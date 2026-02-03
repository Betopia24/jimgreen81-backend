import { z } from "zod";

const PlanValidation = {
  createPlan: z.object({
    name:z.enum(["BASIC", "ADVANCED", "EXPERT"], { required_error: "Plan name is required" }),
    isActive: z.boolean(),
    monthlyPrice: z.number().int().min(0, "Monthly price must be non-negative").max(1000, "Monthly price must be less than or equal to 1000"),
    annualPrice: z.number().int().min(0, "Annual price must be non-negative").max(1000, "Annual price must be less than or equal to 10000"),
    description: z.string().min(1, "Description is required"),
    maxReports: z.number().int().min(0, "Max reports must be non-negative"),
    maxAccounts: z.number().int().min(0, "Max accounts must be non-negative"),
    features: z.object({
     "aiAnalysis": z.boolean(),
     "prioritySupport": z.boolean(),
      "apiAccess": z.boolean(),
      "customBranding": z.boolean(),
      "dashboardAnalytics": z.boolean(),
      "advancedReports": z.boolean(),
    }),
  }),

  updatePlan: z.object({
    name: z.enum(["BASIC", "ADVANCED", "EXPERT"]).optional(),
      isActive: z.boolean(),
    monthlyPrice: z.number().nonnegative("Monthly price must be non-negative").max(1000, "Monthly price must be less than or equal to 1000").optional(),
    annualPrice: z.number().nonnegative("Annual price must be non-negative").max(1000, "Annual price must be less than or equal to 10000").optional(),
    description: z.string().min(1).optional(),
    maxReports: z.number().int().min(0).optional(),
    maxAccounts: z.number().int().min(0).optional(),
    features: z.object({
      "aiAnalysis": z.boolean().optional(),
      "prioritySupport": z.boolean().optional(),
      "apiAccess": z.boolean().optional(),
      "customBranding": z.boolean().optional(),
      "dashboardAnalytics": z.boolean().optional(),
      "advancedReports": z.boolean().optional(),
    }).optional(),
   
  }),

  planId: z.object({
    id: z.string().min(1, "Plan ID is required"),
  }),
};

export { PlanValidation };