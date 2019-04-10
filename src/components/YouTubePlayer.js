// @flow
/* global YT */
// https://developers.google.com/youtube/iframe_api_reference
// https://developers.google.com/youtube/player_parameters

import * as React from 'react';
import nullthrows from 'nullthrows';

export type State = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued';

const YouTubePlayer = ({
  videoId,
  onReady,
  onStateChange,
  onSecondsChange,
  seconds,
  autoplay,
  controls,
  start,
  end,
  playing,
}: {
  videoId: string,
  onReady: ({|
    id: string,
    duration: number,
  |}) => void,
  onStateChange: State => void,
  onSecondsChange: number => void,
  seconds: number,
  autoplay: boolean,
  controls: boolean,
  start: number,
  end: number,
  playing: boolean,
}) => {
  const [player, setPlayer] = React.useState((undefined: Object | void));
  const [state, setState] = React.useState(('unstarted': State));
  const [prevSeconds, setPrevSeconds] = React.useState((undefined: number | void));

  const ref = React.createRef();
  React.useEffect(() => {
    ytReady(() => {
      const ytPlayer = new YT.Player(ref.current, {
        height: 360,
        width: 640,
        videoId,
        playerVars: {
          controls: Number(controls), // video player controls
          disablekb: 1, // disable keyboard controls
          fs: 0, // disable full screen mode
          modestbranding: 1,
          autoplay: Number(autoplay),
        },
        events: {
          onReady: () => {
            setPlayer(ytPlayer);
            onReady({
              id: videoId,
              duration: ytPlayer.getDuration(),
            });
          },
          onStateChange: ({ data }) => {
            const state = ({
              [-1]: 'unstarted',
              [YT.PlayerState.ENDED]: 'ended',
              [YT.PlayerState.PLAYING]: 'playing',
              [YT.PlayerState.PAUSED]: 'paused',
              [YT.PlayerState.BUFFERING]: 'buffering',
              [YT.PlayerState.CUED]: 'cued',
            }: { [number]: State })[data];
            setState(state);
            onStateChange(state);
          },
        },
      });
    });
    return () => ytReady(() => player && player.destroy());
  }, [videoId]);

  // synchronise player time with seconds prop
  React.useEffect(() => {
    if (!player) {
      return;
    }

    if (seconds >= start && seconds <= end) {
      if (seconds !== prevSeconds && seconds !== 0) {
        player.seekTo(seconds, true);
      }
    } else {
      player.seekTo(start, true);
    }
  }, [player, seconds]);

  // broadcast current player time as it changes
  React.useEffect(() => {
    if (!player) {
      return;
    }

    const checkCurrentTime = () => {
      const time = player.getCurrentTime();
      setPrevSeconds(time);
      onSecondsChange(time);
    };

    checkCurrentTime();

    let interval: IntervalID | void;
    switch (state) {
      case 'buffering':
      case 'playing':
        interval = setInterval(checkCurrentTime, 300);
        break;

      default:
    }

    return () => clearInterval(interval);
  }, [player, state]);

  // allow playing/pausing video using the playing prop
  React.useEffect(() => {
    if (!player) {
      return;
    }

    if (playing) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [player, playing]);

  return <div ref={ref} />;
};

YouTubePlayer.defaultProps = {
  onReady: () => {},
  onStateChange: () => {},
  autoplay: true,
  controls: true,
  playing: false,
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
