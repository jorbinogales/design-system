import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeScreen } from './HomeScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/01 Inicio',
  component: HomeScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'light' } },
} satisfies Meta<typeof HomeScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const Cargando: Story = { args: { loading: true } };
