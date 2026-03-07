import status from "http-status";
import AppError from "../../../errors/AppError";
import prisma from "../../../db/prisma";
import { TCreateAssetInput, TUpdateAssetInput } from "./Asset.interface";

// Helper function to populate product information in productPrograms
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const populateProductPrograms = async (asset: any) => {
  if (!asset.productPrograms || !Array.isArray(asset.productPrograms)) {
    return asset;
  }

  const productIds = asset.productPrograms
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((program: any) => program.productId)
    .filter((id: string) => id && id.trim() !== "");

  if (productIds.length === 0) {
    return asset;
  }

  // Fetch all products
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  // Create a map for quick lookup
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Populate productPrograms with product information
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enrichedProductPrograms = asset.productPrograms.map((program: any) => ({
    ...program,
    product: productMap.get(program.productId) || null,
  }));

  return {
    ...asset,
    productPrograms: enrichedProductPrograms,
  };
};

const createAsset = async (data: TCreateAssetInput) => {
  const result = await prisma.asset.create({
    data,
    include: {
      customer: true,
    },
  });

  return populateProductPrograms(result);
};

const getAssetsByCustomerId = async (customerId: string) => {
  const assets = await prisma.asset.findMany({
    where: { customerId },
    include: {
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Populate product programs for each asset
  return Promise.all(assets.map((asset) => populateProductPrograms(asset)));
};

const getAssetById = async (id: string) => {
  const result = await prisma.asset.findUnique({
    where: { id },
    include: {
      customer: {
        include: {
          company: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Asset not found!");
  }

  return populateProductPrograms(result);
};

const updateAsset = async (id: string, data: TUpdateAssetInput) => {
  const asset = await prisma.asset.findUnique({
    where: { id },
  });

  if (!asset) {
    throw new AppError(status.NOT_FOUND, "Asset not found!");
  }

  const result = await prisma.asset.update({
    where: { id },
    data,
    include: {
      customer: true,
    },
  });

  return populateProductPrograms(result);
};

const deleteAsset = async (id: string) => {
  const asset = await prisma.asset.findUnique({
    where: { id },
  });

  if (!asset) {
    throw new AppError(status.NOT_FOUND, "Asset not found!");
  }

  await prisma.asset.delete({
    where: { id },
  });

  return null;
};

export const AssetService = {
  createAsset,
  getAssetById,
  getAssetsByCustomerId,
  updateAsset,
  deleteAsset,
};
