import type { Meta, StoryObj } from '@storybook/react-vite';
import { InviteFriendsScreen } from './InviteFriendsScreen';

const meta = {
  title: 'Pantallas/Perfil/13 Invitar amigos',
  component: InviteFriendsScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof InviteFriendsScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <InviteFriendsScreen /> };
