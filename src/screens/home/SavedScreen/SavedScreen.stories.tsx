import type { Meta, StoryObj } from '@storybook/react-vite';
import { SavedScreen } from './SavedScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/11 Guardados',
  component: SavedScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof SavedScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const Cargando: Story = { args: { loading: true } };

export const Vacio: Story = { name: 'Vacío', args: { defaultCenters: [], defaultPackages: [] } };
