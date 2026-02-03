import status from "http-status";
import AppError from "../../../errors/AppError";
import prisma from "../../../db/prisma";
import { stripe } from "../../../config/stripe";
import Stripe from "stripe";
import { recentActivityLog } from "../../../helpers/recentActivity";

export const PaymentService = {
  /* ===========================
     CREATE SUBSCRIPTION (ONE TIME)
  =========================== */
  createSubscription: async ({
    userId,
    data,
  }: {
    userId: string;
    data: { planId: string; planType: "monthly" | "annually" };
  }) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyMember: true },
    });

    if (!user) throw new AppError(status.NOT_FOUND, "User not found");

    if (!user.companyMember) {
      throw new AppError(
        status.NOT_FOUND,
        "You are not connected to any company",
      );
    }

    if (user.companyMember.role !== "owner") {
      throw new AppError(
        status.NOT_FOUND,
        "You are not company owner to purchase the subscription",
      );
    }

    const companyId = user.companyMember.companyId;

    const existingSub = await prisma.subscription.findUnique({
      where: { companyId },
    });

    if (existingSub && existingSub.status === "ACTIVE") {
      throw new AppError(
        status.BAD_REQUEST,
        "User already has an active subscription",
      );
    }

    const plan = await prisma.plan.findUnique({ where: { id: data.planId } });
    if (!plan || !plan.isActive) {
      throw new AppError(status.BAD_REQUEST, "Invalid plan");
    }

    const price =
      data.planType === "annually" ? plan.annualPrice : plan.monthlyPrice;

    const amount = Math.round(price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        companyId,
        planId: plan.id,
        planType: data.planType,
        billing: "subscription",
      },
    });

    await prisma.subscription.upsert({
      where: { companyId },
      update: {
        paymentIntentId: paymentIntent.id,
        planId: plan.id,
        planType: data.planType,
        status: "INCOMPLETE",
        planSnapshot: {
          name: plan.name,
          price,
          maxReports: plan.maxReports,
          maxAccounts: plan.maxAccounts,
          features: plan.features,
        },
      },
      create: {
        companyId,
        paymentIntentId: paymentIntent.id,
        planId: plan.id,
        planType: data.planType,
        status: "INCOMPLETE",
        planSnapshot: {
          name: plan.name,
          price,
          maxReports: plan.maxReports,
          maxAccounts: plan.maxAccounts,
          features: plan.features,
        },
        startDate: new Date(),
        endDate: new Date(),
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  },

  /* ===========================
     CANCEL SUBSCRIPTION
     refund = false → keep access
     refund = true  → access ends now
  =========================== */
  cancelSubscription: async ({
    companyId,
    refund = false,
  }: {
    companyId: string;
    refund?: boolean;
  }) => {
    const subscription = await prisma.subscription.findUnique({
      where: { companyId },
    });

    if (!subscription || subscription.status !== "ACTIVE") {
      throw new AppError(status.BAD_REQUEST, "No active subscription");
    }

    const now = new Date();

    if (refund && subscription.paymentIntentId) {
      await stripe.refunds.create({
        payment_intent: subscription.paymentIntentId,
      });

      await prisma.transaction.updateMany({
        where: { reference: subscription.paymentIntentId },
        data: { status: "REFUNDED" },
      });
    }

    await prisma.subscription.update({
      where: { companyId },
      data: {
        status: "CANCELED",
        canceledAt: now,
        endDate: refund ? now : subscription.endDate,
      },
    });

    return { message: "Subscription canceled successfully" };
  },

  /* ===========================
     STRIPE WEBHOOK
  =========================== */
  stripeWebhook: async (payload: { sig: string | string[]; body: any }) => {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload.body,
        payload.sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new AppError(status.BAD_REQUEST, err.message);
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;
    }

    return { received: true };
  },

  /* ===========================
     TRANSACTIONS
  =========================== */
  getAllTransactionForCompany: async (companyId: string) => {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new AppError(status.NOT_FOUND, "Company not found!");
    }

    return prisma.transaction.findMany({
      where: { companyId },
      include: { company: true },
    });
  },

  getAllTransactionsForAdmin: async () => {
    return prisma.transaction.findMany({
      include: { company: true },
    });
  },

  getSingleTransaction: async (transactionId: string) => {
    return prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { company: true, subscription: true },
    });
  },
};

/* ===========================
   WEBHOOK HANDLERS
=========================== */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  if (paymentIntent.metadata.billing !== "subscription") return;

  const { companyId, planType } = paymentIntent.metadata;

  const companyMember = await prisma.companyMember.findFirst({
    where: { companyId, role: "owner" },
    select: { user: true },
  });

  const startDate = new Date();
  const endDate =
    planType === "annually"
      ? new Date(startDate.setFullYear(startDate.getFullYear() + 1))
      : new Date(startDate.setMonth(startDate.getMonth() + 1));

  const result = await prisma.$transaction(async (tx) => {
    const subscription = await tx.subscription.update({
      where: { companyId },
      data: {
        status: "ACTIVE",
        startDate,
        endDate,
      },
    });

    await tx.transaction.create({
      data: {
        companyId,
        subscriptionId: subscription.id,
        reference: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency.toUpperCase(),
        status: "SUCCEEDED",
      },
    });

    return subscription;
  });

  await recentActivityLog({
    activityFor: "SUPER_ADMIN",
    performerName: companyMember
      ? companyMember.user.firstName + companyMember.user.firstName
      : "Company Member",
    performerImage: companyMember?.user.avatar,
    message: `Upgraded to ${(result.planSnapshot as any).name}`,
    details: result,
  });
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  await prisma.subscription.updateMany({
    where: { paymentIntentId: paymentIntent.id },
    data: { status: "CANCELED" },
  });
}

async function handleRefund(charge: Stripe.Charge) {
  if (!charge.payment_intent) return;

  await prisma.transaction.updateMany({
    where: { reference: charge.payment_intent.toString() },
    data: { status: "REFUNDED" },
  });
}
