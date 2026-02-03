import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./Payment.service";

export const PaymentController = {
  createSubscription: catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await PaymentService.createSubscription({
      userId,
      data: req.body,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Successfully Create subscription",
      data: result,
    });
  }),

  // refundPayment: catchAsync(async (req, res) => {
  //   const result = await PaymentService.refundPayment({
  //     paymentIntentId: req.body.paymentIntentId,
  //   });

  //   sendResponse(res, {
  //     statusCode: httpStatus.CREATED,
  //     success: true,
  //     message: "Successfully Refund Payment",
  //     data: result,
  //   });
  // }),

  // Get My All Transaction
  getAllTransactionForCompany: catchAsync(async (req, res) => {
    const companyId = req.params.companyId;

    const result = await PaymentService.getAllTransactionForCompany(companyId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved all transactions",
      data: result,
    });
  }),

  // Get All Transaction For Admin
  getAllTransactionsForAdmin: catchAsync(async (req, res) => {
    const result = await PaymentService.getAllTransactionsForAdmin();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved all transactions",
      data: result,
    });
  }),

  // Get All Transaction For Admin
  getSingleTransaction: catchAsync(async (req, res) => {
    const result = await PaymentService.getSingleTransaction(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully Transaction",
      data: result,
    });
  }),

  // Stripe Webhook
  stripeWebhook: catchAsync(async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const body = req.body;
    await PaymentService.stripeWebhook({
      sig,
      body,
    });

    res.status(200).send("ok");
  }),
};
