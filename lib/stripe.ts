import Stripe from "stripe";

export const stripe = new Stripe('', {
  apiVersion: "2022-11-15",
  typescript: true,
})