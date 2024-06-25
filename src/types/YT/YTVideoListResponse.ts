export interface YouTubeVideoListResponse {
  kind: string;
  etag: string;
  items: YouTubeVideo[];
  pageInfo: PageInfo;
}

interface YouTubeVideo {
  kind: string;
  etag: string;
  id: string;
  contentDetails: ContentDetails;
}

interface ContentDetails {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  contentRating: ContentRating;
  projection: string;
}

interface ContentRating {}

interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
