import z from "zod";

const parameterSchemaForArray = z.object({
  name: z.string(),
  value: z.number(),
  unit: z.string(),
  detection_limit: z.number().nullable(),
});

export const ReportAnalysisValidationSchema = {
  createWaterReport: z.object({
    filename: z.string({ required_error: "filename is required" }).nonempty(),
    assetId: z.string({ required_error: "assetId is required" }).nonempty(),
    sampleLocation: z.string().optional(),
    sampleDate: z.string().optional(),
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

  saturationAnalysis: z.object({
    assetId: z.string({ required_error: "assetId is required" }).nonempty(),
    waterReportId: z
      .string({ required_error: "waterReportId is required" })
      .nonempty(),
    inputConfig: z.object({
      salt_id: z.string().optional(),
      treatment_id: z.string().optional(),
      dosage_ppm: z.number().optional(),
      coc_min: z.number().optional(),
      coc_max: z.number().optional(),
      coc_interval: z.number().optional(),
      temp_min: z.number().optional(),
      temp_max: z.number().optional(),
      temp_interval: z.number().optional(),
      temp_unit: z.enum(["F", "C"]).optional(),
      ph_mode: z.string().optional(),
      fixed_ph: z.number().optional(),
      adjustment_chemical: z.string().optional(),
      balance_cation: z.string().optional(),
      balance_anion: z.string().optional(),
    }),
    treatment: z
      .object({
        productId: z.string().optional(),
        rawMaterialId: z.string().optional(),
        dosage: z.number().optional(),
      })
      .optional(),
  }),
};
