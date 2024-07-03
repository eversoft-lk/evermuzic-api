import axios from "axios";
import { Track } from "../types/LAST.FM";

interface TrackSearchResponse {
  results: {
    "openSearch:Query": {
      "#text": string;
      role: string;
      searchTerms: string;
      startPage: string;
    };
    "openSearch:totalResults": string;
    "openSearch:startIndex": string;
    "openSearch:itemsPerPage": string;
    trackmatches: {
      track: Track[];
    };
    "@attr": {
      for: string;
    };
  };
}

export async function searchSongsFromLastFM(
  name: string,
  apiKey: string
): Promise<Track[] | null> {
  let songs;
  try {
    const { data: artistData } = await axios.get<TrackSearchResponse>(
      `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${name}&api_key=${apiKey}&format=json`
    );

    songs = artistData.results.trackmatches.track;
  } catch (error) {
    console.error(error);
    return null;
  }

  return songs;
}

export async function getTrendingSongs(apiKey: string) {
  const { data } = await axios.get(
    `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json`
  );

  return data.tracks.track;
}
