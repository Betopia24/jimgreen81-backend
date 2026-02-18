import { datetimeUtils } from "./../../../utils/datetime";
import prisma from "../../../db/prisma";
import { percentageChange } from "./analytics.utils";

export const getSuperAdminDashboardOverview = async () => {
  const stats = await getSuperAdminDashboardStats();

  const subscriptionGrowth = getYearlySubscriptionGrowth(
    new Date().getFullYear(),
  );

  const recentActivities = await prisma.recentActivity.findMany({
    where: { activityFor: "SUPER_ADMIN" },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const result = {
    stats,
    subscriptionGrowth,
    recentActivities,
  };

  return result;
};

const getYearlySubscriptionGrowth = async (year: number) => {
  const result: {
    month: string;
    revenue: number;
    transactions: number;
  }[] = [];

  for (let month = 0; month < 12; month++) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);

    const [revenueAgg, transactionCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          status: "SUCCEEDED",
          createdAt: { gte: start, lte: end },
        },
        _sum: { amount: true },
      }),

      prisma.transaction.count({
        where: {
          status: "SUCCEEDED",
          createdAt: { gte: start, lte: end },
        },
      }),
    ]);

    result.push({
      month: start.toLocaleString("en-US", { month: "short" }),
      revenue: (revenueAgg._sum.amount || 0) / 100,
      transactions: transactionCount,
    });
  }

  return result;
};

// ===========================================
//       Super admin dashboard stats
// ===========================================

const getSuperAdminDashboardStats = async () => {
  const now = new Date();

  const thisMonthStart = datetimeUtils.startOfThisMonth(now);
  const lastMonthStart = datetimeUtils.startOfLastMonth(now);
  const lastMonthEnd = datetimeUtils.endOfLastMonth(now);

  // ============== USERS ==============
  const [totalUsers, thisMonthUsers, lastMonthUsers] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: { createdAt: { gte: thisMonthStart } },
    }),

    prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
  ]);

  // ============= SUBSCRIPTIONS ==============
  const [totalSubscriptions, thisMonthSubs, lastMonthSubs] = await Promise.all([
    prisma.subscription.count(),

    prisma.subscription.count({
      where: { createdAt: { gte: thisMonthStart } },
    }),

    prisma.subscription.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
  ]);

  // ============= ACTIVE SUBSCRIPTIONS ==============
  const [activeNow, activeLastMonth] = await Promise.all([
    prisma.subscription.count({
      where: {
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now },
      },
    }),

    prisma.subscription.count({
      where: {
        status: "ACTIVE",
        startDate: { lte: lastMonthEnd },
        endDate: { gte: lastMonthStart },
      },
    }),
  ]);

  // ============== MONTHLY REVENUE ==============
  const [thisMonthRevenueAgg, lastMonthRevenueAgg] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        status: "SUCCEEDED",
        createdAt: { gte: thisMonthStart },
      },
    }),

    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        status: "SUCCEEDED",
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
  ]);

  const thisMonthRevenue = (thisMonthRevenueAgg._sum.amount ?? 0) / 100;

  const lastMonthRevenue = (lastMonthRevenueAgg._sum.amount ?? 0) / 100;

  // ============== SUBSCRIPTION HEALTH ==============
  const canceledThisMonth = await prisma.subscription.count({
    where: {
      status: "CANCELED",
      canceledAt: { gte: thisMonthStart },
    },
  });

  const subscriptionHealth =
    activeNow + canceledThisMonth === 0
      ? 0
      : Number(
          ((activeNow / (activeNow + canceledThisMonth)) * 100).toFixed(2),
        );

  // ============== FINAL RESPONSE ==============
  return {
    totalUsers: {
      value: totalUsers,
      change: percentageChange(thisMonthUsers, lastMonthUsers),
    },

    totalSubscriptions: {
      value: totalSubscriptions,
      change: percentageChange(thisMonthSubs, lastMonthSubs),
    },

    activeSubscriptions: {
      value: activeNow,
      change: percentageChange(activeNow, activeLastMonth),
    },

    monthlyRevenue: {
      value: thisMonthRevenue,
      change: percentageChange(thisMonthRevenue, lastMonthRevenue),
    },

    subscriptionHealth: {
      value: subscriptionHealth,
    },
  };
};
