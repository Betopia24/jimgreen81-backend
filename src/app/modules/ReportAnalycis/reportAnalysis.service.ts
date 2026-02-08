import status from "http-status";
import FormData from "form-data";
import AppError from "../../../errors/AppError";
import { aiClient } from "../../../config/aiClient";

const extractReportFile = async (payload: { file: Express.Multer.File }) => {
  if (!payload.file) {
    throw new AppError(status.BAD_REQUEST, "Report file is required!");
  }

  try {
    const formData = new FormData();
    formData.append("file", payload.file.buffer, {
      filename: payload.file.originalname,
      contentType: payload.file.mimetype,
    });

    const aiResult = await aiClient.post("/extract", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return aiResult.data;
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to analyze report file!\n" +
        " " +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data.detail || (error as any).message,
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const analyzeReport = async (payload: { data: any }) => {
  return payload;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const recalculateReport = async (payload: { data: any }) => {
  return payload;
};

const reportHistory = async (payload: { companyId: string }) => {
  return payload;
};

export const ReportAnalysisService = {
  extractReportFile,
  analyzeReport,
  recalculateReport,
  reportHistory,
};
