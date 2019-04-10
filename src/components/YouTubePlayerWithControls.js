// @flow

import { Button } from 'semantic-ui-react';
import * as components from 'components';
import * as React from 'react';

const YouTubePlayerWithControls = ({
  videoId,
  duration,
  seconds,
  autoplay,
  controls,
  start,
  end,
  onSecondsChange,
}: {
  videoId: string,
  duration: number,
  seconds: number,
  autoplay: boolean,
  controls: boolean,
  start: number,
  end: number,
  onSecondsChange: number => void,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = React.useState(('unstarted': components.YouTubePlayerState));
  const [playing, setPlaying] = React.useState((false: boolean));
  if (state === 'playing' && !playing) {
    setPlaying(true);
  }
  if (state === 'paused' && playing) {
    setPlaying(false);
  }

  return (
    <div>
      <components.YouTubePlayer
        {...{ videoId, seconds, autoplay, start, end, playing }}
        controls={false}
        onStateChange={setState}
        onSecondsChange={onSecondsChange}
      />
      {controls && (
        <div>
          <Button circular icon={playing ? 'pause' : 'play'} onClick={() => setPlaying(!playing)} />
          <components.Slider
            start={[seconds]}
            range={{ min: start, max: end }}
            width={640}
            onHandleUpdate={(i, value) => onSecondsChange(value)}
          />
        </div>
      )}
    </div>
  );
};

YouTubePlayerWithControls.defaultProps = {
  autoplay: false,
  controls: true,
};

export default YouTubePlayerWithControls;
