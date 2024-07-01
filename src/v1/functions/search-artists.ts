import axios from "axios";
import { Artist, GeoArtist } from "../types/LAST.FM";

type GeoArtistSearchResponse = {
  topartists: {
    artist: GeoArtist[];
  };
};

type ArtistSearchResponse = {
  results: {
    artistmatches: {
      artist: Artist[];
    };
  };
};

export async function getArtistsFromLocation(
  ipAddr: string,
  apiKey: string
): Promise<GeoArtist[]> {
  const { data } = await axios.get(`http://ip-api.com/json/${ipAddr}`);
  const country: string = (data.country || "sri lanka")?.toLowerCase();

  try {
    const { data: artistData } = await axios.get<GeoArtistSearchResponse>(
      `http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${country}&api_key=${apiKey}&format=json`
    );

    return artistData.topartists.artist;
  } catch (error) {
    return [];
  }
}

export async function searchArtists(
  name: string,
  apiKey: string
): Promise<Artist[] | null> {
  try {
    const { data } = await axios.get<ArtistSearchResponse>(
      `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${name}&api_key=${apiKey}&format=json`
    );

    return data.results.artistmatches.artist;
  } catch (error) {
    return null;
  }
}

export async function getPopularArtists(
  apiKey: string
): Promise<Artist[] | null> {
  try {
    const { data } = await axios.get(
      `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json`
    );

    return data.artists.artist;
  } catch (error) {
    return null;
  }
}
