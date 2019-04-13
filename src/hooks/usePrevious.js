// @flow

import * as React from 'react';

/**
 * Returns the previous value of the given argument
 */
export default function usePrevious<T>(value: T): T | void {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
