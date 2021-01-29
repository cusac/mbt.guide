import {
  AxiosResponseGeneric,
  SearchYTVideo,
  Segment,
  Video,
  VideoListYTVideo,
  YTResult,
} from 'types';
import { httpClient as http } from '../services';
import repository from './repository.service';
import { AxiosPromise } from 'axios';
import { youtubeCall } from './youtube.service';

export const createVideoCall = ({
  youtube,
  duration,
  ytId,
}: {
  youtube: VideoListYTVideo;
  duration: number;
  ytId: string;
}): Promise<Video> => {
  return repository.video.create({
    youtube,
    duration,
    ytId,
  });
};

export const updateSegmentsCall = ({
  videoId,
  segments,
}: {
  videoId: string;
  segments: Partial<Segment>[];
}): Promise<AxiosResponseGeneric<Segment[]>> => {
  return http.post<Segment[]>('/update-video-segments', { videoId, segments });
};

export const searchSegmentsCall = ({ term }: { term: string }): AxiosPromise<Segment[]> => {
  return http.get('/search/segments', { term });
};

export const searchVideosCall = ({
  term,
}: {
  term: string;
}): Promise<AxiosResponseGeneric<YTResult<SearchYTVideo>>> => {
  return youtubeCall<SearchYTVideo>({
    endpoint: 'search',
    params: {
      q: term,
    },
  });
};
