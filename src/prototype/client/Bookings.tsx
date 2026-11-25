import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import EventNoteOutlined from '@mui/icons-material/EventNoteOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { BookingSummary } from '../../blackseat/BookingSummary/BookingSummary';
import { NextAppointmentCard } from '../../blackseat/NextAppointmentCard/NextAppointmentCard';
import { PaymentPanel } from '../../blackseat/PaymentPanel/PaymentPanel';
import { StatusHistory } from '../../blackseat/StatusHistory/StatusHistory';
import { Button } from '../../components/actions/Button/Button';
import { StatusBadge } from '../../components/data-display/StatusBadge/StatusBadge';
import { useToast } from '../../components/feedback/Toast/Toast';
import { ListGroup, ListRow } from '../../components/layout/ListRow/ListRow';
import { SegmentedControl } from '../../components/navigation/SegmentedControl/SegmentedControl';
import { TopBar } from '../../components/navigation/TopBar/TopBar';
import { EmptyState } from '../../components/screen-states/EmptyState/EmptyState';
import { SuccessState } from '../../components/screen-states/SuccessState/SuccessState';
import { useT } from '../../i18n/locale';
import { bs } from '../../theme/theme';
import { me, paymentMethods, TODAY_ISO } from '../data';
import { useProto } from '../store';
import { ClientNav } from './ClientNav';
import { BlockTitle, IconBubble, ScreenBody, ScreenRoot } from './shared';

const messages = {
  es: {
    title: 'Mis reservas',
    upcoming: 'Próximas',
    past: 'Historial',
    tabs: 'Tipo de reservas',
    emptyUp: 'No tienes reservas próximas',
    emptyUpBody: 'Cuando reserves un servicio aparecerá aquí con su estado.',
    emptyPast: 'Todavía no hay historial',
    book: 'Reservar un servicio',
    detail: 'Reserva',
    status: 'Estado',
    history: 'Historial de la reserva',
    payment: 'Pago',
    cancel: 'Cancelar reserva',
    cancelled: 'En el prototipo la cancelación no se aplica.',
    yours: 'Tu reserva',
    doneTitle: '¡Reserva confirmada!',
    doneBody: (id: string) => `Tu número de reserva es ${id}. Te avisamos cuando asignemos a tu profesional.`,
    calendar: 'Añadir al calendario',
    calendarDone: 'Evento listo para tu calendario.',
    view: 'Ver la reserva',
    vip: 'Hazte VIP y ten prioridad en días llenos',
    home: 'Volver al inicio',
    notFound: 'No encontramos esa reserva',
  },
  en: {
    title: 'My bookings',
    upcoming: 'Upcoming',
    past: 'History',
    tabs: 'Booking type',
    emptyUp: 'No upcoming bookings',
    emptyUpBody: 'When you book a service it shows up here with its status.',
    emptyPast: 'No history yet',
    book: 'Book a service',
    detail: 'Booking',
    status: 'Status',
    history: 'Booking history',
    payment: 'Payment',
    cancel: 'Cancel booking',
    cancelled: 'Cancelling is not applied in this prototype.',
    yours: 'Your booking',
    doneTitle: 'Booking confirmed!',
    doneBody: (id: string) => `Your booking number is ${id}. We'll let you know when your professional is assigned.`,
    calendar: 'Add to calendar',
    calendarDone: 'Event ready for your calendar.',
    view: 'View booking',
    vip: 'Go VIP and get priority on full days',
    home: 'Back to home',
    notFound: "We couldn't find that booking",
  },
};

const isUpcoming = (date: string, status: string) => date >= TODAY_ISO && status !== 'cancelled' && status !== 'completed';

