import { Hono } from "hono";

const app = new Hono();

app.post("/register", (c) => {
    return c.text("Hello from auth route");
});

export const Auth = app;