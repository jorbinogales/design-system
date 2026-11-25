import { carFront } from './carFront';
import { createStrokeIcon } from './createStrokeIcon';

const drop = 'c1 1.3 1.6 2.2 1.6 2.9a1.6 1.6 0 0 1-3.2 0c0-.7.6-1.6 1.6-2.9Z';

/** Service category: exterior wash. */
export const ExteriorWashIcon = createStrokeIcon(
  <>
    <path d={`M12 1.8${drop}`} />
    <path d={`M7.5 3${drop}`} />
    <path d={`M16.5 3${drop}`} />
    <g transform="translate(0 2)">{carFront}</g>
  </>,
  'ExteriorWashIcon',
);
