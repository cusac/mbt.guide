/* global YT */
// https://developers.google.com/youtube/iframe_api_reference
// https://developers.google.com/youtube/player_parameters
import React from 'react';
import nullthrows from 'nullthrows';

export type YouTubePlayerState =
  | 'unstarted'
  | 'ended'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'cued';
export type PlayBackRate = 0.25 | 0.5 | 1 | 1.5 | 2;

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
  playBackRate,
}: {
  videoId: string;
  onReady: ({ id, duration }: { id: string; duration: number }) => void;
  onStateChange: (arg0: YouTubePlayerState) => void;
  onSecondsChange: (arg0: number) => void;
  seconds: number;
  autoplay: boolean;
  controls: boolean;
  start: number;
  end: number;
  playing: boolean;
  playBackRate: PlayBackRate;
}): any => {
  const [player, setPlayer] = React.useState(undefined);
  const [state, setState] = React.useState('unstarted');

  const ref = React.createRef();
  React.useEffect(() => {
    ytReady(() => {
      const YT = (window as any)['YT'];

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
          start,
          end,
        },
        events: {
          onReady: () => {
            setPlayer(ytPlayer);
            onReady({
              id: videoId,
              duration: ytPlayer.getDuration(),
            });
          },
          onStateChange: ({ data }: any) => {
            const state = {
              [-1]: 'unstarted',
              [YT.PlayerState.ENDED]: 'ended',
              [YT.PlayerState.PLAYING]: 'playing',
              [YT.PlayerState.PAUSED]: 'paused',
              [YT.PlayerState.BUFFERING]: 'buffering',
              [YT.PlayerState.CUED]: 'cued',
            }[data];
            setState(state);
            onStateChange(state as any);
          },
        },
      });
    });
    return () => ytReady(() => player && (player as any).destroy());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const [prevTime, setPrevTime] = React.useState(undefined);

  // synchronise player time with seconds prop
  React.useEffect(() => {
    if (!player) {
      return;
    }

    // video has just loaded
    if ((player as any).getCurrentTime() === 0) {
      return;
    }

    // seconds updated by the player itself
    if (seconds === prevTime) {
      return;
    }

    (player as any).seekTo(seconds, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, seconds]);

  // broadcast current player time as it changes
  const [counter, setCounter] = React.useState(0);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCounter(counter + 1); // make sure effect runs again

      if (!player) {
        return;
      }

      if (state !== 'playing' && state !== 'buffering') {
        return;
      }

      const time = (player as any).getCurrentTime();
      setPrevTime(time);
      onSecondsChange(time);
    }, 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  // allow playing/pausing video using the playing prop
  React.useEffect(() => {
    if (!player) {
      return;
    }

    if (playing) {
      (player as any).playVideo();
    } else {
      (player as any).pauseVideo();
    }
  }, [player, playing]);

  // allow playback rate control
  React.useEffect(() => {
    if (!player) {
      return;
    }

    (player as any).setPlaybackRate(playBackRate);
  }, [player, playBackRate]);

  return <div ref={ref as any} />;
};

YouTubePlayer.defaultProps = {
  onReady: () => undefined,
  onStateChange: () => undefined,
  autoplay: true,
  controls: true,
  playing: false,
  playBackRate: 1,
};

export default YouTubePlayer;

const ytScript = document.createElement('script');
ytScript.src = 'https://www.youtube.com/iframe_api';

const firstScriptTag = nullthrows(document.getElementsByTagName('script')[0]);
nullthrows(firstScriptTag.parentNode).insertBefore(ytScript, firstScriptTag);

let fnQueue: any = []; // functions to be called once YT API is ready

// queues function until YouTube API is ready
function ytReady(fn: any) {
  if (fnQueue) {
    fnQueue.push(fn);
  } else {
    fn();
  }
}

(window as any).onYouTubeIframeAPIReady = () => {
  // call all queued functions
  nullthrows(fnQueue).forEach((fn: any) => fn());
  fnQueue = null;
};
