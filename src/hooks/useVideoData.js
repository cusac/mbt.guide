// @flow

import * as React from 'react';
import * as luxon from 'luxon';
import * as db from 'services/db';

const YOUTUBE_API_KEY = 'AIzaSyBTOgZacvh2HpWGO-8Fbd7dUOvMJvf-l_o';

/**
 * Returns stored data about the video and an async function to update it.
 */
export default function useVideoData({
  ytVideoId,
  fallback = false,
}: {
  ytVideoId: string,
  fallback?: boolean,
}) {
  const [data, setData] = React.useState((null: ?db.Video));
  const [dataId, setDataId] = React.useState((null: ?string));
  const [error, setError] = React.useState();

  if (error) {
    throw error;
  }

  async function update(updates: Object) {
    try {
      const newData = { ...data, ...updates };
      if (dataId != null) {
        await db.videos.doc(dataId).update(updates);
      } else {
        const docRef = await db.videos.add(newData);
        setDataId(docRef.id);
      }
      setData(newData);
    } catch (e) {
      console.error(`Error saving video`, e);
    }
  }

  React.useEffect(() => {
    (async () => {
      try {
        const querySnapshot = await db.videos.where('id', '==', ytVideoId).get();
        if (querySnapshot.size === 1) {
          const [doc] = querySnapshot.docs;
          setData(doc.data());
          setDataId(doc.id);
          return;
        }

        if (!fallback) {
          throw new Error(`No data for video ${ytVideoId}`);
        }

        const ytResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${ytVideoId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
        );

        const ytData = await ytResponse.json();
        const [ytVideo] = ytData.items;

        if (!ytVideo) {
          throw new Error(`Missing YouTube Video with id ${ytVideoId}`);
        }

        const duration = luxon.Duration.fromISO(ytVideo.contentDetails.duration).as('seconds');

        await update({
          id: ytVideoId,
          duration,
          segments: [
            {
              title: 'First segment',
              end: duration,
            },
          ],
          youtube: ytVideo, // cache all YouTube data for future use
        });
      } catch (e) {
        setError(e);
      }
    })();
  }, [ytVideoId]);

  return [data, update];
}
