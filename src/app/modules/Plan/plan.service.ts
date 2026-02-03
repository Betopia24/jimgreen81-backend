import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import prisma from "../../../db/prisma";
import { TCreatePlan, TUpdatePlan, TPlanFilters } from "./plan.interface";


export const PlanService = {
  // Create a new plan
  createPlan: async (payload: TCreatePlan) => {
    // Check if plan with same name already exists (only active plans)
    const existingPlan = await prisma.plan.findFirst({
      where: {
        name: payload.name,
        isActive: true,
      },
    });

    if (existingPlan) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Plan with name ${payload.name} already exists`
      );
    }

    const result = await prisma.plan.create({
      data: payload,
    });

    return result;
  },

  // Get all plans with filtering (no pagination)
  getAllPlans: async (filters: TPlanFilters) => {
    const { searchTerm, name, isActive } = filters;

    const whereConditions: any = {};

    // Add search functionality
    if (searchTerm) {
      whereConditions.OR = [
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (name) {
      whereConditions.name = name;
    }

    // Only filter by isActive if explicitly provided
    if (isActive !== undefined) {
      whereConditions.isActive = isActive;
    }

    const result = await prisma.plan.findMany({
      where: whereConditions,
      orderBy: { createdAt: "desc" },
    });

    return result;
  },

  // Get single plan by ID
  getPlanById: async (id: string) => {
    const result = await prisma.plan.findUnique({
      where: { id },
    });

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Plan not found");
    }

    return result;
  },

  // Update plan
  updatePlan: async (id: string, payload: TUpdatePlan) => {
    // Check if plan exists
    const existingPlan = await prisma.plan.findUnique({
      where: { id },
    });
    if (!existingPlan) {
      throw new AppError(httpStatus.NOT_FOUND, "Plan not found");
    }

    if(payload.name){
         const existingPlanname = await prisma.plan.findFirst({
        where: {
          name: payload.name,
          id: { not: id },
        },
      });
      if(existingPlanname){
         throw new AppError(
          httpStatus.CONFLICT,
          `Plan with name ${payload.name} already exists`
        );
      }
     

    }
   

    

    const result = await prisma.plan.update({
      where: { id },
      data: payload,
    });

    return result;
  },

  // Delete plan (hard delete)
  deletePlan: async (id: string) => {
    const existingPlan = await prisma.plan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      throw new AppError(httpStatus.NOT_FOUND, "Plan not found");
    }

    // Since plan details are stored as JSON in subscriptions, we can safely delete the plan
    const result = await prisma.plan.delete({
      where: { id },
    });

    return result;
  },

  // Get active plans only
  getActivePlans: async () => {
    const result = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return result;
  },
};