/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

// https://refreshless.com/nouislider/
import 'nouislider/distribute/nouislider.css';
import React from 'react';
import * as utils from '../utils';
import noUiSlider from 'nouislider';

export type Range = { min: number; max: number };

const Slider = ({
  onChange,
  onHandleUpdate,
  onHandleSet,
  range,
  start,
  colors,
  margin,
  width,
  pips,
  disabled,
  offsetTooltip,
}: {
  onChange: (arg0: [number]) => void;
  onHandleUpdate: (arg0: number, arg1: number) => void;
  onHandleSet: (arg0: number, arg1: number) => void;
  range: Range;
  start: Array<number>;
  colors: Array<string>;
  margin: number;
  width: number;
  pips: boolean;
  disabled: boolean;
  offsetTooltip: boolean;
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
      connect: true,
      margin,
      range,
      pips: pips && {
        mode: 'range',
        density: 3,
        format: utils.timeFormat,
      },
      tooltips: offsetTooltip
        ? [
            {
              to: (value: any) => utils.timeFormat.to(value - range.min),
              from: (value: any) => utils.timeFormat.from((parseInt(value) - range.min).toString()),
            },
          ]
        : true,
      format: utils.timeFormat,
    });

    setSlider(slider);

    return () => slider.destroy();
  }, []);

  React.useEffect(() => slider && (slider as any).updateOptions({ range }), [
    slider,
    range.min,
    range.max,
  ]);
  React.useEffect(() => {
    slider && (slider as any).updateOptions({ start });
    disabled && ref
      ? ref.current && (ref as any).current.setAttribute('disabled', disabled)
      : ref.current && (ref as any).current.removeAttribute('disabled');
  }, [slider, ...start]);
  React.useEffect(
    () =>
      slider &&
      [...(slider as any).target.querySelectorAll('.noUi-connect')].forEach((connect, i) => {
        connect.style.background = colors[i];
      }),
    [slider, ...colors]
  );

  [
    ['update', onHandleUpdate],
    ['set', onHandleSet],
  ].forEach(([name, callback]) =>
    React.useEffect(() => {
      if (!slider) {
        return;
      }

      // NOTE we need to add namespace to the event name to keep the internal callbacks
      const eventName = `${name}.react`;

      let justBound = true;
      (slider as any).on(eventName, (values: any, handleIndex: any, rawValues: any) => {
        if (justBound) {
          return;
        }

        (callback as any)(handleIndex, rawValues[handleIndex]);
      });
      justBound = false;

      return () => (slider as any).off(eventName);
    }, [slider, callback])
  );

  return <div ref={ref as any} style={{ margin: '0px auto', width }} />;
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
  width: 400,
  colors: ['red', 'rgb(255, 255, 255, 0.5)'],
  pips: false,
  disabled: false,
  offsetTooltip: false,
};

export default Slider;
