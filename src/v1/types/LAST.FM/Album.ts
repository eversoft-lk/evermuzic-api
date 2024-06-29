interface Image {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge";
}

interface Album {
  name: string;
  artist: string;
  url: string;
  image: Image[];
  streamable: string;
  mbid: string;
}

interface AlbumMatches {
  album: Album[];
}

interface OpenSearchQuery {
  "#text": string;
  role: string;
  searchTerms: string;
  startPage: string;
}

interface Results {
  "opensearch:Query": OpenSearchQuery;
  "opensearch:totalResults": string;
  "opensearch:startIndex": string;
  "opensearch:itemsPerPage": string;
  albummatches: AlbumMatches;
}

export interface AlbumSearchResponse {
  results: Results;
}
