// @flow
// https://refreshless.com/nouislider/

import 'nouislider/distribute/nouislider.css';
import * as React from 'react';
import * as utils from 'utils';
import noUiSlider from 'nouislider';

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
        format: utils.timeFormat,
      },
      tooltips: true,
      format: utils.timeFormat,
    });

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

  [['update', onHandleUpdate], ['set', onHandleSet]].forEach(([name, callback]) =>
    React.useEffect(() => {
      if (!slider) {
        return;
      }

      // NOTE we need to add namespace to the event name to keep the internal callbacks
      const eventName = `${name}.react`;

      let justBound = true;
      slider.on(eventName, (values, handleIndex, rawValues) => {
        if (justBound) {
          return;
        }

        callback(handleIndex, rawValues[handleIndex]);
      });
      justBound = false;

      return () => slider.off(eventName);
    }, [slider, callback])
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
