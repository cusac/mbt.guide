import * as components from 'components';
import React from 'reactn';

const { Button, Popup } = components;

const playBackRates = [0.25, 0.5, 1, 1.5, 2];

const YouTubePlayerWithControls = ({
  videoId,
  duration,
  autoplay,
  controls,
  start,
  end,
  offsetTooltip,
}: {
  videoId: string;
  duration: number;
  autoplay: boolean;
  controls: boolean;
  start: number;
  end: number;
  offsetTooltip: boolean;
}) => {
  const [seconds, setSeconds] = React.useState(start);
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = React.useState('unstarted' as components.YouTubePlayerState);
  const [playing, setPlaying] = React.useState(autoplay);
  const [playBackRate, setPlayBackRate] = React.useState(playBackRates[2]);
  const [playBackRateIndex, setPlayBackRateIndex] = React.useState(2);

  const speedUp = () => {
    if (playBackRateIndex >= playBackRates.length - 1) {
      return;
    }

    setPlayBackRateIndex(playBackRateIndex + 1);
  };

  const slowDown = () => {
    if (playBackRateIndex <= 0) {
      return;
    }

    setPlayBackRateIndex(playBackRateIndex - 1);
  };

  // allow playback rate control
  React.useEffect(() => {
    setPlayBackRate(playBackRates[playBackRateIndex]);
  }, [playBackRateIndex]);

  return (
    <div>
      <div key={`${start}-${end}`}>
        <components.YouTubePlayer
          {...{ videoId, seconds, autoplay, start, end, playing, playBackRate }}
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
            <Popup
              trigger={<Button icon="fast backward" onClick={() => setSeconds(start)} />}
              content="Skip to start"
              mouseEnterDelay={400}
              on="hover"
            />
            <Popup
              trigger={
                <Button
                  icon="backward"
                  onClick={() => slowDown()}
                  disabled={playBackRateIndex <= 0}
                />
              }
              content="Decrease playback speed"
              mouseEnterDelay={400}
              on="hover"
            />
            <Popup
              trigger={<Button icon="undo" onClick={() => setSeconds(seconds - 10)} />}
              content="Back 10 seconds"
              mouseEnterDelay={400}
              on="hover"
            />
            <Popup
              trigger={
                <Button icon={playing ? 'pause' : 'play'} onClick={() => setPlaying(!playing)} />
              }
              content={playing ? 'Pause' : 'Play'}
              mouseEnterDelay={400}
              on="hover"
            />
            <Popup
              trigger={<Button icon="redo" onClick={() => setSeconds(seconds + 10)} />}
              content="Forward 10 seconds"
              mouseEnterDelay={400}
              on="hover"
            />
            <Popup
              trigger={
                <Button
                  icon="forward"
                  onClick={() => speedUp()}
                  disabled={playBackRateIndex >= playBackRates.length - 1}
                />
              }
              content="Increase playback speed"
              mouseEnterDelay={400}
              on="hover"
            />
            <Popup
              trigger={<Button icon="fast forward" onClick={() => setSeconds(end)} />}
              content="Skip to end"
              mouseEnterDelay={400}
              on="hover"
            />
          </Button.Group>
          <components.Slider
            start={[seconds]}
            range={{ min: Math.round(start), max: Math.round(end) }}
            width={640}
            onHandleUpdate={(i, value) => setSeconds(value)}
            pips={true}
            offsetTooltip={offsetTooltip}
          />
        </div>
      )}
    </div>
  );
};

YouTubePlayerWithControls.defaultProps = {
  autoplay: false,
  controls: true,
  offsetTooltip: false,
};

export default YouTubePlayerWithControls;
