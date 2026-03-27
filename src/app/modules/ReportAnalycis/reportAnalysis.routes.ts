import { Router } from "express";
import { uploadFile } from "../../../upload/fileUpload";
import { ReportAnalysisController } from "./reportAnalysis.controller";
import { ReportAnalysisValidationSchema } from "./reportAnalysis.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { needCompanySubscription } from "../../middlewares/needCompanySubscription";

const router = Router();

// ==========================================
// Water Reports (Base Analytics)
// ==========================================

// Extract Report from file (OCR)
router.post(
  "/water-reports/extract",
  auth(),
  uploadFile.single("file"),
  ReportAnalysisController.extractWaterReport,
);

// Create Water Report (Manual or Save OCR)
router.post(
  "/water-reports",
  auth(),
  validateRequest(ReportAnalysisValidationSchema.createWaterReport),
  ReportAnalysisController.createWaterReport,
);

// Flexible Query Water Reports
router.get(
  "/water-reports",
  auth(),
  ReportAnalysisController.getWaterReportsHistory,
);

// Single Water Report
router.get(
  "/water-reports/:reportId",
  auth(),
  ReportAnalysisController.getSingleWaterReport,
);

// Actions on Water Reports
router.post(
  "/water-reports/modify-graph",
  auth(),
  // needCompanySubscription("REPORT_GENERATE"),
  validateRequest(ReportAnalysisValidationSchema.modifyReportGraph),
  ReportAnalysisController.modifyWaterReportGraph,
);

// Recalculate Water Report
router.post(
  "/water-reports/recalculate",
  auth(),
  validateRequest(ReportAnalysisValidationSchema.recalculateReport),
  ReportAnalysisController.recalculateWaterReport,
);

// ==========================================
// Saturation Analysis (Simulations)
// ==========================================

// Create new Saturation Analysis
router.post(
  "/saturation-analyses",
  auth(),
  // needCompanySubscription("REPORT_GENERATE"),
  validateRequest(ReportAnalysisValidationSchema.saturationAnalysis),
  ReportAnalysisController.createSaturationAnalysis,
);

// History of Saturation Analyses
router.get(
  "/saturation-analyses",
  auth(),
  ReportAnalysisController.getSaturationAnalysesHistory,
);

// Single Saturation Analysis Result
router.get(
  "/saturation-analyses/:id",
  auth(),
  ReportAnalysisController.getSingleSaturationAnalysis,
);

export const reportAnalysisRoutes = router;
