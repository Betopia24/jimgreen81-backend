import express from "express";
import { auth } from "../../middlewares/auth";
import { CompanyValidationSchema } from "./company.validation";
import { CompanyController } from "./company.controller";
import validateRequest from "../../middlewares/validateRequest";
import { companyAccess } from "../../middlewares/companyAccess";

const router = express.Router();

// Get Company list
router.get("/list", auth(), CompanyController.getCompanyList);

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

// Add New Member
router.post(
  "/:id/members",
  auth(),
  companyAccess("owner"),
  validateRequest(CompanyValidationSchema.addNewMember),
  CompanyController.addNewMember,
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

// Update Member Info
router.put(
  "/:id/members/:memberId",
  auth(),
  companyAccess("owner"),
  validateRequest(CompanyValidationSchema.updateMemberInfo),
  CompanyController.updateMemberInfo,
);

// Delete Member
router.delete(
  "/:id/members/:memberId",
  auth(),
  companyAccess("owner"),
  CompanyController.deleteMember,
);

// Delete Company
router.patch(
  "/:id/status",
  auth("ADMIN"),
  CompanyController.updateCompanyStatus,
);

// Delete Company
router.delete("/:id", auth("ADMIN"), CompanyController.deleteCompany);

export const CompanyRoutes = router;
