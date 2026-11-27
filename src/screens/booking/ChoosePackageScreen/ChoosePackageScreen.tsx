import Box from '@mui/material/Box';
import { useState } from 'react';
import { useNav } from '../../../app/nav';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { useLocale, useT } from '../../../i18n/locale';
import { PackageCard } from '../../../blacksix/PackageCard/PackageCard';
import { getPackagesForUnit } from '../../../mocks/catalog';
import { unitMeta, type BusinessUnit } from '../../../domain/units';
import { getVehicle, vehicleName } from '../../../mocks/people';
import { myVehicles } from '../data';
import { BookingTopBar, Lead, ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Elegir paquete',
    lead: (unit: string, home: boolean) => `Elige un paquete de ${unit}. ${home ? 'Vamos a tu dirección.' : 'Lo realizamos en uno de nuestros centros.'}`,
    forVehicle: (v: string) => `Para tu ${v}`,
    next: 'Continuar',
    nextWith: (n: string) => `Continuar con ${n}`,
  },
  en: {
    title: 'Choose package',
    lead: (unit: string, home: boolean) => `Choose a ${unit} package. ${home ? 'We come to your address.' : 'We do it at one of our centers.'}`,
    forVehicle: (v: string) => `For your ${v}`,
    next: 'Continue',
    nextWith: (n: string) => `Continue with ${n}`,
  },
};

export interface ChoosePackageScreenProps {
  /** Package selected at the start. `null` = nothing chosen yet. */
  initialId?: string | null;
  /** Business unit whose packages are listed. Defaults to the `unit` route param, then Detailing. */
  unit?: BusinessUnit;
}

/** Elegir paquete (s28): the packages of the unit with single selection. Step 2 of 5. */
export function ChoosePackageScreen({ initialId, unit }: ChoosePackageScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const nav = useNav();
  const params = nav.route.params ?? {};
  const unitId = unit ?? (params.unit === 'personal-washing' ? 'personal-washing' : 'detailing');
  const packages = getPackagesForUnit(unitId);
  const [selected, setSelected] = useState<string | null>(initialId === undefined ? (packages.find((p) => p.popular) ?? packages[0]).id : initialId);
  const current = packages.find((p) => p.id === selected);
  const vehicle = getVehicle(myVehicles[0].id);
  return (
    <ScreenRoot>
      <BookingTopBar title={t.title} step={1} />
      <ScreenBody sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
          <Tag label={t.forVehicle(vehicleName(vehicle))} />
          <Lead>{t.lead(unitMeta[unitId].name, unitId === 'personal-washing')}</Lead>
        </Box>
        <Box role="group" aria-label={t.title} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {packages.map((p) => (
            <PackageCard key={p.id} pkg={p} selected={p.id === selected} onSelect={setSelected} />
          ))}
        </Box>
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth disabled={!current} onClick={() => current && nav.go('schedule', { ...params, unit: unitId, packageId: current.id })}>
          {current ? t.nextWith(current.name[locale]) : t.next}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
