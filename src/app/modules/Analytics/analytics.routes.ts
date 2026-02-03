import express from "express";
import { analyticsController } from "./analytics.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

// Get Super admin dashboard overview
router.get(
  "/super-admin/dashboard-overview",
  auth(),
  analyticsController.getSuperAdminDashboardOverview,
);

// Get Super admin dashboard overview
router.get(
  "/admin/dashboard-overview",
  auth(),
  analyticsController.getAdminDashboardOverview,
);

export const analyticsRoutes = router;
