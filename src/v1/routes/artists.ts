import { Hono } from "hono";
import { Bindings } from "../types";
import {
  getArtistsFromLocation,
  getPopularArtists,
  searchArtists,
} from "../functions";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const ipAddr = c.req.raw.headers.get("CF-Connecting-IP") || "112.134.193.110";

  const popularArtists = getPopularArtists(c.env.LAST_FM_API);
  const geoArtists = getArtistsFromLocation(ipAddr, c.env.LAST_FM_API);

  const [popular, geo] = await Promise.all([popularArtists, geoArtists]);

  return c.json({
    popular,
    geo,
  });
});

app.get("/search", async (c) => {
  const artistName = c.req.query("q");
  if (!artistName?.trim()) {
    return c.json(
      {
        message: "Invalid Query",
      },
      400
    );
  }
  const artists = await searchArtists(artistName, c.env.LAST_FM_API);
  if (!artists) {
    return c.json(
      {
        message: "No Artists Found",
      },
      404
    );
  }

  return c.json({
    artists,
  });
});

app.get("/geo", async (c) => {
  const ipAddr = c.req.raw.headers.get("CF-Connecting-IP") || "112.134.193.110";

  const artists = await getArtistsFromLocation(ipAddr, c.env.LAST_FM_API);

  return c.json({
    artists,
  });
});

export const Artists = app;
