import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { MapCanvas } from '../../../components/address/MapCanvas/MapCanvas';
import { formatAddress } from '../../../components/address/LocationCard/LocationCard';
import { Card } from '../../../components/layout/Card/Card';
import { RadioGroup } from '../../../components/selection/Radio/Radio';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { addressLabel, addressPins, myAddresses } from '../data';
import { AddRow, BookingTopBar, Lead, ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Recogida y entrega',
    lead: 'Pasamos por tu vehículo a esta dirección y lo devolvemos al mismo lugar al terminar.',
    group: 'Direcciones guardadas',
    map: 'Mapa con la ubicación de la dirección elegida',
    add: 'Agregar dirección',
    next: 'Continuar',
    reference: 'Referencia',
  },
  en: {
    title: 'Pickup and delivery',
    lead: 'We pick up your vehicle at this address and bring it back to the same place when done.',
    group: 'Saved addresses',
    map: 'Map showing the location of the chosen address',
    add: 'Add address',
    next: 'Continue',
    reference: 'Reference',
  },
};

export interface PickupAddressScreenProps {
  initialId?: string | null;
}

/** Recogida y entrega (s33): saved addresses as a radio list with the full address text, a small map and "Agregar dirección". Step 3 of 5. */
export function PickupAddressScreen({ initialId = 'adr-andrea-home' }: PickupAddressScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const [selected, setSelected] = useState<string | null>(initialId);
  return (
    <ScreenRoot>
      <BookingTopBar title={t.title} step={2} />
      <ScreenBody sx={{ flex: 1 }}>
        <Lead>{t.lead}</Lead>
        <MapCanvas
          label={t.map}
          ratio={16 / 8}
          seed={11}
          pinLabels="selected"
          selectedPinId={selected}
          onPinSelect={(id) => id && setSelected(id)}
          pins={myAddresses.map((a) => ({ id: a.id, kind: 'address' as const, ...addressPins[a.id], label: addressLabel(a, locale) }))}
        />
        <Card>
          <RadioGroup
            label={t.group}
            value={selected}
            onChange={setSelected}
            options={myAddresses.map((a) => ({
              value: a.id,
              label: (
                <Typography variant="label" component="span" sx={{ fontWeight: 600 }}>
                  {addressLabel(a, locale)}
                </Typography>
              ),
              description: (
                <>
                  {formatAddress(a)}
                  {a.reference && (
                    <Box component="span" sx={{ display: 'block', color: bs.text.secondary }}>
                      {t.reference}: {a.reference}
                    </Box>
                  )}
                </>
              ),
            }))}
          />
        </Card>
        <AddRow label={t.add} />
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth disabled={!selected}>
          {t.next}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
