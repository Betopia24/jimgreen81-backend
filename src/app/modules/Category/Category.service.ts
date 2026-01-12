import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { TAddCategory } from "./Category.interface";
import prisma from "../../../db/prisma";

const addCategory = async (payload: { data: TAddCategory }) => {
  const existCategories = await prisma.category.findFirst({
    where: { name: { equals: payload.data.name, mode: "insensitive" } },
  });

  if (existCategories) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category Name Already Exist");
  }

  const count = await prisma.category.count();

  const payloadIndex = payload.data.orderIndex;

  const result = await prisma.category.create({
    data: {
      name: payload.data.name,
      orderIndex: payloadIndex ? payloadIndex : count + 1,
    },
  });

  return result;
};

const getCategories = async () => {
  const result = await prisma.category.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return result;
};

const updateCategory = async (payload: {
  categoryId: string;
  data: TAddCategory;
}) => {
  const existCategory = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!existCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }

  const existName = await prisma.category.findFirst({
    where: {
      name: { equals: payload.data.name, mode: "insensitive" },
      NOT: { id: existCategory.id },
    },
  });

  if (existName) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category Name Already Exist");
  }

  const result = await prisma.category.update({
    where: { id: existCategory.id },
    data: payload.data,
  });

  return result;
};

const deleteCategory = async (payload: { categoryId: string }) => {
  const existCategory = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!existCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }

  const result = await prisma.category.delete({
    where: { id: existCategory.id },
  });

  return result;
};

export const categoryService = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
