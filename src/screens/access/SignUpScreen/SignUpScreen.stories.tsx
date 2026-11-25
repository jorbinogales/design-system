import type { Meta, StoryObj } from '@storybook/react-vite';
import { SignUpScreen } from './SignUpScreen';

const meta = {
  title: 'Pantallas/Acceso/07 Crear cuenta',
  component: SignUpScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof SignUpScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const ConError: Story = {
  name: 'Con error',
  args: { defaultName: 'Andrea Salcedo', defaultEmail: 'andrea.salcedo@', defaultPassword: 'clave', initialSubmitted: true },
};

export const Cargando: Story = {
  args: { defaultName: 'Andrea Salcedo', defaultEmail: 'andrea.salcedo@example.com', defaultPassword: 'BlackSeat2025', defaultAccepted: true, loading: true },
};
