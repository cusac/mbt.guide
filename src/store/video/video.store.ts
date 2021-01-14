import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as luxon from 'luxon';
import { AsyncAppThunk } from 'store';
import {
  createVideoCall,
  searchSegmentsCall,
  toYTVid,
  updateSegmentsCall,
  youtubeCall,
} from '../../services';
import {
  assertModelArrayType,
  AxiosErrorData,
  SearchYTVideo,
  Segment,
  SegmentTag,
  Video,
  VideoListYTVideo,
  YTVideo,
} from '../../types';
import captureAndLog from '../../utils/captureAndLog';
import { parseError } from '../utils';
import { AxiosResponse } from 'axios';

//#region Types

export type VideoStoreAction =
  | 'createVideo'
  | 'updateSegments'
  | 'searchSegments'
  | 'searchYTVideos';

export type SearchType = 'segment' | 'ytVideo';

export type VideoState = {
  lastViewedSegmentId: string;
  lastViewedVideoId: string;
  searchSegmentsResult: Segment[];
  searchYTVideosResult: YTVideo[];
  searchType: SearchType;
  hasSearched: boolean;
  loadingSegments: boolean;
  loadingVideos: boolean;
  errors: Record<VideoStoreAction, Error | AxiosErrorData | undefined>;
};

//#endregion

const channelId = 'UCYwlraEwuFB4ZqASowjoM0g';

//#region Reducers
/**
 * Reducers should only contain logic to update state. All other store logic should be moved to the actions/thunks.
 */

const initalVideoState: VideoState = {
  errors: {} as any,
  searchSegmentsResult: [],
  searchYTVideosResult: [],
  searchType: 'segment',
  hasSearched: false,
  loadingSegments: false,
  loadingVideos: false,
  lastViewedSegmentId: '',
  lastViewedVideoId: '',
};

export const videoStore = createSlice({
  name: 'video',
  initialState: initalVideoState,
  reducers: {
    setLastViewedSegmentId(state, { payload }: PayloadAction<{ lastViewedSegmentId: string }>) {
      const { lastViewedSegmentId } = payload;
      state.lastViewedSegmentId = lastViewedSegmentId;
    },
    setLastViewedVideoId(state, { payload }: PayloadAction<{ lastViewedVideoId: string }>) {
      const { lastViewedVideoId } = payload;
      state.lastViewedVideoId = lastViewedVideoId;
    },
    setSearchSegmentsResult(
      state,
      { payload }: PayloadAction<{ searchSegmentsResult: Segment[] }>
    ) {
      const { searchSegmentsResult } = payload;
      state.searchSegmentsResult = searchSegmentsResult;
    },
    setSearchYTVideosResult(
      state,
      { payload }: PayloadAction<{ searchYTVideosResult: YTVideo[] }>
    ) {
      const { searchYTVideosResult } = payload;
      state.searchYTVideosResult = searchYTVideosResult;
    },
    setSearchType(state, { payload }: PayloadAction<{ searchType: SearchType }>) {
      const { searchType } = payload;
      state.searchType = searchType;
    },
    setHasSearched(state, { payload }: PayloadAction<{ hasSearched: boolean }>) {
      const { hasSearched } = payload;
      state.hasSearched = hasSearched;
    },
    setLoadingSegments(state, { payload }: PayloadAction<{ loadingSegments: boolean }>) {
      const { loadingSegments } = payload;
      state.loadingSegments = loadingSegments;
    },
    setLoadingVideos(state, { payload }: PayloadAction<{ loadingVideos: boolean }>) {
      const { loadingVideos } = payload;
      state.loadingVideos = loadingVideos;
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

export const {
  setLastViewedSegmentId,
  setLastViewedVideoId,
  setSearchSegmentsResult,
  setSearchYTVideosResult,
  setSearchType,
  setHasSearched,
  setLoadingSegments,
  setLoadingVideos,
} = videoStore.actions;
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

//#region searchSegments
export const searchSegments = ({ term }: { term: string }): AsyncAppThunk<Segment[]> => async (
  dispatch,
  getState
) => {
  try {
    dispatch(setLoadingSegments({ loadingSegments: true }));
    const { data } = await searchSegmentsCall({ term });
    dispatch(searchSegmentsSuccess(data));
    return data;
  } catch (err) {
    dispatch(searchSegmentsFailure(err));
    throw err;
  } finally {
    dispatch(setLoadingSegments({ loadingSegments: false }));
  }
};

export const searchSegmentsSuccess = (searchSegmentsResult: Segment[]): AsyncAppThunk => async (
  dispatch,
  getState
) => {
  dispatch(setSearchSegmentsResult({ searchSegmentsResult }));
  dispatch(clearError({ action: 'searchSegments' }));
};

export const searchSegmentsFailure = (err: Error | AxiosResponse): AsyncAppThunk => async (
  dispatch,
  getState
) => {
  captureAndLog({ file: 'videoStore', method: 'searchSegments', err });
  dispatch(setError({ action: 'searchSegments', err: parseError(err) }));
};
//#endregion

//#region searchYTVideos
export const searchYTVideos = ({ term }: { term: string }): AsyncAppThunk<YTVideo[]> => async (
  dispatch,
  getState
) => {
  try {
    dispatch(setLoadingVideos({ loadingVideos: true }));
    const { data } = await youtubeCall<SearchYTVideo>({
      endpoint: 'search',
      params: {
        q: term,
      },
    });

    // Filter out any videos that don't belong to the MBT channel
    const ytVids = data.items.filter(v => v.snippet.channelId === channelId).map(toYTVid);
    dispatch(searchVideosSuccess(ytVids));
    return ytVids;
  } catch (err) {
    dispatch(searchVideosFailure(err));
    throw err;
  } finally {
    dispatch(setLoadingVideos({ loadingVideos: false }));
  }
};

export const searchVideosSuccess = (searchYTVideosResult: YTVideo[]): AsyncAppThunk => async (
  dispatch,
  getState
) => {
  dispatch(setHasSearched({ hasSearched: true }));
  dispatch(setSearchYTVideosResult({ searchYTVideosResult }));
  dispatch(clearError({ action: 'searchYTVideos' }));
};

export const searchVideosFailure = (err: Error | AxiosResponse): AsyncAppThunk => async (
  dispatch,
  getState
) => {
  captureAndLog({ file: 'videoStore', method: 'searchYTVideos', err });
  dispatch(setError({ action: 'searchYTVideos', err: parseError(err) }));
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
