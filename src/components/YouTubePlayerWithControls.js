// @flow

import { Button } from 'semantic-ui-react';
import * as components from 'components';
import * as React from 'react';

const showPlayPauseButton = false;

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
  const [state, setState] = React.useState(('unstarted': components.YouTubePlayerState));

  return (
    <div>
      <components.YouTubePlayer
        {...{ videoId, seconds, autoplay, start, end }}
        controls={false}
        onStateChange={setState}
        onSecondsChange={onSecondsChange}
      />
      {controls && (
        <div>
          {showPlayPauseButton && <Button circular icon={state === 'paused' ? 'pause' : 'play'} />}
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
