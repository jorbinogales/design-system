import DirectionsCarOutlined from '@mui/icons-material/DirectionsCarOutlined';
import EventOutlined from '@mui/icons-material/EventOutlined';
import GavelRounded from '@mui/icons-material/GavelRounded';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import StarRounded from '@mui/icons-material/StarRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { auctionLabel, formatDateShort } from '../../blacksix/shared/format';
import { Button } from '../../components/actions/Button/Button';
import { formatAddress } from '../../components/address/LocationCard/LocationCard';
import { formatSlotTime } from '../../components/date-time/TimeSlot/TimeSlot';
import { InitialsAvatar } from '../../components/data-display/InitialsAvatar/InitialsAvatar';
import { Price } from '../../components/data-display/Price/Price';
import { InlineAlert } from '../../components/feedback/InlineAlert/InlineAlert';
import { Card } from '../../components/layout/Card/Card';
import type { BookingDetail } from '../../domain/booking';
import { unitMeta } from '../../domain/units';
import { formatMoney } from '../../i18n/format';
import { useLocale, useT } from '../../i18n/locale';
import { unitIcon } from '../../icons/unitIcon';
import { vehicleName } from '../../mocks/people';
import { bs } from '../../theme/theme';
import { IconBubble } from '../profile/ui';
import { refundOf } from './data';

export type BookingsTab = 'active' | 'completed' | 'cancelled';

const messages = {
  es: {
    track: 'Seguir reserva',
    cancel: 'Cancelar',
    review: 'Dejar reseña',
    reviewed: (n: number) => `Reseña enviada · ${n}/5`,
    receipt: 'Ver recibo',
    again: 'Reservar de nuevo',
    lot: 'Lote',
    code: 'Código',
    assignedTo: 'Responsable',
    failed: 'No pudimos cobrar tu tarjeta. Elige otro método de pago antes de la cita para no perder el horario.',
    refund: (amount: string, method: string) => `Reembolso de ${amount} a ${method}. Llega en 3 a 5 días hábiles.`,
    noCharge: 'No se hizo ningún cobro, así que no hay nada que reembolsar.',
    on: (id: string) => `Reserva ${id}`,
  },
  en: {
    track: 'Track booking',
    cancel: 'Cancel',
    review: 'Leave a review',
    reviewed: (n: number) => `Review sent · ${n}/5`,
    receipt: 'View receipt',
    again: 'Book again',
    lot: 'Lot',
    code: 'Code',
    assignedTo: 'Assigned to',
    failed: 'We could not charge your card. Choose another payment method before the appointment to keep your slot.',
    refund: (amount: string, method: string) => `Refund of ${amount} to ${method}. It arrives in 3 to 5 business days.`,
    noCharge: 'You were not charged, so there is nothing to refund.',
    on: (id: string) => `Booking ${id}`,
  },
};

export interface BookingCardProps {
  booking: BookingDetail;
  /** Decides which badges matter and which actions show. */
  tab: BookingsTab;
  /** Rating already left (completed tab). */
  rating?: number;
  onTrack?: () => void;
  onCancel?: () => void;
  onReview?: () => void;
  onReceipt?: () => void;
  onRebook?: () => void;
}

function Line({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', color: bs.text.secondary }}>
      <Box aria-hidden sx={{ display: 'flex', mt: 0.25, '& svg': { fontSize: 20 } }}>
        {icon}
      </Box>
      <Typography variant="body2" component="div" sx={{ color: 'inherit', minWidth: 0 }}>
        {children}
      </Typography>
    </Box>
  );
}

/**
 * One booking of "Mis reservas". The three statuses stay separate badges and each shows only where it matters:
 * booking status always; assignment while the booking is active; payment while active and, when cancelled, only if refunded.
 */
export function BookingCard({ booking: b, tab, rating, onTrack, onCancel, onReview, onReceipt, onRebook }: BookingCardProps) {
  const t = useT(messages);
  const locale = useLocale();
  const Icon = unitIcon[b.unit];
  const title = `${unitMeta[b.unit].name} ${b.package.name[locale]}`;
  const where = b.center ? `${b.center.name} · ${formatAddress(b.center.address)}` : b.address ? formatAddress(b.address) : '';
  const refund = refundOf(b);

  return (
    <Card component="article">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <IconBubble>
            <Icon />
          </IconBubble>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h4" component="h3">
              {title}
            </Typography>
            <Typography variant="caption" component="p" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
              {t.on(b.id)}
            </Typography>
          </Box>
          <Price amount={b.total} size="md" />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Line icon={<EventOutlined />}>
            <Box component="span" sx={{ color: bs.text.primary, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {formatDateShort(b.date, locale)} · {formatSlotTime(b.time, locale)}
            </Box>
          </Line>
          <Line icon={<DirectionsCarOutlined />}>
            {vehicleName(b.vehicle)} · {b.vehicle.plate}
          </Line>
          <Line icon={<PlaceOutlined />}>{where}</Line>
          {b.auction && b.yard && (
            <Line icon={<GavelRounded />}>
              {auctionLabel[b.auction.auction]} · {b.yard.name} · {t.lot} <Box component="span" sx={{ color: bs.text.primary, fontVariantNumeric: 'tabular-nums' }}>{b.auction.lot}</Box> · {t.code}{' '}
              <Box component="span" sx={{ color: bs.text.primary, fontVariantNumeric: 'tabular-nums' }}>{b.auction.code}</Box>
            </Line>
          )}
        </Box>

        {tab === 'active' && b.assignee && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <InitialsAvatar name={b.assignee.name} size="sm" />
            <Typography variant="body2" sx={{ color: bs.text.secondary }}>
              {t.assignedTo} <Box component="span" sx={{ color: bs.text.primary, fontWeight: 600 }}>{b.assignee.name}</Box> · {b.assignee.role[locale]}
            </Typography>
          </Box>
        )}

        {tab === 'active' && b.payment.status === 'failed' && <InlineAlert severity="error">{t.failed}</InlineAlert>}

        {tab === 'cancelled' && (
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {refund.kind === 'refunded' ? t.refund(formatMoney(refund.amount, locale), b.paymentMethod.label[locale]) : t.noCharge}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          {tab === 'active' && (
            <>
              <Box sx={{ flex: 1, minWidth: 140 }}>
                <Button variant="secondary" size="md" fullWidth onClick={onTrack}>
                  {t.track}
                </Button>
              </Box>
              <Button variant="quiet" size="md" onClick={onCancel}>
                {t.cancel}
              </Button>
            </>
          )}
          {tab === 'completed' && (
            <>
              <Box sx={{ flex: 1, minWidth: 140 }}>
                {rating ? (
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: bs.text.secondary }}>
                    <StarRounded aria-hidden fontSize="small" />
                    {t.reviewed(rating)}
                  </Typography>
                ) : (
                  <Button variant="secondary" size="md" fullWidth onClick={onReview}>
                    {t.review}
                  </Button>
                )}
              </Box>
              <Button variant="quiet" size="md" onClick={onReceipt}>
                {t.receipt}
              </Button>
            </>
          )}
          {tab === 'cancelled' && (
            <Button variant="secondary" size="md" fullWidth onClick={onRebook}>
              {t.again}
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}
