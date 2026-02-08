import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { analyticsService } from "./analytics.service";

const getSuperAdminDashboardOverview = catchAsync(async (req, res) => {
  const result = await analyticsService.getSuperAdminDashboardOverview();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Get Super Admin Dashboard Overview",
    data: result,
  });
});

const getOwnerAdminDashboardOverview = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await analyticsService.getOwnerAdminDashboardOverview(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Get Owner Admin Dashboard Overview",
    data: result,
  });
});

export const analyticsController = {
  getSuperAdminDashboardOverview,
  getOwnerAdminDashboardOverview,
};
