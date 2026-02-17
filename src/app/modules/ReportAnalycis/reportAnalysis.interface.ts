import z from "zod";
import { ReportAnalysisValidationSchema } from "./reportAnalysis.validation";

export type TAnalyzeReportInput = z.infer<
  typeof ReportAnalysisValidationSchema.analyzeReport
>;

export type TModifyReportGraphInput = z.infer<
  typeof ReportAnalysisValidationSchema.modifyReportGraph
>;

export type TRecalculateReportInput = z.infer<
  typeof ReportAnalysisValidationSchema.recalculateReport
>;

export type IReportFilterRequest = {
  searchTerm?: string | undefined;
};

export type TCalculateIndicesInput = z.infer<
  typeof ReportAnalysisValidationSchema.calculateIndices
>;

export type TCalculateCoolingTowerInput = z.infer<
  typeof ReportAnalysisValidationSchema.calculateCoolingTower
>;

export type TBatchSaturationAnalysisInput = z.infer<
  typeof ReportAnalysisValidationSchema.batchSaturationAnalysis
>;

export type TPredictCorrosionRateInput = z.infer<
  typeof ReportAnalysisValidationSchema.predictCorrosionRate
>;
