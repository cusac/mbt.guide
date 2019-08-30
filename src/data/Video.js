// @flow

import * as db from 'services/db';
import * as luxon from 'luxon';
import * as services from 'services';
import invariant from 'invariant';

const YOUTUBE_API_KEY = 'AIzaSyBTOgZacvh2HpWGO-8Fbd7dUOvMJvf-l_o';

type DbSnapshot = $Shape<{|
  videos: Array<db.Video>,
  videoSegments: Array<db.VideoSegment>,
|}>;

export default class Video {
  /**
   * Creates data for video with given id based on YouTube content
   */
  static async create(id: string): Promise<void> {
    return db.default.runTransaction(async transaction => {
      const videoRef = db.videos.doc(id);
      const videoDoc = await transaction.get(videoRef);

      if (videoDoc.exists) {
        transaction.update(videoRef, {}); // dummy update as required by transactions
        return; // nothing to do here
      }

      const ytResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
      );
      const [ytVideo] = (await ytResponse.json()).items;
      if (!ytVideo) {
        throw new Error(`Missing YouTube Video with id ${id}`);
      }
      const duration = luxon.Duration.fromISO(ytVideo.contentDetails.duration).as('seconds');

      const user = services.auth.currentUser;

      if (!user) {
        throw new Error(`Must be logged in to create a segment`);
      }

      transaction.set(
        videoRef,
        ({
          id,
          duration,
          youtube: ytVideo,
        }: db.Video)
      );
    });
  }

  static subscribe(id: string, onChange: Video => void, onError: any => void): () => void {
    const dbSnapshot = {};
    const cb = (dbs: DbSnapshot) => {
      const { videos, videoSegments } = Object.assign(dbSnapshot, dbs);
      if (!videos || !videoSegments) {
        return; // still loading data
      }

      try {
        onChange(new Video(dbSnapshot));
      } catch (e) {
        onError(e);
      }
    };
    const unsubs = [
      db.videos.doc(id).onSnapshot(video => cb({ videos: [video.data()] }), onError),
      db.videoSegments
        .where('videoId', '==', id)
        .onSnapshot(
          videoSegments => cb({ videoSegments: videoSegments.docs.map(doc => doc.data()) }),
          onError
        ),
    ];
    return () => unsubs.forEach(fn => fn());
  }

  static async getSegments(): Promise<Array<db.VideoSegment>> {
    const videoSegments = await db.videoSegments.get();
    return videoSegments.docs.map(doc => doc.data());
  }

  constructor(dbSnapshot: DbSnapshot) {
    this._dbSnapshot = dbSnapshot;

    const { videos, videoSegments } = dbSnapshot;
    invariant(videos && videoSegments, 'videos and videoSegments snapshots required');

    this.data = videos[0];
    this.segments = videoSegments;
  }

  _dbSnapshot: DbSnapshot;

  +data: db.Video;
  +segments: Array<db.VideoSegment>;

  async updateSegments(
    segments: Array<db.VideoSegment>,
    setSegments: (Array<db.VideoSegment>) => void
  ): Promise<void> {
    const updatedSegments = segments.filter(s => !s.pristine);
    segments = segments.map(s => ({ ...s, pristine: true }));
    setSegments(segments);

    const batch = db.default.batch();
    // Save updates
    updatedSegments.forEach(s => batch.set(db.videoSegments.doc(s.id), s));

    // Persist deletions
    let deletedSegments = this.segments.filter(
      s => segments.find(ss => ss.id === s.id) === undefined
    );

    deletedSegments.forEach(s => batch.delete(db.videoSegments.doc(s.id)));
    await batch.commit();
  }
}
