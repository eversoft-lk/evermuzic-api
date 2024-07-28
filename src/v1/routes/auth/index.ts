import { Hono } from "hono";
import { Login } from "./login";
import { Register } from "./register";
import { Validate } from "./validate";

const app = new Hono();

app.route("/", Login);
app.route("/", Register);
app.route("/", Validate);

export const Auth = app;
