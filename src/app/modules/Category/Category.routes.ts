import express from "express";
import { categoryController } from "./Category.controller";
import { categoryValidationSchema } from "./Category.validation";
import { auth } from "../../middlewares/auth";
import requestValidate from "../../middlewares/validateRequest";

const router = express.Router();

// Create Category
router.post(
  "/",
  auth("ADMIN"),
  requestValidate(categoryValidationSchema.addCategory),
  categoryController.addCategory,
);

// Get Categories
router.get("/", categoryController.getCategories);

// Update Category
router.put(
  "/:id",
  auth("ADMIN"),
  requestValidate(categoryValidationSchema.addCategory),
  categoryController.updateCategory,
);

// Delete Category
router.delete("/:id", auth("ADMIN"), categoryController.deleteCategory);

export const categoryRoutes = router;
