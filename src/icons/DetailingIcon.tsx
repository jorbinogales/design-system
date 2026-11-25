import { carFront } from './carFront';
import { createStrokeIcon } from './createStrokeIcon';

/** Business unit: Detailing (car with shine). */
export const DetailingIcon = createStrokeIcon(
  <>
    <path d="M18.5 1.8c.3 1.6 1 2.3 2.6 2.6-1.6.3-2.3 1-2.6 2.6-.3-1.6-1-2.3-2.6-2.6 1.6-.3 2.3-1 2.6-2.6Z" />
    <path d="M5.5 3.2c.2.9.6 1.3 1.5 1.5-.9.2-1.3.6-1.5 1.5-.2-.9-.6-1.3-1.5-1.5.9-.2 1.3-.6 1.5-1.5Z" />
    <g transform="translate(0 2)">{carFront}</g>
  </>,
  'DetailingIcon',
);
