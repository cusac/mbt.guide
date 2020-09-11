/* global YT */
// https://developers.google.com/youtube/iframe_api_reference
// https://developers.google.com/youtube/player_parameters
import React from 'reactn';
import nullthrows from 'nullthrows';

export type State = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued';
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
  onReady: ({ id: string, duration: number }) => void;
  onStateChange: (State) => void;
  onSecondsChange: (number) => void;
  seconds: number;
  autoplay: boolean;
  controls: boolean;
  start: number;
  end: number;
  playing: boolean;
  playBackRate: PlayBackRate;
}) => {
  const [player, setPlayer] = React.useState(undefined);
  const [state, setState] = React.useState('unstarted' as State);

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
          onStateChange: ({ data }) => {
            const state = ({
              [-1]: 'unstarted',
              [YT.PlayerState.ENDED]: 'ended',
              [YT.PlayerState.PLAYING]: 'playing',
              [YT.PlayerState.PAUSED]: 'paused',
              [YT.PlayerState.BUFFERING]: 'buffering',
              [YT.PlayerState.CUED]: 'cued',
            } as Record<number, State>)[data];
            setState(state);
            onStateChange(state);
          },
        },
      });
    });
    return () => ytReady(() => player && player.destroy());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const [prevTime, setPrevTime] = React.useState(undefined as number | void);

  // synchronise player time with seconds prop
  React.useEffect(() => {
    if (!player) {
      return;
    }

    // video has just loaded
    if (player.getCurrentTime() === 0) {
      return;
    }

    // seconds updated by the player itself
    if (seconds === prevTime) {
      return;
    }

    player.seekTo(seconds, true);
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

      const time = player.getCurrentTime();
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
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [player, playing]);

  // allow playback rate control
  React.useEffect(() => {
    if (!player) {
      return;
    }

    player.setPlaybackRate(playBackRate);
  }, [player, playBackRate]);

  return <div ref={ref} />;
};

YouTubePlayer.defaultProps = {
  onReady: () => {},
  onStateChange: () => {},
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

let fnQueue: [() => void] = []; // functions to be called once YT API is ready

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
