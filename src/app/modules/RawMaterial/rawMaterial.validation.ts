import { z } from "zod";

const createRawMaterialSchema = z.object({
  chemicalName: z.string().min(1, "Chemical name is required"),
  chemicalType: z.enum(
    [
      "Corrosion Inhibitor",
      "Biocide",
      "Scale Inhibitor",
      "Dispersant",
      "Other",
    ],
    {
      errorMap: () => ({ message: "Invalid chemical type" }),
    },
  ),
  supplierName: z.string().min(1, "Supplier name is required"),
  dosageRate: z.string().min(1, "Dosage rate is required"),
  dosageType: z.enum(["ppm", "mg/L"]),
  feedFrequency: z.string().min(1, "Feed frequency is required"),
  safetyClassification: z.string().min(1, "safetyClassification is required"),
  instructions: z.string().min(1, "Instructions are required"),
  isActive: z.boolean().optional(),
  companyId: z.string().min(1, "Company ID is required"),
});

const updateRawMaterialSchema = z.object({
  chemicalName: z.string().min(1).optional(),
  chemicalType: z
    .enum([
      "Corrosion Inhibitor",
      "Biocide",
      "Scale Inhibitor",
      "Dispersant",
      "Other",
    ])
    .optional(),
  supplierName: z.string().min(1).optional(),
  dosageRate: z.string().min(1).optional(),
  dosageType: z.enum(["ppm", "mg/L"]).optional(),
  feedFrequency: z.string().min(1).optional(),
  safetyClassification: z.string().optional(),
  instructions: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const RawMaterialValidation = {
  createRawMaterialSchema,
  updateRawMaterialSchema,
};
