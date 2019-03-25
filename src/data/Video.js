// @flow

import invariant from 'invariant';
import * as db from 'services/db';
import * as luxon from 'luxon';

const YOUTUBE_API_KEY = 'AIzaSyBTOgZacvh2HpWGO-8Fbd7dUOvMJvf-l_o';

type QuerySnapshots = $Shape<{|
  videos: Object,
  videoSegments: Object,
|}>;

export default class Video {
  static subscribe(
    { ytVideoId, fallback = false }: {| ytVideoId: string, fallback?: boolean |},
    onChange: Video => void,
    onError: any => void
  ): () => void {
    let querySnapshots = {};
    const cb = (qs: QuerySnapshots) => {
      const { videos, videoSegments } = Object.assign(querySnapshots, qs);
      if (!videos || !videoSegments) {
        return; // still loading data
      }

      if (!videos.empty && !videoSegments.empty) {
        // TODO test errors
        onChange(new Video(querySnapshots));
        return;
      }

      (async () => {
        try {
          if (!fallback) {
            throw new Error(`No data for video ${ytVideoId}`);
          }

          const ytResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${ytVideoId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
          );
          const [ytVideo] = (await ytResponse.json()).items;
          if (!ytVideo) {
            throw new Error(`Missing YouTube Video with id ${ytVideoId}`);
          }
          const duration = luxon.Duration.fromISO(ytVideo.contentDetails.duration).as('seconds');
          console.log('duration', duration);

          invariant(videos.empty && videoSegments.empty, 'expected no prior data');
          querySnapshots = {}; // mark snapshots as still loading
          await db.default
            .batch()
            .set(
              db.videos.doc(),
              ({
                id: ytVideoId,
                duration,
                youtube: ytVideo,
              }: db.Video)
            )
            .set(
              db.videoSegments.doc(),
              ({
                videoId: ytVideoId,
                index: 0,
                title: 'Segment title',
                start: 0,
                end: duration,
              }: db.VideoSegment)
            )
            .commit();
        } catch (e) {
          onError(e);
        }
      })();
    };
    const unsubs = [
      db.videos.where('id', '==', ytVideoId).onSnapshot(videos => cb({ videos })),
      db.videoSegments
        .where('videoId', '==', ytVideoId)
        .onSnapshot(videoSegments => cb({ videoSegments })),
    ];
    return () => unsubs.forEach(fn => fn());
  }

  constructor(querySnapshots: QuerySnapshots) {
    this._querySnapshots = querySnapshots;

    const { videos, videoSegments } = querySnapshots;
    invariant(videos && videoSegments, 'videos and videoSegments snapshots required');
    invariant(videos.size === 1 && !videoSegments.empty, 'expected one video with segments');

    this.data = videos.docs[0].data();
    this.segments = videoSegments.docs.map(doc => doc.data());
  }

  _querySnapshots: QuerySnapshots;

  +data: db.Video;
  +segments: Array<db.VideoSegment>;

  async updateSegments(newSegments: Array<db.VideoSegment>): Promise<void> {
    console.log('updateSegments', newSegments);
    // TODO#1 check that this.segments is ordered by index
    // TODO#2 check that newSegments is ordered by index
    // TODO#3 create bulk with matching updates
    // TODO#4 if newSegments is longer add new ones, if shorter remove objects
  }
}
