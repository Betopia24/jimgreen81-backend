import prisma from "../../../db/prisma";

const getSuperAdminDashboardOverview = async () => {
  const result = {
    stats: {
      totalUsers: 10012,
      activeSubscriptions: 3485,
      monthlyRevenue: 34573,
      subscriptionHealth: 34,
    },
    subscriptionGrowth: [
      {
        level: "Jan",
        value: 45,
      },
      {
        level: "Feb",
        value: 45,
      },
      {
        level: "Mar",
        value: 45,
      },
      {
        level: "Apr",
        value: 45,
      },
    ],
    recentActivities: [
      {
        firstName: "Test user",
        lastName: "one",
        avatar: "",
        action: "Cancelled subscription",
        date: new Date().toISOString(),
      },
    ],
  };

  return result;
};

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
  getSuperAdminDashboardOverview,
  getDashboardStats,
  getRecentActivity,
};
