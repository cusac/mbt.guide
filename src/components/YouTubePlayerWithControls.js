// @flow

import * as components from 'components';
import * as React from 'react';

const { Button } = components;

const YouTubePlayerWithControls = ({
  videoId,
  duration,
  autoplay,
  controls,
  start,
  end,
}: {
  videoId: string,
  duration: number,
  autoplay: boolean,
  controls: boolean,
  start: number,
  end: number,
}) => {
  const [seconds, setSeconds] = React.useState(start);
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = React.useState(('unstarted': components.YouTubePlayerState));
  const [playing, setPlaying] = React.useState(autoplay);

  return (
    <div>
      <div key={`${start}-${end}`}>
        <components.YouTubePlayer
          {...{ videoId, seconds, autoplay, start, end, playing }}
          controls={false}
          onStateChange={state => {
            setState(state);
            switch (state) {
              case 'playing':
                setPlaying(true);
                break;

              case 'paused':
              case 'ended':
                setPlaying(false);
                break;

              default:
            }
          }}
          onSecondsChange={setSeconds}
        />
      </div>
      {controls && (
        <div>
          <Button.Group>
            <Button icon={playing ? 'pause' : 'play'} onClick={() => setPlaying(!playing)} />
            <Button icon="undo" onClick={() => setSeconds(start)} />
          </Button.Group>
          <components.Slider
            start={[seconds]}
            range={{ min: start, max: end }}
            width={640}
            onHandleUpdate={(i, value) => setSeconds(value)}
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
