import { z } from "zod";

// ----------------------------
// Shared Schemas
// ----------------------------
const ParameterValueSchema = z.object({
  value: z.number(),
  unit: z.string().optional(),
});

const SaturationIndicesSchema = z.object({
  Calcite: z.number().optional(),
  AluminiumSilicate: z.number().optional(),
  TinSilicate: z.number().optional(),
  Tricalciumphosphate: z.number().optional(),
  Zincphosphate: z.number().optional(),
});

// ----------------------------
// /water/calculate-indices
// ----------------------------
export const calculateIndicesSchema = z
  .object({
    // Option A: report_id
    report_id: z.string().optional(),

    // Option B: manual parameters
    parameters: z
      .object({
        pH: ParameterValueSchema,
        Calcium: ParameterValueSchema,
        Alkalinity: ParameterValueSchema,
        TDS: ParameterValueSchema,
        Temperature: ParameterValueSchema,
        Chloride: ParameterValueSchema,
        Sulfate: ParameterValueSchema,
        Bicarbonate: ParameterValueSchema,
        Carbonate: ParameterValueSchema,
      })
      .optional(),
  })
  .refine(
    (data) =>
      (!!data.report_id && !data.parameters) ||
      (!data.report_id && !!data.parameters),
    {
      message:
        "Either provide report_id (Option A) or parameters (Option B), not both",
    },
  );

// ----------------------------
// /water/cooling-tower
// ----------------------------
export const calculateCoolingTowerSchema = z.object({
  recirculation_rate_gpm: z.number(),
  hot_water_temp_f: z.number(),
  cold_water_temp_f: z.number(),
  wet_bulb_temp_f: z.number(),
  coc: z.number(),
  drift_percent: z.number(),
  evaporation_factor_percent: z.number(),
});

// ----------------------------
// /water/batch-saturation
// ----------------------------
export const batchSaturationAnalysisSchema = z
  .object({
    report_id: z.string().optional(),
    base_water_parameters: z
      .object({
        pH: ParameterValueSchema,
        Calcium: ParameterValueSchema,
        Magnesium: ParameterValueSchema,
        Sodium: ParameterValueSchema,
        Potassium: ParameterValueSchema,
        Chloride: ParameterValueSchema,
        Sulfate: ParameterValueSchema,
        Alkalinity: ParameterValueSchema,
        Temperature: ParameterValueSchema,
      })
      .optional(),

    // New flat range fields
    ph_range_min: z.number(),
    ph_range_max: z.number(),
    coc_range_min: z.number(),
    coc_range_max: z.number(),
    temp_range_min: z.number(),
    temp_range_max: z.number(),

    grid_resolution: z.number(),
  })
  .refine(
    (data) =>
      (!!data.report_id && !data.base_water_parameters) ||
      (!data.report_id && !!data.base_water_parameters),
    {
      message:
        "Either provide report_id (Option A) or base_water_parameters (Option B)",
    },
  )
  .refine((data) => data.ph_range_min < data.ph_range_max, {
    message: "ph_range_min must be less than ph_range_max",
    path: ["ph_range_min"],
  })
  .refine((data) => data.coc_range_min < data.coc_range_max, {
    message: "coc_range_min must be less than coc_range_max",
    path: ["coc_range_min"],
  })
  .refine((data) => data.temp_range_min < data.temp_range_max, {
    message: "temp_range_min must be less than temp_range_max",
    path: ["temp_range_min"],
  });

// ----------------------------
// /water/corrosion-rate
// ----------------------------
export const predictCorrosionRateSchema = z
  .object({
    report_id: z.string().optional(), // Option A
    metal_type: z.enum(["mild_steel", "copper"]),
    parameters: z
      .object({
        pH: ParameterValueSchema,
        Temperature: ParameterValueSchema.optional(), // mild_steel
        PMA: ParameterValueSchema.optional(), // mild_steel
        Chloride: ParameterValueSchema.optional(), // copper
        Free_Chlorine: ParameterValueSchema.optional(),
        Total_Chlorine: ParameterValueSchema.optional(),
        TTA: ParameterValueSchema.optional(),
        MBT: ParameterValueSchema.optional(),
        Copper: ParameterValueSchema.optional(),
      })
      .optional(), // Option B
    saturation_indices: SaturationIndicesSchema.optional(),
    do_ppm: z.number().optional(),
    temp_c: z.number().optional(),
  })
  .refine(
    (data) =>
      (!!data.report_id && !data.parameters && !data.saturation_indices) ||
      (!data.report_id && !!data.parameters),
    {
      message:
        "Either provide report_id + metal_type (Option A) or full manual parameters (Option B), not both",
    },
  );

export const AnalysisLabValidationSchema = {
  calculateIndices: calculateIndicesSchema,
  calculateCoolingTower: calculateCoolingTowerSchema,
  batchSaturationAnalysis: batchSaturationAnalysisSchema,
  predictCorrosionRate: predictCorrosionRateSchema,
};
