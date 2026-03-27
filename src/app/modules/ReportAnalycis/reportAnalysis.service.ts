import status from "http-status";
import FormData from "form-data";
import AppError from "../../../errors/AppError";
import { aiClient } from "../../../config/aiClient";
import prisma from "../../../db/prisma";
import {
  IReportFilterRequest,
  TModifyReportGraphInput,
  TRecalculateReportInput,
  TSaturationAnalysisInput,
  TCreateWaterReportInput,
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

const extractWaterReport = async (payload: { file: Express.Multer.File }) => {
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
      filename: result.file_info.filename || payload.file.originalname,
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

const createWaterReport = async (payload: {
  data: TCreateWaterReportInput;
}) => {
  const { assetId, sampleLocation, sampleDate, ...rest } = payload.data;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    include: { customer: true },
  });

  if (!asset) {
    throw new AppError(status.NOT_FOUND, "Asset not found!");
  }

  const parameters = reportParameterArrayToObject(rest.parameters);

  try {
    // Call AI for professional insights (Industrial Grade Score, Risks, etc.)
    const aiResult = await aiClient.post("/water/analyze-data", {
      parameters,
      sample_location: sampleLocation,
      sample_date: sampleDate,
    });

    const result = aiResult.data;

    const reportResult = await prisma.waterReport.create({
      data: {
        originalFilename: rest.filename,
        assetId,
        customerId: asset.customerId,
        companyId: asset.customer.companyId,
        sampleLocation: sampleLocation,
        sampleDate: sampleDate,
        aiReportId: result.report_id, // Save AI persistent ID
        // AI Insights
        extractedParameters: result.extracted_parameters,
        parameterGraph: result.parameter_graph,
        chemicalStatus: result.chemical_status,
        totalScore: result.total_score,
        qualityReport: result.quality_report,
        chemicalComposition: result.chemical_composition,
        biologicalIndicators: result.biological_indicators,
        complianceChecklist: result.compliance_checklist,
        contaminationRisk: result.contamination_risk,
      },
      include: {
        asset: true,
        customer: true,
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

const modifyWaterReportGraph = async (payload: {
  data: TModifyReportGraphInput;
}) => {
  const report = await prisma.waterReport.findUnique({
    where: { aiReportId: payload.data.reportId },
    select: {
      id: true,
      aiReportId: true,
      originalFilename: true,
    },
  });

  if (!report) {
    throw new AppError(status.NOT_FOUND, "Water Report not found!");
  }

  try {
    const aiResult = await aiClient.post("/water/graph/modify", {
      report_id: report.aiReportId,
      prompt: payload.data.prompt,
    });

    const result = aiResult.data;

    const reportResult = await prisma.waterReport.update({
      where: { id: report.id },
      data: {
        parameterGraph: result.updated_graph,
      },
      include: {
        asset: true,
        customer: true,
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

const recalculateWaterReport = async (payload: {
  data: TRecalculateReportInput;
}) => {
  const report = await prisma.waterReport.findUnique({
    where: { aiReportId: payload.data.reportId },
  });

  if (!report) {
    throw new AppError(status.NOT_FOUND, "Water Report not found!");
  }

  try {
    const aiResult = await aiClient.post("/water/recalculate", {
      report_id: report.aiReportId,
      adjusted_parameters: payload.data.adjustedParameters,
    });

    const result = aiResult.data;

    const updatedReport = await prisma.waterReport.update({
      where: { id: report.id },
      data: {
        extractedParameters: result.extracted_parameters,
        parameterGraph: result.parameter_graph,
        chemicalStatus: result.chemical_status,
        totalScore: result.total_score,
        qualityReport: result.quality_report,
        chemicalComposition: result.chemical_composition,
        biologicalIndicators: result.biological_indicators,
        complianceChecklist: result.compliance_checklist,
        contaminationRisk: result.contamination_risk,
      },
      include: {
        asset: true,
        customer: true,
      },
    });

    return updatedReport;
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

const getWaterReportsHistory = async (payload: {
  companyId: string;
  filters: IReportFilterRequest;
  options: IPaginationOptions;
}) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(payload.options);
  const { searchTerm } = payload.filters;

  const andConditions: Prisma.WaterReportWhereInput[] = [
    { companyId: payload.companyId },
  ];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          customer: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          originalFilename: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.WaterReportWhereInput = { AND: andConditions };

  const reports = await prisma.waterReport.findMany({
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
    include: {
      asset: true,
      customer: true,
    },
  });

  const formattedReports = reports.map((report) => ({
    id: report.id,
    assetName: report.asset?.name,
    customerName: report.customer?.name,
    sampleLocation: report.sampleLocation,
    sampleDate: report.sampleDate,
    createdAt: report.createdAt,
  }));

  const total = await prisma.waterReport.count({
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

const getSingleWaterReport = async (payload: { reportId: string }) => {
  const report = await prisma.waterReport.findUnique({
    where: {
      id: payload.reportId,
    },
    include: {
      asset: true,
      customer: true,
    },
  });

  if (!report) {
    throw new AppError(status.NOT_FOUND, "Water Report not found!");
  }

  return report;
};

const createSaturationAnalysis = async (payload: {
  data: TSaturationAnalysisInput;
}) => {
  const { assetId, waterReportId, inputConfig, treatment } = payload.data;

  // 1. Fetch required context
  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    include: { customer: true },
  });

  const waterReport = await prisma.waterReport.findUnique({
    where: { id: waterReportId },
  });

  if (!asset || !waterReport) {
    throw new AppError(status.NOT_FOUND, "Asset or Water Report not found!");
  }

  // 2. Map Asset Data for defaults (if not in inputConfig)
  const cocData = asset?.controlVariablesAndTargets
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (asset.controlVariablesAndTargets as any[]).find(
        (target) => target.variable === "COC",
      )
    : null;

  const tempData = asset?.controlVariablesAndTargets
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (asset.controlVariablesAndTargets as any[]).find(
        (target) => target.variable === "Temperature",
      )
    : null;

  const phData = asset?.controlVariablesAndTargets
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (asset.controlVariablesAndTargets as any[]).find(
        (target) => target.variable === "pH",
      )
    : null;

  const assetTreatmentData =
    asset?.productPrograms && Array.isArray(asset.productPrograms)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (asset.productPrograms as any[])[0]
      : null;

  // 3. Construct AI Payload (Merging report chemical data + asset operational data)
  const aiPayload = {
    salt_id: inputConfig.salt_id || "Calcite",
    treatment_id:
      inputConfig.treatment_id || assetTreatmentData?.productId || "HEDP",
    dosage_ppm:
      inputConfig.dosage_ppm ||
      (assetTreatmentData?.dosage
        ? parseFloat(assetTreatmentData.dosage)
        : 2.0),
    coc_min: inputConfig.coc_min || cocData?.minValue || 1,
    coc_max: inputConfig.coc_max || cocData?.maxValue || 10,
    coc_interval: inputConfig.coc_interval || 1,
    temp_min: inputConfig.temp_min || tempData?.minValue || 110,
    temp_max: inputConfig.temp_max || tempData?.maxValue || 160,
    temp_interval: inputConfig.temp_interval || 10,
    temp_unit: inputConfig.temp_unit || tempData?.unit || "F",
    ph_mode: inputConfig.ph_mode || "fixed",
    fixed_ph:
      inputConfig.fixed_ph || phData?.maxValue || phData?.minValue || 8.2,
    adjustment_chemical: inputConfig.adjustment_chemical || "H2SO4",
    balance_cation: inputConfig.balance_cation || "Na",
    balance_anion: inputConfig.balance_anion || "Cl",

    // Base water parameters from chemical snapshot
    base_water_parameters: waterReport.extractedParameters,

    // Additional asset context
    asset_info: {
      name: asset.name,
      type: asset.type,
      towerType: asset.towerType,
      systemVolume: asset.systemVolume,
      systemMetallurgy: asset.systemMetallurgy,
    },
  };

  // 4. Run Simulation via AI
  try {
    const aiResult = await aiClient.post("/water/batch-saturation", aiPayload);

    // 5. Store Analysis Result in DB
    const analysisRecord = await prisma.saturationAnalysis.create({
      data: {
        companyId: asset.customer.companyId,
        customerId: asset.customerId,
        assetId: asset.id,
        waterReportId: waterReport.id,
        inputConfig: inputConfig as any,
        productId: treatment?.productId,
        rawMaterialId: treatment?.rawMaterialId,
        dosage: treatment?.dosage,
        aiResponse: aiResult.data,
        graphData: aiResult.data.graphData || aiResult.data, // Map appropriately
        status: "DONE",
      },
      include: {
        asset: true,
        waterReport: true,
      },
    });

    return analysisRecord;
  } catch (error) {
    // Save as FAILED if possible
    await prisma.saturationAnalysis.create({
      data: {
        companyId: asset.customer.companyId,
        customerId: asset.customerId,
        assetId: asset.id,
        waterReportId: waterReport.id,
        inputConfig: inputConfig as any,
        status: "FAILED",
        graphData: {},
        aiResponse: {
          error: (error as any).message,
          detail: (error as any).response?.data,
        },
      },
    });

    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to perform saturation analysis!\n" +
        " " +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data.detail || (error as any).message,
    );
  }
};

const getSingleSaturationAnalysis = async (payload: { id: string }) => {
  const result = await prisma.saturationAnalysis.findUnique({
    where: { id: payload.id },
    include: {
      waterReport: true,
      asset: true,
      customer: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Saturation Analysis not found!");
  }

  return result;
};

const getSaturationAnalysesHistory = async (payload: {
  companyId: string;
  filters: IReportFilterRequest;
  options: IPaginationOptions;
}) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(payload.options);
  const { searchTerm } = payload.filters;

  const andConditions: Prisma.SaturationAnalysisWhereInput[] = [
    { companyId: payload.companyId },
  ];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          customer: {
            name: { contains: searchTerm, mode: "insensitive" },
          },
        },
        {
          asset: {
            name: { contains: searchTerm, mode: "insensitive" },
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.SaturationAnalysisWhereInput = {
    AND: andConditions,
  };

  const results = await prisma.saturationAnalysis.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      asset: true,
      customer: true,
      waterReport: true,
    },
  });

  const total = await prisma.saturationAnalysis.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: results,
  };
};

export const ReportAnalysisService = {
  extractWaterReport,
  createWaterReport,
  modifyWaterReportGraph,
  recalculateWaterReport,
  getWaterReportsHistory,
  getSingleWaterReport,
  createSaturationAnalysis,
  getSingleSaturationAnalysis,
  getSaturationAnalysesHistory,
};
