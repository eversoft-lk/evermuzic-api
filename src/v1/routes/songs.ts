import { Hono } from "hono";
import { Bindings, Song } from "../types";
import axios from "axios";

// youtube types
import * as YTTYPES from "../types/YT";
import { getTrendingSongs, searchSongsFromLastFM } from "../functions";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/trending-now", async (c) => {
  const data = await getTrendingSongs(c.env.LAST_FM_API);

  return c.json({
    tracks: data,
  });
});

app.get("/search", async (c) => {
  const songName = c.req.query("q");
  if (!songName?.trim()) {
    return c.json(
      {
        message: "Invalid Query",
      },
      400
    );
  }
  const songs = await searchSongsFromLastFM(songName, c.env.LAST_FM_API);
  if (!songs) {
    return c.json(
      {
        message: "Error while fetching data",
      },
      500
    );
  }

  return c.json({
    songs: songs,
  });
});

app.get("/yt-search", async (c) => {
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

  let response: YTTYPES.YouTubeSearchResponse;
  try {
    const { data } = await axios.get<YTTYPES.YouTubeSearchResponse>(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${songName}&key=${c.env.YT_DATA_API}`
    );
    response = data;
  } catch (e) {
    return c.json(
      {
        message: "Error while fetching data",
        error: e,
      },
      500
    );
  }

  let id: string = "";
  const songs: Song[] = response.items.map((item, index) => {
    id += item.id.videoId;
    if (response.items.length - 1 !== index) {
      id += ",";
    }

    return {
      name: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: {
        sm: item.snippet.thumbnails.default.url,
        md: item.snippet.thumbnails.medium.url,
        lg: item.snippet.thumbnails.high.url,
      },
      duration: "0:00",
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    };
  });

  const { data } = await axios.get<YTTYPES.YouTubeVideoListResponse>(
    `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${id}&key=${c.env.YT_DATA_API}`
  );

  data.items.forEach((item, index) => {
    songs[index].duration = parseDuration(item.contentDetails.duration);
  });

  return c.json({
    status: "success",
    songs,
  });
});

function parseDuration(isoDuration: string) {
  const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const matches = isoDuration.match(regex);
  if (!matches) {
    return "Live";
  }

  const hours = matches[1] ? matches[1].slice(0, -1) : "0";
  const minutes = matches[2] ? matches[2].slice(0, -1) : "0";
  const seconds = matches[3] ? matches[3].slice(0, -1) : "0";

  if (hours === "0") {
    return `${minutes}m ${seconds}s`;
  }

  if (minutes === "0") {
    return `${seconds}s`;
  }

  return `${hours}h ${minutes}m ${seconds}s`;
}

export const Songs = app;
