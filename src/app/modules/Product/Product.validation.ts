import { z } from "zod";

const createProductSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  manufacturerName: z.string().min(1, "Manufacturer name is required"),
  rawMaterials: z.array(
    z.object({
      rawId: z.string(),
      percentage: z.number(),
    }),
  ),
  calculatedProductCost: z.number().optional(),
  manualCostOverride: z.number().nullable().optional(),
  productPrice: z.number(),
  communityVisibility: z.string(),
  isActive: z.boolean().optional(),
  companyId: z.string().min(1, "Company ID is required"),
});

const updateProductSchema = z.object({
  productName: z.string().min(1, "Product name is required").optional(),
  manufacturerName: z
    .string()
    .min(1, "Manufacturer name is required")
    .optional(),
  rawMaterials: z
    .array(
      z.object({
        rawId: z.string(),
        percentage: z.number(),
      }),
    )
    .optional(),
  calculatedProductCost: z.number().optional(),
  manualCostOverride: z.number().nullable().optional(),
  productPrice: z.number().optional(),
  communityVisibility: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const ProductValidation = {
  createProductSchema,
  updateProductSchema,
};
