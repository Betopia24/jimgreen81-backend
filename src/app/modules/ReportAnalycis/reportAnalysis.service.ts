import status from "http-status";
import FormData from "form-data";
import AppError from "../../../errors/AppError";
import { aiClient } from "../../../config/aiClient";
import prisma from "../../../db/prisma";
import {
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
  const { name, assetId, sampleLocation, sampleDate, ...rest } = payload.data;

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
      parameters: parameters,
      sample_location: sampleLocation,
      sample_date: sampleDate,
    });

    const result = aiResult.data;

    const updateData = {
      name,
      originalFilename: rest.filename,
      assetId,
      customerId: asset.customerId,
      companyId: asset.customer.companyId,
      sampleLocation: sampleLocation,
      sampleDate: sampleDate,
      extractedParameters: result.extracted_parameters,
      parameterGraph: result.parameter_graph,
      chemicalStatus: result.chemical_status,
      totalScore: result.total_score,
      qualityReport: result.quality_report,
      chemicalComposition: result.chemical_composition,
      biologicalIndicators: result.biological_indicators,
      complianceChecklist: result.compliance_checklist,
      contaminationRisk: result.contamination_risk,
    };

    const reportResult = await prisma.waterReport.upsert({
      where: {
        aiReportId: result.report_id,
      },
      update: {
        ...updateData,
      },
      create: {
        aiReportId: result.report_id,
        ...updateData,
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
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(payload.data.reportId);

  const report = await prisma.waterReport.findUnique({
    where: isObjectId
      ? { id: payload.data.reportId }
      : { aiReportId: payload.data.reportId },
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
        asset: {
          select: {
            name: true,
            type: true,
            towerType: true,
            fillType: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            address: true,
            contactEmail: true,
            contactPerson: true,
            contactPhone: true,
          },
        },
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
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(payload.data.reportId);

  const report = await prisma.waterReport.findUnique({
    where: isObjectId
      ? { id: payload.data.reportId }
      : { aiReportId: payload.data.reportId },
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
        asset: {
          select: {
            name: true,
            type: true,
            towerType: true,
            fillType: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            address: true,
            contactEmail: true,
            contactPerson: true,
            contactPhone: true,
          },
        },
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

// Flexible filter: by companyId, customerId, or assetId (query params)
const getWaterReportsHistory = async (payload: {
  filters: {
    companyId?: string;
    customerId?: string;
    assetId?: string;
    searchTerm?: string;
  };
  options: IPaginationOptions;
}) => {
  const { filters, options } = payload;
  const { companyId, customerId, assetId, searchTerm } = filters;

  if (!companyId && !customerId && !assetId) {
    throw new AppError(
      status.BAD_REQUEST,
      "At least one of companyId, customerId, or assetId is required!",
    );
  }

  if (companyId && customerId) {
    throw new AppError(
      status.BAD_REQUEST,
      "CompanyId and CustomerId cannot be provided together!",
    );
  }

  if (companyId && assetId) {
    throw new AppError(
      status.BAD_REQUEST,
      "CompanyId and AssetId cannot be provided together!",
    );
  }

  if (customerId && assetId) {
    throw new AppError(
      status.BAD_REQUEST,
      "CustomerId and AssetId cannot be provided together!",
    );
  }

  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(options);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    AND: [
      companyId ? { companyId } : {},
      customerId ? { customerId } : {},
      assetId ? { assetId } : {},
    ],
  };

  if (searchTerm) {
    whereClause.OR = [
      { customer: { name: { contains: searchTerm, mode: "insensitive" } } },
      { originalFilename: { contains: searchTerm, mode: "insensitive" } },
      { sampleLocation: { contains: searchTerm, mode: "insensitive" } },
      { aiReportId: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const [total, reports] = await Promise.all([
    prisma.waterReport.count({ where: whereClause }),
    prisma.waterReport.findMany({
      where: whereClause,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        asset: { select: { name: true, type: true, towerType: true } },
        customer: { select: { id: true, name: true, siteName: true } },
        company: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: reports.map((r) => ({
      id: r.id,
      aiReportId: r.aiReportId,
      name: r.name,
      originalFilename: r.originalFilename,
      sampleLocation: r.sampleLocation,
      sampleDate: r.sampleDate,
      assetId: r.assetId,
      assetName: r.asset?.name,
      customerId: r.customerId,
      customerName: r.customer?.name,
      customerSiteName: r.customer?.siteName,
      companyId: r.companyId,
      companyName: r.company?.name,
      createdAt: r.createdAt,
    })),
  };
};

const getSingleWaterReport = async (payload: { reportId: string }) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(payload.reportId);

  const report = await prisma.waterReport.findUnique({
    where: isObjectId
      ? { id: payload.reportId }
      : { aiReportId: payload.reportId },
    include: {
      asset: {
        select: {
          name: true,
          type: true,
          towerType: true,
          fillType: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          address: true,
          contactEmail: true,
          contactPerson: true,
          contactPhone: true,
        },
      },
    },
  });

  if (!report) {
    throw new AppError(status.NOT_FOUND, "Water Report not found!");
  }

  return report;
};

const deleteWaterReport = async (payload: { id: string }) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(payload.id);

  const report = await prisma.waterReport.findUnique({
    where: isObjectId ? { id: payload.id } : { aiReportId: payload.id },
  });

  if (!report) {
    throw new AppError(status.NOT_FOUND, "Water Report not found!");
  }

  const result = await prisma.waterReport.delete({
    where: { id: report.id },
  });

  return result;
};

const createSaturationAnalysis = async (payload: {
  data: TSaturationAnalysisInput;
}) => {
  const { name, assetId, waterReportId, inputConfig, treatment } = payload.data;

  // 1. Fetch required context
  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    include: { customer: true },
  });

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(waterReportId);

  const waterReport = await prisma.waterReport.findUnique({
    where: isObjectId ? { id: waterReportId } : { aiReportId: waterReportId },
  });

  if (!asset || !waterReport) {
    throw new AppError(status.NOT_FOUND, "Asset or Water Report not found!");
  }

  // 2. Extract Data from Asset Models
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

  const activeProgram =
    asset?.productPrograms && Array.isArray(asset.productPrograms)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (asset.productPrograms as any[])[0]
      : null;

  // 3. Resolve Treatment Chemistry
  // Priority: body.treatment.productId > body.treatment.rawMaterialId > asset activeProgram.productId
  let productSnapshot = null;
  let rawMaterialSnapshot = null;

  const targetProductId =
    treatment?.productId || activeProgram?.productId || null;

  const targetRawMaterialId = treatment?.rawMaterialId || null;

  // Fetch full Product (with its blend of rawMaterials snapshot)
  if (targetProductId && /^[0-9a-fA-F]{24}$/.test(targetProductId)) {
    productSnapshot = await prisma.product.findUnique({
      where: { id: targetProductId },
    });
  }

  // Fetch specific RawMaterial (for single-component or override simulation)
  if (targetRawMaterialId && /^[0-9a-fA-F]{24}$/.test(targetRawMaterialId)) {
    rawMaterialSnapshot = await prisma.rawMaterial.findUnique({
      where: { id: targetRawMaterialId },
    });
  }

  // Resolve dosage: explicit override > asset program dosage > default
  const resolvedDosage =
    inputConfig?.dosage_ppm ??
    treatment?.dosage ??
    (activeProgram?.dosage ? parseFloat(activeProgram.dosage) : 2.0);

  // 4. Construct AI Payload — no backend calculations, pass all raw data to AI
  const aiPayload = {
    // === Primary salt to visualize (AI calculates all salts regardless) ===
    salt_id: inputConfig?.salt_id ?? null,
    // === Salts of Interest to calculate ===
    salts_of_interest: inputConfig?.salts_of_interest ?? null,

    // === Operational control ranges (from Asset or body override) ===
    dosage_ppm: resolvedDosage,
    coc_min: inputConfig?.coc_min ?? cocData?.minValue ?? 1,
    coc_max: inputConfig?.coc_max ?? cocData?.maxValue ?? 10,
    coc_interval: inputConfig?.coc_interval ?? 1,
    temp_min: inputConfig?.temp_min ?? tempData?.minValue ?? 110,
    temp_max: inputConfig?.temp_max ?? tempData?.maxValue ?? 160,
    temp_interval: inputConfig?.temp_interval ?? 10,
    temp_unit: inputConfig?.temp_unit ?? tempData?.unit ?? "F",

    // === pH mode: 'fixed' (user-specified value) or 'natural' (from water analysis) ===
    ph_mode: inputConfig?.ph_mode ?? "fixed",
    fixed_ph:
      inputConfig?.fixed_ph ?? phData?.maxValue ?? phData?.minValue ?? 8.2,

    // === Charge balance adjustment (anion/cation to balance within +/-5%) ===
    adjustment_chemical: inputConfig?.adjustment_chemical ?? "H2SO4",
    balance_cation: inputConfig?.balance_cation ?? "Na",
    balance_anion: inputConfig?.balance_anion ?? "Cl",

    // === Base water chemistry (from WaterReport OCR/AI extraction) ===
    base_water_parameters: waterReport.extractedParameters,

    // === Product blend snapshot (multi-component treatment) ===
    // Contains: [{ rawId, percentage, nameSnapshot, costSnapshot }]
    product_blend: productSnapshot
      ? {
          productId: productSnapshot.id,
          productName: productSnapshot.productName,
          waterPercentage: productSnapshot.waterPercentage,
          rawMaterials: productSnapshot.rawMaterials,
        }
      : null,

    // === Single raw material snapshot (pure-component or override simulation) ===
    // inhibitionFormulas: used by AI to determine saturation inhibition performance per salt
    // bandUpperCushion / bandLowerCushion: used by frontend to color graph Green/Yellow/Red
    raw_material_chemistry: rawMaterialSnapshot
      ? {
          rawMaterialId: rawMaterialSnapshot.id,
          commonName: rawMaterialSnapshot.commonName,
          activeComponentName: rawMaterialSnapshot.activeComponentName,
          activePercentage: rawMaterialSnapshot.activePercentage,
          activePercentageChemicalFormula:
            rawMaterialSnapshot.activePercentageChemicalFormula,
          inhibitionFormulas: rawMaterialSnapshot.formulas,
          // Saturation cushion bands for graph coloring (Green < upper < Yellow < lower = Red)
          bandUpperCushion: rawMaterialSnapshot.bandUpperCushion,
          bandLowerCushion: rawMaterialSnapshot.bandLowerCushion,
        }
      : null,

    // === Asset operational context ===
    asset_info: {
      name: asset.name,
      type: asset.type,
      towerType: asset.towerType,
      systemVolume: asset.systemVolume,
      systemMetallurgy: asset.systemMetallurgy,
      systemMaterials: asset.systemMaterials,
      supplyTemperature: asset.supplyTemperature,
      supplyTemperatureType: asset.supplyTemperatureType,
      returnTemperature: asset.returnTemperature,
      returnTemperatureType: asset.returnTemperatureType,
      recirculationRate: asset.recirculationRate,
    },
  };

  // 5. Run Simulation via AI
  try {
    const aiResult = await aiClient.post("/saturation/run-analysis", aiPayload);

    const aiData = aiResult.data.data;

    // 6. Store Analysis Result in DB with MERGED configuration
    const analysisRecord = await prisma.saturationAnalysis.create({
      data: {
        companyId: asset.customer.companyId,
        customerId: asset.customerId,
        assetId: asset.id,
        waterReportId: waterReport.id,
        name: name,
        // Save the full resolved config for historical audit
        inputConfig: aiPayload as any,
        productId: targetProductId,
        rawMaterialId: targetRawMaterialId,
        aiResponse: aiData,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            siteName: true,
            location: true,
            address: true,
          },
        },
        waterReport: {
          select: {
            id: true,
            aiReportId: true,
            name: true,
            originalFilename: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return analysisRecord;
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to perform saturation analysis!\n" +
        " " +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data.detail || (error as any).message,
    );
  }
};

// Flexible filter: by companyId, customerId, assetId, or waterReportId (query params)
const getSaturationAnalysesHistory = async (payload: {
  filters: {
    companyId?: string;
    customerId?: string;
    assetId?: string;
    waterReportId?: string;
    searchTerm?: string;
  };
  options: IPaginationOptions;
}) => {
  const { filters, options } = payload;
  const { companyId, customerId, assetId, waterReportId, searchTerm } = filters;

  if (!companyId && !customerId && !assetId && !waterReportId) {
    throw new AppError(
      status.BAD_REQUEST,
      "At least one of companyId, customerId, assetId, or waterReportId is required!",
    );
  }

  // Ensure only one of the 4 parent IDs is provided to prevent conflicting queries
  const providedIds = [companyId, customerId, assetId, waterReportId].filter(
    (id) => id !== undefined,
  );

  if (providedIds.length > 1) {
    throw new AppError(
      status.BAD_REQUEST,
      "Please provide only one ID filter at a time (companyId, customerId, assetId, or waterReportId)!",
    );
  }

  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(options);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    AND: [
      companyId ? { companyId } : {},
      customerId ? { customerId } : {},
      assetId ? { assetId } : {},
      waterReportId ? { waterReportId } : {},
    ],
  };

  if (searchTerm) {
    whereClause.OR = [
      { customer: { name: { contains: searchTerm, mode: "insensitive" } } },
      { asset: { name: { contains: searchTerm, mode: "insensitive" } } },
    ];
  }

  const [total, results] = await Promise.all([
    prisma.saturationAnalysis.count({ where: whereClause }),
    prisma.saturationAnalysis.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
      select: {
        id: true,
        companyId: true,
        customerId: true,
        assetId: true,
        name: true,
        waterReportId: true,
        productId: true,
        rawMaterialId: true,
        aiResponse: true,
        createdAt: true,
        updatedAt: true,
        waterReport: {
          select: {
            id: true,
            aiReportId: true,
            name: true,
            originalFilename: true,
            createdAt: true,
            updatedAt: true,
          },
        },

        customer: {
          select: {
            id: true,
            name: true,
            siteName: true,
            location: true,
            address: true,
          },
        },
      },
    }),
  ]);

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

const getSingleSaturationAnalysis = async (payload: { id: string }) => {
  const result = await prisma.saturationAnalysis.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      companyId: true,
      customerId: true,
      assetId: true,
      waterReportId: true,
      productId: true,
      rawMaterialId: true,
      aiResponse: true,
      createdAt: true,
      updatedAt: true,

      customer: {
        select: {
          id: true,
          name: true,
          siteName: true,
          location: true,
          address: true,
        },
      },

      asset: {
        select: {
          id: true,
          name: true,
          type: true,
          towerType: true,
          fillType: true,
        },
      },

      waterReport: {
        select: {
          id: true,
          aiReportId: true,
          name: true,
          originalFilename: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Saturation Analysis not found!");
  }

  return result;
};

const deleteSaturationAnalysis = async (payload: { id: string }) => {
  const analysis = await prisma.saturationAnalysis.findUnique({
    where: { id: payload.id },
  });

  if (!analysis) {
    throw new AppError(status.NOT_FOUND, "Saturation Analysis not found!");
  }

  const result = await prisma.saturationAnalysis.delete({
    where: { id: payload.id },
  });

  return result;
};

const getCompanyOverview = async (payload: { companyId: string }) => {
  const { companyId } = payload;

  const customers = await prisma.customer.findMany({
    where: { companyId },
    select: {
      id: true,
      name: true,
      siteName: true,
      location: true,
      _count: {
        select: {
          assets: true,
          waterReports: true,
        },
      },
      assets: {
        select: {
          id: true,
          name: true,
          type: true,
          towerType: true,
          systemVolume: true,
          systemMetallurgy: true,
          systemMaterials: true,
          recirculationRate: true,
          _count: {
            select: {
              waterReports: true,
              saturationAnalyses: true,
            },
          },
          waterReports: {
            select: {
              id: true,
              aiReportId: true,
              sampleDate: true,
              sampleLocation: true,
              name: true,
              originalFilename: true,
              assetId: true,
              customerId: true,
              _count: {
                select: {
                  saturationAnalyses: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  return { customers };
};

const getAvailableSalts = async () => {
  try {
    const aiResult = await aiClient.get("/saturation/available-salts");
    return aiResult.data.salts;
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to fetch available salts from AI engine!\n" +
        " " +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((error as any).response?.data?.detail || (error as any).message),
    );
  }
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
  deleteWaterReport,
  deleteSaturationAnalysis,
  getCompanyOverview,
  getAvailableSalts,
};
