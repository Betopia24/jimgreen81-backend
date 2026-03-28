import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReportAnalysisService } from "./reportAnalysis.service";
import pickOptions from "../../../shared/pick";

const extractWaterReport = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.extractWaterReport({
    file: req.file as Express.Multer.File,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report Successfully Extracted!",
    data: result,
  });
});

const modifyWaterReportGraph = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.modifyWaterReportGraph({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report Successfully Modified!",
    data: result,
  });
});

const recalculateWaterReport = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.recalculateWaterReport({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report Successfully Recalculated!",
    data: result,
  });
});

const getWaterReportsHistory = catchAsync(async (req, res) => {
  const filters = pickOptions(req.query, [
    "companyId",
    "customerId",
    "assetId",
    "searchTerm",
  ]);
  const options = pickOptions(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);

  const result = await ReportAnalysisService.getWaterReportsHistory({
    filters,
    options,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Water Reports Successfully Retrieved!",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleWaterReport = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.getSingleWaterReport({
    reportId: req.params.reportId,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report Successfully Retrieved!",
    data: result,
  });
});

const createSaturationAnalysis = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.createSaturationAnalysis({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Successfully performed Saturation Analysis!",
    data: result,
  });
});

const createWaterReport = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.createWaterReport({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Water Report Successfully Created!",
    data: result,
  });
});

const getSingleSaturationAnalysis = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.getSingleSaturationAnalysis({
    id: req.params.id,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Saturation Analysis Successfully Retrieved!",
    data: result,
  });
});

const getSaturationAnalysesHistory = catchAsync(async (req, res) => {
  const filters = pickOptions(req.query, [
    "companyId",
    "customerId",
    "assetId",
    "waterReportId",
    "searchTerm",
  ]);
  const options = pickOptions(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);

  const result = await ReportAnalysisService.getSaturationAnalysesHistory({
    filters,
    options,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Saturation Analyses Successfully Retrieved!",
    data: result.data,
    meta: result.meta,
  });
});

const deleteWaterReport = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.deleteWaterReport({
    id: req.params.id,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Water Report Successfully Deleted!",
    data: result,
  });
});

const deleteSaturationAnalysis = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.deleteSaturationAnalysis({
    id: req.params.id,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Saturation Analysis Successfully Deleted!",
    data: result,
  });
});

const getCompanyOverview = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.getCompanyOverview({
    companyId: req.params.companyId,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Company Overview Successfully Retrieved!",
    data: result,
  });
});

export const ReportAnalysisController = {
  extractWaterReport,
  createWaterReport,
  modifyWaterReportGraph,
  recalculateWaterReport,
  getWaterReportsHistory,
  getSingleWaterReport,
  createSaturationAnalysis,
  getSingleSaturationAnalysis,
  getSaturationAnalysesHistory,
  deleteWaterReport,
  deleteSaturationAnalysis,
  getCompanyOverview,
};
