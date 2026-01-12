import prisma from "../db/prisma";

export type TActActionType =
  | "ACCOUNT_CREATED"
  | "ACCOUNT_DELETED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_FAILED";

export type TActivity = {
  actionType: TActActionType;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
};

export const recentActivityLog = async (data: TActivity) => {
  await prisma.recentActivity.create({
    data,
  });
};
