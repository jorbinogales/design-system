import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationsScreen } from './NotificationsScreen';

const meta = {
  title: 'Pantallas/Notificaciones/01 Notificaciones',
  component: NotificationsScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof NotificationsScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <NotificationsScreen /> };
export const Cargando: StoryObj<typeof meta> = { name: 'Cargando', render: () => <NotificationsScreen state="loading" /> };
export const Vacio: StoryObj<typeof meta> = { name: 'Vacío', render: () => <NotificationsScreen state="empty" /> };
