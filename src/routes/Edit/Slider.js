// @flow
// https://refreshless.com/nouislider/

import * as React from 'react';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';

import * as timeFormat from 'utils/timeFormat';

export type Range = {| min: number, max: number |};

const Slider = ({
  onChange,
  onHandleUpdate,
  onHandleSet,
  range,
  start,
  colors,
  margin,
}: {
  onChange: (Array<number>) => void,
  onHandleUpdate: (number, number) => void,
  onHandleSet: (number, number) => void,
  range: Range,
  start: Array<number>,
  colors: Array<string>,
  margin: number,
}) => {
  const [slider, setSlider] = React.useState(undefined);
  const ref = React.createRef();
  React.useEffect(() => {
    if (start.length === 0) {
      return;
    }
    const slider = noUiSlider.create(ref.current, {
      start,
      step: 1,
      connect: Array(start.length + 1).fill(true),
      margin,
      range,
      pips: {
        mode: 'range',
        density: 3,
        format: timeFormat,
      },
      tooltips: true,
      format: timeFormat,
    });

    slider.on('update', (values, handleIndex, rawValues) =>
      onHandleUpdate(handleIndex, rawValues[handleIndex])
    );

    slider.on('set', (values, handleIndex, rawValues) =>
      onHandleSet(handleIndex, rawValues[handleIndex])
    );

    setSlider(slider);

    return () => slider.destroy();
  }, []);

  React.useEffect(() => slider && slider.updateOptions({ range }), [slider, range.min, range.max]);
  React.useEffect(
    () =>
      slider &&
      [...slider.target.querySelectorAll('.noUi-connect')].forEach((connect, i) => {
        connect.style.background = colors[i];
      }),
    [slider, ...colors]
  );

  return <div ref={ref} style={{ width: 640 }} />;
};

Slider.defaultProps = {
  onChange: () => {},
  onHandleUpdate: () => {},
  onHandleSet: () => {},
  range: {
    min: 0,
    max: 4000,
  },
  start: [],
  margin: 0,
};

export default Slider;
