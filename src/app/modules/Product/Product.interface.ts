import z from "zod";
import { ProductValidation } from "./Product.validation";

export type TCreateProductInput = z.infer<
  typeof ProductValidation.createProductSchema
>;

export type TUpdateProductInput = z.infer<
  typeof ProductValidation.createProductSchema
>;
