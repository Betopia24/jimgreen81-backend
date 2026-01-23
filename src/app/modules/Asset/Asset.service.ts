import status from "http-status";
import AppError from "../../../errors/AppError";
import prisma from "../../../db/prisma";
import { TCreateAssetInput, TUpdateAssetInput } from "./Asset.interface";

const createAsset = async (data: TCreateAssetInput) => {
  const result = await prisma.asset.create({
    data,
    include: {
      customer: {
        include: {
          company: true,
        },
      },
    },
  });

  return result;
};

const getAssetsByCustomerId = async (customerId: string) => {
  const result = await prisma.asset.findMany({
    where: { customerId },
    include: {
      customer: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
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

  return result;
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
      customer: {
        include: {
          company: true,
        },
      },
    },
  });

  return result;
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
