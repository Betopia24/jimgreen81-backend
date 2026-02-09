import z from "zod";
import { PlanValidation } from "./plan.validation";

// Plan types without Zod validation
export type TCreatePlan = z.infer<typeof PlanValidation.createPlan>;

export type TUpdatePlan = z.infer<typeof PlanValidation.updatePlan>;

export type TPlanFilters = {
  searchTerm?: string;
  name?: "BASIC" | "ADVANCED" | "EXPERT";
  isActive?: boolean;
};
