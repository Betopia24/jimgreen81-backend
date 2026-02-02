import { Router } from "express";
import { uploadFile } from "../../../upload/fileUpload";
import { ReportAnalysisController } from "./reportAnalysis.controller";

const router = Router();

// Upload Report
router.post(
  "/upload-report",
  uploadFile.single("file"),
  ReportAnalysisController.analyzeReportFile,
);

// Get Products By CompanyId
// router.get("/company/:companyId", ProductController.getProductsByCompanyId);

export const reportAnalysisRoutes = router;
