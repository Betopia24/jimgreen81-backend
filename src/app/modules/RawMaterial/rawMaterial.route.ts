// src/routes/rawMaterial.routes.ts
import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { RawMaterialValidation } from "./rawMaterial.validation";
import { RawMaterialController } from "./rawMaterial.controller";

const router = Router();

// Create raw materials
router.post(
  "/",
  validateRequest(RawMaterialValidation.createRawMaterialSchema),
  RawMaterialController.createRawMaterial,
);

// Get rew materials by company Id
router.get(
  "/company/:companyId",
  RawMaterialController.getRawMaterialsByCompanyId,
);

// Get raw material by Id
router.get("/:id", RawMaterialController.getRawMaterialById);

// Update
router.put(
  "/:id",
  validateRequest(RawMaterialValidation.updateRawMaterialSchema),
  RawMaterialController.updateRawMaterial,
);

// Delete
router.delete("/:id", RawMaterialController.deleteRawMaterial);

export const rawMaterialRoutes = router;
