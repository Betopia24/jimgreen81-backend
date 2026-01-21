import express from "express";
import { auth } from "../../middlewares/auth";
import { CompanyValidationSchema } from "./company.validation";
import { CompanyController } from "./company.controller";
import validateRequest from "../../middlewares/validateRequest";
import { companyAccess } from "../../middlewares/companyAccess";

const router = express.Router();

// Add New Member
router.post(
  "/:id/members",
  auth(),
  companyAccess("owner"),
  validateRequest(CompanyValidationSchema.addNewMember),
  CompanyController.addNewMember,
);

// Update Member Info
router.put(
  "/:id/members/:memberId",
  auth(),
  companyAccess("owner"),
  validateRequest(CompanyValidationSchema.updateMemberInfo),
  CompanyController.updateMemberInfo,
);

// Update Member Activation
router.patch(
  "/:id/members/:memberId",
  auth(),
  companyAccess("owner"),
  CompanyController.updateMemberActivation,
);

// Get Member List
router.get(
  "/:id/members",
  auth(),
  companyAccess("owner"),
  CompanyController.getMemberList,
);

// Get Single Member info
router.get(
  "/:id/members/:memberId",
  auth(),
  companyAccess("owner"),
  CompanyController.getSingleMemberInfo,
);

// Delete Member
router.delete(
  "/:id/members/:memberId",
  auth(),
  companyAccess("owner"),
  CompanyController.deleteMember,
);

// Get Company Info
router.get(
  "/:id",
  auth(),
  companyAccess("owner", "member"),
  CompanyController.getCompanyInfo,
);

// Update Company Info
router.put(
  "/:id",
  auth(),
  companyAccess("owner"),
  validateRequest(CompanyValidationSchema.updateCompanyInfo),
  CompanyController.updateCompanyInfo,
);

export const CompanyRoutes = router;
