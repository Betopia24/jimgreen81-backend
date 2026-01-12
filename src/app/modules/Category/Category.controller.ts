import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { categoryService } from "./Category.service";

const addCategory = catchAsync(async (req, res) => {
  const result = await categoryService.addCategory({ data: req.body });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category Successfully Created",
    data: result,
  });
});

const getCategories = catchAsync(async (req, res) => {
  const result = await categoryService.getCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Retrieved Categories",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const result = await categoryService.updateCategory({
    categoryId: req.params.id,
    data: req.body,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category Successfully Updated",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const result = await categoryService.deleteCategory({
    categoryId: req.params.id,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category Successfully Deleted",
    data: result,
  });
});

export const categoryController = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
