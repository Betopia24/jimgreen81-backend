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

const getDashboardStats = catchAsync(async (req, res) => {
  const result = await analyticsService.getDashboardStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Get Dashboard Stats",
    data: result,
  });
});

const getRecentActivity = catchAsync(async (req, res) => {
  const result = await analyticsService.getRecentActivity();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Get Recent Activity",
    data: result,
  });
});

export const analyticsController = {
  getSuperAdminDashboardOverview,
  getDashboardStats,
  getRecentActivity,
};
