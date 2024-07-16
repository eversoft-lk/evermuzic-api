import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Bindings, PayPalResponse } from "../types";
import { createOrder, generateAccessToken } from "../functions/paypal";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  const { amount } = await c.req.json<{ amount: number }>();
  const accessToken = await generateAccessToken(
    c.env.PAYPAL_CLIENT_ID,
    c.env.PAYPAL_CLIENT_SECRET
  );
  const order = await createOrder(accessToken, amount);

  return c.json({
    response: order,
  });
});

app.get("/payment-success", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const token = c.req.query("token");

  const accessToken = await generateAccessToken(
    c.env.PAYPAL_CLIENT_ID,
    c.env.PAYPAL_CLIENT_SECRET
  );

  try {
    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json<PayPalResponse>();
    const name = data.purchase_units[0].shipping.name.full_name;
    const email = data.payment_source.paypal.email_address;
    const amount = data.purchase_units[0].payments.captures[0].amount.value;

    await prisma.donations.create({
      data: {
        name,
        email,
        amount: parseFloat(amount),
      },
    });

    return c.redirect(c.env.FRONTEND_URL + "/donate/success");
  } catch (error) {
    return c.redirect(c.env.FRONTEND_URL + "/donate");
  }
});

export const Donate = app;
