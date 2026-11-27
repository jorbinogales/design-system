import Box from '@mui/material/Box';
import { useState } from 'react';
import { useNav } from '../../app/nav';
import { Button } from '../../components/actions/Button/Button';
import { SkeletonCard, SkeletonGroup } from '../../components/feedback/Skeleton/Skeleton';
import { BottomNav } from '../../components/navigation/BottomNav/BottomNav';
import { TabPanel, Tabs } from '../../components/navigation/Tabs/Tabs';
import { TopBar } from '../../components/navigation/TopBar/TopBar';
import { NoItemsState } from '../../components/screen-states/StatePresets/StatePresets';
import type { BookingDetail } from '../../domain/booking';
import { useT } from '../../i18n/locale';
import { layout } from '../../theme/tokens';
import { ScreenRoot } from '../profile/ui';
import { BookingCard, type BookingsTab } from './BookingCard';
import { activeBookings, cancelledBookings, completedBookings, reviewedRatings } from './data';

const messages = {
  es: {
    title: 'Mis reservas',
    tabs: 'Estado de las reservas',
    active: 'Activas',
    completed: 'Completadas',
    cancelled: 'Canceladas',
    loading: 'Cargando tus reservas',
    empty: {
      active: { title: 'No tienes reservas activas', body: 'Cuando reserves un servicio lo verás aquí para seguirlo o cancelarlo.', cta: 'Reservar un servicio' },
      completed: { title: 'Aún no hay reservas completadas', body: 'Tus servicios terminados aparecerán aquí con su recibo y tu reseña.' },
      cancelled: { title: 'No tienes reservas canceladas', body: 'Si cancelas una reserva, aquí verás el estado de tu reembolso.' },
    },
  },
  en: {
    title: 'My bookings',
    tabs: 'Booking status',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
    loading: 'Loading your bookings',
    empty: {
      active: { title: 'You have no active bookings', body: 'When you book a service you will see it here to track or cancel it.', cta: 'Book a service' },
      completed: { title: 'No completed bookings yet', body: 'Your finished services will show up here with their receipt and your review.' },
      cancelled: { title: 'You have no cancelled bookings', body: 'If you cancel a booking, you will see the status of your refund here.' },
    },
  },
};

export interface BookingsListProps {
  initialTab?: BookingsTab;
  state?: 'default' | 'loading' | 'empty';
}

const tabRoute: Record<BookingsTab, string> = { active: 'bookings', completed: 'completed-bookings', cancelled: 'cancelled-bookings' };
const data = { active: activeBookings, completed: completedBookings, cancelled: cancelledBookings };

/** Shared body of the three "Mis reservas" screens: top bar, status tabs, booking cards (or skeleton / empty state) and the client BottomNav. */
export function BookingsList({ initialTab = 'active', state = 'default' }: BookingsListProps) {
  const t = useT(messages);
  const nav = useNav();
  const [navTab, setNavTab] = useState('bookings');
  const [tab, setTab] = useState<BookingsTab>(initialTab);
  // Each tab is its own root route in the app, so Android back leaves the list instead of walking the tabs.
  const changeTab = (next: BookingsTab) => {
    setTab(next);
    nav.reset(tabRoute[next]);
  };
  const rebook = (b: BookingDetail) => (b.unit === 'towing' ? nav.go('auction-pickup', { unit: 'towing' }) : nav.go('select-vehicle', { unit: b.unit }));

  const panel = (value: BookingsTab) => {
    if (state === 'loading') {
      return (
        <SkeletonGroup label={t.loading}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </Box>
        </SkeletonGroup>
      );
    }
    if (state === 'empty') {
      const e = t.empty[value];
      return <NoItemsState layout="inline" title={e.title} description={e.body} primaryAction={'cta' in e ? <Button onClick={() => nav.go('explore')}>{e.cta}</Button> : undefined} />;
    }
    return (
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {data[value].map((b) => (
          <li key={b.id}>
            <BookingCard
              booking={b}
              tab={value}
              rating={reviewedRatings[b.id]}
              onTrack={() => nav.go('track-order', { bookingId: b.id })}
              onCancel={() => nav.go('cancel-booking', { bookingId: b.id })}
              onReview={() => nav.go('write-review', { bookingId: b.id })}
              onReceipt={() => nav.go('receipt', { bookingId: b.id })}
              onRebook={() => rebook(b)}
            />
          </li>
        ))}
      </Box>
    );
  };

  return (
    <ScreenRoot>
      <TopBar title={t.title} />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flex: 1, px: `${layout.gutter.mobile}px`, pb: 6 }}>
        <Tabs
          idPrefix="bookings"
          label={t.tabs}
          value={tab}
          onChange={changeTab}
          items={[
            { value: 'active', label: t.active, count: state === 'default' ? activeBookings.length : undefined },
            { value: 'completed', label: t.completed },
            { value: 'cancelled', label: t.cancelled },
          ]}
        />
        {(['active', 'completed', 'cancelled'] as const).map((value) => (
          <TabPanel key={value} idPrefix="bookings" value={value} current={tab}>
            <Box sx={{ pt: 4 }}>{panel(value)}</Box>
          </TabPanel>
        ))}
      </Box>
      <BottomNav side="client" value={navTab} onChange={setNavTab} />
    </ScreenRoot>
  );
}
