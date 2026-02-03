import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PlanService } from "./plan.service";
import pick from "../../../shared/pick";

export const PlanController = {
  // Create plan
  createPlan: catchAsync(async (req, res) => {
    const result = await PlanService.createPlan(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Plan created successfully",
      data: result,
    });
  }),

  // Get all plans
  getAllPlans: catchAsync(async (req, res) => {
    const filters = pick(req.query, ["searchTerm", "name", "isActive"]);

    const result = await PlanService.getAllPlans(filters);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Plans retrieved successfully",
      data: result,
    });
  }),

  // Get single plan
  getPlanById: catchAsync(async (req, res) => {
    const result = await PlanService.getPlanById(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Plan retrieved successfully",
      data: result,
    });
  }),

  // Update plan
  updatePlan: catchAsync(async (req, res) => {
    const result = await PlanService.updatePlan(req.params.id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Plan updated successfully",
      data: result,
    });
  }),

  // Delete plan
  deletePlan: catchAsync(async (req, res) => {
    const result = await PlanService.deletePlan(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Plan deleted successfully",
      data: result,
    });
  }),

  // Get active plans
  getActivePlans: catchAsync(async (req, res) => {
    const result = await PlanService.getActivePlans();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Active plans retrieved successfully",
      data: result,
    });
  }),
};