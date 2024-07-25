import { Hono } from "hono";
import { RegisterSchema } from "../../schema";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Bindings } from "../../types";
import { v4 as uuid } from "uuid";
import { hashPassword } from "../../functions";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/register", zValidator("json", RegisterSchema), async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  type requestType = z.infer<typeof RegisterSchema>;
  const req = await c.req.json<requestType>();

  const isExists = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: req.email,
        },
        {
          username: req.username,
        },
      ],
    },
  });

  if (isExists) {
    isExists.password = "undefined";

    return c.json(
      {
        message: "User already exists!",
        user: isExists,
      },
      400,
    );
  }

  const password = await hashPassword(req.password);
  const user = await prisma.user.create({
    data: {
      id: uuid(),
      name: req.name,
      username: req.username,
      email: req.email,
      password: password,
    },
  });

  user.password = "undefined";
  return c.json({
    status: "success",
    message: "User created successfully!",
    user,
  });
});

export const Register = app;
