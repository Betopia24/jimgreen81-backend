import { z } from "zod";
import { CompanyValidationSchema } from "./company.validation";

export type TAddMember = z.infer<typeof CompanyValidationSchema.addNewMember>;

export type TUpdateMemberInfo = z.infer<
  typeof CompanyValidationSchema.updateMemberInfo
>;

export type TUpdateCompanyInfo = z.infer<
  typeof CompanyValidationSchema.updateCompanyInfo
>;
