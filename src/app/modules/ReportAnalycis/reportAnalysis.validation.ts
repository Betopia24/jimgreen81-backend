import z from "zod";

export const ReportAnalysisValidationSchema = {
  analyzeReport: z.object({}),
  recalculateReport: z.object({
    reportId: z.string({ required_error: "reportId is required" }).nonempty(),
  }),
};
