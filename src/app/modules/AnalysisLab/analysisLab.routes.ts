import { Router } from "express";
import { AnalysisLabController } from "./analysisLab.controller";
import { AnalysisLabValidationSchema } from "./analysisLab.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";

const router = Router();

// Calculate Water Indices
router.post(
  "/calculate-indices",
  auth(),
  validateRequest(AnalysisLabValidationSchema.calculateIndices),
  AnalysisLabController.calculateWaterIndices,
);

// Calculate Cooling Tower
router.post(
  "/cooling-tower",
  auth(),
  validateRequest(AnalysisLabValidationSchema.calculateCoolingTower),
  AnalysisLabController.calculateCoolingTower,
);

// Batch Saturation Analysis
router.post(
  "/batch-saturation",
  auth(),
  validateRequest(AnalysisLabValidationSchema.batchSaturationAnalysis),
  AnalysisLabController.batchSaturationAnalysis,
);

// Predict Corrosion Rate
router.post(
  "/corrosion-rate",
  auth(),
  validateRequest(AnalysisLabValidationSchema.predictCorrosionRate),
  AnalysisLabController.predictCorrosionRate,
);

export const analysisLabRoutes = router;
