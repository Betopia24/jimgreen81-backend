import { z } from "zod";

const formulaSchema = z.object({
  salToInhibit: z.string().min(1, "salToInhibit is required"),
  applicableIonicStrength: z.string().min(1, "applicableIonicStrength is required"),
  formulaForInhibitionPerformance: z.string().min(1, "formulaForInhibitionPerformance is required"),
});

const createRawMaterialSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  commonName: z.string().min(1, "Common name is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  manufacturerProductName: z.string().min(1, "Manufacturer product name is required"),
  activeComponentName: z.string().min(1, "Active component name is required"),
  activePercentage: z.number().min(0).max(100),
  activePercentageChemicalFormula: z.string().min(1, "Active percentage chemical formula is required"),
  formulas: z.array(formulaSchema).min(1, "At least one formula is required"),
  estimatedCost: z.number().min(0),
  bandUpperCushion: z.string().min(1, "Band upper cushion is required"),
  bandLowerCushion: z.string().min(1, "Band lower cushion is required"),
  communityVisibility: z.string().min(1, "Community visibility is required"),
  additionalInfomation: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

const updateRawMaterialSchema = z.object({
  commonName: z.string().optional(),
  manufacturer: z.string().optional(),
  manufacturerProductName: z.string().optional(),
  activeComponentName: z.string().optional(),
  activePercentage: z.number().optional(),
  activePercentageChemicalFormula: z.string().optional(),
  formulas: z.array(formulaSchema).optional(),
  estimatedCost: z.number().optional(),
  bandUpperCushion: z.string().optional(),
  bandLowerCushion: z.string().optional(),
  communityVisibility: z.string().optional(),
  additionalInfomation: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});


export const RawMaterialValidation = {
  createRawMaterialSchema,
  updateRawMaterialSchema,
};
