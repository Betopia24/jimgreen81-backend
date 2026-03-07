import { z } from "zod";

const environmentalDischargeLimitSchema = z.object({
  parameter: z.string().optional(),
  limitValue: z.string().optional(),
  unit: z.string().optional(),
});

const productProgramSchema = z.object({
  productId: z.string().optional(),
  dosage: z.string().optional(),
  unit: z.string().optional(),
});

const controlVariableSchema = z.object({
  variable: z.string().optional(),
  source: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  unit: z.string().optional(),
});

const createAssetSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  name: z.string().min(1, "Asset name is required"),
  type: z.string().min(1, "Asset type is required"),
  towerType: z.string().optional(),
  fillType: z.string().optional(),
  criticalHeatExchangerDesign: z.string().optional(),
  recirculationRate: z.number().optional(),
  recirculationRateType: z.string().optional(),
  tonnageOfCooling: z.number().optional(),
  systemVolume: z.number().optional(),
  systemVolumeType: z.string().optional(),
  supplyTemperature: z.number().optional(),
  supplyTemperatureType: z.string().optional(),
  returnTemperature: z.number().optional(),
  returnTemperatureType: z.string().optional(),
  deltaTemperature: z.number().optional(),
  systemMetallurgy: z.array(z.string()).optional(),
  systemMaterials: z.array(z.string()).optional(),
  hottestSkinTemperature: z.number().optional(),
  hottestSkinTemperatureType: z.string().optional(),
  criticalHeatExchangerFlowRate: z.number().optional(),
  criticalHeatExchangerFlowRateType: z.string().optional(),

  // for 3rd type
  flowRate: z.number().optional(),
  flowRateType: z.string().optional(),
  dischargeTemperature: z.number().optional(),
  dischargeTemperatureType: z.string().optional(),
  criticalCooling: z.string().optional(),
  criticalFlowRate: z.number().optional(),
  criticalFlowRateType: z.string().optional(),

  NSFStandard60: z.boolean().optional(),
  NSFG5G7: z.boolean().optional(),
  GRAS: z.boolean().optional(),
  environmentalDischargeLimits: z
    .array(environmentalDischargeLimitSchema)
    .optional(),
  productPrograms: z.array(productProgramSchema).optional(),
  controlVariablesAndTargets: z.array(controlVariableSchema).optional(),
});

const updateAssetSchema = z.object({
  customerId: z.string().optional(),
  name: z.string().min(1).optional(),
  type: z.string().optional(),
  towerType: z.string().optional(),
  fillType: z.string().optional(),
  criticalHeatExchangerDesign: z.string().optional(),
  recirculationRate: z.number().optional(),
  recirculationRateType: z.string().optional(),
  tonnageOfCooling: z.number().optional(),
  systemVolume: z.number().optional(),
  systemVolumeType: z.string().optional(),
  supplyTemperature: z.number().optional(),
  supplyTemperatureType: z.string().optional(),
  returnTemperature: z.number().optional(),
  returnTemperatureType: z.string().optional(),
  deltaTemperature: z.number().optional(),
  systemMetallurgy: z.array(z.string()).optional(),
  systemMaterials: z.array(z.string()).optional(),
  hottestSkinTemperature: z.number().optional(),
  hottestSkinTemperatureType: z.string().optional(),
  criticalHeatExchangerFlowRate: z.number().optional(),
  criticalHeatExchangerFlowRateType: z.string().optional(),
  NSFStandard60: z.boolean().optional(),
  NSFG5G7: z.boolean().optional(),
  GRAS: z.boolean().optional(),
  environmentalDischargeLimits: z
    .array(environmentalDischargeLimitSchema)
    .optional(),
  productPrograms: z.array(productProgramSchema).optional(),
  controlVariablesAndTargets: z.array(controlVariableSchema).optional(),
});

export const AssetValidation = {
  createAssetSchema,
  updateAssetSchema,
};
