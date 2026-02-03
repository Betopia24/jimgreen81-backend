import { Router } from "express";
import { PlanController } from "./plan.controller";
import { PlanValidation } from "./plan.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";

const router = Router();

// Create plan
router.post(
  "/",
  auth("ADMIN"),
  validateRequest(PlanValidation.createPlan),
  PlanController.createPlan,
);

// Get all plans
router.get("/", auth("ADMIN"), PlanController.getAllPlans);

// Get active plans
router.get("/active", PlanController.getActivePlans);

// Get single plan
router.get("/:id", PlanController.getPlanById);

// Update plan
router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(PlanValidation.updatePlan),
  PlanController.updatePlan,
);

// Delete plan
router.delete("/:id", auth("ADMIN"), PlanController.deletePlan);

export const PlanRoutes = router;
