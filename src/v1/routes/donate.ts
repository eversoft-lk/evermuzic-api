import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Bindings, PayPalResponse } from "../types";
import { createOrder, generateAccessToken } from "../functions/paypal";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const donations = await prisma.donations.findMany({
    orderBy: {
      amount: "desc",
    },
  });
  return c.json({
    donations,
  });
});

app.post("/", async (c) => {
  const request = await c.req.json<{
    name: string;
    email: string;
    amount: number;
  }>();
  const accessToken = await generateAccessToken(
    c.env.PAYPAL_CLIENT_ID,
    c.env.PAYPAL_CLIENT_SECRET
  );
  const order = await createOrder(accessToken, request);

  return c.json({
    response: order,
  });
});

app.get("/payment-success", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const name = c.req.query("name");
  const email = c.req.query("email");
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
    // const name = data.purchase_units[0].shipping.name.full_name;
    // const email = data.payment_source.paypal.email_address;
    const amount = data.purchase_units[0].payments.captures[0].amount.value;

    console.log(data);

    const payment = await prisma.donations.findFirst({
      where: {
        email: email,
      },
    });
    if (!payment) {
      await prisma.donations.create({
        data: {
          name: name as string,
          email: email as string,
          amount: parseFloat(amount),
        },
      });

      return c.redirect(c.env.FRONTEND_URL + "/donation/success");
    }

    await prisma.donations.update({
      where: {
        id: payment.id,
      },
      data: {
        amount: payment.amount + parseFloat(amount),
      },
    });

    return c.redirect(c.env.FRONTEND_URL + "/donation/success");
  } catch (error) {
    return c.redirect(c.env.FRONTEND_URL + "/donation/cancel");
  }
});

export const Donate = app;
