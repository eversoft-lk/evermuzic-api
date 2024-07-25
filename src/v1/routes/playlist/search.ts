import { Hono } from "hono";
import { Bindings } from "../../types";
import axios from "axios";
import type {
  PlaylistContent,
  PlaylistSearch,
  PlaylistItem,
  YouTubeVideoListResponse,
} from "../../types/YT";

type PlaylistSearchResponse = {
  items: PlaylistSearch[];
};

type PlaylistContentResponse = {
  items: PlaylistContent[];
};

type PlaylistItemResponse = {
  items: PlaylistItem[];
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

app.get("/yt-search/:id", async (c) => {
  const playlistId = c.req.param("id");
  if (!playlistId) {
    return c.json(
      {
        message: "Invalid Params",
      },
      400
    );
  }

  let playlist: {
    content: PlaylistContent;
    items: PlaylistItem[];
  } | null = null;
  try {
    const getContent = axios.get<PlaylistContentResponse>(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${c.env.YT_DATA_API}`
    );

    const getItems = axios.get<PlaylistItemResponse>(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${c.env.YT_DATA_API}&maxResults=50`
    );

    const [content, items] = await Promise.all([getContent, getItems]);
    let ids = "";
    items.data.items.forEach((item, index) => {
      ids += item.snippet.resourceId.videoId;
      if (items.data.items.length - 1 !== index) {
        ids += ",";
      }
    });

    const getVideos = axios.get<YouTubeVideoListResponse>(
      `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${c.env.YT_DATA_API}`
    );

    const { data: videos } = await getVideos;
    videos.items.forEach((item, index) => {
      items.data.items[index].duration = parseDuration(
        item.contentDetails.duration
      );
    });

    playlist = {
      content: content.data.items[0],
      items: items.data.items,
    };
  } catch (error) {
    return c.json(
      {
        message: "Failed to fetch playlist",
        error,
      },
      500
    );
  }

  return c.json({
    status: "success",
    playlist: playlist,
  });
});

function parseDuration(isoDuration: string) {
  const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const matches = isoDuration.match(regex);
  if (!matches) {
    return "Live";
  }

  const hours = matches[1] ? parseInt(matches[1].slice(0, -1)) : 0;
  const minutes = matches[2] ? parseInt(matches[2].slice(0, -1)) : 0;
  const seconds = matches[3] ? parseInt(matches[3].slice(0, -1)) : 0;

  const formattedHours = hours > 0 ? `${hours}:` : "";
  const formattedMinutes =
    minutes > 0 ? `${minutes}:` : hours > 0 ? "00:" : "0:";
  const formattedSeconds = seconds > 9 ? seconds : `0${seconds}`;

  return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
}

export const YTPlaylistSearch = app;
