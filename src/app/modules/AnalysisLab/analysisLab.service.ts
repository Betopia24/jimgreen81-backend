import status from "http-status";
import AppError from "../../../errors/AppError";
import { aiClient } from "../../../config/aiClient";
import {
  TCalculateCoolingTowerInput,
  TCalculateIndicesInput,
  TBatchSaturationAnalysisInput,
  TPredictCorrosionRateInput,
} from "./analysisLab.interface";

const calculateWaterIndices = async (payload: {
  data: TCalculateIndicesInput;
}) => {
  const { report_id, ...data } = payload.data;

  const aiPath = report_id
    ? `/water/calculate-indices?report_id=${report_id}`
    : "/water/calculate-indices";

  try {
    const aiResult = await aiClient.post(aiPath, data);

    return aiResult.data.indices;
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to calculate water indices!\n" +
        " " +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data.detail || (error as any).message,
    );
  }
};

const calculateCoolingTower = async (payload: {
  data: TCalculateCoolingTowerInput;
}) => {
  try {
    const aiResult = await aiClient.post("/water/cooling-tower", payload.data);

    return aiResult.data.cooling_tower_analysis;
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to calculate cooling tower!\n" +
        " " +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data.detail || (error as any).message,
    );
  }
};

const batchSaturationAnalysis = async (payload: {
  data: TBatchSaturationAnalysisInput;
}) => {
  const {
    ph_range_min,
    ph_range_max,
    coc_range_min,
    coc_range_max,
    temp_range_min,
    temp_range_max,
    ...rest
  } = payload.data;

  const transformedData = {
    ...rest,
    ph_range: [ph_range_min, ph_range_max],
    coc_range: [coc_range_min, coc_range_max],
    temp_range: [temp_range_min, temp_range_max],
  };

  try {
    const aiResult = await aiClient.post(
      "/water/batch-saturation",
      transformedData,
    );

    return aiResult.data;
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to batch saturation analysis!\n" +
        " " +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data.detail || (error as any).message,
    );
  }
};

const predictCorrosionRate = async (payload: {
  data: TPredictCorrosionRateInput;
}) => {
  const { report_id, ...data } = payload.data;

  const aiPath = report_id
    ? `/water/corrosion-rate?report_id=${report_id}`
    : "/water/corrosion-rate";

  try {
    const aiResult = await aiClient.post(aiPath, data);

    return aiResult.data;
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to predict corrosion rate!\n" +
        " " +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data.detail || (error as any).message,
    );
  }
};

export const AnalysisLabService = {
  calculateWaterIndices,
  calculateCoolingTower,
  batchSaturationAnalysis,
  predictCorrosionRate,
};
