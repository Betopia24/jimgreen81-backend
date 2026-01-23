// src/validations/customer.validation.ts
import { z } from "zod";

const createCustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  siteName: z.string().min(1, "Site name is required"),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  contactEmail: z.string().email("Invalid email format"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  isActive: z.boolean().optional(),
  companyId: z.string().min(1, "Company ID is required"),
});

const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  siteName: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  contactPerson: z.string().min(1).optional(),
  contactEmail: z.string().email("Invalid email format").optional(),
  contactPhone: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const CustomerValidation = {
  createCustomerSchema,
  updateCustomerSchema,
};
