import z from "zod";
import { AnalysisLabValidationSchema } from "./analysisLab.validation";

export type TCalculateIndicesInput = z.infer<
  typeof AnalysisLabValidationSchema.calculateIndices
>;

export type TCalculateCoolingTowerInput = z.infer<
  typeof AnalysisLabValidationSchema.calculateCoolingTower
>;

export type TBatchSaturationAnalysisInput = z.infer<
  typeof AnalysisLabValidationSchema.batchSaturationAnalysis
>;

export type TPredictCorrosionRateInput = z.infer<
  typeof AnalysisLabValidationSchema.predictCorrosionRate
>;
