import express from "express";
import { userValidationSchema } from "./user.validation";
import requestValidate from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { uploadFile } from "../../../upload/fileUpload";
import { UserController } from "./user.controller";

const router = express.Router();

// Get my profile
router.get("/profile", auth(), UserController.getMyProfile);

// Update my profile
router.put(
  "/profile",
  auth(),
  requestValidate(userValidationSchema.updateUser),
  UserController.updateProfile,
);

// Update Profile avatar
router.put(
  "/profile/avatar",
  auth(),
  uploadFile.single("file"),
  UserController.updateProfilePicture,
);

// Delete My Account
router.delete("/profile", auth(), UserController.deleteAccount);

// ========== Admin ===========

// Get all  users
router.get("/", auth("SUPER_ADMIN"), UserController.getAllUsers);

// Get single user by id
router.get("/:id", auth("SUPER_ADMIN"), UserController.getSingleUser);

// Block User
router.patch(
  "/:id/status",
  auth("SUPER_ADMIN"),
  UserController.updateUserStatus,
);

export const userRoutes = router;
