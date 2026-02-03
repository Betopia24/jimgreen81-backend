import prisma from "../db/prisma";

export type TActivityFor = "SUPER_ADMIN" | "COMPANY_OWNER";

export type TActivity = {
  activityFor: TActivityFor;
  message: string;
  performerName: string;
  performerImage?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
};

export const recentActivityLog = async (data: TActivity) => {
  await prisma.recentActivity.create({
    data,
  });
};
