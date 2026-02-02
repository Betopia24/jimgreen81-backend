import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReportAnalysisService } from "./reportAnalysis.service";

const analyzeReportFile = catchAsync(async (req, res) => {
  const result = await ReportAnalysisService.analyzeReportFile({
    file: req.file as Express.Multer.File,
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "Report Successfully Upload",
    data: result,
  });
});

export const ReportAnalysisController = { analyzeReportFile };
