// @flow

import * as store from '../store';
import * as luxon from 'luxon';
import * as services from 'services';

import { httpClient as http, firebaseAuth } from '../services';

export type VideoSegment = {|
  _id: string,
  segmentId: string,
  owner: string,
  ownerEmail: string,
  videoId: string,
  title: string,
  start: number,
  end: number, // seconds, last segment's end is the video duration
  tags: string[],
  description: string,
  pristine: boolean, // used to indicate the segment has changes that need saving
|};

export type Video = {|
  _id: string,
  ytId: string,
  duration: number, // video length in seconds
  youtube: Object, // cached information about the video from YouTube
  segments: [VideoSegment],
|};

const YOUTUBE_API_KEY = 'AIzaSyBTOgZacvh2HpWGO-8Fbd7dUOvMJvf-l_o';

const internals = {};

internals.create = async ({ videoId, setVideo }: { videoId: string, setVideo: Video => void }) => {
  const ytResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
  );
  const [ytVideo] = (await ytResponse.json()).items;

  if (!ytVideo) {
    throw new Error(`Missing YouTube Video with id ${videoId}`);
  }
  const duration = luxon.Duration.fromISO(ytVideo.contentDetails.duration).as('seconds');

  try {
    const video = await services.repository.video.create({
      youtube: ytVideo,
      duration: duration,
      ytId: videoId,
    });

    setVideo && setVideo(video);

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
  return http.post('/update-video-segments', { videoId, segments }).catch(error => {
    console.error('authService.login-error:\n', error);
    throw error;
  });
};

export default internals;
