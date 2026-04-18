import z from "zod";

const parameterSchemaForArray = z.object({
  name: z.string(),
  value: z.number(),
  unit: z.string(),
  detection_limit: z.number().nullable(),
});

export const ReportAnalysisValidationSchema = {
  createWaterReport: z.object({
    name: z.string({ required_error: "name is required" }).nonempty(),
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
    name: z.string({ required_error: "name is required" }).nonempty(),
    waterReportId: z
      .string({ required_error: "waterReportId is required" })
      .nonempty(),
    inputConfig: z
      .object({
        // which salt to visualize SI for (AI calculates all, but this is default view)
        salt_id: z.string().optional(),
        // Salts of Interest: list of salts AI should calculate for
        salts_of_interest: z.array(z.string()).optional(),
        dosage_ppm: z.number().optional(),
        coc_min: z.number().optional(),
        coc_max: z.number().optional(),
        coc_interval: z.number().optional(),
        temp_min: z.number().optional(),
        temp_max: z.number().optional(),
        temp_interval: z.number().optional(),
        temp_unit: z.enum(["F", "C"]).optional(),
        ph_mode: z.enum(["fixed", "natural"]).optional(),
        fixed_ph: z.number().optional(),
        // CO2 log partial pressure for EQUILIBRIUM_PHASES block (natural pH mode only)
        // PHREEQC uses: CO2(g) <co2_log_partial_pressure> 10.0
        // Atmospheric CO2 default is -3.4 (approx 0.0004 atm)
        co2_log_partial_pressure: z.number().optional(),
        adjustment_chemical: z.string().optional(),
        balance_cation: z.string().optional(),
        balance_anion: z.string().optional(),
      })
      .optional(),
    treatment: z
      .object({
        productId: z.string().optional(),
        rawMaterialId: z.string().optional(),
        dosage: z.number().optional(),
      })
      .optional()
      .refine(
        (t) => !t || !(t.productId && t.rawMaterialId),
        {
          message: "Provide either productId or rawMaterialId, not both",
        },
      ),
  }),
};
