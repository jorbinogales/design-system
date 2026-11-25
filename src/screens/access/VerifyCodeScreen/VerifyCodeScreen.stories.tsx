import type { Meta, StoryObj } from '@storybook/react-vite';
import { VerifyCodeScreen } from './VerifyCodeScreen';

const meta = {
  title: 'Pantallas/Acceso/08 Verificar código',
  component: VerifyCodeScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof VerifyCodeScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Escribe 4821 para el código correcto. */
export const Predeterminado: Story = { args: { initialCode: '48' } };

export const ConError: Story = {
  name: 'Con error',
  args: { initialCode: '4820', initialInvalid: true },
};

export const ReenvioDisponible: Story = {
  name: 'Reenvío disponible',
  args: { initialCode: '', initialSeconds: 0 },
};
