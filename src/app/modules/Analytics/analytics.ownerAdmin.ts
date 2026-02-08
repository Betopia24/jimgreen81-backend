import { datetimeUtils } from "./../../../utils/datetime";
import prisma from "../../../db/prisma";
import { percentageChange } from "./analytics.utils";

export async function getReportStats(companyId: string) {
  const now = new Date();

  const startOfThisMonth = datetimeUtils.startOfThisMonth(now);
  const startOfLastMonth = datetimeUtils.startOfLastMonth(now);
  const endOfLastMonth = datetimeUtils.endOfLastMonth(now);

  const todayStart = new Date(now.setHours(0, 0, 0, 0));

  const [totalReports, thisMonthReports, lastMonthReports, todayReports] =
    await Promise.all([
      prisma.report.count({ where: { companyId } }),

      prisma.report.count({
        where: {
          companyId,
          waterReport: { createdAt: { gte: startOfThisMonth } },
        },
      }),

      prisma.report.count({
        where: {
          companyId,
          waterReport: {
            createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          },
        },
      }),

      prisma.report.count({
        where: { companyId, waterReport: { createdAt: { gte: todayStart } } },
      }),
    ]);

  const daysPassed = now.getDate();

  return {
    totalReports: {
      value: totalReports,
      changePercent: percentageChange(thisMonthReports, lastMonthReports),
    },

    thisMonthReports: {
      value: thisMonthReports,
      changeValue: thisMonthReports - lastMonthReports,
    },

    avgPerDay: {
      value: Number((thisMonthReports / daysPassed).toFixed(1)),
      todayIncrease: todayReports,
    },

    reportsGenerated: {
      value: totalReports,
      changeValue: thisMonthReports,
    },
  };
}
