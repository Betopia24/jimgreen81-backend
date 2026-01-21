import { emailVerification } from "./../../../mail/template/emailVerification";
import status from "http-status";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../../../mail/sendEmail";
import AppError from "../../../errors/AppError";
import { resetPasswordHtml } from "../../../mail/template/resetPassword";
import config from "../../../config";
import { generateOtp } from "./auth.utils";
import prisma from "../../../db/prisma";
import {
  TChangePassword,
  TCreateUser,
  TLogin,
  TResetPassword,
  TSendOtp,
  TSocialLogin,
  TVerifyOtp,
} from "./auth.interface";
import { PasswordHelper } from "../../../helpers/password";
import JwtHelper from "../../../helpers/jwtHelpers";

export class AuthService {
  // Create Account
  static createAccount = async (payload: { data: TCreateUser }) => {
    const { data } = payload;
    data.email = data.email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new AppError(
        status.CONFLICT,
        "User already exists with this email!",
      );
    }

    // Check company email already exists
    const companyEmailExist = await prisma.company.findUnique({
      where: { email: data.email },
    });
    if (companyEmailExist) {
      throw new AppError(
        status.CONFLICT,
        "Company already exists with this email!",
      );
    }

    // Hash password
    data.password = await PasswordHelper.hashedPassword(data.password);

