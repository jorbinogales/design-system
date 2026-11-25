import { BookingsList, type BookingsListProps } from '../BookingsList';

export type CancelledBookingsScreenProps = Pick<BookingsListProps, 'state'>;

/** Mis reservas · Canceladas: Tabs Activas / Completadas / Canceladas opened on the "Canceladas" tab. */
export function CancelledBookingsScreen({ state }: CancelledBookingsScreenProps) {
  return <BookingsList initialTab="cancelled" state={state} />;
}
