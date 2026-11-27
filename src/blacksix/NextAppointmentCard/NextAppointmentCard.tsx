import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { BookingDetail } from '../../domain/booking';
import { unitMeta } from '../../domain/units';
import { useLocale, useT } from '../../i18n/locale';
import { unitIcon } from '../../icons/unitIcon';
import { Button } from '../../components/actions/Button/Button';
import { formatSlotTime } from '../../components/date-time/TimeSlot/TimeSlot';
import { Card } from '../../components/layout/Card/Card';
import { bs } from '../../theme/theme';
import { radius } from '../../theme/tokens';
import { dayNumber, formatDateLong, monthShort } from '../shared/format';

export interface NextAppointmentCardProps {
  booking: BookingDetail;
  onView?: (bookingId: string) => void;
  href?: string;
}

const messages = {
  es: { view: 'Ver reserva', viewFor: (id: string, s: string) => `Ver reserva ${id}: ${s}`, at: 'en', code: 'Reserva', where: { center: 'En el centro', home: 'En tu dirección', auction: 'Entrega' } },
  en: { view: 'View booking', viewFor: (id: string, s: string) => `View booking ${id}: ${s}`, at: 'at', code: 'Booking', where: { center: 'At the center', home: 'At your address', auction: 'Delivery' } },
};

/**
 * The customer's next appointment: service, date, time and status with a "Ver reserva" action.
 * The booking id (BS-24117) is the same one the confirmation and the history use.
 */
export function NextAppointmentCard({ booking, onView, href }: NextAppointmentCardProps) {
  const t = useT(messages);
  const locale = useLocale();
  const Icon = unitIcon[booking.unit];
  const service = `${unitMeta[booking.unit].name} · ${booking.package.name[locale]}`;
  const place = booking.auction ? `${t.where.auction}: ${booking.address?.city ?? ''}` : booking.center ? booking.center.name : t.where.home;

  return (
    <Card component="article">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          <Box
            aria-hidden
            sx={{ width: 60, flexShrink: 0, textAlign: 'center', py: 2, borderRadius: `${radius.md}px`, backgroundColor: bs.surface.subtle, border: `1px solid ${bs.border.subtle}` }}
          >
            <Typography variant="caption" component="div" sx={{ color: bs.text.secondary, textTransform: 'uppercase' }}>
              {monthShort(booking.date, locale)}
            </Typography>
            <Typography variant="h2" component="div" sx={{ lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
              {dayNumber(booking.date)}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon aria-hidden sx={{ fontSize: 20, flexShrink: 0 }} />
              <Typography variant="h4" component="h3">
                {service}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: bs.text.secondary, mt: 0.5 }}>
              {formatDateLong(booking.date, locale)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5 }}>
              <ScheduleOutlined aria-hidden sx={{ fontSize: 18, color: bs.text.secondary }} />
              <Typography variant="label" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatSlotTime(booking.time, locale)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mt: 1 }}>
              <PlaceOutlined aria-hidden sx={{ fontSize: 18, mt: '1px', color: bs.text.secondary }} />
              <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                {place}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
            {t.code} <Box component="span" sx={{ color: bs.text.primary, fontWeight: 600 }}>{booking.id}</Box>
          </Typography>
          <Button
            variant="secondary"
            size="md"
            href={href}
            onClick={onView ? () => onView(booking.id) : undefined}
            endIcon={<ArrowForwardRounded />}
            aria-label={t.viewFor(booking.id, service)}
          >
            {t.view}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
