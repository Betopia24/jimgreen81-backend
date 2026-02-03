import express from "express";
import { auth } from "../../middlewares/auth";
import { PaymentController } from "./Payment.controller";

const router = express.Router();

// Create Subscription
router.post(
  "/subscription/create",
  auth("USER"),
  PaymentController.createSubscription,
);

// Get My all transactions
router.get(
  "/transactions/company/:companyId",
  auth("USER"),
  PaymentController.getAllTransactionForCompany,
);

// Get all transactions - For Admin
router.get(
  "/transactions",
  // auth("ADMIN"),
  PaymentController.getAllTransactionsForAdmin,
);

// Get Single transactions
router.get("/transactions/:id", auth(), PaymentController.getSingleTransaction);

export const PaymentRoutes = router;
