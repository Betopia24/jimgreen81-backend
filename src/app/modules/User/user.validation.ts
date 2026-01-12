import { z } from "zod";

const updateUser = z.object({
  firstName: z.string().nonempty().optional(),
  lastName: z.string().nonempty().optional(),
  email: z.string().email().nonempty().optional(),
});

export const userValidationSchema = {
  updateUser,
};
