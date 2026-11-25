import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined';
import PersonSearchOutlined from '@mui/icons-material/PersonSearchOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { formatDateLong } from '../../../blackseat/shared/format';
import { Button } from '../../../components/actions/Button/Button';
import { formatAddress } from '../../../components/address/LocationCard/LocationCard';
import { formatSlotTime } from '../../../components/date-time/TimeSlot/TimeSlot';
import { IdentifierBlock } from '../../../components/data-display/IdentifierBlock/IdentifierBlock';
import { StatusBadge } from '../../../components/data-display/StatusBadge/StatusBadge';
import { KeyValue, KeyValueList } from '../../../components/layout/KeyValue/KeyValue';
import { ListGroup, ListRow } from '../../../components/layout/ListRow/ListRow';
import { SuccessState } from '../../../components/screen-states/SuccessState/SuccessState';
import { useLocale, useT } from '../../../i18n/locale';
import { getBookingDetail } from '../../../mocks/bookings';
import { vehicleName } from '../../../mocks/people';
import { layout } from '../../../theme/tokens';
import { FLOW_BOOKING_ID } from '../data';
import { IconBubble, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Reserva confirmada',
    titlePending: 'Recibimos tu solicitud',
    body: (service: string, date: string, time: string) => `Tu servicio ${service} quedó reservado para el ${date} a las ${time}.`,
    bodyPending: (service: string, date: string, time: string) => `Estamos confirmando tu servicio ${service} para el ${date} a las ${time}. Te avisamos en la app.`,
    id: 'Número de reserva',
    service: 'Servicio',
    when: 'Fecha y hora',
    place: 'Lugar',
    delivery: 'Entrega',
    vehicle: 'Vehículo',
    lot: 'Lote',
    code: 'Código de recogida',
    next: 'Qué sigue',
    nextAssign: 'Te avisaremos cuando asignemos a tu profesional',
    nextAssignBody: {
      detailing: 'Asignamos a tu detailer hasta 24 horas antes de la cita.',
      towing: 'Asignamos al conductor cuando confirmamos la recogida en el patio.',
      'personal-washing': 'Asignamos al profesional que va a tu dirección hasta 24 horas antes.',
    },
    nextPay: 'Tu pago sigue pendiente',
    nextPayBody: (m: string) => `Pagas con ${m}. Verás el estado actualizado en la reserva cuando lo recibamos.`,
    nextPaid: 'Tu pago está registrado',
    nextPaidBody: 'Puedes descargar el comprobante cuando quieras.',
    nextCome: 'Llega a tiempo',
    nextComeCenter: (where: string) => `Te esperamos en ${where}.`,
    nextComeAuction: (lot: string, code: string) => `Retiramos el vehículo con el lote ${lot} y el código ${code}. Ten tu documentación a mano.`,
    receipt: 'Ver recibo',
    bookings: 'Ver mis reservas',
  },
  en: {
    title: 'Booking confirmed',
    titlePending: 'We got your request',
    body: (service: string, date: string, time: string) => `Your ${service} service is booked for ${date} at ${time}.`,
    bodyPending: (service: string, date: string, time: string) => `We are confirming your ${service} service for ${date} at ${time}. We will tell you in the app.`,
    id: 'Booking number',
    service: 'Service',
    when: 'Date and time',
    place: 'Place',
    delivery: 'Delivery',
    vehicle: 'Vehicle',
    lot: 'Lot',
    code: 'Pickup code',
    next: 'What happens next',
    nextAssign: 'We will tell you when we assign your professional',
    nextAssignBody: {
      detailing: 'We assign your detailer up to 24 hours before the appointment.',
      towing: 'We assign the driver once the yard pickup is confirmed.',
      'personal-washing': 'We assign the professional who comes to your address up to 24 hours ahead.',
    },
    nextPay: 'Your payment is still pending',
    nextPayBody: (m: string) => `You pay with ${m}. You will see the updated status on the booking once we receive it.`,
    nextPaid: 'Your payment is recorded',
    nextPaidBody: 'You can download the receipt whenever you like.',
    nextCome: 'Arrive on time',
    nextComeCenter: (where: string) => `We are waiting for you at ${where}.`,
    nextComeAuction: (lot: string, code: string) => `We collect the vehicle with lot ${lot} and code ${code}. Keep your paperwork at hand.`,
    receipt: 'View receipt',
    bookings: 'View my bookings',
  },
};

