import type { Meta, StoryObj } from '@storybook/react-vite';
import { CompletedBookingsScreen } from './CompletedBookingsScreen';

const meta = {
  title: 'Pantallas/Mis reservas/02 Mis reservas · Completadas',
  component: CompletedBookingsScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof CompletedBookingsScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <CompletedBookingsScreen /> };
export const Vacio: StoryObj<typeof meta> = { name: 'Vacío', render: () => <CompletedBookingsScreen state="empty" /> };
