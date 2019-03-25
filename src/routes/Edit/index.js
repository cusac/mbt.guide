// @flow

import * as React from 'react';

import * as db from 'services/db';
import YouTubePlayer, { type Video } from 'components/YouTubePlayer';
import VideoSplitter from './VideoSplitter';

const segmentColors = ['orange', 'green', 'yellow', 'blue', 'red', 'purple'];
const minSegmentDuration = 5;

const Edit = ({ videoId }: { videoId: string }) => {
  const [video, setVideo] = React.useState((null: ?Video));
  const [data, setData] = React.useState((null: ?db.Video));
  const [dataId, setDataId] = React.useState((null: ?string));
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    if (!video) {
      return;
    }
    (async () => {
      try {
        const querySnapshot = await db.videos.where('id', '==', videoId).get();
        if (querySnapshot.size === 1) {
          const [doc] = querySnapshot.docs;
          setData(doc.data());
          setDataId(doc.id);
          return;
        }
        setData({
          // default new document
          id: videoId,
          segments: [
            {
              title: 'First segment',
              end: video.duration, // last segment's end is the video duration
            },
          ],
        });
      } catch (e) {
        console.error(`Error loading data for video ${video.id}`, e);
      }
    })();
  }, [video && video.id]);

  return (
    <div>
      <YouTubePlayer onReady={setVideo} {...{ videoId, seconds }} />
      {video && data ? (
        <VideoSplitter
          onSave={async segments => {
            try {
              if (dataId) {
                await db.videos.doc(dataId).update({ segments });
              } else {
                const docRef = await db.videos.add({
                  ...data,
                  segments,
                });
                setDataId(docRef.id);
              }
            } catch (e) {
              console.error(`Error saving video`, e);
            }
          }}
          {...{ video, data, setSeconds, segmentColors, minSegmentDuration }}
        />
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default Edit;
