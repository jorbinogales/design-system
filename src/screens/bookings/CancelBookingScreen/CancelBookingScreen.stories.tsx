import type { Meta, StoryObj } from '@storybook/react-vite';
import { getBookingDetail } from '../../../mocks/bookings';
import { CancelBookingScreen } from './CancelBookingScreen';

const meta = {
  title: 'Pantallas/Mis reservas/06 Cancelar reserva',
  component: CancelBookingScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof CancelBookingScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado (pagada con tarjeta, BS-24118)', render: () => <CancelBookingScreen /> };
export const OtroMotivo: StoryObj<typeof meta> = {
  name: 'Otro motivo',
  render: () => <CancelBookingScreen initialReason="other" initialDetail="Voy a estar fuera de la ciudad esos días y prefiero cancelar." />,
};
export const Confirmacion: StoryObj<typeof meta> = { name: 'Confirmación destructiva', render: () => <CancelBookingScreen initialReason="reschedule" confirmOpen /> };
export const PagoPendiente: StoryObj<typeof meta> = {
  name: 'Pago pendiente (BS-24117, sin reembolso)',
  render: () => <CancelBookingScreen booking={getBookingDetail('BS-24117')} initialReason="no-need" />,
};
