import type { Meta, StoryObj } from '@storybook/react-vite';
import { YourProfileScreen } from './YourProfileScreen';

const meta = {
  title: 'Pantallas/Perfil/02 Tu perfil',
  component: YourProfileScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof YourProfileScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <YourProfileScreen /> };

export const ConError: StoryObj<typeof meta> = {
  name: 'Con error',
  render: () => <YourProfileScreen submitted initial={{ name: 'Andrea', phone: '305 55', email: 'andrea.salcedo@' }} />,
};
