import z from "zod";
import { AssetValidation } from "./Asset.validation";

export type TCreateAssetInput = z.infer<
  typeof AssetValidation.createAssetSchema
>;

export type TUpdateAssetInput = z.infer<
  typeof AssetValidation.updateAssetSchema
>;
