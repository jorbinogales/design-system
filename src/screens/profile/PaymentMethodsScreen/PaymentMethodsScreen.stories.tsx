import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaymentMethodsScreen } from './PaymentMethodsScreen';

const meta = {
  title: 'Pantallas/Perfil/03 Métodos de pago',
  component: PaymentMethodsScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof PaymentMethodsScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <PaymentMethodsScreen /> };
