import { getSuperAdminDashboardOverview } from "./analytics.superAdmin";

const getAdminDashboardOverview = async (userId: string) => {
  return userId;
};

export const analyticsService = {
  getSuperAdminDashboardOverview,
  getAdminDashboardOverview,
};
