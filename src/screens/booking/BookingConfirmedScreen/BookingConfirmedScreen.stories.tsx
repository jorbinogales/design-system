import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookingConfirmedScreen } from './BookingConfirmedScreen';

const meta = {
  title: 'Pantallas/Reserva/10 Reserva confirmada',
  component: BookingConfirmedScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof BookingConfirmedScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado (BS-24117)', render: () => <BookingConfirmedScreen /> };
export const Towing: StoryObj<typeof meta> = { name: 'Towing (BS-24120)', render: () => <BookingConfirmedScreen bookingId="BS-24120" /> };
