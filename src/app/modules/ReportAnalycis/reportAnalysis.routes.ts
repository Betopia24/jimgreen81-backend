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

export const reportAnalysisRoutes = router;
