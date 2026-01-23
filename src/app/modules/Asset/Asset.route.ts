import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AssetValidation } from "./Asset.validation";
import { AssetController } from "./Asset.controller";

const router = Router();

// Create
router.post(
  "/",
  validateRequest(AssetValidation.createAssetSchema),
  AssetController.createAsset,
);

// Get Assets By CustomerId
router.get("/customer/:customerId", AssetController.getAssetsByCustomerId);

// Get Single
router.get("/:id", AssetController.getAssetById);

// Update
router.put(
  "/:id",
  validateRequest(AssetValidation.updateAssetSchema),
  AssetController.updateAsset,
);

// Delete
router.delete("/:id", AssetController.deleteAsset);

export const assetRoutes = router;
