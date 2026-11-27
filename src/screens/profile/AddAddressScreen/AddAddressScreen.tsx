import Box from '@mui/material/Box';
import { useState } from 'react';
import { useNav } from '../../../app/nav';
import { AddressForm, emptyAddressForm, type AddressFormValue } from '../../../components/address/AddressForm/AddressForm';
import { MapCanvas } from '../../../components/address/MapCanvas/MapCanvas';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { useT } from '../../../i18n/locale';
import { layout } from '../../../theme/tokens';
import { ScreenRoot } from '../ui';

const messages = {
  es: { title: 'Agregar dirección', map: 'Mapa con la ubicación de la dirección', pin: 'Tu dirección', save: 'Guardar dirección', saved: 'Dirección guardada', zip: 'El ZIP 90210 no corresponde a Coconut Grove, FL. Prueba con 33133.' },
  en: { title: 'Add address', map: 'Map showing the address location', pin: 'Your address', save: 'Save address', saved: 'Address saved', zip: 'ZIP 90210 does not match Coconut Grove, FL. Try 33133.' },
};

export interface AddAddressScreenProps {
  initial?: AddressFormValue;
  /** Shows a server-side ZIP mismatch error (story "Con error"). */
  zipError?: boolean;
}

function Content({ initial = emptyAddressForm, zipError }: AddAddressScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const toast = useToast();
  const [value, setValue] = useState<AddressFormValue>(initial);
  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={nav.back} />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', gap: 5, px: `${layout.gutter.mobile}px`, pt: 3, pb: `calc(24px + ${layout.safeAreaBottom})` }}>
        <MapCanvas
          label={t.map}
          ratio={16 / 10}
          pins={[{ id: 'pin', kind: 'address', x: 54, y: 48, label: t.pin }]}
          selectedPinId="pin"
          pinLabels="none"
          seed={11}
        />
        <AddressForm value={value} onChange={setValue} errors={zipError ? { zip: t.zip } : undefined} submitLabel={t.save} onSubmit={() => {
            toast.show({ message: t.saved, severity: 'success' });
            nav.back();
          }} />
      </Box>
    </ScreenRoot>
  );
}

/** Agregar dirección (s71): map with a pin plus the manual address form (label chips, street, unit, reference). */
export function AddAddressScreen(props: AddAddressScreenProps) {
  return (
    <ToastProvider>
      <Content {...props} />
    </ToastProvider>
  );
}
