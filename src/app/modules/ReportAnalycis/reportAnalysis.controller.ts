import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReportAnalysisService } from "./reportAnalysis.service";
import pickOptions from "../../../shared/pick";

const extractReportFile = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.extractReportFile({
    file: req.file as Express.Multer.File,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report Successfully Extracted!",
    data: result,
  });
});

const analyzeReport = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.analyzeReport({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report Successfully Analyzed!",
    data: result,
  });
});

const modifyReportGraph = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.modifyReportGraph({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report Successfully Modified!",
    data: result,
  });
});

const recalculateReport = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.recalculateReport({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report Successfully Recalculated!",
    data: result,
  });
});

const reportHistory = catchAsync(async (req, res) => {
  const filters = pickOptions(req.query, ["searchTerm"]);
  const options = pickOptions(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);

  const result = await ReportAnalysisService.reportHistory({
    companyId: req.params.companyId,
    filters,
    options,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report History Successfully Retrieved!",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleReport = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.getSingleReport({
    reportId: req.params.reportId,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report Successfully Retrieved!",
    data: result,
  });
});

const calculateWaterIndices = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.calculateWaterIndices({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Successfully Calculated Water Indices!",
    data: result,
  });
});

const calculateCoolingTower = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.calculateCoolingTower({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Successfully Calculated Cooling Tower!",
    data: result,
  });
});

const batchSaturationAnalysis = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.batchSaturationAnalysis({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Successfully Batch Saturation Analysis!",
    data: result,
  });
});

const predictCorrosionRate = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.predictCorrosionRate({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Successfully Predicted Corrosion Rate!",
    data: result,
  });
});

export const ReportAnalysisController = {
  extractReportFile,
  analyzeReport,
  modifyReportGraph,
  recalculateReport,
  reportHistory,
  getSingleReport,
  calculateWaterIndices,
  calculateCoolingTower,
  batchSaturationAnalysis,
  predictCorrosionRate,
};
