import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AnalysisLabService } from "./analysisLab.service";

const calculateWaterIndices = catchAsync(async (req, res) => {
  const result = await AnalysisLabService.calculateWaterIndices({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Successfully Calculated Water Indices!",
    data: result,
  });
});

const calculateCoolingTower = catchAsync(async (req, res) => {
  const result = await AnalysisLabService.calculateCoolingTower({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Successfully Calculated Cooling Tower!",
    data: result,
  });
});

const batchSaturationAnalysis = catchAsync(async (req, res) => {
  const result = await AnalysisLabService.batchSaturationAnalysis({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Successfully Batch Saturation Analysis!",
    data: result,
  });
});

const predictCorrosionRate = catchAsync(async (req, res) => {
  const result = await AnalysisLabService.predictCorrosionRate({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Successfully Predicted Corrosion Rate!",
    data: result,
  });
});

export const AnalysisLabController = {
  calculateWaterIndices,
  calculateCoolingTower,
  batchSaturationAnalysis,
  predictCorrosionRate,
};
