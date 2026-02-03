import express from "express";
import { PaymentController } from "../modules/Payment/Payment.controller";

const rawRouter = express.Router();

rawRouter.post(
  "/api/v1/stripe/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhook,
);

export default rawRouter;
