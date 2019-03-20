// @flow
/* global YT */

import * as React from 'react';
import nullthrows from 'nullthrows';

export type Video = {|
  duration: number,
|};

const YouTubePlayer = ({ onReady, seconds }: { onReady: Video => void, seconds: number }) => {
  const [player, setPlayer] = React.useState(undefined);

  const ref = React.createRef();
  React.useEffect(
    () =>
      ytReady(() => {
        const player = new YT.Player(ref.current, {
          height: 360,
          width: 640,
          videoId: 'k0aLELfo9ws',
          playerVars: {
            controls: 0, // disable video player controls
            disablekb: 1, // disable keyboard controls
            fs: 0, // disable full screen mode
            modestbranding: 1,
          },
          events: {
            onReady: () => {
              onReady({
                duration: player.getDuration(),
              });

              setPlayer(player);

              if (seconds !== 0) {
                player.seekTo(seconds, true);
              }
            },
          },
        });
      }),
    []
  );

  React.useEffect(() => {
    if (!player) {
      return;
    }

    player.seekTo(seconds, true);
  }, [seconds]);

  return <div ref={ref} />;
};

YouTubePlayer.defaultProps = {
  onReady: () => {},
  seconds: 0,
};

export default YouTubePlayer;

const ytScript = document.createElement('script');
ytScript.src = 'https://www.youtube.com/iframe_api';

const firstScriptTag = nullthrows(document.getElementsByTagName('script')[0]);
nullthrows(firstScriptTag.parentNode).insertBefore(ytScript, firstScriptTag);

let fnQueue: ?Array<() => void> = []; // functions to be called once YT API is ready

// queues function until YouTube API is ready
function ytReady(fn: () => void) {
  if (fnQueue) {
    fnQueue.push(fn);
  } else {
    fn();
  }
}

window.onYouTubeIframeAPIReady = () => {
  // call all queued functions
  nullthrows(fnQueue).forEach(fn => fn());
  fnQueue = null;
};
