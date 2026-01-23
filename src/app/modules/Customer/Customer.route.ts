import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CustomerValidation } from "./Customer.validation";
import { CustomerController } from "./Customer.controller";

const router = Router();

// Create
router.post(
  "/",
  validateRequest(CustomerValidation.createCustomerSchema),
  CustomerController.createCustomer,
);

// Get All By Company Id
router.get("/company/:companyId", CustomerController.getCustomersByCompanyId);

// Get Single
router.get("/:id", CustomerController.getCustomerById);

// Update
router.put(
  "/:id",
  validateRequest(CustomerValidation.updateCustomerSchema),
  CustomerController.updateCustomer,
);

// Delete
router.delete("/:id", CustomerController.deleteCustomer);

export const customerRoutes = router;
