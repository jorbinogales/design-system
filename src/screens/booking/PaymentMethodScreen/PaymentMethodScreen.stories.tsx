import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaymentMethodScreen } from './PaymentMethodScreen';

const meta = {
  title: 'Pantallas/Reserva/07 Método de pago',
  component: PaymentMethodScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof PaymentMethodScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado (Zelle, pago pendiente)', render: () => <PaymentMethodScreen /> };
export const Tarjeta: StoryObj<typeof meta> = { name: 'Tarjeta (cobro en línea)', render: () => <PaymentMethodScreen initialId="pm-card" /> };
