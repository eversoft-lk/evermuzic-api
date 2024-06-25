import { Hono } from "hono";

import * as TYPES from "./types";
import * as V1ROUTES from "./v1/routes";

const app = new Hono<{ Bindings: TYPES.Bindings }>().basePath("/api");

// V1 APIs
app.route("/v1/songs", V1ROUTES.Songs);

export default app;