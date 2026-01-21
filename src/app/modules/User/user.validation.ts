import { z } from "zod";
import { emailSchema, passwordSchema } from "../../validation/global";

export const userValidationSchema = {
  updateProfile: z.object({
    firstName: z.string().nonempty().optional(),
    lastName: z.string().nonempty().optional(),
    email: z.string().email().nonempty().optional(),
  }),

  // add new user
  addNewUser: z.object({
    firstName: z.string({ required_error: "firstName is required" }).nonempty(),
    lastName: z.string({ required_error: "lastName is required" }).nonempty(),
    email: emailSchema,
    password: passwordSchema,
  }),
};
