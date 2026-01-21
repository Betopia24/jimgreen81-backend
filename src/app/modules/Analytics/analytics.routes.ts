import express from "express";
import { analyticsController } from "./analytics.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

// Get dashboard stats
router.get(
  "/dashboard-stats",
  auth("ADMIN"),
  analyticsController.getDashboardStats,
);

// Get Recent Activity
router.get(
  "/recent-activities",
  auth("ADMIN"),
  analyticsController.getRecentActivity,
);

export const analyticsRoutes = router;
