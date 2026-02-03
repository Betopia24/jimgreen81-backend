import { z } from "zod";
import { emailSchema, passwordSchema } from "../../validation/global";

export const AuthValidation = {
  // sign up
  signup: z.object({
    firstName: z.string({ required_error: "firstName is required" }).nonempty(),
    lastName: z.string({ required_error: "lastName is required" }).nonempty(),
    email: emailSchema,
    password: passwordSchema,
    companyName: z
      .string({
        required_error: "companyName is required",
      })
      .nonempty(),
    companyEmail: emailSchema.optional(),
    companyLocation: z
      .string({
        required_error: "companyLocation is required",
      })
      .nonempty(),
  }),

  // login
  login: z.object({
    email: z.string().email().nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .nonempty("Password is required"),
  }),

  // social login
  socialLogin: z.object({
    token: z
      .string({ required_error: "token is required!" })
      .nonempty("token is required"),
    provider: z.enum(["GOOGLE"]),
  }),

  // change password
  changePassword: z.object({
    currentPassword: z
      .string({ required_error: "currentPassword is required" })
      .min(6),
    newPassword: z.string({ required_error: "newPassword is required" }).min(6),
  }),

  // Forget password
  forgotPassword: z.object({
    email: z.string().email().nonempty("Email is required"),
  }),

  // Reset password
  resetPassword: z.object({
    email: emailSchema,
    newPassword: z.string({ required_error: "newPassword is required" }).min(6),
  }),

  sendOtp: z.object({
    email: emailSchema,
  }),

  verifyOtp: z.object({
    email: emailSchema,
    otp: z
      .number({ required_error: "OTP is required" })
      .min(100000, "OTP must be a 6 digit number")
      .max(999999, "OTP must be a 6 digit number"),
  }),
};
