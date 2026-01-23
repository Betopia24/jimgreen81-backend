// src/routes/product.routes.ts
import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidation } from "./Product.validation";
import { ProductController } from "./Product.controller";

const router = Router();

// Create
router.post(
  "/",
  validateRequest(ProductValidation.createProductSchema),
  ProductController.createProduct,
);

// Get Products By CompanyId
router.get("/company/:companyId", ProductController.getProductsByCompanyId);

// Get Single Product
router.get("/:id", ProductController.getProductById);

// Update
router.put(
  "/:id",
  validateRequest(ProductValidation.updateProductSchema),
  ProductController.updateProduct,
);

// Delete
router.delete("/:id", ProductController.deleteProduct);

export const productRoutes = router;
