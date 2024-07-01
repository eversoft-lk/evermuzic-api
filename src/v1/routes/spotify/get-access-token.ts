import { Hono } from "hono";
import { Bindings } from "../../types";
import axios from "axios";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/get-access-token", async (c) => {
  try {
    const clientId = c.env.SPOTIFY_CLIENT_ID;
    const clientSecret = c.env.SPOTIFY_CLIENT_SECRET;

    // Encode client ID and client secret in Base64
    const authString = `${clientId}:${clientSecret}`;
    const base64AuthString = btoa(authString);

    // Get access token
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "client_credentials",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64AuthString}`,
        },
      }
    );

    return c.json(response.data);
  } catch (error) {
    return c.json({ error: error });
  }
});

export const Spotify = app;
