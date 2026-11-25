import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddMoneyScreen } from './AddMoneyScreen';

const meta = {
  title: 'Pantallas/Perfil/07 Agregar dinero',
  component: AddMoneyScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof AddMoneyScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <AddMoneyScreen /> };
export const MontoElegido: StoryObj<typeof meta> = { name: 'Monto elegido', render: () => <AddMoneyScreen initialAmount="50" /> };
export const ConError: StoryObj<typeof meta> = { name: 'Con error', render: () => <AddMoneyScreen initialAmount="5" /> };
