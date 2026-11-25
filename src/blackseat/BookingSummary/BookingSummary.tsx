import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { BookingDetail } from '../../domain/booking';
import { unitMeta } from '../../domain/units';
import { useLocale, useT } from '../../i18n/locale';
import { unitIcon } from '../../icons/unitIcon';
import { Button } from '../../components/actions/Button/Button';
import { formatAddress } from '../../components/address/LocationCard/LocationCard';
import { formatSlotTime } from '../../components/date-time/TimeSlot/TimeSlot';
import { AmountBreakdown } from '../../components/data-display/AmountBreakdown/AmountBreakdown';
import { InitialsAvatar } from '../../components/data-display/InitialsAvatar/InitialsAvatar';
import { Card } from '../../components/layout/Card/Card';
import { bs } from '../../theme/theme';
import { addMinutes, auctionLabel, formatDateLong, formatDuration } from '../shared/format';

export type SummaryField = 'service' | 'schedule' | 'location' | 'vehicle' | 'auction' | 'payment';

export interface BookingSummaryProps {
  booking: BookingDetail;
  /** Adds a "Cambiar" action per editable row; called with the field to correct. Omit for a read-only summary. */
  onEdit?: (field: SummaryField) => void;
  /** Hide the price breakdown (when another block already shows it). */
  hideAmounts?: boolean;
}

const messages = {
  es: {
    service: 'Servicio',
    schedule: 'Fecha y hora',
    location: 'Ubicación',
    delivery: 'Entrega',
    vehicle: 'Vehículo',
    auction: 'Recogida en subasta',
    assignee: 'Responsable',
    payment: 'Método de pago',
    change: 'Cambiar',
    changeFor: (what: string) => `Cambiar ${what.toLowerCase()}`,
    awaiting: 'Pendiente de asignación',
    awaitingHint: 'Te avisamos cuando asignemos a tu profesional.',
    lot: 'Lote',
    code: 'Código',
    ends: (t: string) => `termina aprox. ${t}`,
    total: 'Total a pagar',
    summary: 'Resumen de la reserva',
  },
  en: {
    service: 'Service',
    schedule: 'Date and time',
    location: 'Location',
    delivery: 'Delivery',
    vehicle: 'Vehicle',
    auction: 'Auction pickup',
    assignee: 'Assigned to',
    payment: 'Payment method',
    change: 'Change',
    changeFor: (what: string) => `Change ${what.toLowerCase()}`,
    awaiting: 'Awaiting assignment',
    awaitingHint: "We'll let you know once your professional is assigned.",
    lot: 'Lot',
    code: 'Code',
    ends: (t: string) => `ends about ${t}`,
    total: 'Total to pay',
    summary: 'Booking summary',
  },
};

function Row({ label, children, onEdit, editLabel, last = false }: { label: string; children: ReactNode; onEdit?: () => void; editLabel: string; last?: boolean }) {
  const t = useT(messages);
  return (
    <Box component="div" role="group" aria-label={label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, py: 3.5, borderBottom: last ? 0 : `1px solid ${bs.border.subtle}` }}>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" sx={{ color: bs.text.secondary, display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        {children}
      </Box>
      {onEdit && (
        <Button variant="quiet" size="sm" onClick={onEdit} aria-label={editLabel} sx={{ flexShrink: 0, mt: -0.5 }}>
          {t.change}
        </Button>
      )}
    </Box>
  );
}

/**
 * Review step before paying: unit, package, date and time, location, assignee, price and payment method.
 * Every editable row has its own "Cambiar" action so a wrong detail is fixed without starting over.
 */
export function BookingSummary({ booking, onEdit, hideAmounts = false }: BookingSummaryProps) {
  const t = useT(messages);
  const locale = useLocale();
  const Icon = unitIcon[booking.unit];
  const edit = (field: SummaryField, label: string) => (onEdit ? { onEdit: () => onEdit(field), editLabel: t.changeFor(label) } : { editLabel: '' });
  const where = booking.address ? formatAddress(booking.address) : booking.center ? `${booking.center.name} · ${formatAddress(booking.center.address)}` : '';
  const v = booking.vehicle;
  const end = formatSlotTime(addMinutes(booking.time, booking.package.durationMin), locale);

  return (
    <Box component="section" aria-label={t.summary} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Card density="comfortable">
        <Row label={t.service} {...edit('service', t.service)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon aria-hidden sx={{ fontSize: 20 }} />
            <Typography variant="label">
              {unitMeta[booking.unit].name} · {booking.package.name[locale]}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            ~{formatDuration(booking.package.durationMin)}
          </Typography>
        </Row>
        <Row label={t.schedule} {...edit('schedule', t.schedule)}>
          <Typography variant="label" component="p">
            {formatDateLong(booking.date, locale)}
          </Typography>
          <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', color: bs.text.secondary }}>
            {formatSlotTime(booking.time, locale)} · {t.ends(end)}
          </Typography>
        </Row>
        <Row label={booking.auction ? t.delivery : t.location} {...edit('location', booking.auction ? t.delivery : t.location)}>
          <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
            {where}
          </Typography>
        </Row>
        {booking.auction && booking.yard && (
          <Row label={t.auction} {...edit('auction', t.auction)}>
            <Typography variant="label" component="p">
              {auctionLabel[booking.auction.auction]} · {booking.yard.name}
            </Typography>
            <Typography variant="code" component="p" sx={{ fontVariantNumeric: 'tabular-nums slashed-zero', fontSize: '0.8125rem' }}>
              {t.lot} {booking.auction.lot} · {t.code} {booking.auction.code}
            </Typography>
          </Row>
        )}
        {booking.vehicleId && (
          <Row label={t.vehicle} {...edit('vehicle', t.vehicle)}>
            <Typography variant="body2">
              {v.year} {v.make} {v.model} · {v.color[locale]} · {v.plate}
            </Typography>
          </Row>
        )}
        <Row label={t.assignee} editLabel="">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <InitialsAvatar name={booking.assignee?.name} size="sm" />
            <Box>
              <Typography variant="label" component="p">
                {booking.assignee?.name ?? t.awaiting}
              </Typography>
              {!booking.assignee && (
                <Typography variant="caption" sx={{ color: bs.text.secondary }}>
                  {t.awaitingHint}
                </Typography>
              )}
            </Box>
          </Box>
        </Row>
        <Row label={t.payment} last {...edit('payment', t.payment)}>
          <Typography variant="label" component="p">
            {booking.paymentMethod.label[locale]}
          </Typography>
          {booking.paymentMethod.detail && (
            <Typography variant="body2" sx={{ color: bs.text.secondary }}>
              {booking.paymentMethod.detail[locale]}
            </Typography>
          )}
        </Row>
      </Card>

      {!hideAmounts && (
        <AmountBreakdown
          lines={booking.lines.map((l) => ({ label: l.label[locale], amount: l.amount, kind: l.kind }))}
          total={booking.total}
          totalLabel={t.total}
          note={booking.package.priceFrom ? (locale === 'es' ? 'El precio final se confirma según vehículo y distancia.' : 'The final price is confirmed based on vehicle and distance.') : undefined}
        />
      )}
    </Box>
  );
}
