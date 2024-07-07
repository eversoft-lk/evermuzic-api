import { Hono } from "hono";
import * as V1ROUTES from "./v1/routes";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api");

app.use("*", cors());

// V1 APIs
app.route("/v1", V1ROUTES.NotifyMe);
app.route("/v1/songs", V1ROUTES.Songs);
app.route("/v1/artists", V1ROUTES.Artists);
app.route("/v1/auth", V1ROUTES.Auth);
app.route("/v1/spotify", V1ROUTES.Spotify);

export default app;
