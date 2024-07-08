import { Hono } from "hono";
import { Bindings } from "../../types";
import axios from "axios";
import type { PlaylistContent, PlaylistSearch } from "../../types/YT";

type PlaylistSearchResponse = {
  items: PlaylistSearch[];
};

type PlaylistContentResponse = {
  items: PlaylistContent[];
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/yt-search", async (c) => {
  const playlistName = c.req.query("q");
  if (!playlistName?.trim()) {
    return c.json(
      {
        message: "Invalid Query",
      },
      400
    );
  }
  console.log(playlistName);

  const { data } = await axios.get<PlaylistSearchResponse>(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&q=${playlistName}&key=${c.env.YT_DATA_API}&maxResults=10`
  );

  let ids = "";
  data.items.forEach((item, index) => {
    ids += item.id.playlistId;
    if (data.items.length - 1 !== index) {
      ids += ",";
    }
  });

  const { data: playlistItems } = await axios.get<PlaylistContentResponse>(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${ids}&key=${c.env.YT_DATA_API}`
  );

  return c.json({
    playlists: playlistItems.items,
    status: "success",
  });
});

export const YTPlaylistSearch = app;
