import { z } from "zod";

const createAssetSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
  type: z.enum(
    [
      "Cooling Tower",
      "Evaporative Condenser",
      "Once-Through Cooling",
      "Seawater Cooling Tower",
      "Adiabatic Cooler",
    ],
    {
      errorMap: () => ({ message: "Invalid asset type" }),
    },
  ),
  location: z.string().min(1, "Location is required"),
  installationDate: z.string().min(1, "Installation date is required"),
  systemVolume: z.string().min(1, "System volume is required"),
  flowRate: z.string().min(1, "Flow rate is required"),
  operatingTemperature: z.string().min(1, "Operating temperature is required"),
  cyclesOfConcentration: z
    .string()
    .min(1, "Cycles of concentration is required"),
  materialType: z.enum(
    ["Carbon Steel", "Stainless Steel", "Copper", "Galvanized Steel"],
    {
      errorMap: () => ({ message: "Invalid material type" }),
    },
  ),
  currentCondition: z.string().min(1, "Current condition is required"),
  knownIssues: z.string().default(""),
  customerId: z.string().min(1, "Customer ID is required"),
});

const updateAssetSchema = z.object({
  name: z.string().min(1).optional(),
  type: z
    .enum([
      "Cooling Tower",
      "Evaporative Condenser",
      "Once-Through Cooling",
      "Seawater Cooling Tower",
      "Adiabatic Cooler",
    ])
    .optional(),
  location: z.string().min(1).optional(),
  installationDate: z.string().min(1).optional(),
  systemVolume: z.string().min(1).optional(),
  flowRate: z.string().min(1).optional(),
  operatingTemperature: z.string().min(1).optional(),
  cyclesOfConcentration: z.string().min(1).optional(),
  materialType: z
    .enum(["Carbon Steel", "Stainless Steel", "Copper", "Galvanized Steel"])
    .optional(),
  currentCondition: z.string().min(1).optional(),
  knownIssues: z.string().optional(),
});

export const AssetValidation = {
  createAssetSchema,
  updateAssetSchema,
};
