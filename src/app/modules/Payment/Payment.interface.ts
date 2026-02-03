import z from "zod";
import { PaymentValidation } from "./Payment.validation";

export type TCreateSubscriptionInput = z.infer<
  typeof PaymentValidation.createSubscription
>;
