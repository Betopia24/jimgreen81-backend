import { Request, Response, NextFunction } from "express";
import catchAsync from "../../shared/catchAsync";
import AppError from "../../errors/AppError";
import status from "http-status";
import prisma from "../../db/prisma";

export const needCompanySubscription = (
  type?: "ADD_MEMBER" | "REPORT_GENERATE",
) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      const userId = req.user.id;

      const getMemberInfo = await prisma.companyMember.findUnique({
        where: { id: userId },
      });

      if (!getMemberInfo) {
        throw new AppError(status.FORBIDDEN, "You don't have company access!");
      }

      const activeSubscription = await prisma.subscription.findFirst({
        where: {
          companyId: getMemberInfo.companyId,
          status: "ACTIVE",
        },
      });

      if (!activeSubscription) {
        throw new AppError(
          status.NOT_FOUND,
          "Company doesn't have an active subscription!",
        );
      }

      let subscriptionPlan;
      if (typeof activeSubscription.planSnapshot === "string") {
        subscriptionPlan = JSON.parse(activeSubscription.planSnapshot);
      } else {
        subscriptionPlan = activeSubscription.planSnapshot;
      }

      if (type === "ADD_MEMBER") {
        const currentMemberCount = await prisma.companyMember.count({
          where: { companyId: getMemberInfo.companyId },
        });

        if (currentMemberCount >= subscriptionPlan.maxAccounts) {
          throw new AppError(
            status.FORBIDDEN,
            "You have reached the maximum number of members for your current subscription plan. Please upgrade your plan to add more members.",
          );
        }
      }

      if (type === "REPORT_GENERATE") {
        const currentReportCount = await prisma.waterReport.count({
          where: { companyId: getMemberInfo.companyId },
        });

        if (currentReportCount >= subscriptionPlan.maxReports) {
          throw new AppError(
            status.FORBIDDEN,
            "You have reached the maximum number of reports for your current subscription plan. Please upgrade your plan to generate more reports.",
          );
        }
      }

      next();
    },
  );
};
