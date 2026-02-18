import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CompanyService } from "./company.services";

export const CompanyController = {
  // Add New Member
  addNewMember: catchAsync(async (req, res) => {
    const result = await CompanyService.addNewMember({
      companyId: req.params.id,
      data: req.body,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Successfully add new member",
      data: result,
    });
  }),

  // Update Member Info
  updateMemberInfo: catchAsync(async (req, res) => {
    const result = await CompanyService.updateMemberInfo({
      memberId: req.params.memberId,
      data: req.body,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Member successfully updated",
      data: result,
    });
  }),

  // Get Member List
  getMemberList: catchAsync(async (req, res) => {
    const result = await CompanyService.getMemberList({
      companyId: req.params.id,
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Successfully retrieved member list",
      data: result,
    });
  }),

  // Get Single Member info
  getSingleMemberInfo: catchAsync(async (req, res) => {
    const result = await CompanyService.getSingleMemberInfo({
      memberId: req.params.memberId,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Member info retrieved successfully",
      data: result,
    });
  }),

  // Delete Member
  deleteMember: catchAsync(async (req, res) => {
    const result = await CompanyService.deleteMember({
      memberId: req.params.memberId,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Member Successfully Deleted",
      data: result,
    });
  }),

  // Get Company List
  getCompanyList: catchAsync(async (req, res) => {
    // TODO: Need to implement pagination and search functionality in this controller
    const result = await CompanyService.getCompanyList();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Successfully retrieved company list",
      data: result,
    });
  }),

  // Get Company Info
  getCompanyInfo: catchAsync(async (req, res) => {
    const result = await CompanyService.getCompanyInfo({
      companyId: req.params.id,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "successfully Retrieved Company info",
      data: result,
    });
  }),

  // Update Company Info
  updateCompanyInfo: catchAsync(async (req, res) => {
    const result = await CompanyService.updateCompanyInfo({
      companyId: req.params.id,
      data: req.body,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Company info successfully updated",
      data: result,
    });
  }),

  // Update Company status
  updateCompanyStatus: catchAsync(async (req, res) => {
    const result = await CompanyService.updateCompanyStatus(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Company status successfully updated",
      data: result,
    });
  }),

  // Delete Company Info
  deleteCompany: catchAsync(async (req, res) => {
    const result = await CompanyService.deleteCompany({
      companyId: req.params.id,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Company successfully deleted",
      data: result,
    });
  }),
};
