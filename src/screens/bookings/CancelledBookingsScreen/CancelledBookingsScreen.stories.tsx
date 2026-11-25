import type { Meta, StoryObj } from '@storybook/react-vite';
import { CancelledBookingsScreen } from './CancelledBookingsScreen';

const meta = {
  title: 'Pantallas/Mis reservas/03 Mis reservas · Canceladas',
  component: CancelledBookingsScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof CancelledBookingsScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <CancelledBookingsScreen /> };
export const Vacio: StoryObj<typeof meta> = { name: 'Vacío', render: () => <CancelledBookingsScreen state="empty" /> };
