import z from "zod";
import { CustomerValidation } from "./Customer.validation";

export type TCreateCustomerInput = z.infer<
  typeof CustomerValidation.createCustomerSchema
>;

export type TUpdateCustomerInput = z.infer<
  typeof CustomerValidation.createCustomerSchema
>;