    const { companyEmail, companyLocation, companyName, ...restData } =
      payload.data;

    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: { ...restData },
      });

      // Create company
      const newCompany = await tx.company.create({
        data: {
          name: companyName,
          email: companyEmail,
          location: companyLocation,
        },
      });

      await tx.companyMember.create({
        data: { companyId: newCompany.id, id: newUser.id, role: "owner" },
      });
    });

    // send otp
    await this.resendSignUpOtp({ email: payload.data.email });
  };

  // Send Signup OTP
  static resendSignUpOtp = async (payload: TSendOtp) => {
    payload.email.toLowerCase().trim();

    // create otp
    const genOtp = generateOtp();
    await prisma.otp.create({
      data: {
        type: "ACCOUNT_VERIFY",
        email: payload.email,
        code: genOtp.otp,
        expiresAt: genOtp.expiresAt,
      },
    });

    await sendEmail({
      to: payload.email,
      subject: "Verify Your Email To Complete Account",
      html: emailVerification(genOtp.otp, genOtp.expireMinute),
    });

    return null;
  };

  // Verify sign up otp
  static async verifySignUpOtp(payload: TVerifyOtp) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found!");
    }

    if (user.isEmailVerified) {
      throw new AppError(status.BAD_REQUEST, "Email already verified!");
    }

    const result = await this.verifyOTP(payload);

    // Optionally: Mark the OTP as used to prevent reuse
    await prisma.otp.updateMany({
      where: {
        id: result.optId,
      },
      data: {
        isUsed: true,
      },
    });

    return this.getLoginTokens({ id: user.id, role: user.role });
  }

  //  Login User
  static loginUser = async (payload: TLogin) => {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found!");
    }

    if (!user.isEmailVerified) {
      throw new AppError(status.BAD_REQUEST, "Please verify your email first!");
    }

    // Check user status
    if (user.status === "BLOCKED") {
      throw new AppError(
        status.FORBIDDEN,
        "Your account has been blocked. Please contact support.",
      );
    }

    // Check if password exists (OAuth users don't have passwords)
    if (!user.password) {
      throw new AppError(
        status.BAD_REQUEST,
        `This account is linked with ${user.provider}. Please use ${user.provider} login.`,
      );
    }

    const isPasswordMatched = await PasswordHelper.isPasswordMatch(
      payload.password,
      user.password as string,
    );

    if (!isPasswordMatched) {
      throw new AppError(status.UNAUTHORIZED, "Password is incorrect!");
    }

    return this.getLoginTokens({ id: user.id, role: user.role });
  };

  // Social Login
  static socialLogin = async (payload: TSocialLogin) => {
    const { provider, token } = payload;

    let userInfo;

    userInfo = await this.verifyGoogleToken(token);

    // const socialId = userInfo.sub ?? userInfo.id ?? "";
    const email = userInfo.email ?? "";
    const name = (userInfo.name ?? "").trim();
    const avatar =
      typeof userInfo.picture === "string"
        ? userInfo.picture
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((userInfo.picture as any)?.data?.url ?? "");

    const parts = name.split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";

    const existUser = await prisma.user.findUnique({ where: { email } });

    if (existUser) {
      return this.getLoginTokens({ id: existUser.id, role: existUser.role });
    }

    // Find existing user OR create new
    let user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        firstName,
        lastName,
        avatar,
        password: "",
        provider: provider,
      },
    });

    return this.getLoginTokens({ id: user.id, role: user.role });
  };

  // Forgot Password
  static forgotPassword = async (email: string) => {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found!");
    }

    if (user.status === "BLOCKED") {
      throw new AppError(
        status.FORBIDDEN,
        "Account has been blocked! contact support.",
      );
    }

    const { otp, expiresAt, expireMinute } = generateOtp();

    // Invalidate any previous unverified OTPs for this user
    await prisma.otp.create({
      data: {
        code: otp,
        type: "FORGOT_PASSWORD",
        email: email,
        expiresAt,
      },
    });

    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: resetPasswordHtml({
        otp,
        userName: user.firstName + user.lastName,
        expireMinute,
      }),
    });

    return null;
  };

  // Reset Password
  static resetPassword = async (payload: TResetPassword) => {
    const normalizedEmail = payload.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found!");
    }

    // Check if OTP was verified from OtpLog
    const verifiedOtp = await prisma.otp.findFirst({
      where: {
        email: normalizedEmail,
        isVerified: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!verifiedOtp) {
      throw new AppError(status.BAD_REQUEST, "Please verify OTP first!");
    }

    // check verified expire
    if (verifiedOtp.verifiedAt) {
      this.verifiedOtpExpire(verifiedOtp.verifiedAt);
    }

    payload.newPassword = await PasswordHelper.hashedPassword(
      payload.newPassword,
    );

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        password: payload.newPassword,
      },
    });

    // Optionally: Mark the OTP as used to prevent reuse
    await prisma.otp.updateMany({
      where: {
        id: verifiedOtp.id,
      },
      data: {
        isUsed: true,
      },
    });

    return null;
  };

  // refreshToken
  static refreshToken = async (token?: string) => {
    if (!token) {
      throw new AppError(status.UNAUTHORIZED, "You are not authorized");
    }

    const decoded = JwtHelper.verifyToken(token, "REFRESH_TOKEN");

    if (!decoded) {
      throw new AppError(status.UNAUTHORIZED, "Invalid access token");
    }

    const { id } = decoded;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    return this.getLoginTokens({ id: user.id, role: user.role });
  };

  // change password
  static changePassword = async (payload: TChangePassword) => {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found!");
    }

    if (user.status === "BLOCKED") {
      throw new AppError(
        status.FORBIDDEN,
        "Account has been blocked! contact support session",
      );
    }

    const isPasswordMatch = await PasswordHelper.isPasswordMatch(
      payload.currentPassword,
      user.password as string,
    );

    if (!isPasswordMatch) {
      throw new AppError(status.BAD_REQUEST, "Current password is incorrect!");
    }

    if (payload.currentPassword === payload.newPassword) {
      throw new AppError(
        status.BAD_REQUEST,
        "Can't used new password as current password",
      );
    }

    payload.newPassword = await PasswordHelper.hashedPassword(
      payload.newPassword,
    );

    await prisma.user.update({
      where: { id: payload.userId },
      data: {
        password: payload.newPassword,
      },
    });

    return null;
  };

  static async verifyOTP(payload: { email: string; otp: number }) {
    const maxAttempts = 3;

    const otpData = await prisma.otp.findFirst({
      where: {
        email: payload.email,
        isVerified: false,
        isUsed: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpData) {
      throw new AppError(
        status.BAD_REQUEST,
        "OTP not found or has expired. Please request a new OTP.",
      );
    }

    if (otpData.attempts >= maxAttempts) {
      throw new AppError(
        status.BAD_REQUEST,
        "Maximum OTP attempts exceeded. Please request a new OTP.",
      );
    }

    // Check expiration
    const currentTime = new Date();
    if (currentTime > otpData.expiresAt) {
      throw new AppError(
        status.BAD_REQUEST,
        "OTP has expired. Please request a new OTP.",
      );
    }

    // If OTP does not match, increment attempts
    if (otpData.code !== payload.otp) {
      if (otpData.attempts + 1 >= maxAttempts) {
        // Invalidate OTP after max attempts reached
        await prisma.otp.update({
          where: { id: otpData.id },
          data: {
            attempts: otpData.attempts + 1,
          },
        });

        throw new AppError(
          status.BAD_REQUEST,
          "Maximum OTP attempts exceeded. Please request a new OTP.",
        );
      }

      // Increment attempts count and allow retry
      await prisma.otp.update({
        where: { id: otpData.id },
        data: { attempts: otpData.attempts + 1 },
      });

      throw new AppError(
        status.BAD_REQUEST,
        `Invalid OTP. You have ${
          maxAttempts - (otpData.attempts + 1)
        } attempts left.`,
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // check otp type
      if (otpData.type === "ACCOUNT_VERIFY") {
        await tx.user.update({
          where: { email: payload.email },
          data: { isEmailVerified: true },
        });
      }

      return await tx.otp.update({
        where: { id: otpData.id },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
          attempts: otpData.attempts + 1,
        },
      });
    });

    return {
      isVerified: true,
      message: "OTP successfully verified",
      email: payload.email,
      optId: result.id,
    };
  }

  // Check if the verified OTP is still recent
  private static verifiedOtpExpire(verifiedAt: Date) {
    const minute = 10;
    const fifteenMinutesAgo = new Date(Date.now() - Number(minute) * 60 * 1000);

    if (verifiedAt < fifteenMinutesAgo) {
      throw new AppError(
        status.BAD_REQUEST,
        "OTP verification expired. Please request a new OTP.",
      );
    }
  }

  // verify google token
  private static verifyGoogleToken = async (idToken: string) => {
    const client = new OAuth2Client(config.oauth.google.GOOGLE_CLIENT_ID);
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const response = ticket.getPayload();

      if (!response) {
        throw new AppError(status.NOT_FOUND, "Empty Google token payload");
      }

      console.log("Google verify: ", response);

      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Google OAuth error:", error?.message);

      if (error?.message?.includes("Wrong number of segments")) {
        throw new AppError(status.BAD_REQUEST, "Malformed Google token");
      }

      if (error?.message?.includes("Token used too late")) {
        throw new AppError(status.BAD_REQUEST, "Google token expired");
      }

      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        "Google authentication failed",
      );
    }
  };

  private static getLoginTokens(payload: { id: string; role: string }) {
    return {
      accessToken: JwtHelper.generateToken(payload, "ACCESS_TOKEN"),
      refreshToken: JwtHelper.generateToken(payload, "REFRESH_TOKEN"),
    };
  }
}
