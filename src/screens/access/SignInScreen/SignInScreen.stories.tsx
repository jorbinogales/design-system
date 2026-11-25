import type { Meta, StoryObj } from '@storybook/react-vite';
import { SignInScreen } from './SignInScreen';

const meta = {
  title: 'Pantallas/Acceso/06 Iniciar sesión',
  component: SignInScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof SignInScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const ConError: Story = {
  name: 'Con error',
  args: { defaultEmail: 'andrea.salcedo@example', initialSubmitted: true },
};

export const CredencialesIncorrectas: Story = {
  name: 'Credenciales incorrectas',
  args: { defaultEmail: 'andrea.salcedo@example.com', defaultPassword: 'clave-equivocada', credentialsError: true },
};

export const Cargando: Story = {
  args: { defaultEmail: 'andrea.salcedo@example.com', defaultPassword: 'BlackSix2025', loading: true },
};
