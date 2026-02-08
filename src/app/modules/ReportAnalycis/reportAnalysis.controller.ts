import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReportAnalysisService } from "./reportAnalysis.service";

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
  const result = await ReportAnalysisService.reportHistory({
    companyId: req.params.companyId,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report History Successfully Retrieved!",
    data: result,
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

export const ReportAnalysisController = {
  extractReportFile,
  analyzeReport,
  recalculateReport,
  reportHistory,
  getSingleReport,
};
