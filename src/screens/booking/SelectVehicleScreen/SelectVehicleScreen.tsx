import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNav } from '../../../app/nav';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { Card } from '../../../components/layout/Card/Card';
import { RadioGroup } from '../../../components/selection/Radio/Radio';
import { useLocale, useT } from '../../../i18n/locale';
import { unitIcon } from '../../../icons/unitIcon';
import { bs } from '../../../theme/theme';
import { vehicleName } from '../../../mocks/people';
import { kindLabel, myVehicles } from '../data';
import { AddRow, BookingTopBar, Lead, ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Seleccionar vehículo',
    unit: 'Detailing',
    lead: 'Elige el vehículo que vamos a atender en esta reserva.',
    group: 'Tus vehículos',
    add: 'Agregar vehículo',
    next: 'Continuar',
    noneYet: 'Aún no tienes vehículos guardados.',
  },
  en: {
    title: 'Select vehicle',
    unit: 'Detailing',
    lead: 'Choose the vehicle we will service in this booking.',
    group: 'Your vehicles',
    add: 'Add vehicle',
    next: 'Continue',
    noneYet: 'You have no saved vehicles yet.',
  },
};

export interface SelectVehicleScreenProps {
  /** Vehicle selected at the start. Defaults to the first one. */
  initialId?: string | null;
}

/** Seleccionar vehículo (s27 + s29): radio list of the customer's vehicles, "Agregar vehículo" and Continuar. Step 1 of 5. */
export function SelectVehicleScreen({ initialId }: SelectVehicleScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const nav = useNav();
  const params = nav.route.params ?? {};
  const [selected, setSelected] = useState<string | null>(initialId === undefined ? myVehicles[0].id : initialId);
  const Icon = unitIcon.detailing;
  return (
    <ScreenRoot>
      <BookingTopBar title={t.title} step={0} />
      <ScreenBody sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
          <Tag label={t.unit} icon={<Icon fontSize="small" />} />
          <Lead>{t.lead}</Lead>
        </Box>
        {myVehicles.length ? (
          <Card>
            <RadioGroup
              label={t.group}
              value={selected}
              onChange={setSelected}
              options={myVehicles.map((v) => ({
                value: v.id,
                label: (
                  <Typography variant="label" component="span" sx={{ fontWeight: 600 }}>
                    {vehicleName(v)}
                  </Typography>
                ),
                description: `${v.color[locale]} · ${kindLabel(v.kind, locale)} · ${v.plate}`,
              }))}
            />
          </Card>
        ) : (
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.noneYet}
          </Typography>
        )}
        <AddRow label={t.add} onClick={() => nav.go('add-vehicle', params)} />
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth disabled={!selected} onClick={() => selected && nav.go('choose-package', { ...params, vehicleId: selected })}>
          {t.next}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
