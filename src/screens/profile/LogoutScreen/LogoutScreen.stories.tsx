import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfileScreen } from '../ProfileScreen/ProfileScreen';

const meta = {
  title: 'Pantallas/Perfil/14 Cerrar sesión',
  component: ProfileScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ProfileScreen>;
export default meta;

/** Confirmation bottom sheet (s81) over the profile screen. */
export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <ProfileScreen signOutOpen /> };
