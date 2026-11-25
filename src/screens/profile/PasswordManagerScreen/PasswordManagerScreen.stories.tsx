import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordManagerScreen } from './PasswordManagerScreen';

const meta = {
  title: 'Pantallas/Perfil/10 Gestor de contraseñas',
  component: PasswordManagerScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof PasswordManagerScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <PasswordManagerScreen /> };

export const ConError: StoryObj<typeof meta> = {
  name: 'Con error',
  render: () => <PasswordManagerScreen submitted initial={{ current: 'Blackseat2025', next: 'corta', confirm: 'otra' }} />,
};
