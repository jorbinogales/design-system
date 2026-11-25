import Box from '@mui/material/Box';
import { useState } from 'react';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { useLocale, useT } from '../../../i18n/locale';
import { PackageCard } from '../../../blackseat/PackageCard/PackageCard';
import { getPackagesForUnit } from '../../../mocks/catalog';
import { getVehicle, vehicleName } from '../../../mocks/people';
import { myVehicles } from '../data';
import { BookingTopBar, Lead, ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Elegir paquete',
    lead: 'Elige un paquete de Detailing. Lo realizamos en uno de nuestros centros.',
    forVehicle: (v: string) => `Para tu ${v}`,
    next: 'Continuar',
    nextWith: (n: string) => `Continuar con ${n}`,
  },
  en: {
    title: 'Choose package',
    lead: 'Choose a Detailing package. We do it at one of our centers.',
    forVehicle: (v: string) => `For your ${v}`,
    next: 'Continue',
    nextWith: (n: string) => `Continue with ${n}`,
  },
};

export interface ChoosePackageScreenProps {
  /** Package selected at the start. `null` = nothing chosen yet. */
  initialId?: string | null;
}

/** Elegir paquete (s28): the packages of the unit with single selection. Step 2 of 5. */
export function ChoosePackageScreen({ initialId = 'det-premium' }: ChoosePackageScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const [selected, setSelected] = useState<string | null>(initialId);
  const packages = getPackagesForUnit('detailing');
  const current = packages.find((p) => p.id === selected);
  const vehicle = getVehicle(myVehicles[0].id);
  return (
    <ScreenRoot>
      <BookingTopBar title={t.title} step={1} />
      <ScreenBody sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
          <Tag label={t.forVehicle(vehicleName(vehicle))} />
          <Lead>{t.lead}</Lead>
        </Box>
        <Box role="group" aria-label={t.title} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {packages.map((p) => (
            <PackageCard key={p.id} pkg={p} selected={p.id === selected} onSelect={setSelected} />
          ))}
        </Box>
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth disabled={!current}>
          {current ? t.nextWith(current.name[locale]) : t.next}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
