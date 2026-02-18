import { Router } from "express";
import { uploadFile } from "../../../upload/fileUpload";
import { ReportAnalysisController } from "./reportAnalysis.controller";
import { ReportAnalysisValidationSchema } from "./reportAnalysis.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { needCompanySubscription } from "../../middlewares/needCompanySubscription";

const router = Router();

// Extract Report
router.post(
  "/extract-report",
  auth(),
  uploadFile.single("file"),
  ReportAnalysisController.extractReportFile,
);

// Analyze Report
router.post(
  "/analyze-report",
  auth(),
  needCompanySubscription("REPORT_GENERATE"),
  validateRequest(ReportAnalysisValidationSchema.analyzeReport),
  ReportAnalysisController.analyzeReport,
);

// Modify Report Graph
router.post(
  "/modify-report-graph",
  auth(),
  needCompanySubscription("REPORT_GENERATE"),
  validateRequest(ReportAnalysisValidationSchema.modifyReportGraph),
  ReportAnalysisController.modifyReportGraph,
);

// Recalculate Report
router.post(
  "/recalculate-report",
  auth(),
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
  auth(),
  validateRequest(ReportAnalysisValidationSchema.calculateIndices),
  ReportAnalysisController.calculateWaterIndices,
);

// Calculate Cooling Tower
router.post(
  "/water/cooling-tower",
  auth(),
  validateRequest(ReportAnalysisValidationSchema.calculateCoolingTower),
  ReportAnalysisController.calculateCoolingTower,
);

// Batch Saturation Analysis
router.post(
  "/water/batch-saturation",
  auth(),
  validateRequest(ReportAnalysisValidationSchema.batchSaturationAnalysis),
  ReportAnalysisController.batchSaturationAnalysis,
);

// Predict Corrosion Rate
router.post(
  "/water/corrosion-rate",
  auth(),
  validateRequest(ReportAnalysisValidationSchema.predictCorrosionRate),
  ReportAnalysisController.predictCorrosionRate,
);

export const reportAnalysisRoutes = router;
