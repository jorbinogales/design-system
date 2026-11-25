import NearMeOutlined from '@mui/icons-material/NearMeOutlined';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { MapCanvas } from '../../../components/address/MapCanvas/MapCanvas';
import { LocationCard } from '../../../components/address/LocationCard/LocationCard';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { formatSlotTime } from '../../../components/date-time/TimeSlot/TimeSlot';
import { KeyValue, KeyValueList } from '../../../components/layout/KeyValue/KeyValue';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { intlLocale } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { getCenter } from '../../../mocks/catalog';
import { bs } from '../../../theme/theme';
import { layout, radius } from '../../../theme/tokens';
import { centerClosing, getListing } from '../../home/data';
import { serviceCenterId } from '../data';

const messages = {
  es: {
    title: 'Ubicación del centro',
    map: (n: string) => `Mapa con la ubicación de ${n} y tu posición`,
    address: 'Dirección',
    distance: 'Distancia',
    drive: 'En auto',
    today: 'Hoy',
    until: (t: string) => `Abierto hasta ${t}`,
    directions: 'Cómo llegar',
    min: (n: number) => `${n} min`,
  },
  en: {
    title: 'Center location',
    map: (n: string) => `Map showing ${n} and your position`,
    address: 'Address',
    distance: 'Distance',
    drive: 'By car',
    today: 'Today',
    until: (t: string) => `Open until ${t}`,
    directions: 'Get directions',
    min: (n: number) => `${n} min`,
  },
};

/** Ubicación del centro: map with the center pin, its address card and "Cómo llegar". */
export function CenterLocationScreen({ onDirections }: { onDirections?: () => void }) {
  const t = useT(messages);
  const locale = useLocale();
  const [selected, setSelected] = useState<string | null>(serviceCenterId);
  const center = getCenter(serviceCenterId)!;
  const listing = getListing(serviceCenterId);
  const nf = new Intl.NumberFormat(intlLocale[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={t.title} onBack={() => undefined} />
      <MapCanvas
        label={t.map(center.name)}
        ratio={390 / 430}
        rounded={false}
        seed={5}
        pins={[{ id: serviceCenterId, kind: 'service', x: 60, y: 46, label: center.name }]}
        selectedPinId={selected}
        onPinSelect={setSelected}
        userLocation={{ x: 30, y: 74 }}
      />
      <Box sx={{ flex: 1, mt: -6, position: 'relative', backgroundColor: bs.surface.canvas, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, boxShadow: bs.elevation.e2, px: `${layout.gutter.mobile}px`, pt: 5, pb: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <LocationCard address={center.address} title={center.name} pinKind="service" showMap={false} />
        <KeyValueList>
          <KeyValue label={t.distance} value={`${nf.format(listing.distanceMi)} mi`} tabular />
          <KeyValue label={t.drive} value={t.min(listing.driveMin)} tabular />
          <KeyValue label={t.today} value={t.until(formatSlotTime(centerClosing(center), locale))} />
        </KeyValueList>
      </Box>
      <BottomActionBar>
        <Button variant="primary" size="lg" fullWidth startIcon={<NearMeOutlined />} onClick={onDirections}>
          {t.directions}
        </Button>
      </BottomActionBar>
    </Box>
  );
}