export interface BookingConfirmedScreenProps {
  /** `BS-24117` (Detailing, Zelle pending) or `BS-24120` (Towing). */
  bookingId?: string;
}

/** Reserva confirmada (s35): SuccessState with the booking id, the three statuses, what happens next, "Ver recibo" and "Ver mis reservas". */
export function BookingConfirmedScreen({ bookingId = FLOW_BOOKING_ID }: BookingConfirmedScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const b = getBookingDetail(bookingId);
  const service = `${b.package.name[locale]}`;
  const date = formatDateLong(b.date, locale);
  const time = formatSlotTime(b.time, locale);
  const confirmed = b.status === 'confirmed';
  const place = b.center ? `${b.center.name} · ${formatAddress(b.center.address)}` : b.address ? formatAddress(b.address) : '';
  const unitName = b.unit === 'detailing' ? 'Detailing' : b.unit === 'towing' ? 'Towing' : 'Personal Washing';

  return (
    <ScreenRoot sx={{ pt: `calc(${layout.safeAreaTop} + 24px)` }}>
      <SuccessState
        title={confirmed ? t.title : t.titlePending}
        description={(confirmed ? t.body : t.bodyPending)(`${unitName} ${service}`, date, time)}
        primaryAction={<Button fullWidth>{t.receipt}</Button>}
        secondaryAction={
          <Button variant="quiet" fullWidth>
            {t.bookings}
          </Button>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, textAlign: 'left', width: '100%' }}>
          <IdentifierBlock label={t.id} value={b.id} copyable />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <StatusBadge dimension="booking" status={b.status} />
            <StatusBadge dimension="assignment" status={b.assignment.status} />
            <StatusBadge dimension="payment" status={b.payment.status} />
          </Box>
          <KeyValueList>
            <KeyValue label={t.vehicle} value={vehicleName(b.vehicle)} />
            <KeyValue label={t.when} value={`${date} · ${time}`} />
            <KeyValue label={b.auction ? t.delivery : t.place} value={place} />
            {b.auction && <KeyValue label={t.lot} value={b.auction.lot} tabular />}
            {b.auction && <KeyValue label={t.code} value={b.auction.code} tabular />}
          </KeyValueList>
          <Box component="section" aria-label={t.next} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h2">
              {t.next}
            </Typography>
            <ListGroup label={t.next}>
              {b.assignment.status === 'unassigned' && (
                <ListRow as="li" inset="none" chevron={false} leading={<IconBubble><PersonSearchOutlined /></IconBubble>} title={t.nextAssign} description={t.nextAssignBody[b.unit]} />
              )}
              <ListRow
                as="li"
                inset="none"
                chevron={false}
                leading={<IconBubble><PaymentsOutlined /></IconBubble>}
                title={b.payment.status === 'paid' ? t.nextPaid : t.nextPay}
                description={b.payment.status === 'paid' ? t.nextPaidBody : t.nextPayBody(b.paymentMethod.label[locale])}
              />
              <ListRow
                as="li"
                inset="none"
                chevron={false}
                divider={false}
                leading={<IconBubble><EventAvailableOutlined /></IconBubble>}
                title={t.nextCome}
                description={b.auction ? t.nextComeAuction(b.auction.lot, b.auction.code) : t.nextComeCenter(place)}
              />
            </ListGroup>
          </Box>
        </Box>
      </SuccessState>
    </ScreenRoot>
  );
}
