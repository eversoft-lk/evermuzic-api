import { Hono } from "hono";
import { Bindings } from "../types";
import { getArtistsFromLocation } from "../functions";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/geo", async (c) => {
  const ipAddr = c.req.raw.headers.get("CF-Connecting-IP") || "112.134.193.110";

  const artists = await getArtistsFromLocation(ipAddr, c.env.LAST_FM_API);

  return c.json({
    artists,
  });
});

export const Artists = app;
