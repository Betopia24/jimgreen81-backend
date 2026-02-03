import { Router } from "express";
import { PlanController } from "./plan.controller";
import { PlanValidation } from "./plan.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";


const router = Router();

// Create plan
router.post(
  "/",
  validateRequest(PlanValidation.createPlan),
  PlanController.createPlan
);

// Get all plans
router.get("/", PlanController.getAllPlans);

// Get active plans
router.get("/active", PlanController.getActivePlans);

// Get single plan
router.get(
  "/:id",
 
  PlanController.getPlanById
);

// Update plan
router.patch(
  "/:id",
  
  validateRequest(PlanValidation.updatePlan),
  PlanController.updatePlan
);

// Delete plan
router.delete(
  "/:id",

  PlanController.deletePlan
);

export const PlanRoutes = router;