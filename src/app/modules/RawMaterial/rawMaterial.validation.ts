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
  feedFrequency: z.string().min(1, "Feed frequency is required"),
  safetyClassification: z.enum(["Hazardous", "Non-hazardous"], {
    errorMap: () => ({ message: "Invalid safety classification" }),
  }),
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
  feedFrequency: z.string().min(1).optional(),
  safetyClassification: z.enum(["Hazardous", "Non-hazardous"]).optional(),
  instructions: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const RawMaterialValidation = {
  createRawMaterialSchema,
  updateRawMaterialSchema,
};
