import { z } from "zod";
import { emailSchema, passwordSchema } from "../../validation/global";

export const CompanyValidationSchema = {
  updateMemberInfo: z.object({
    firstName: z.string().nonempty().optional(),
    lastName: z.string().nonempty().optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),

  // add new member
  addNewMember: z.object({
    firstName: z.string({ required_error: "firstName is required" }).nonempty(),
    lastName: z.string({ required_error: "lastName is required" }).nonempty(),
    email: emailSchema,
    password: passwordSchema,
  }),

  // update company info
  updateCompanyInfo: z.object({
    name: z
      .string({
        required_error: "name is required",
      })
      .nonempty()
      .optional(),
    email: emailSchema.optional(),
    location: z
      .string({
        required_error: "location is required",
      })
      .nonempty()
      .optional(),
  }),
};
