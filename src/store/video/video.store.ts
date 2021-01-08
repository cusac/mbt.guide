import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as luxon from 'luxon';
import { AsyncAppThunk } from 'store';
import { createVideoCall, updateSegmentsCall, youtubeCall } from '../../services';
import {
  assertModelArrayType,
  AxiosErrorData,
  Segment,
  SegmentTag,
  Video,
  VideoListYTVideo,
} from '../../types';
import captureAndLog from '../../utils/captureAndLog';
import { parseError } from '../utils';

//#region Types

export type VideoStoreAction = 'createVideo' | 'updateSegments';

export type VideoState = {
  lastViewedSegmentId: string;
  errors: Record<VideoStoreAction, Error | AxiosErrorData | undefined>;
};

//#endregion

//#region Reducers
/**
 * Reducers should only contain logic to update state. All other store logic should be moved to the actions/thunks.
 */

const initalVideoState: VideoState = {
  errors: {} as any,
  lastViewedSegmentId: '',
};

export const videoStore = createSlice({
  name: 'video',
  initialState: initalVideoState,
  reducers: {
    setLastViewedSegmentId(state, { payload }: PayloadAction<{ lastViewedSegmentId: string }>) {
      const { lastViewedSegmentId } = payload;
      state.lastViewedSegmentId = lastViewedSegmentId;
    },
    setError(
      state,
      { payload }: PayloadAction<{ action: VideoStoreAction; err: Error | AxiosErrorData }>
    ) {
      const { action, err } = payload;
      state.errors[action] = err;
    },
    clearError(state, { payload }: PayloadAction<{ action: VideoStoreAction }>) {
      const { action } = payload;
      state.errors[action] = undefined;
    },
  },
});

export const { setLastViewedSegmentId } = videoStore.actions;
const { setError, clearError } = videoStore.actions;

//#region Async Actions (Thunks)
/**
 * These actions contain the main logic to process and fetch state.
 *
 * Most async actions will be split into three parts: the call action, a success action, and a failure action.
 */

//#region createVideo
export const createVideo = ({ videoId }: { videoId: string }): AsyncAppThunk<Video> => async (
  dispatch,
  getState
) => {
  try {
    const { data } = await youtubeCall<VideoListYTVideo>({
      endpoint: 'videos',
      params: {
        id: videoId,
        part: 'snippet,contentDetails',
      },
    });

    const ytVideo = data.items[0];

    if (!ytVideo) {
      throw new Error(`Missing YouTube Video with id ${videoId}`);
    }

    let duration;

    if (!ytVideo.contentDetails) {
      throw new Error(`Missing contentDetails for YouTube Video with id ${videoId}`);
    } else {
      duration = luxon.Duration.fromISO(ytVideo.contentDetails.duration).as('seconds');
    }

    const video = await createVideoCall({
      youtube: ytVideo,
      duration: duration,
      ytId: videoId,
    });

    dispatch(clearError({ action: 'createVideo' }));

    return video;
  } catch (err) {
    captureAndLog({ file: 'videoStore', method: 'createVideo', err });
    dispatch(setError({ action: 'createVideo', err: parseError(err) }));
    throw err;
  }
};

//#endregion

//#region updateSegments
export const updateSegments = ({
  videoId,
  segments,
}: {
  videoId: string;
  segments: Partial<Segment>[];
}): AsyncAppThunk<Segment[]> => async (dispatch, getState) => {
  try {
    segments = segments.map(formatSegmentForUpdate);
    const { data } = await updateSegmentsCall({ videoId, segments });
    dispatch(clearError({ action: 'updateSegments' }));
    return data;
  } catch (err) {
    captureAndLog({ file: 'videoStore', method: 'updateSegments', err });
    dispatch(setError({ action: 'updateSegments', err: parseError(err) }));
    throw err;
  }
};
//#endregion

//#endregion

//#region Synchronous Actions (Thunks)
/**
 * These actions contain only synchronous logic
 */

//#endregion

//#region Utilities

function formatSegmentForUpdate(segment: Partial<Segment>): Partial<Segment> {
  const { segmentId, video, start, end, title, description, tags, pristine } = segment;
  if (assertModelArrayType<SegmentTag>(tags, 'SegmentTag')) {
    return {
      segmentId,
      video,
      start,
      end,
      title,
      description,
      tags: tags.map(formatTagForUpdate),
      pristine: pristine === false ? false : true,
    };
  } else {
    throw new Error('Tags to update are incorrect format.');
  }
}

function formatTagForUpdate(segmentTag: SegmentTag): SegmentTag {
  const { tag, rank } = segmentTag;
  const { name } = tag;
  return {
    tag: {
      name,
    },
    rank,
  };
}

//#endregion
