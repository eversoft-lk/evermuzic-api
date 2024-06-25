import { Hono } from "hono";
import { Bindings } from "../../types";
import axios from "axios";

const songs = new Hono<{ Bindings: Bindings }>();

songs.get("/search", async (c) => {
  // Get song name from queryset
  const songName = c.req.query("q");
  if (!songName?.trim()) {
    return c.json(
      {
        message: "Song Not Found",
      },
      404
    );
  }

  const response = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${songName}&key=${c.env.YT_DATA_API}`
  );

  return c.json({
    status: "success",
    response,
  });
});

export const Songs = songs;
