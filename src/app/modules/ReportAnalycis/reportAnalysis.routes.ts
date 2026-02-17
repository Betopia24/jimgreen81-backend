import { Router } from "express";
import { uploadFile } from "../../../upload/fileUpload";
import { ReportAnalysisController } from "./reportAnalysis.controller";
import { ReportAnalysisValidationSchema } from "./reportAnalysis.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

// Extract Report
router.post(
  "/extract-report",
  uploadFile.single("file"),
  ReportAnalysisController.extractReportFile,
);

// Analyze Report
router.post(
  "/analyze-report",
  validateRequest(ReportAnalysisValidationSchema.analyzeReport),
  ReportAnalysisController.analyzeReport,
);

// Modify Report Graph
router.post(
  "/modify-report-graph",
  validateRequest(ReportAnalysisValidationSchema.modifyReportGraph),
  ReportAnalysisController.modifyReportGraph,
);

// Recalculate Report
router.post(
  "/recalculate-report",
  validateRequest(ReportAnalysisValidationSchema.recalculateReport),
  ReportAnalysisController.recalculateReport,
);

// Get Report History By CompanyId
router.get("/history/:companyId", ReportAnalysisController.reportHistory);

// Get Single Report
router.get("/report/:reportId", ReportAnalysisController.getSingleReport);

// Calculate Water Indices
router.post(
  "/water/calculate-indices",
  validateRequest(ReportAnalysisValidationSchema.calculateIndices),
  ReportAnalysisController.calculateWaterIndices,
);

// Calculate Cooling Tower
router.post(
  "/water/cooling-tower",
  validateRequest(ReportAnalysisValidationSchema.calculateCoolingTower),
  ReportAnalysisController.calculateCoolingTower,
);

// Batch Saturation Analysis
router.post(
  "/water/batch-saturation",
  validateRequest(ReportAnalysisValidationSchema.batchSaturationAnalysis),
  ReportAnalysisController.batchSaturationAnalysis,
);

// Predict Corrosion Rate
router.post(
  "/water/corrosion-rate",
  validateRequest(ReportAnalysisValidationSchema.predictCorrosionRate),
  ReportAnalysisController.predictCorrosionRate,
);

export const reportAnalysisRoutes = router;
