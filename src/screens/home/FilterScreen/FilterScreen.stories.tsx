import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterScreen } from './FilterScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/05 Filtro',
  component: FilterScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof FilterScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const ConFiltrosActivos: Story = {
  name: 'Con filtros activos',
  args: { defaultValue: { unit: 'detailing', services: ['interior', 'polish'], price: [50, 300], minRating: 4.5, sort: 'rating' } },
};
