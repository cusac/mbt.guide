import * as React from 'react';
import { Label } from '../components';

const Tip = ({
  tipText,
  position = 'right center',
}: {
  tipText: string;
  position?: string;
}): any => {
  return (
    <React.Fragment>
      <Label circular basic data-tooltip={tipText} data-position={position}>
        ?
      </Label>
    </React.Fragment>
  );
};
export default Tip;
