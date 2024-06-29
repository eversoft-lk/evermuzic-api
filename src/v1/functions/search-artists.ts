import axios from "axios";
import { Artist } from "../types/LAST.FM";

type ArtistGeoSearchResponse = {
  topartists: {
    artist: Artist[];
  };
};

export async function getArtistsFromLocation(
  ipAddr: string,
  apiKey: string
): Promise<Artist[]> {
  const { data } = await axios.get(`http://ip-api.com/json/${ipAddr}`);
  const country: string = (data.country || "sri lanka")?.toLowerCase();

  const { data: artistData } = await axios.get<ArtistGeoSearchResponse>(
    `http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${country}&api_key=${apiKey}&format=json`
  );

  return artistData.topartists.artist;
}

export async function searchArtists(name: string, apiKey: string) {}
