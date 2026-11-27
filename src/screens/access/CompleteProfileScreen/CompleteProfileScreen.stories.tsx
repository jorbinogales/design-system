import type { Meta, StoryObj } from '@storybook/react-vite';
import { CompleteProfileScreen } from './CompleteProfileScreen';

const meta = {
  title: 'Pantallas/Acceso/10 Completar perfil',
  component: CompleteProfileScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof CompleteProfileScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const ConError: Story = {
  name: 'Con error',
  args: { defaultPhone: '305555', initialSubmitted: true },
};

export const ConFoto: Story = {
  name: 'Opciones de foto',
  args: { defaultPhone: '3055550188', initialSheetOpen: true },
};
