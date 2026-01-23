import status from "http-status";
import AppError from "../../../errors/AppError";
import prisma from "../../../db/prisma";
import {
  TCreateRawMaterialInput,
  TUpdateRawMaterialInput,
} from "./rawMaterial.interface";

const createRawMaterial = async (data: TCreateRawMaterialInput) => {
  const result = await prisma.rawMaterial.create({
    data,
    include: {
      company: true,
    },
  });

  return result;
};

const getRawMaterialsByCompanyId = async (companyId: string) => {
  const result = await prisma.rawMaterial.findMany({
    where: { companyId },
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getRawMaterialById = async (id: string) => {
  const result = await prisma.rawMaterial.findUnique({
    where: { id },
    include: {
      company: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Raw material not found!");
  }

  return result;
};

const updateRawMaterial = async (id: string, data: TUpdateRawMaterialInput) => {
  const rawMaterial = await prisma.rawMaterial.findUnique({
    where: { id },
  });

  if (!rawMaterial) {
    throw new AppError(status.NOT_FOUND, "Raw material not found!");
  }

  const result = await prisma.rawMaterial.update({
    where: { id },
    data,
    include: {
      company: true,
    },
  });

  return result;
};

const deleteRawMaterial = async (id: string) => {
  const rawMaterial = await prisma.rawMaterial.findUnique({
    where: { id },
  });

  if (!rawMaterial) {
    throw new AppError(status.NOT_FOUND, "Raw material not found!");
  }

  await prisma.rawMaterial.delete({
    where: { id },
  });

  return null;
};

export const RawMaterialService = {
  createRawMaterial,
  getRawMaterialsByCompanyId,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
};
