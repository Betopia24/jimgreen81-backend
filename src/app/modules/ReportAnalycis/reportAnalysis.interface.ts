import z from "zod";
import { ReportAnalysisValidationSchema } from "./reportAnalysis.validation";

export type TAnalyzeReportInput = z.infer<typeof ReportAnalysisValidationSchema.analyzeReport>

export type TModifyReportGraphInput = z.infer<typeof ReportAnalysisValidationSchema.modifyReportGraph>

export type TRecalculateReportInput = z.infer<typeof ReportAnalysisValidationSchema.recalculateReport>