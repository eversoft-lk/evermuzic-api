import { Hono } from "hono";
import { Bindings } from "../types";
import { zValidator } from "@hono/zod-validator";
import { FeedbackRequest, FeedbackRequestType } from "../schema";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", zValidator("json", FeedbackRequest), async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const req = await c.req.json<FeedbackRequestType>();
  const feedback = await prisma.feedback.create({
    data: {
      name: req.name,
      email: req.email,
      message: req.feedback,
    },
  });

  return c.json({
    message: "Thank you for your feedback!",
    feedback,
  });
});

export const Feedback = app;
