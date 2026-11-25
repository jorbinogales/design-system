import type { BusinessUnit } from '../domain/units';
import type { StrokeIcon } from './createStrokeIcon';
import { DetailingIcon } from './DetailingIcon';
import { PersonalWashingIcon } from './PersonalWashingIcon';
import { TowingIcon } from './TowingIcon';

/** Icon for each business unit (used by Media fallbacks and unit cards). */
export const unitIcon: Record<BusinessUnit, StrokeIcon> = {
  detailing: DetailingIcon,
  towing: TowingIcon,
  'personal-washing': PersonalWashingIcon,
};
