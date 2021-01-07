import { httpClient as http } from '../services';
import {
  AxiosResponseGeneric,
  isPlaylistType,
  isSearchType,
  PlaylistYTVideo,
  SearchYTVideo,
  VideoListYTVideo,
  YTResult,
  YTVideo,
} from '../types';

export async function youtubeCall<T>({
  endpoint,
  params,
}: {
  endpoint: string;
  params: any;
}): Promise<AxiosResponseGeneric<YTResult<T>>> {
  return http.post<YTResult<T>>('/youtube', { endpoint, params });
}

export function toYTVid(orig: PlaylistYTVideo | SearchYTVideo | VideoListYTVideo): YTVideo {
  if (isSearchType(orig)) {
    return {
      id: orig.id.videoId,
      snippet: orig.snippet,
    };
  } else if (isPlaylistType(orig)) {
    return {
      id: orig.snippet.resourceId.videoId,
      snippet: orig.snippet,
    };
  } else {
    return {
      id: orig.id,
      snippet: orig.snippet,
    };
  }
}
