import { Hono } from "hono";
import { Login } from "./login";
import { Register } from "./register";

const app = new Hono();

app.route("/", Login);
app.route("/", Register);

export const Auth = app;
