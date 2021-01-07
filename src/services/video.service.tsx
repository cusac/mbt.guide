import { AxiosResponseGeneric, Segment, Video, VideoListYTVideo } from 'types';
import { httpClient as http } from '../services';
import repository from './repository.service';

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
