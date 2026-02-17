import z from "zod";
import {
  batchSaturationAnalysisSchema,
  calculateCoolingTowerSchema,
  calculateIndicesSchema,
  predictCorrosionRateSchema,
} from "./reportCalculationValidation";

const parameterSchemaForArray = z.object({
  name: z.string(),
  value: z.number(),
  unit: z.string(),
  detection_limit: z.number().nullable(),
});

export const ReportAnalysisValidationSchema = {
  analyzeReport: z.object({
    customerId: z
      .string({ required_error: "customerId is required" })
      .nonempty(),
    parameters: z.array(parameterSchemaForArray),
  }),

  modifyReportGraph: z.object({
    reportId: z.string({ required_error: "reportId is required" }).nonempty(),
    prompt: z.string({ required_error: "prompt is required" }).nonempty(),
  }),

  recalculateReport: z.object({
    reportId: z.string({ required_error: "reportId is required" }).nonempty(),
    adjustedParameters: z.array(
      z.object({
        name: z.string(),
        value: z.number(),
      }),
    ),
  }),

  calculateIndices: calculateIndicesSchema,

  calculateCoolingTower: calculateCoolingTowerSchema,

  batchSaturationAnalysis: batchSaturationAnalysisSchema,

  predictCorrosionRate: predictCorrosionRateSchema,
};
