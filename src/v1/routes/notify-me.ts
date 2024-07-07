import { Hono } from "hono";
import { Bindings } from "../types/Bindings";
import { zValidator } from "@hono/zod-validator";
import { NotifyMeRequest } from "../schema";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { z } from "zod";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/notify-me", zValidator("json", NotifyMeRequest), async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  type RequestType = z.infer<typeof NotifyMeRequest>;

  const body = await c.req.json<RequestType>();

  const isExists = await prisma.notifyRequest.findFirst({
    where: {
      email: body.email,
    },
  });

  if (isExists) {
    return c.json(
      {
        message: "You have already subscribed!",
        request: isExists,
      },
      400
    );
  }

  const request = await prisma.notifyRequest.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });

  return c.json({
    message: "Thank you for subscribing!",
    request,
  });
});

export const NotifyMe = app;
