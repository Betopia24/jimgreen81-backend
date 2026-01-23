import { z } from "zod";

const createProductSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    manufacturer: z.string().min(1, "Manufacturer is required"),
    productCategory: z.enum(
      [
        "Corrosion Inhibitor",
        "Biocide",
        "Scale Inhibitor",
        "Dispersant",
        "Other",
      ],
      {
        errorMap: () => ({ message: "Invalid product category" }),
      },
    ),
    intendedUse: z.enum(["Cooling", "Boiler", "Process Water"], {
      errorMap: () => ({ message: "Invalid intended use" }),
    }),
    operatingPhRangeMin: z
      .number()
      .min(0)
      .max(14, "pH must be between 0 and 14"),
    operatingPhRangeMax: z
      .number()
      .min(0)
      .max(14, "pH must be between 0 and 14"),
    temperatureTolerance: z
      .string()
      .min(1, "Temperature tolerance is required"),
    maximumHardnessAllowed: z
      .string()
      .min(1, "Maximum hardness allowed is required"),
    compatibilityNote: z.string().min(1, "Compatibility note is required"),
    costPerUnit: z.number().positive("Cost per unit must be positive"),
    averageMonthlyConsumption: z
      .string()
      .min(1, "Average monthly consumption is required"),
    replacementFrequency: z.enum(
      ["monthly", "quarterly", "semi-annually", "annually"],
      {
        errorMap: () => ({ message: "Invalid replacement frequency" }),
      },
    ),
    isActive: z.boolean().optional(),
    companyId: z.string().min(1, "Company ID is required"),
  })
  .refine((data) => data.operatingPhRangeMin <= data.operatingPhRangeMax, {
    message: "pH range min must be less than or equal to pH range max",
    path: ["operatingPhRangeMin"],
  });

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  manufacturer: z.string().min(1).optional(),
  productCategory: z
    .enum([
      "Corrosion Inhibitor",
      "Biocide",
      "Scale Inhibitor",
      "Dispersant",
      "Other",
    ])
    .optional(),
  intendedUse: z.enum(["Cooling", "Boiler", "Process Water"]).optional(),
  operatingPhRangeMin: z.number().min(0).max(14).optional(),
  operatingPhRangeMax: z.number().min(0).max(14).optional(),
  temperatureTolerance: z.string().min(1).optional(),
  maximumHardnessAllowed: z.string().min(1).optional(),
  compatibilityNote: z.string().min(1).optional(),
  costPerUnit: z.number().positive().optional(),
  averageMonthlyConsumption: z.string().min(1).optional(),
  replacementFrequency: z
    .enum(["monthly", "quarterly", "semi-annually", "annually"])
    .optional(),
  isActive: z.boolean().optional(),
});

export const ProductValidation = {
  createProductSchema,
  updateProductSchema,
};
