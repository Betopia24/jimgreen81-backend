import z from "zod";
import { ReportAnalysisValidationSchema } from "./reportAnalysis.validation";

export type TModifyReportGraphInput = z.infer<
  typeof ReportAnalysisValidationSchema.modifyReportGraph
>;

export type TRecalculateReportInput = z.infer<
  typeof ReportAnalysisValidationSchema.recalculateReport
>;

export type TSaturationAnalysisInput = z.infer<
  typeof ReportAnalysisValidationSchema.saturationAnalysis
>;

export type IReportFilterRequest = {
  searchTerm?: string | undefined;
};

export type TCreateWaterReportInput = z.infer<
  typeof ReportAnalysisValidationSchema.createWaterReport
>;

export type TSwitchSaltViewInput = z.infer<
  typeof ReportAnalysisValidationSchema.switchSaltView
>;
