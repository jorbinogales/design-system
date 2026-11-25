import type { Meta, StoryObj } from '@storybook/react-vite';
import { NewPasswordScreen } from './NewPasswordScreen';

const meta = {
  title: 'Pantallas/Acceso/09 Nueva contraseña',
  component: NewPasswordScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof NewPasswordScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const ConError: Story = {
  name: 'Con error',
  args: { defaultPassword: 'BlackSix2025', defaultConfirm: 'BlackSix2024', initialSubmitted: true },
};

export const Cargando: Story = {
  args: { defaultPassword: 'BlackSix2025', defaultConfirm: 'BlackSix2025', loading: true },
};
