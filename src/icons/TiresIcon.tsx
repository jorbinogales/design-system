import { createStrokeIcon } from './createStrokeIcon';

/** Service category: tires and rims. */
export const TiresIcon = createStrokeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.3" />
    <path d="M12 10.7V7M13.24 11.6l3.52-1.15M12.76 13.05l2.18 3M11.24 13.05l-2.18 3M10.76 11.6 7.24 10.45" />
  </>,
  'TiresIcon',
);
