interface Image {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge";
}

export interface Track {
  name: string;
  artist: string;
  url: string;
  streamable: string; // The "FIXME" value suggests this should be further clarified.
  listeners: string; // This is a string representation of a number.
  image: Image[];
  mbid: string;
}
