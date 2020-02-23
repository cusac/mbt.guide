// @flow

import * as store from '../store';
import * as luxon from 'luxon';
import * as services from 'services';

import { httpClient as http } from '../services';

export type Tag = {|
  _id?: string,
  name: string,
|};

export type TagEmbed = {|
  tag: Tag,
  rank: number,
|};

export type VideoSegment = {|
  _id?: string,
  segmentId: string,
  owner: string,
  ownerEmail: string,
  video: string,
  title: string,
  start: number,
  end: number, // seconds, last segment's end is the video duration
  tags: TagEmbed[],
  description: string,
  pristine: boolean, // used to indicate the segment has changes that need saving
|};

export type Video = {|
  _id?: string,
  ytId: string,
  duration: number, // video length in seconds
  youtube: Object, // cached information about the video from YouTube
  segments: [VideoSegment],
|};

const internals = {};

internals.create = async ({ videoId }: { videoId: string }) => {
  try {
    const [ytVideo] = await services.youtube({
      endpoint: 'videos',
      params: {
        id: videoId,
        part: 'snippet,contentDetails',
      },
    });

    if (!ytVideo) {
      throw new Error(`Missing YouTube Video with id ${videoId}`);
    }
    const duration = luxon.Duration.fromISO(ytVideo.contentDetails.duration).as('seconds');

    const video = await services.repository.video.create({
      youtube: ytVideo,
      duration: duration,
      ytId: videoId,
    });

    return video;
  } catch (error) {
    console.error('videoService.create-error:\n', error);
    throw error;
  }
};

internals.updateVideoSegments = async ({
  videoId,
  segments,
}: {
  videoId: string,
  segments: VideoSegment[],
}) => {
  segments = segments.map(filterSegmentForUpdate);
  return http.post('/update-video-segments', { videoId, segments }).catch(error => {
    console.error('videoService.updateVideoSegments-error:\n', error);
    throw error;
  });
};

function filterSegmentForUpdate(segment: VideoSegment): any {
  const { segmentId, video, start, end, title, description, tags, pristine } = segment;
  return {
    segmentId,
    video,
    start,
    end,
    title,
    description,
    tags,
    pristine: pristine === false ? false : true,
  };
}

export default internals;
