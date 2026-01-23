import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CustomerService } from "./Customer.service";

const createCustomer = catchAsync(async (req, res) => {
  const result = await CustomerService.createCustomer(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    message: "Customer created successfully",
    data: result,
  });
});

const getCustomersByCompanyId = catchAsync(async (req, res) => {
  const { companyId } = req.params;
  const result = await CustomerService.getCustomersByCompanyId(companyId);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Customers retrieved successfully",
    data: result,
  });
});
const getCustomerById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CustomerService.getCustomerById(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Customer retrieved successfully",
    data: result,
  });
});

const updateCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CustomerService.updateCustomer(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Customer updated successfully",
    data: result,
  });
});

const deleteCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CustomerService.deleteCustomer(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Customer deleted successfully",
    data: null,
  });
});

export const CustomerController = {
  createCustomer,
  getCustomersByCompanyId,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
