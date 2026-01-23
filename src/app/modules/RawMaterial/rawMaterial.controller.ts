import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { RawMaterialService } from "./rawMaterial.service";

export const RawMaterialController = {
  createRawMaterial: catchAsync(async (req, res) => {
    const result = await RawMaterialService.createRawMaterial(req.body);

    sendResponse(res, {
      statusCode: status.CREATED,
      message: "Raw material created successfully",
      data: result,
    });
  }),

  getRawMaterialsByCompanyId: catchAsync(async (req, res) => {
    const { companyId } = req.params;
    const result =
      await RawMaterialService.getRawMaterialsByCompanyId(companyId);

    sendResponse(res, {
      statusCode: status.OK,
      message: "Raw materials retrieved successfully",
      data: result,
    });
  }),

  getRawMaterialById: catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RawMaterialService.getRawMaterialById(id);

    sendResponse(res, {
      statusCode: status.OK,
      message: "Raw material retrieved successfully",
      data: result,
    });
  }),

  updateRawMaterial: catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RawMaterialService.updateRawMaterial(id, req.body);

    sendResponse(res, {
      statusCode: status.OK,
      message: "Raw material updated successfully",
      data: result,
    });
  }),

  deleteRawMaterial: catchAsync(async (req, res) => {
    const { id } = req.params;
    await RawMaterialService.deleteRawMaterial(id);

    sendResponse(res, {
      statusCode: status.OK,
      message: "Raw material deleted successfully",
      data: null,
    });
  }),
};
