import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import MyLocationRounded from '@mui/icons-material/MyLocationRounded';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ProfessionalCard } from '../../../blackseat/ProfessionalCard/ProfessionalCard';
import { addMinutes } from '../../../blackseat/shared/format';
import { Button } from '../../../components/actions/Button/Button';
import { BackButton } from '../../../components/navigation/BackButton/BackButton';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { MapCanvas, type MapPin, type MapPoint } from '../../../components/address/MapCanvas/MapCanvas';
import { RouteSummary, type RouteStop } from '../../../components/address/RouteSummary/RouteSummary';
import { formatSlotTime } from '../../../components/date-time/TimeSlot/TimeSlot';
import { Divider } from '../../../components/layout/Divider/Divider';
import type { BookingDetail } from '../../../domain/booking';
import { useLocale, useT } from '../../../i18n/locale';
import { getBookingDetail } from '../../../mocks/bookings';
import { getCenter } from '../../../mocks/catalog';
import { bs } from '../../../theme/theme';
import { layout, radius, typeScale } from '../../../theme/tokens';
import { ScreenRoot } from '../../profile/ui';

const messages = {
  es: {
    title: 'Ubicación en vivo',
    map: (from: string, to: string) => `Mapa en vivo: el recorrido de ${from} a ${to}`,
    eta: 'Llegada estimada',
    etaChip: (min: number) => `Llega en ${min} min`,
    chat: 'Mensaje',
    call: 'Llamar',
    recenter: 'Centrar el mapa en el recorrido',
    departs: 'Sale de',
    arrives: 'Llega a',
    yourAddress: 'Tu dirección',
    driver: 'Conductor de la grúa',
    unit: 'Grúa en camino',
  },
  en: {
    title: 'Live location',
    map: (from: string, to: string) => `Live map: the route from ${from} to ${to}`,
    eta: 'Estimated arrival',
    etaChip: (min: number) => `Arrives in ${min} min`,
    chat: 'Message',
    call: 'Call',
    recenter: 'Center the map on the route',
    departs: 'Departs from',
    arrives: 'Arrives at',
    yourAddress: 'Your address',
    driver: 'Tow truck driver',
    unit: 'Tow truck on its way',
  },
};

export interface LiveLocationScreenProps {
  /** Defaults to BS-24118 (a washer on the way to Andrea's home). Pass the Towing booking for the yard-to-delivery route. */
  booking?: BookingDetail;
  /** Minutes until arrival, shown in the chip and used for the arrival window. */
  etaMin?: number;
}

/**
 * Ubicación en vivo (s63): route on the map with an ETA chip, arrival window, the assigned professional with chat / call,
 * and the route as origin → destination. Towing uses RouteSummary from the auction yard (lot and code) to the delivery address.
 */
export function LiveLocationScreen({ booking = getBookingDetail('BS-24118'), etaMin = 12 }: LiveLocationScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const b = booking;
  const towing = b.unit === 'towing' && b.auction && b.yard;
  const base = getCenter(b.assignee?.centerId ?? 'c-doral')!;
  const delivery = b.address ?? base.address;

  const origin: RouteStop =
    towing && b.yard && b.auction
      ? { kind: 'auction', name: b.yard.name, address: b.yard.address, auction: { lot: b.auction.lot, code: b.auction.code } }
      : { kind: 'address', name: base.name, address: base.address };
  const destination: RouteStop = { kind: 'address', name: t.yourAddress, address: delivery };

  // Positions are map percentages: the origin sits in one corner and the destination in the opposite one.
  const route: MapPoint[] = towing ? [[18, 80], [18, 62], [46, 62], [46, 38], [76, 38], [76, 22]] : [[22, 26], [22, 46], [50, 46], [50, 72], [76, 72]];
  const pins: MapPin[] = towing
    ? [
        { id: 'origin', kind: 'auction', x: 18, y: 80, label: origin.name },
        { id: 'unit', kind: 'unit', x: 46, y: 50, label: t.unit },
        { id: 'dest', kind: 'destination', x: 76, y: 22, label: t.yourAddress },
      ]
    : [
        { id: 'origin', kind: 'service', x: 22, y: 26, label: origin.name },
        { id: 'dest', kind: 'address', x: 76, y: 72, label: t.yourAddress },
      ];

  const arrivalFrom = formatSlotTime(addMinutes(b.time, -10), locale);
  const arrivalTo = formatSlotTime(addMinutes(b.time, 10), locale);

  return (
    <ScreenRoot>
      <MapCanvas label={t.map(origin.name, t.yourAddress)} ratio={1.2} rounded={false} seed={towing ? 19 : 13} route={route} pins={pins} pinLabels="none" eta={{ label: t.etaChip(etaMin) }}>
        <Box sx={{ position: 'absolute', inset: 0 }}>
          <Box sx={{ position: 'absolute', top: `calc(${layout.safeAreaTop} + 8px)`, left: `${layout.gutter.mobile}px`, right: `${layout.gutter.mobile}px`, display: 'flex', alignItems: 'center', gap: 3 }}>
            <BackButton variant="raised" onClick={() => undefined} />
            <Typography component="h1" sx={{ ...typeScale.label, px: 4, py: 2, borderRadius: `${radius.pill}px`, backgroundColor: bs.surface.raised, boxShadow: bs.elevation.e2 }}>
              {t.title}
            </Typography>
          </Box>
          <Box sx={{ position: 'absolute', right: `${layout.gutter.mobile}px`, bottom: 40 }}>
            <IconButton label={t.recenter} icon={<MyLocationRounded />} variant="raised" />
          </Box>
        </Box>
      </MapCanvas>

      <Box
        component="main"
        sx={{
          position: 'relative',
          mt: '-24px',
          flex: 1,
          backgroundColor: bs.surface.raised,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          boxShadow: bs.elevation.e3,
          px: `${layout.gutter.mobile}px`,
          pt: 5,
          pb: `calc(24px + ${layout.safeAreaBottom})`,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.eta}
          </Typography>
          <Typography variant="h3" component="p" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {arrivalFrom} – {arrivalTo}
          </Typography>
        </Box>
        <Divider />
        <ProfessionalCard professional={b.assignee} unit={b.unit} baseLabel={base.name} />
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Button variant="secondary" size="md" fullWidth startIcon={<ChatBubbleOutlineRounded />}>
              {t.chat}
            </Button>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Button variant="secondary" size="md" fullWidth startIcon={<PhoneOutlined />}>
              {t.call}
            </Button>
          </Box>
        </Box>
        <RouteSummary
          origin={origin}
          destination={destination}
          trip={towing ? '18.4 mi · 32 min' : '6.2 mi · 14 min'}
          originLabel={towing ? undefined : t.departs}
          destinationLabel={towing ? undefined : t.arrives}
        />
      </Box>
    </ScreenRoot>
  );
}
