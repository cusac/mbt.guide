// @flow
// https://developers.google.com/youtube/iframe_api_reference
// https://developers.google.com/youtube/player_parameters

import * as React from 'react';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';

export type Range = {| min: number, max: number |};

const Slider = ({
  onChange,
  onHandleUpdate,
  range,
}: {
  onChange: (Array<number>) => void,
  onHandleUpdate: (number, number) => void,
  range: Range,
}) => {
  const [slider, setSlider] = React.useState(undefined);
  const ref = React.createRef();
  React.useEffect(() => {
    const format = {
      to: value => (isNaN(value) ? value : new Date(1000 * value).toISOString().substr(11, 8)),
      from: value =>
        isNaN(value) ? new Date(`1970-01-01T${value}Z`).getTime() / 1000 : parseInt(value, 10),
    };

    const slider = noUiSlider.create(ref.current, {
      start: [200, 1000],
      step: 1,
      connect: [true, true, true],
      margin: 5,
      range,
      pips: {
        mode: 'range',
        density: 3,
        format,
      },
      tooltips: true,
      format,
    });

    slider.on('update', (values, handleIndex, rawValues) => {
      onHandleUpdate(handleIndex, rawValues[handleIndex]);
    });

    setSlider(slider);
  }, []);

  React.useEffect(() => slider && slider.updateOptions({ range }), [range.min, range.max]);

  return <div ref={ref} style={{ width: 640 }} />;
};

Slider.defaultProps = {
  onChange: () => {},
  onHandleUpdate: () => {},
  range: {
    min: 0,
    max: 4000,
  },
};

export default Slider;
