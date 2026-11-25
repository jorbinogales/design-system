import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchScreen } from './SearchScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/03 Búsqueda',
  component: SearchScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof SearchScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const SinRecientes: Story = { name: 'Sin búsquedas recientes', args: { noRecents: true } };
