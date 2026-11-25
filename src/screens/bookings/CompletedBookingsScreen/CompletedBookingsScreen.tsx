import { BookingsList, type BookingsListProps } from '../BookingsList';

export type CompletedBookingsScreenProps = Pick<BookingsListProps, 'state'>;

/** Mis reservas · Completadas: Tabs Activas / Completadas / Canceladas opened on the "Completadas" tab. */
export function CompletedBookingsScreen({ state }: CompletedBookingsScreenProps) {
  return <BookingsList initialTab="completed" state={state} />;
}
