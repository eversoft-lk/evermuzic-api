import { Hono } from "hono";
import { verify } from "hono/jwt";
import { Bindings } from "../../types";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/validate", async (c) => {
  const token = c.req.header("Authorization");

  if (token == null) {
    return c.json({
      status: "error",
      message: "Token is not provided!",
    });
  }

  try {
    const payload = await verify(token, c.env.ACCESS_TOKEN_SECRET);
    return c.json({
      status: "success",
      payload: payload,
      token,
    });
  } catch (error) {
    return c.json({
      status: "error",
      message: "Invalid Access Token",
    });
  }
});

export const Validate = app;
