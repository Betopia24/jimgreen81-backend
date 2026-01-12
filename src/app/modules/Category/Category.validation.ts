import { z } from "zod";

const addCategory = z.object({
  name: z
    .string({ required_error: "name is required" })
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name too long"),
  orderIndex: z
    .number()
    .positive("Can't not provide negative value")
    .optional(),
});

export const categoryValidationSchema = {
  addCategory,
};
