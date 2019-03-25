// @flow

import * as React from 'react';
import * as db from 'services/db';

import { type Video } from 'components/YouTubePlayer';

/**
 * Returns stored data about the video and an async function to update it.
 *
 * TODO cache YT data from YouTube API, so only videoId is required as argument
 */
export default function useVideoData(video: ?Video) {
  const [data, setData] = React.useState((null: ?db.Video));
  const [dataId, setDataId] = React.useState((null: ?string));

  React.useEffect(() => {
    (async () => {
      if (!video) {
        return;
      }
      const { id, duration } = video;
      try {
        const querySnapshot = await db.videos.where('id', '==', id).get();
        if (querySnapshot.size === 1) {
          const [doc] = querySnapshot.docs;
          setData(doc.data());
          setDataId(doc.id);
          return;
        }
        // default new document
        setData({
          id,
          segments: [
            {
              title: 'First segment',
              end: duration, // last segment's end is the video duration
            },
          ],
        });
      } catch (e) {
        console.error(`Error loading data for video ${video.id}`, e);
      }
    })();
  }, [video && video.id]);

  async function update(updates: Object) {
    try {
      const newData = { ...data, ...updates };
      if (dataId != null) {
        await db.videos.doc(dataId).update(newData);
      } else {
        const docRef = await db.videos.add(newData);
        setDataId(docRef.id);
      }
      setData(newData);
    } catch (e) {
      console.error(`Error saving video`, e);
    }
  }

  return [data, update];
}
