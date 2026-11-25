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
import { dayNumber, formatDateLong, monthShort, weekdayShort } from '../shared/format';

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
 * The customer's next appointment in two columns: a large date with the booking id under it, and
 * service, date, time, place and a full-width "Ver reserva" action. Statuses live in the booking detail.
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
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(96px, 30%) minmax(0, 1fr)', columnGap: 4, alignItems: 'stretch' }}>
        {/* Left column: the date, large, and the booking id under it */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            aria-hidden
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 3,
              borderRadius: `${radius.md}px`,
              backgroundColor: bs.surface.subtle,
              border: `1px solid ${bs.border.subtle}`,
            }}
          >
            <Typography variant="label" component="div" sx={{ color: bs.text.secondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {monthShort(booking.date, locale)}
            </Typography>
            <Typography component="div" sx={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, fontStretch: '108%', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', my: 0.5 }}>
              {dayNumber(booking.date)}
            </Typography>
            <Typography variant="caption" component="div" sx={{ color: bs.text.secondary, textTransform: 'capitalize' }}>
              {weekdayShort(booking.date, locale)}
            </Typography>
          </Box>
          <Typography variant="caption" component="p" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums', textAlign: 'center' }}>
            {t.code}{' '}
            <Box component="span" sx={{ color: bs.text.primary, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {booking.id}
            </Box>
          </Typography>
        </Box>

        {/* Right column: service, date, time, place and the full-width action */}
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Icon aria-hidden sx={{ fontSize: 20, flexShrink: 0, mt: '2px' }} />
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
          <Box sx={{ mt: 'auto', pt: 4 }}>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              href={href}
              onClick={onView ? () => onView(booking.id) : undefined}
              endIcon={<ArrowForwardRounded />}
              aria-label={t.viewFor(booking.id, service)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {t.view}
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
