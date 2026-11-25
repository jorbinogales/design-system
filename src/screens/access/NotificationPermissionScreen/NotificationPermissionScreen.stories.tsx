import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationPermissionScreen } from './NotificationPermissionScreen';

const meta = {
  title: 'Pantallas/Acceso/13 Permiso de notificaciones',
  component: NotificationPermissionScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof NotificationPermissionScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};
