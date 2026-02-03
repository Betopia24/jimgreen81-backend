import z from "zod";

export const PaymentValidation = {
  createSubscription: z.object({
    planId: z
      .string({ required_error: "planId is required!" })
      .nonempty({ message: "planId is required!" }),
    planType: z.enum(["monthly", "annually"]),
  }),
};
