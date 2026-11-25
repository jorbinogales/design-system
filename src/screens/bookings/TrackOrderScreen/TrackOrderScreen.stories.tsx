import type { Meta, StoryObj } from '@storybook/react-vite';
import { getBookingDetail } from '../../../mocks/bookings';
import { towingAssigned } from '../data';
import { TrackOrderScreen } from './TrackOrderScreen';

const meta = {
  title: 'Pantallas/Mis reservas/04 Seguimiento',
  component: TrackOrderScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof TrackOrderScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado (BS-24118, asignada y pagada)', render: () => <TrackOrderScreen /> };
export const SinAsignar: StoryObj<typeof meta> = {
  name: 'Sin asignar (BS-24117, pago pendiente)',
  render: () => <TrackOrderScreen booking={getBookingDetail('BS-24117')} />,
};
export const Towing: StoryObj<typeof meta> = { name: 'Towing (BS-24120)', render: () => <TrackOrderScreen booking={towingAssigned} /> };
