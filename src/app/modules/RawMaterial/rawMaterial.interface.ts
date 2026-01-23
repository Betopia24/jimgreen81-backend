import z from "zod";
import { RawMaterialValidation } from "./rawMaterial.validation";

export type TCreateRawMaterialInput = z.infer<
  typeof RawMaterialValidation.createRawMaterialSchema
>;
export type TUpdateRawMaterialInput = z.infer<
  typeof RawMaterialValidation.updateRawMaterialSchema
>;
