import prisma from "../db/prisma";

export async function updateSubscriptionUseCronJob() {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
    },
  });

  const now = new Date();

  for (const subscription of subscriptions) {
    const endDate = new Date(subscription.endDate);
    if (!subscription.canceledAt && endDate < now) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" },
      });
    }
  }
}
