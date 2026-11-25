import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActiveBookingsScreen } from './ActiveBookingsScreen';

const meta = {
  title: 'Pantallas/Mis reservas/01 Mis reservas · Activas',
  component: ActiveBookingsScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ActiveBookingsScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <ActiveBookingsScreen /> };
export const Cargando: StoryObj<typeof meta> = { name: 'Cargando', render: () => <ActiveBookingsScreen state="loading" /> };
export const Vacio: StoryObj<typeof meta> = { name: 'Vacío', render: () => <ActiveBookingsScreen state="empty" /> };
