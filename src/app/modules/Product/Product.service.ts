/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../../errors/AppError";
import prisma from "../../../db/prisma";
import { TCreateProductInput, TUpdateProductInput } from "./Product.interface";

// ======================== HELPER FUNCTION ========================

const calculateProductData = async (
  rawMaterials: { rawId: string; percentage: number }[],
) => {
  if (!rawMaterials || rawMaterials.length === 0) {
    throw new AppError(
      status.BAD_REQUEST,
      "At least one raw material required",
    );
  }

  let totalPercent = 0;
  let calculatedCost = 0;

  const enrichedRawMaterials: any[] = [];

  for (const item of rawMaterials) {
    const raw = await prisma.rawMaterial.findUnique({
      where: { id: item.rawId },
    });

    if (!raw) {
      throw new AppError(
        status.NOT_FOUND,
        `Raw material not found: ${item.rawId}`,
      );
    }

    totalPercent += item.percentage;

    const weightedCost = (raw.estimatedCost * item.percentage) / 100;
    calculatedCost += weightedCost;

    enrichedRawMaterials.push({
      rawId: raw.id,
      percentage: item.percentage,
      nameSnapshot: raw.commonName,
      costSnapshot: raw.estimatedCost,
    });
  }

  if (totalPercent > 100) {
    throw new AppError(
      status.BAD_REQUEST,
      "Total percentage cannot exceed 100%",
    );
  }

  const waterPercentage = 100 - totalPercent;

  return {
    enrichedRawMaterials,
    calculatedCost,
    waterPercentage,
  };
};

// ======================== CREATE ========================
const createProduct = async (data: TCreateProductInput) => {
  const {
    productName,
    manufacturerName,
    rawMaterials,
    manualCostOverride,
    productPrice,
    communityVisibility,
  } = data;

  const company = await prisma.company.findUnique({
    where: { id: data.companyId },
  });

  if (!company) {
    throw new AppError(status.NOT_FOUND, "Company not found");
  }

  const { enrichedRawMaterials, calculatedCost, waterPercentage } =
    await calculateProductData(rawMaterials);

  const finalProductCost = manualCostOverride ?? calculatedCost;

  const result = await prisma.product.create({
    data: {
      productName,
      manufacturerName,
      rawMaterials: enrichedRawMaterials,
      waterPercentage,
      calculatedProductCost: calculatedCost,
      manualCostOverride: manualCostOverride ?? null,
      finalProductCost,
      productPrice,
      communityVisibility,
      companyId: company.id,
    },
    include: {
      company: true,
    },
  });

  return result;
};

// ======================== GET ALL ========================
const getProductsByCompanyId = async (companyId: string) => {
  return prisma.product.findMany({
    where: { companyId },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });
};

// ======================== GET ONE ========================

const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!product) {
    throw new AppError(status.NOT_FOUND, "Product not found!");
  }

  return product;
};

// ======================== UPDATE ========================

const updateProduct = async (id: string, data: TUpdateProductInput) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new AppError(status.NOT_FOUND, "Product not found!");
  }

  const {
    productName,
    rawMaterials,
    manualCostOverride,
    productPrice,
    communityVisibility,
  } = data;

  let updateData: any = {
    productName,
    productPrice,
    communityVisibility,
  };

  if (rawMaterials && rawMaterials.length > 0) {
    const { enrichedRawMaterials, calculatedCost, waterPercentage } =
      await calculateProductData(rawMaterials);

    const finalProductCost = manualCostOverride ?? calculatedCost;

    updateData = {
      ...updateData,
      rawMaterials: enrichedRawMaterials,
      waterPercentage,
      calculatedProductCost: calculatedCost,
      manualCostOverride: manualCostOverride ?? null,
      finalProductCost,
    };
  }

  const result = await prisma.product.update({
    where: { id },
    data: updateData,
    include: { company: true },
  });

  return result;
};

// ======================== DELETE ========================

const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError(status.NOT_FOUND, "Product not found!");
  }

  await prisma.product.delete({
    where: { id },
  });

  return null;
};

export const ProductService = {
  createProduct,
  getProductsByCompanyId,
  getProductById,
  updateProduct,
  deleteProduct,
};
