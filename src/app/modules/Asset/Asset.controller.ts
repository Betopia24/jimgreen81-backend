import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AssetService } from "./Asset.service";

const createAsset = catchAsync(async (req, res) => {
  const result = await AssetService.createAsset(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    message: "Asset created successfully",
    data: result,
  });
});

const getAssetsByCustomerId = catchAsync(async (req, res) => {
  const { customerId } = req.params;
  const result = await AssetService.getAssetsByCustomerId(customerId);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Assets retrieved successfully",
    data: result,
  });
});

const getAssetById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AssetService.getAssetById(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Asset retrieved successfully",
    data: result,
  });
});

const updateAsset = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AssetService.updateAsset(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Asset updated successfully",
    data: result,
  });
});

const deleteAsset = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AssetService.deleteAsset(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Asset deleted successfully",
    data: null,
  });
});

export const AssetController = {
  createAsset,
  getAssetsByCustomerId,
  getAssetById,
  updateAsset,
  deleteAsset,
};