/** Mis reservas: upcoming vs history, each as the same appointment card. */
export function BookingsScreen() {
  const t = useT(messages);
  const { bookings, go } = useProto();
  const [tab, setTab] = useState<'up' | 'past'>('up');
  const mine = bookings.filter((b) => b.customerId === me.id);
  const list = mine
    .filter((b) => (tab === 'up' ? isUpcoming(b.date, b.status) : !isUpcoming(b.date, b.status)))
    .sort((a, b) => (tab === 'up' ? 1 : -1) * `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  return (
    <ScreenRoot>
      <TopBar title={t.title}>
        <SegmentedControl fullWidth label={t.tabs} value={tab} onChange={setTab} options={[{ value: 'up', label: t.upcoming }, { value: 'past', label: t.past }]} />
      </TopBar>
      <ScreenBody gap={4} sx={{ flex: 1 }}>
        {list.length === 0 ? (
          <EmptyState
            illustration={<EventNoteOutlined sx={{ fontSize: 40 }} />}
            title={tab === 'up' ? t.emptyUp : t.emptyPast}
            description={tab === 'up' ? t.emptyUpBody : undefined}
            primaryAction={<Button onClick={() => go({ name: 'home' })}>{t.book}</Button>}
          />
        ) : (
          <Box component="ul" aria-labelledby="h-list" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box component="h2" id="h-list" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', m: 0 }}>
              {tab === 'up' ? t.upcoming : t.past}
            </Box>
            {list.map((b) => (
              <Box component="li" key={b.id}>
                <NextAppointmentCard booking={b} onView={(id) => go({ name: 'booking', id })} />
              </Box>
            ))}
          </Box>
        )}
      </ScreenBody>
      <ClientNav value="bookings" />
    </ScreenRoot>
  );
}

/** Detalle de reserva (cliente): three independent statuses, summary, payment and history. */
export function BookingDetailScreen({ id }: { id: string }) {
  const t = useT(messages);
  const toast = useToast();
  const { bookings, back } = useProto();
  const b = bookings.find((x) => x.id === id);
  if (!b) {
    return (
      <ScreenRoot>
        <TopBar title={t.detail} onBack={back} />
        <EmptyState title={t.notFound} />
      </ScreenRoot>
    );
  }
  const open = b.status === 'confirmed' || b.status === 'pending_confirmation';
  return (
    <ScreenRoot>
      <TopBar title={`${t.detail} ${b.id}`} onBack={back} />
      <ScreenBody gap={7}>
        <Box component="section" aria-label={t.status} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <StatusBadge dimension="booking" status={b.status} />
          <StatusBadge dimension="assignment" status={b.assignment.status} long />
          <StatusBadge dimension="payment" status={b.payment.status} />
        </Box>
        <BookingSummary booking={b} hideAmounts />
        <Box component="section" aria-labelledby="h-pay" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <BlockTitle id="h-pay">{t.payment}</BlockTitle>
          <PaymentPanel methods={paymentMethods} value={b.payment.methodId} lines={b.lines} total={b.total} status={b.payment.status} reference={b.payment.reference} mode="receipt" />
        </Box>
        <Box component="section" aria-labelledby="h-hist" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <BlockTitle id="h-hist">{t.history}</BlockTitle>
          <StatusHistory changes={b.history} audience="customer" showUpcoming={open} />
        </Box>
        {open && (
          <Button variant="destructive" size="md" onClick={() => toast.show({ message: t.cancelled, severity: 'info' })} sx={{ alignSelf: 'flex-start' }}>
            {t.cancel}
          </Button>
        )}
      </ScreenBody>
    </ScreenRoot>
  );
}

/** Confirmación: success, the booking card, next actions and a light VIP cross-sell. */
export function ConfirmedScreen({ id }: { id: string }) {
  const t = useT(messages);
  const toast = useToast();
  const { bookings, go, isVip } = useProto();
  const b = bookings.find((x) => x.id === id);
  return (
    <ScreenRoot sx={{ pt: 'calc(var(--bs-safe-area-top, 0px) + 24px)' }}>
      <ScreenBody gap={6} sx={{ flex: 1 }}>
        <SuccessState title={t.doneTitle} description={t.doneBody(id)} headingLevel="h1" />
        {b && (
          <Box component="section" aria-labelledby="h-yours" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <BlockTitle id="h-yours">{t.yours}</BlockTitle>
            <NextAppointmentCard booking={b} onView={(x) => go({ name: 'booking', id: x })} />
          </Box>
        )}
        <ListGroup>
          <ListRow leading={<IconBubble><EventAvailableOutlined /></IconBubble>} title={t.calendar} onClick={() => toast.show({ message: t.calendarDone, severity: 'success' })} />
          <ListRow leading={<IconBubble><ReceiptLongOutlined /></IconBubble>} title={t.view} onClick={() => go({ name: 'booking', id })} />
          {!isVip && (
            <ListRow
              leading={<IconBubble><WorkspacePremiumOutlined sx={{ color: bs.brand.primary }} /></IconBubble>}
              title={<Typography variant="label">{t.vip}</Typography>}
              onClick={() => go({ name: 'vip' })}
              divider={false}
            />
          )}
        </ListGroup>
        <Box sx={{ mt: 'auto', pb: 'var(--bs-safe-area-bottom, 0px)' }}>
          <Button fullWidth onClick={() => go({ name: 'home' })}>
            {t.home}
          </Button>
        </Box>
      </ScreenBody>
    </ScreenRoot>
  );
}
