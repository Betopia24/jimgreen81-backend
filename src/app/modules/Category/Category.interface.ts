import { z } from "zod";
import { categoryValidationSchema } from "./Category.validation";

export type TAddCategory = z.infer<typeof categoryValidationSchema.addCategory>;
