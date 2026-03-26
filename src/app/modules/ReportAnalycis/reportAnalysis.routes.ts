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

// Create Water Report (Manual Entry / Save Edited OCR)
router.post(
  "/water-report",
  auth(),
  validateRequest(ReportAnalysisValidationSchema.createWaterReport),
  ReportAnalysisController.createWaterReport,
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

// Saturation Analysis
router.post(
  "/saturation-analysis",
  auth(),
  needCompanySubscription("REPORT_GENERATE"),
  validateRequest(ReportAnalysisValidationSchema.saturationAnalysis),
  ReportAnalysisController.saturationAnalysis,
);

export const reportAnalysisRoutes = router;
