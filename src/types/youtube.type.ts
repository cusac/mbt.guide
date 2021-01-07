export enum YTResponseTypes {
  playlist = 'youtube#playlistItem',
  search = 'youtube#searchResult',
  video = 'youtube#video',
}

export type VideoListYTVideo = {
  kind: YTResponseTypes.video;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    tags: string[];
    categoryId: number;
    liveBroadcastContent: string;
    defaultAudioLanguage: string;
  };
  contentDetails?: {
    duration: string;
    dimension: string;
    definition: string;
    caption: boolean;
    licensedContent: boolean;
    contentRating: any;
    projection: string;
  };
};

export type PlaylistYTVideo = {
  kind: YTResponseTypes.playlist;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
};

export type SearchYTVideo = {
  kind: YTResponseTypes.search;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
};

export type YTResult<T> = {
  kind: string;
  etag: string;
  nextPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: T[];
};

export type YTVideo = {
  id: string;
  snippet: PlaylistYTVideo['snippet'] | SearchYTVideo['snippet'] | VideoListYTVideo['snippet'];
};

export function isSearchType(obj: any): obj is SearchYTVideo {
  return obj !== undefined && (obj as SearchYTVideo).kind === YTResponseTypes.search;
}

export function isPlaylistType(obj: any): obj is PlaylistYTVideo {
  return obj !== undefined && (obj as PlaylistYTVideo).kind === YTResponseTypes.playlist;
}

export function isVideoListYTVideoType(obj: any): obj is VideoListYTVideo {
  return obj !== undefined && (obj as VideoListYTVideo).kind === YTResponseTypes.video;
}
