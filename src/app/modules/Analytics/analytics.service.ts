import prisma from "../../../db/prisma";

const getDashboardStats = async () => {
  // Total Active Users
  const totalActiveUsers = await prisma.user.count({});

  const totalUsers = await prisma.user.count();

  const stats = {
    totalActiveUsers: totalActiveUsers,
    totalUsers: totalUsers,
  };

  return stats;
};

const getRecentActivity = async () => {
  const recentActivities = await prisma.recentActivity.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return recentActivities;
};

export const analyticsService = {
  getDashboardStats,
  getRecentActivity,
};
