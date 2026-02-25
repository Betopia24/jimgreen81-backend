import { z } from "zod";

const createRawMaterialSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  commonName: z.string(),
  manufacturer: z.string(),
  manufacturerProductName: z.string(),
  activeComponentName: z.string(),
  activePercentage: z.number(),
  activePercentageChemicalFormula: z.string(),
  estimatedCost: z.number(),
  saltToInhibit: z.string(),
  formulaForInhibitionPerformance: z.string(),
  bandUpperCushion: z.string(),
  bandLowerCushion: z.string(),
  communityVisibility: z.string(),
  isActive: z.boolean().optional(),
});

const updateRawMaterialSchema = z.object({
  commonName: z.string().optional(),
  manufacturer: z.string().optional(),
  manufacturerProductName: z.string().optional(),
  activeComponentName: z.string().optional(),
  activePercentage: z.number().optional(),
  activePercentageChemicalFormula: z.string().optional(),
  estimatedCost: z.number().optional(),
  saltToInhibit: z.string().optional(),
  formulaForInhibitionPerformance: z.string().optional(),
  bandUpperCushion: z.string().optional(),
  bandLowerCushion: z.string().optional(),
  communityVisibility: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const RawMaterialValidation = {
  createRawMaterialSchema,
  updateRawMaterialSchema,
};
