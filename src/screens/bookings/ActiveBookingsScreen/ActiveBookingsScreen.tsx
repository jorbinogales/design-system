import { BookingsList, type BookingsListProps } from '../BookingsList';

export type ActiveBookingsScreenProps = Pick<BookingsListProps, 'state'>;

/** Mis reservas · Activas: Tabs Activas / Completadas / Canceladas opened on the "Activas" tab. */
export function ActiveBookingsScreen({ state }: ActiveBookingsScreenProps) {
  return <BookingsList initialTab="active" state={state} />;
}
