interface Image {
  "#text": string; // URL of the image
  size: "small" | "medium" | "large" | "extralarge" | "mega";
}

export interface Artist {
  name: string;
  url: string;
  streamable: string; // Likely a boolean string ("0" or "1")
  image: Image[];
  "@attr": {
    rank: string; // Likely a number string
  };
}
