import status from "http-status";
import FormData from "form-data";
import AppError from "../../../errors/AppError";
import { aiClient } from "../../../config/aiClient";
import prisma from "../../../db/prisma";

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

    const aiResult = await aiClient.post("/water/extract", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const result = aiResult.data;
    return {parameters: result.parameters, validation: result.validation};
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
  const result = await prisma.report.create({
    data: {
      companyId: "69720ddcfbd00e45c48af57b",
      waterReportId: "696732bf672add21ab74b104",
      customerId: "697d83d177a7c34e08d7133b",
    },
  });

  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const recalculateReport = async (payload: { data: any }) => {
  return payload;
};

const reportHistory = async (payload: { companyId: string }) => {
  return payload;
};

const getSingleReport = async (payload: { reportId: string }) => {
  const report = await prisma.report.findUnique({
    where: {
      id: payload.reportId,
    },
    include: {
      customer: true,
      waterReport: true,
    },
  });

  return report;
};

export const ReportAnalysisService = {
  extractReportFile,
  analyzeReport,
  recalculateReport,
  reportHistory,
  getSingleReport,
};
