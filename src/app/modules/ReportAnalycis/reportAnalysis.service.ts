import status from "http-status";
import AppError from "../../../errors/AppError";

const analyzeReportFile = async (payload: { file: Express.Multer.File }) => {
  if (!payload.file) {
    throw new AppError(status.BAD_REQUEST, "Report file is required!");
  }

  return payload;
};

const generateReport = async (payload: { file: Express.Multer.File }) => {
  return payload;
};

export const ReportAnalysisService = { analyzeReportFile };
