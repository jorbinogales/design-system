import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfileScreen } from './ProfileScreen';

const meta = {
  title: 'Pantallas/Perfil/01 Perfil',
  component: ProfileScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ProfileScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <ProfileScreen /> };
