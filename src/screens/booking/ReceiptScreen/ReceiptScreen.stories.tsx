import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReceiptScreen } from './ReceiptScreen';

const meta = {
  title: 'Pantallas/Reserva/11 Recibo electrónico',
  component: ReceiptScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ReceiptScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado (pagado, PAY-9F4K2L)', render: () => <ReceiptScreen /> };
export const PagoPendiente: StoryObj<typeof meta> = { name: 'Pago pendiente (BS-24117)', render: () => <ReceiptScreen bookingId="BS-24117" /> };
