import { z } from "zod";
import { userValidationSchema } from "./user.validation";

export type TUpdateProfile = z.infer<typeof userValidationSchema.updateProfile>;

export type IUserFilterRequest = {
  searchTerm?: string | undefined;
  role?: string;
  status?: string;
};
