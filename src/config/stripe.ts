import Stripe from "stripe";
import config from ".";

export const stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});
