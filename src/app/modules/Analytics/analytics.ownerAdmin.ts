import { datetimeUtils } from "./../../../utils/datetime";
import prisma from "../../../db/prisma";
import { percentageChange } from "./analytics.utils";

export async function getReportStats(companyId: string) {
  const now = new Date();

  const startOfThisMonth = datetimeUtils.startOfThisMonth(now);
  const startOfLastMonth = datetimeUtils.startOfLastMonth(now);
  const endOfLastMonth = datetimeUtils.endOfLastMonth(now);
  const todayStart = datetimeUtils.startOfToday();

  const [
    totalReports,
    thisMonthReports,
    lastMonthReports,
    todayReports,

    totalMembers,

    totalCustomers,
    thisMonthCustomers,
    lastMonthCustomers,
    todayCustomers,
  ] = await Promise.all([
    // TOTAL REPORTS
    prisma.report.count({
      where: { companyId },
    }),

    // THIS MONTH REPORTS
    prisma.report.count({
      where: {
        companyId,

        createdAt: { gte: startOfThisMonth },
      },
    }),

    // LAST MONTH REPORTS
    prisma.report.count({
      where: {
        companyId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    }),

    // TODAY REPORTS
    prisma.report.count({
      where: {
        companyId,
        createdAt: { gte: todayStart },
      },
    }),

    // TOTAL MEMBERS
    prisma.companyMember.count({
      where: { companyId },
    }),

    // TOTAL CUSTOMERS
    prisma.customer.count({
      where: { companyId },
    }),

    // THIS MONTH CUSTOMERS
    prisma.customer.count({
      where: {
        companyId,
        createdAt: { gte: startOfThisMonth },
      },
    }),

    // LAST MONTH CUSTOMERS
    prisma.customer.count({
      where: {
        companyId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    }),

    // TODAY CUSTOMERS
    prisma.customer.count({
      where: {
        companyId,
        createdAt: { gte: todayStart },
      },
    }),
  ]);

  const daysPassed = now.getDate();

  return {
    // 📊 REPORTS
    totalReports: {
      value: totalReports,
      changePercent: percentageChange(thisMonthReports, lastMonthReports),
    },

    monthlyReports: {
      value: thisMonthReports,
      changeValue: thisMonthReports - lastMonthReports,
      changePercent: percentageChange(thisMonthReports, lastMonthReports),
    },

    avgReportsPerDay: {
      value: Number((thisMonthReports / daysPassed).toFixed(1)),
      todayIncrease: todayReports,
    },

    // 👥 MEMBERS
    totalMembers: {
      value: totalMembers,
    },

    // 🧑‍💼 CUSTOMERS
    totalCustomers: {
      value: totalCustomers,
      changePercent: percentageChange(thisMonthCustomers, lastMonthCustomers),
    },

    monthlyCustomers: {
      value: thisMonthCustomers,
      changeValue: thisMonthCustomers - lastMonthCustomers,
      todayIncrease: todayCustomers,
    },
  };
}

export async function getReportTrend(companyId: string, year: number) {
  const data = [];

  for (let month = 0; month < 12; month++) {
    const start = new Date(year, month, 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(year, month + 1, 0);
    end.setHours(23, 59, 59, 999);

    const reports = await prisma.report.count({
      where: {
        companyId,

        createdAt: { gte: start, lte: end },
      },
    });

    const customers = await prisma.report.findMany({
      where: {
        companyId,

        createdAt: { gte: start, lte: end },
      },
      distinct: ["customerId"],
      select: { customerId: true },
    });

    data.push({
      month: start.toLocaleString("en", { month: "short" }),
      reports,
      customers: customers.length,
    });
  }

  return data;
}

export async function getRecentReports(companyId: string, limit = 8) {
  const reports = await prisma.report.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      customer: { select: { name: true } },
      waterReport: true,
    },
  });

  return reports.map((r) => ({
    id: r.id,
    reportId: r.waterReport?.report_id,
    customer: r.customer.name,
    type: r.waterReport?.contamination_risk
      ? "Contamination Risk"
      : r.waterReport?.compliance_checklist
        ? "Compliance Check"
        : "Water Quality",
    status: "Completed",
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}
