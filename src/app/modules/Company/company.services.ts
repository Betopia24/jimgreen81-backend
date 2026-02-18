import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import prisma from "../../../db/prisma";
import {
  TAddMember,
  TUpdateCompanyInfo,
  TUpdateMemberInfo,
} from "./company.interface";
import { PasswordHelper } from "../../../helpers/password";

export const CompanyService = {
  // Add New Member
  addNewMember: async (payload: { companyId: string; data: TAddMember }) => {
    const { companyId, data } = payload;
    data.email = data.email.toLowerCase().trim();

    // Check if member already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new AppError(
        httpStatus.CONFLICT,
        "User already exists with this email!",
      );
    }

    // Hash password
    data.password = await PasswordHelper.hashedPassword(data.password);

    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: { ...data, isEmailVerified: true },
      });

      await tx.companyMember.create({
        data: { companyId, id: newUser.id, role: "member" },
      });

      return newUser;
    });

    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      avatar: result.avatar,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  },

  // Update Member Info
  updateMemberInfo: async (payload: {
    memberId: string;
    data: TUpdateMemberInfo;
  }) => {
    const { memberId, data } = payload;

    if (data.email) {
      data.email = data.email.toLowerCase().trim();
    }

    if (data.password) {
      data.password = await PasswordHelper.hashedPassword(data.password);
    }

    const memberInfo = await prisma.user.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!memberInfo) {
      throw new AppError(404, "member not found");
    }

    // check already other use this email
    if (data.email) {
      const existEmail = await prisma.user.findFirst({
        where: { email: data.email, id: { not: memberInfo.id } },
      });

      if (existEmail) {
        throw new AppError(httpStatus.BAD_REQUEST, "Try another email address");
      }
    }

    const { status, ...userData } = payload.data;

    const result = await prisma.$transaction(async (tx) => {
      // Update the member info with the new information
      const userResult = await tx.user.update({
        where: {
          id: memberInfo.id,
        },
        data: userData,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          companyMember: {
            select: { role: true, companyId: true, status: true },
          },
        },
      });

      // status update
      if (status) {
        await prisma.companyMember.update({
          where: { id: memberId },
          data: {
            status: status,
          },
        });

        return {
          ...userResult,
          companyMember: { ...userResult.companyMember, status: status },
        };
      }

      return userResult;
    });

    return result;
  },

  // Get Member List
  getMemberList: async (payload: { companyId: string }) => {
    const members = await prisma.user.findMany({
      where: { companyMember: { companyId: payload.companyId } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        companyMember: {
          select: { role: true, status: true, companyId: true },
        },
      },
    });

    return members;
  },

  // Get Single Member info
  getSingleMemberInfo: async (payload: { memberId: string }) => {
    const userInfo = await prisma.user.findUnique({
      where: {
        id: payload.memberId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        companyMember: {
          select: { role: true, companyId: true, status: true },
        },
      },
    });

    if (!userInfo)
      throw new AppError(httpStatus.NOT_FOUND, "Member Not Found!");

    return userInfo;
  },

  // Delete Member
  deleteMember: async (payload: { memberId: string }) => {
    const memberInfo = await prisma.user.findUnique({
      where: {
        id: payload.memberId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        companyMember: {
          select: { role: true, companyId: true, status: true },
        },
      },
    });

    if (!memberInfo) {
      throw new AppError(404, "member not found");
    }

    if (memberInfo.companyMember?.role === "owner") {
      throw new AppError(404, "company owner can't deletable");
    }

    await prisma.$transaction(async (tx) => {
      // delete member list first
      await tx.companyMember.delete({
        where: { id: memberInfo.id },
      });

      // then delete user
      await tx.user.delete({
        where: { id: memberInfo.id },
      });
    });

    return memberInfo;
  },

  // Get Company Info
  getCompanyList: async () => {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        subscriptions: true,
        _count: {
          select: {
            companyMembers: true,
            rawMaterials: true,
            products: true,
            customers: true,
          },
        },
      },
    });

    return companies;
  },

  // Get Company Info
  getCompanyInfo: async (payload: { companyId: string }) => {
    const { companyId } = payload;

    const companyInfo = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        subscriptions: true,
        _count: {
          select: {
            companyMembers: true,
            rawMaterials: true,
            products: true,
            customers: true,
          },
        },
      },
    });

    if (!companyInfo) {
      throw new AppError(httpStatus.NOT_FOUND, "Company not found!");
    }

    return companyInfo;
  },

  // Update Company Info
  updateCompanyInfo: async (payload: {
    companyId: string;
    data: TUpdateCompanyInfo;
  }) => {
    const { companyId, data } = payload;

    const companyInfo = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!companyInfo) {
      throw new AppError(httpStatus.NOT_FOUND, "Company not found!");
    }

    // check already other use this email
    if (data.email) {
      data.email = data.email.toLowerCase().trim();
      const existEmail = await prisma.company.findUnique({
        where: { email: data.email, NOT: { id: companyInfo.id } },
      });

      if (existEmail) {
        throw new AppError(httpStatus.BAD_REQUEST, "Try another email address");
      }
    }

    const result = await prisma.company.update({
      where: { id: companyId },
      data: data,
    });

    return result;
  },

  // Update company Status
  updateCompanyStatus: async (id: string) => {
    const companyInfo = await prisma.company.findUnique({
      where: {
        id: id,
      },
    });

    if (!companyInfo)
      throw new AppError(httpStatus.NOT_FOUND, "Company not found!");

    const result = await prisma.company.update({
      where: {
        id: companyInfo.id,
      },
      data: { isActive: companyInfo.isActive === true ? false : true },
    });

    if (!result)
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update company status!",
      );

    return companyInfo;
  },

  // Delete Company
  deleteCompany: async (payload: { companyId: string }) => {
    const { companyId } = payload;

    const companyInfo = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!companyInfo) {
      throw new AppError(httpStatus.NOT_FOUND, "Company not found!");
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.companyMember.deleteMany({
        where: { companyId },
      });

      await tx.user.deleteMany({
        where: { companyMember: { companyId } },
      });

      await tx.rawMaterial.deleteMany({
        where: { companyId },
      });

      await tx.product.deleteMany({
        where: { companyId },
      });

      const customerIds = await tx.customer
        .findMany({
          where: { companyId },
          select: { id: true },
        })
        .then((customers) => customers.map((customer) => customer.id));

      await tx.asset.deleteMany({
        where: { customerId: { in: customerIds } },
      });

      await tx.customer.deleteMany({
        where: { id: { in: customerIds } },
      });

      const deletedCompany = await prisma.company.delete({
        where: { id: companyId },
      });

      return deletedCompany;
    });

    return result;
  },
};
