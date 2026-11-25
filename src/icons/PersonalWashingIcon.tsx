import { createStrokeIcon } from './createStrokeIcon';

/** Business unit: Personal Washing (hand wash with sponge). */
export const PersonalWashingIcon = createStrokeIcon(
  <>
    <rect x="3.5" y="11" width="13" height="8.5" rx="3" transform="rotate(-12 10 15.25)" />
    <path d="M7.4 15.6h.01M10.4 14.4h.01M12.6 16.6h.01M9.6 17.6h.01" strokeWidth={2} />
    <circle cx="17.5" cy="6" r="2.5" />
    <circle cx="21" cy="10.6" r="1.3" />
    <circle cx="12.4" cy="4.4" r="1.4" />
  </>,
  'PersonalWashingIcon',
);
