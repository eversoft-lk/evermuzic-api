import { Hono } from "hono";
import { Bindings } from "../../types";
import { zValidator } from "@hono/zod-validator";
import { LoginSchema } from "../../schema";
import type { LoginType } from "../../schema";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { comparePassword } from "../../functions";
import { decode, sign, verify } from "hono/jwt";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/login", zValidator("json", LoginSchema), async (c) => {
  const req = await c.req.json<LoginType>();

  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: req.usernameOrEmail,
        },
        {
          username: req.usernameOrEmail,
        },
      ],
    },
  });

  if (!user) {
    return c.json(
      {
        message: "User not found!",
      },
      404,
    );
  }

  const isPasswordMatch = await comparePassword(req.password, user.password);
  if (!isPasswordMatch) {
    return c.json(
      {
        message: "Password is incorrect!",
      },
      400,
    );
  }

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  }

  const accessToken = await sign(payload, c.env.ACCESS_TOKEN_SECRET);
  const refreshToken = await sign(payload, c.env.REFRESH_TOKEN_SECRET);

  user.password = "undefined";
  return c.json({
    message: "Login successful!",
    user,
    accessToken,
    refreshToken,
  });
});

export const Login = app;
