import { Hono } from "hono";
import { Bindings } from "../types";
import { verify } from "hono/jwt";
import { PrismaClient, playlist } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { v4 as uuid } from "uuid";

const app = new Hono<{ Bindings: Bindings }>();
type User = {
  id: string;
  name: string;
  username: string;
  email: string;
};

app.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const token = c.req.header("Authorization");

  if (token == null) {
    return c.json({
      status: "error",
      message: "Token is not provided!",
    });
  }

  try {
    const payload = await verify(token, c.env.ACCESS_TOKEN_SECRET);
    const playlists = await prisma.favorite.findMany({
      where: {
        user_id: payload.id as string,
      },
    });

    return c.json({
      status: "success",
      playlists,
    });
  } catch (error) {
    return c.json({
      status: "error",
      message: "Invalid Access Token",
      error,
    });
  }
});

app.post("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const token = c.req.header("Authorization");

  if (token == null) {
    return c.json({
      status: "error",
      message: "Token is not provided!",
    });
  }

  try {
    const payload = await verify(token, c.env.ACCESS_TOKEN_SECRET);
    const req = await c.req.json<{
      playlist_id: string;
      playlist_type: string;
      image: string;
      title: string;
      description: string;
    }>();

    const isExist = await prisma.favorite.findFirst({
      where: {
        user_id: payload.id as string,
        playlist_id: req.playlist_id,
        playlist_type: parseInt(req.playlist_type),
      },
    });
    if (isExist) {
      await prisma.favorite.delete({
        where: {
          id: isExist.id,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          title: req.title,
          description: req.description,
          image: req.image,
          user_id: payload.id as string,
          playlist_id: req.playlist_id,
          playlist_type: parseInt(req.playlist_type),
          created_at: new Date(),
        },
      });
    }

    return c.json({
      status: "success",
    });
  } catch (error) {
    return c.json({
      status: "error",
      message: "Invalid Access Token",
      error,
    });
  }
});

export const Favorite = app;
