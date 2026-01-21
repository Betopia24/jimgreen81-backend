import { Request, Response, NextFunction } from "express";
import catchAsync from "../../shared/catchAsync";
import { MemberRole } from "@prisma/client";
import AppError from "../../errors/AppError";
import status from "http-status";
import prisma from "../../db/prisma";

export const companyAccess = (...roles: MemberRole[]) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      const userId = req.user.id;

      const getMemberInfo = await prisma.companyMember.findUnique({
        where: { id: userId },
      });

      if (!getMemberInfo) {
        throw new AppError(status.FORBIDDEN, "You don't have company access!");
      }

      // Check roles
      if (roles.length && !roles.includes(getMemberInfo.role)) {
        throw new AppError(
          403,
          "You don't have permission to perform this action in that company!",
        );
      }

      next();
    },
  );
};
