import status from "http-status";
import FormData from "form-data";
import AppError from "../../../errors/AppError";
import { aiClient } from "../../../config/aiClient";
import prisma from "../../../db/prisma";
import {
  IReportFilterRequest,
  TAnalyzeReportInput,
  TBatchSaturationAnalysisInput,
  TCalculateCoolingTowerInput,
  TCalculateIndicesInput,
  TModifyReportGraphInput,
  TPredictCorrosionRateInput,
  TRecalculateReportInput,
} from "./reportAnalysis.interface";
import {
  reportParameterArrayToObject,
  reportParameterObjectToArray,
} from "./reportAnalysis.utils";
import {
  IPaginationOptions,
  PaginationHelper,
} from "../../../helpers/pagination";
import { Prisma } from "@prisma/client";

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
    return {
      parameters: reportParameterObjectToArray(result.parameters),
      validation: result.validation,
    };
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
  const { customerId } = payload.data;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new AppError(
      status.NOT_FOUND,
      "Customer not found with the provided customerId!",
    );
  }

  const analyzePayload = {
    parameters: reportParameterArrayToObject(payload.data.parameters),
  };

  try {
    const aiResult = await aiClient.post("/water/analyze-data", analyzePayload);

    const result = aiResult.data;

    const existingReport = await prisma.waterReport.findFirst({
      where: {
        report_id: result.report_id,
      },
    });

    const reportResult = await prisma.report.create({
      data: {
        companyId: customer.companyId,
        waterReportId: existingReport?.id,
        customerId: customerId,
      },
      select: {
        id: true,
        companyId: true,
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

const modifyReportGraph = async (payload: {
  data: TModifyReportGraphInput;
}) => {
  const report = await prisma.report.findUnique({
    where: { id: payload.data.reportId },
    select: {
      id: true,
      waterReport: {
        select: {
          id: true,
          report_id: true,
        },
      },
    },
  });

  if (!report?.waterReport) {
    throw new AppError(status.NOT_FOUND, "Report not found!");
  }

  try {
    await aiClient.post("/water/graph/modify", {
      report_id: report.waterReport.report_id,
      prompt: payload.data.prompt,
    });

    const reportResult = await prisma.report.findUnique({
      where: { id: payload.data.reportId },
      select: {
        id: true,
        companyId: true,
        createdAt: true,
        customer: true,
        waterReport: true,
      },
    });

    return reportResult;
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

const recalculateReport = async (payload: {
  data: TRecalculateReportInput;
}) => {
  const report = await prisma.report.findUnique({
    where: { id: payload.data.reportId },
    include: {
      waterReport: true,
    },
  });

  if (!report || !report.waterReport) {
    throw new AppError(status.NOT_FOUND, "Report not found!");
  }

  try {
    const aiResult = await aiClient.post("/water/recalculate", {
      report_id: report.waterReport.report_id,
      adjusted_parameters: payload.data.adjustedParameters,
    });

    const reportResult = await prisma.report.findUnique({
      where: { id: payload.data.reportId },
      select: {
        id: true,
        companyId: true,
        createdAt: true,
        customer: true,
        waterReport: true,
      },
    });

    return reportResult;
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

const reportHistory = async (payload: {
  companyId: string;
  filters: IReportFilterRequest;
  options: IPaginationOptions;
}) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(payload.options);
  const { searchTerm } = payload.filters;

  const andConditions: Prisma.ReportWhereInput[] = [
    { companyId: payload.companyId },
  ];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          customer: {
            is: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
        {
          waterReport: {
            is: {
              report_id: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.ReportWhereInput = { AND: andConditions };

  const reports = await prisma.report.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      companyId: true,
      createdAt: true,
      customer: true,
      waterReport: true,
    },
  });

  const formattedReports = reports.map((report) => ({
    id: report.id,
    report_id: report.waterReport?.report_id,
    customerName: report.customer.name,
    total_score: report.waterReport?.total_score,
    createdAt: report.createdAt,
  }));

  const total = await prisma.report.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: formattedReports,
  };
};

const getSingleReport = async (payload: { reportId: string }) => {
  const report = await prisma.report.findUnique({
    where: {
      id: payload.reportId,
    },
    select: {
      id: true,
      companyId: true,
      createdAt: true,
      customer: true,
      waterReport: true,
    },
  });

  return report;
};

const calculateWaterIndices = async (payload: {
  data: TCalculateIndicesInput;
}) => {
  const { report_id, ...data } = payload.data;

  if (report_id) {
    const report = await prisma.waterReport.findFirst({
      where: { report_id: report_id },
    });

    if (!report) {
      throw new AppError(status.NOT_FOUND, "Report not found!");
    }
  }

  // return payload.data;

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
  // return payload.data;

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

  if (payload.data.report_id) {
    const report = await prisma.waterReport.findFirst({
      where: { report_id: payload.data.report_id },
    });

    if (!report) {
      throw new AppError(status.NOT_FOUND, "Report not found!");
    }
  }

  // return transformedData;

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

  if (report_id) {
    const report = await prisma.waterReport.findFirst({
      where: { report_id: report_id },
    });

    if (!report) {
      throw new AppError(status.NOT_FOUND, "Report not found!");
    }
  }

  // return payload.data;

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

export const ReportAnalysisService = {
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
