import { Hono } from "hono";
import { Bindings } from "../types";
import axios from "axios";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const ipAddr = c.req.raw.headers.get("CF-Connecting-IP") || "112.134.193.110";

  const { data } = await axios.get(`http://ip-api.com/json/${ipAddr}`);
  const country: string = (data.country || "sri lanka")?.toLowerCase();

  const { data: artistData } = await axios.get(
    `http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${country}&api_key=${c.env.LAST_FM_API}&format=json`
  );

  return c.json({
    artists: artistData.topartists.artist,
  });
});

export const Artists = app;
