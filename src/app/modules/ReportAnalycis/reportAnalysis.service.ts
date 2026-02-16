import status from "http-status";
import FormData from "form-data";
import AppError from "../../../errors/AppError";
import { aiClient } from "../../../config/aiClient";
import prisma from "../../../db/prisma";
import { TAnalyzeReportInput, TModifyReportGraphInput, TRecalculateReportInput } from "./reportAnalysis.interface";
import { reportParameterArrayToObject, reportParameterObjectToArray } from "./reportAnalysis.utils";

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
    return {parameters: reportParameterObjectToArray(result.parameters), validation: result.validation};
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

const analyzeReport = async (payload: { data: TAnalyzeReportInput }) => {

  const {customerId } = payload.data;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if(!customer) {
    throw new AppError(status.NOT_FOUND, "Customer not found with the provided customerId!");
  }

  // return reportParameterArrayToObject(payload.data.parameters);
  const analyzePayload = {
    parameters: reportParameterArrayToObject(payload.data.parameters),
  };

  try {
    const aiResult = await aiClient.post("/water/extract", analyzePayload);

    const result = aiResult.data;

    const reportResult = await prisma.report.create({
      data: {
        companyId: customer.companyId,
        waterReportId: result.id,
        customerId: customerId,
      },
         select: {
      id: true,
      companyId:true,
      createdAt: true,
      customer: true,
      waterReport: true,
    },
    });

    return reportResult;
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to analyze data!\n" +
        " " +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data.detail || (error as any).message,
    );
  }
};

const modifyReportGraph = async (payload: { data: TModifyReportGraphInput}) => {

  const report = await prisma.report.findUnique({
    where: { id: payload.data.reportId },
    select:{
      id: true,
      waterReport: {
        select: {
          id: true,
          report_id: true,
        }
      }
    }
  });

  if (!report?.waterReport) {
    throw new AppError(status.NOT_FOUND, "Report not found!");
  }

  try {
    const aiResult = await aiClient.post("/water/graph/modify", {
      report_id: report.waterReport.report_id,
      prompt: payload.data.prompt,
    });

    const result = aiResult.data;

    const reportResult = await prisma.report.findUnique({
    where: { id: payload.data.reportId },
    select: {
      id: true,
      companyId:true,
      createdAt: true,
      customer: true,
      waterReport: true,
    },
  });

    return {aiResult: result, result: reportResult};
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to modify report graph!\n" +
        " " +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data.detail || (error as any).message,
    );
  }
};

const recalculateReport = async (payload: { data: TRecalculateReportInput }) => {

  const report = await prisma.report.findUnique({ 
    where: { id: payload.data.reportId },
    include:{
      waterReport: true,
    }
  });

  if (!report || !report.waterReport) {
    throw new AppError(status.NOT_FOUND, "Report not found!");
  }

  const existingParameters = reportParameterArrayToObject(payload.data.parameters);

  const recalculatePayload = {
    report_id: report.waterReport.report_id,
    parameters: existingParameters,
  };

  try {
    const aiResult = await aiClient.post("/water/graph/recalculate", recalculatePayload);

    const result = aiResult.data;

    const reportResult = await prisma.report.findUnique({
    where: { id: payload.data.reportId },
    select: {
      id: true,
      companyId:true,
      createdAt: true,
      customer: true,
      waterReport: true,
    },
  });

    return {aiResult: result, result: reportResult};
  // return recalculatePayload;
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to recalculate report!\n" +
        " " +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data.detail || (error as any).message,
    );
  }
};

const reportHistory = async (payload: { companyId: string }) => {

  const reports = await prisma.report.findMany({
    where: { companyId: payload.companyId },
    select: {
      id: true,
      companyId:true,
      createdAt: true,
      customer: true,
      waterReport: true,
    },
  });

  const formattedReports = reports.map(report => ({
    id: report.id,
    report_id: report.waterReport?.report_id,
    customerName: report.customer.name,
    total_score: report.waterReport?.total_score,
    createdAt: report.createdAt,
  }));

  return formattedReports;
};

const getSingleReport = async (payload: { reportId: string }) => {
  const report = await prisma.report.findUnique({
    where: {
      id: payload.reportId,
    },
    select: {
      id: true,
      companyId:true,
      createdAt: true,
      customer: true,
      waterReport: true,
    },
  });

  return report;
};

export const ReportAnalysisService = {
  extractReportFile,
  analyzeReport,
  modifyReportGraph,
  recalculateReport,
  reportHistory,
  getSingleReport,
};
