export interface Song {
  name: string;
  artist: string;
  thumbnail: {
    sm: string;
    md: string;
    lg: string;
  };
  duration: string;
  url: string;
}
