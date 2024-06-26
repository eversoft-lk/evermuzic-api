import { Hono } from "hono";
import * as V1ROUTES from "./v1/routes";

const app = new Hono().basePath("/api");

// V1 APIs
app.route("/v1/songs", V1ROUTES.Songs);
app.route("/v1/artists", V1ROUTES.Artists);

export default app;
