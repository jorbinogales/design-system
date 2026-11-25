import type { Meta, StoryObj } from '@storybook/react-vite';
import { DirectionsScreen } from './DirectionsScreen';

const meta = {
  title: 'Pantallas/Servicio/06 Cómo llegar',
  component: DirectionsScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof DirectionsScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const EnCurso: Story = { name: 'Navegación en curso', args: { defaultStarted: true } };
