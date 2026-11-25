import type { Meta, StoryObj } from '@storybook/react-vite';
import { WelcomeScreen } from './WelcomeScreen';

const meta = {
  title: 'Pantallas/Acceso/02 Bienvenida',
  component: WelcomeScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof WelcomeScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};
