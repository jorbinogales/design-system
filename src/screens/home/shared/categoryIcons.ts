import type { ServiceCategoryId } from '../../../domain/booking';
import { EngineBayIcon } from '../../../icons/EngineBayIcon';
import { ExteriorWashIcon } from '../../../icons/ExteriorWashIcon';
import { InteriorIcon } from '../../../icons/InteriorIcon';
import { PolishIcon } from '../../../icons/PolishIcon';
import { TiresIcon } from '../../../icons/TiresIcon';
import { TowTruckIcon } from '../../../icons/TowTruckIcon';
import { VacuumIcon } from '../../../icons/VacuumIcon';

export const categoryIcon = {
  exterior: ExteriorWashIcon,
  interior: InteriorIcon,
  vacuum: VacuumIcon,
  'engine-bay': EngineBayIcon,
  polish: PolishIcon,
  tires: TiresIcon,
  towing: TowTruckIcon,
} satisfies Record<ServiceCategoryId, unknown>;
