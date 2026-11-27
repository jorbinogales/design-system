import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNav } from '../../../app/nav';
import { StatusHistory } from '../../../blacksix/StatusHistory/StatusHistory';
import { formatDateLong, formatDuration } from '../../../blacksix/shared/format';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { formatAddress } from '../../../components/address/LocationCard/LocationCard';
import { AmountBreakdown } from '../../../components/data-display/AmountBreakdown/AmountBreakdown';
import { formatSlotTime } from '../../../components/date-time/TimeSlot/TimeSlot';
import { StatusBadge } from '../../../components/data-display/StatusBadge/StatusBadge';
import { Divider } from '../../../components/layout/Divider/Divider';
import { KeyValue, KeyValueList } from '../../../components/layout/KeyValue/KeyValue';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import type { BookingDetail } from '../../../domain/booking';
import { unitMeta } from '../../../domain/units';
import { useLocale, useT } from '../../../i18n/locale';
import { getBookingDetail } from '../../../mocks/bookings';
import { vehicleName } from '../../../mocks/people';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { ScreenRoot } from '../../profile/ui';

const messages = {
  es: {
    title: 'Seguimiento',
    order: (id: string) => `Reserva ${id}`,
    status: 'Estado de la reserva',
    details: 'Detalles de la reserva',
    service: 'Servicio',
    vehicle: 'Vehículo',
    when: 'Fecha y hora',
    duration: 'Duración estimada',
    place: 'Lugar',
    delivery: 'Entrega',
    auction: 'Subasta',
    lot: 'Lote',
    code: 'Código de recogida',
    pro: 'Responsable',
    awaiting: 'Pendiente de asignación',
    method: 'Método de pago',
    total: 'Total',
    live: 'Ver ubicación en vivo',
    liveWait: 'La ubicación en vivo estará disponible cuando asignemos a tu profesional y salga hacia ti.',
    statusLabel: 'Historial de estados de tu reserva',
  },
  en: {
    title: 'Tracking',
    order: (id: string) => `Booking ${id}`,
    status: 'Booking status',
    details: 'Booking details',
    service: 'Service',
    vehicle: 'Vehicle',
    when: 'Date and time',
    duration: 'Estimated duration',
    place: 'Place',
    delivery: 'Delivery',
    auction: 'Auction',
    lot: 'Lot',
    code: 'Pickup code',
    pro: 'Assigned to',
    awaiting: 'Awaiting assignment',
    method: 'Payment method',
    total: 'Total',
    live: 'View live location',
    liveWait: 'Live location will be available once we assign your professional and they set off.',
    statusLabel: 'Status history of your booking',
  },
};

export interface TrackOrderScreenProps {
  /** Defaults to BS-24118 (Personal Washing, assigned and paid). */
  booking?: BookingDetail;
}

/** Seguimiento (s66): order header with the three statuses, StatusHistory for the customer, order details and "Ver ubicación en vivo". */
export function TrackOrderScreen({ booking = getBookingDetail('BS-24118') }: TrackOrderScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const locale = useLocale();
  const b = booking;
  const where = b.center ? `${b.center.name} · ${formatAddress(b.center.address)}` : b.address ? formatAddress(b.address) : '';
  const canTrack = b.assignment.status === 'assigned' && (b.status === 'confirmed' || b.status === 'in_progress');
  const lines = b.lines.map((l) => ({ label: l.label[locale], amount: l.amount, kind: l.kind }));

  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={nav.back} />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', gap: 6, px: `${layout.gutter.mobile}px`, pt: 3, pb: 6, flex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h2" component="h2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {t.order(b.id)}
            </Typography>
            <Typography variant="body2" sx={{ color: bs.text.secondary }}>
              {unitMeta[b.unit].name} {b.package.name[locale]} · {formatDateLong(b.date, locale)} · {formatSlotTime(b.time, locale)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <StatusBadge dimension="booking" status={b.status} />
            <StatusBadge dimension="assignment" status={b.assignment.status} />
            <StatusBadge dimension="payment" status={b.payment.status} />
          </Box>
        </Box>

        <Box component="section" aria-labelledby="track-status" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography id="track-status" variant="h3" component="h2">
            {t.status}
          </Typography>
          <StatusHistory changes={b.history} audience="customer" showUpcoming label={t.statusLabel} />
        </Box>

        <Divider />

        <Box component="section" aria-labelledby="track-details" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography id="track-details" variant="h3" component="h2">
            {t.details}
          </Typography>
          <KeyValueList>
            <KeyValue label={t.service} value={`${unitMeta[b.unit].name} ${b.package.name[locale]}`} />
            <KeyValue label={t.vehicle} value={`${vehicleName(b.vehicle)} · ${b.vehicle.plate}`} />
            <KeyValue label={t.duration} value={formatDuration(b.package.durationMin)} />
            <KeyValue label={b.auction ? t.delivery : t.place} value={where} />
            {b.auction && b.yard && <KeyValue label={t.auction} value={`${b.yard.name}`} />}
            {b.auction && <KeyValue label={t.lot} value={b.auction.lot} tabular />}
            {b.auction && <KeyValue label={t.code} value={b.auction.code} tabular />}
            <KeyValue label={t.pro} value={b.assignee ? `${b.assignee.name} · ${b.assignee.role[locale]}` : t.awaiting} />
            <KeyValue label={t.method} value={b.paymentMethod.label[locale]} />
          </KeyValueList>
          <AmountBreakdown lines={lines} total={b.total} totalLabel={t.total} />
        </Box>
      </Box>
      <BottomActionBar>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
          {!canTrack && (
            <Typography variant="caption" component="p" sx={{ color: bs.text.secondary, textAlign: 'center' }}>
              {t.liveWait}
            </Typography>
          )}
          <Button fullWidth disabled={!canTrack} startIcon={<PlaceOutlined />} onClick={() => nav.go('live-location', { bookingId: b.id })}>
            {t.live}
          </Button>
        </Box>
      </BottomActionBar>
    </ScreenRoot>
  );
}
