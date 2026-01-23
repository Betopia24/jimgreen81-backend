import status from "http-status";
import AppError from "../../../errors/AppError";
import prisma from "../../../db/prisma";
import { TCreateProductInput, TUpdateProductInput } from "./Product.interface";

const createProduct = async (data: TCreateProductInput) => {
  const result = await prisma.product.create({
    data,
    include: {
      company: true,
    },
  });

  return result;
};

const getProductsByCompanyId = async (companyId: string) => {
  const result = await prisma.product.findMany({
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

const getProductById = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: { id },
    include: {
      company: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Product not found!");
  }

  return result;
};

const updateProduct = async (id: string, data: TUpdateProductInput) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError(status.NOT_FOUND, "Product not found!");
  }

  const result = await prisma.product.update({
    where: { id },
    data,
    include: {
      company: true,
    },
  });

  return result;
};

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
