interface Image {
  "#text": string; // URL of the image
  size: "small" | "medium" | "large" | "extralarge" | "mega";
}

export interface GeoArtist {
  name: string;
  url: string;
  streamable: string; // Likely a boolean string ("0" or "1")
  image: Image[];
  "@attr": {
    rank: string; // Likely a number string
  };
}

export interface Artist {
  name: string;
  listeners: string; // This is a string representation of a number.
  mbid: string;
  url: string;
  streamable: string; // This seems to be a numeric string in this context.
  image: Image[];
}
