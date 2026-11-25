import type { Meta, StoryObj } from '@storybook/react-vite';
import { LocationPermissionScreen } from './LocationPermissionScreen';

const meta = {
  title: 'Pantallas/Acceso/11 Tu ubicación',
  component: LocationPermissionScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof LocationPermissionScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const PermisoDenegado: Story = {
  name: 'Permiso denegado',
  args: { denied: true },
};
