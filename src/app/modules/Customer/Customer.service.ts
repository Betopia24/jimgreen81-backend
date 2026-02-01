import status from "http-status";
import AppError from "../../../errors/AppError";
import prisma from "../../../db/prisma";
import {
  TCreateCustomerInput,
  TUpdateCustomerInput,
} from "./Customer.interface";

const createCustomer = async (data: TCreateCustomerInput) => {
  const result = await prisma.customer.create({
    data,
    include: {
      company: true,
      assets: true,
    },
  });

  return result;
};

const getCustomersByCompanyId = async (companyId: string) => {
  const result = await prisma.customer.findMany({
    where: { companyId },
    include: {
      company: true,
      assets: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getCustomerById = async (id: string) => {
  const result = await prisma.customer.findUnique({
    where: { id },
    include: {
      company: true,
      assets: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Customer not found!");
  }

  return result;
};

const updateCustomer = async (id: string, data: TUpdateCustomerInput) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    throw new AppError(status.NOT_FOUND, "Customer not found!");
  }

  const result = await prisma.customer.update({
    where: { id },
    data,
    include: {
      company: true,
      assets: true,
    },
  });

  return result;
};

const deleteCustomer = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    throw new AppError(status.NOT_FOUND, "Customer not found!");
  }

  await prisma.$transaction([
    prisma.asset.deleteMany({ where: { customerId: id } }),
    prisma.customer.delete({ where: { id } }),
  ]);

  return null;
};

export const CustomerService = {
  createCustomer,
  getCustomerById,
  getCustomersByCompanyId,
  updateCustomer,
  deleteCustomer,
};
