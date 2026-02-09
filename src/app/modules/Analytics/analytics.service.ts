import status from "http-status";
import prisma from "../../../db/prisma";
import AppError from "../../../errors/AppError";
import {
  getRecentReports,
  getReportStats,
  getReportTrend,
} from "./analytics.ownerAdmin";
import { getSuperAdminDashboardOverview } from "./analytics.superAdmin";

const getOwnerAdminDashboardOverview = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { companyMember: true },
  });
  if (!user) throw new Error("User not found");

  if (!user.companyMember) {
    throw new AppError(status.FORBIDDEN, "User is not a company member");
  }

  const reportStats = await getReportStats(user.companyMember.companyId);

  const reportTrend = await getReportTrend(
    user.companyMember.companyId,
    new Date().getFullYear(),
  );

  const recentReports = await getRecentReports(user.companyMember.companyId);

  return {
    reportStats,
    reportTrend,
    recentReports,
  };
};

export const analyticsService = {
  getSuperAdminDashboardOverview,
  getOwnerAdminDashboardOverview,
};
