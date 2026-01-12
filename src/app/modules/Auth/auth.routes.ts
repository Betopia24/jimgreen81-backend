import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";

const router = Router();

// Create account
router.post(
  "/signup",
  validateRequest(AuthValidation.signup),
  AuthController.createAccount,
);

// Send verify otp to register account
router.post(
  "/resend-signup-otp",
  validateRequest(AuthValidation.sendOtp),
  AuthController.reSendSignUpOtp,
);

// Verify signup otp
router.post(
  "/verify-signup-otp",
  validateRequest(AuthValidation.verifyOtp),
  AuthController.verifySignUpOtp,
);

// Login user
router.post(
  "/login",
  validateRequest(AuthValidation.login),
  AuthController.loginUser,
);

// Social login
router.post(
  "/social-login",
  validateRequest(AuthValidation.socialLogin),
  AuthController.socialLogin,
);

// Forgot password
router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPassword),
  AuthController.forgotPassword,
);

// Verify Otp
router.post(
  "/verify-otp",
  validateRequest(AuthValidation.verifyOtp),
  AuthController.verifyOtp,
);

// Reset password
router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPassword),
  AuthController.resetPassword,
);

// change password
router.patch(
  "/change-password",
  auth(),
  validateRequest(AuthValidation.changePassword),
  AuthController.changePassword,
);

export const AuthRoutes = router;
