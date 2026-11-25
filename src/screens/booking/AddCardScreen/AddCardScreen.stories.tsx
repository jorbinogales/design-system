import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddCardScreen } from './AddCardScreen';

const meta = {
  title: 'Pantallas/Reserva/08 Agregar tarjeta',
  component: AddCardScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof AddCardScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <AddCardScreen /> };
export const Guardando: StoryObj<typeof meta> = { name: 'Guardando', render: () => <AddCardScreen saving /> };
