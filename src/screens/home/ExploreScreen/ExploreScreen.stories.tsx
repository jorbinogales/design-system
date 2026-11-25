import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExploreScreen } from './ExploreScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/02 Explorar',
  component: ExploreScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ExploreScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const OtroCentroSeleccionado: Story = { name: 'Brickell seleccionado', args: { defaultSelectedId: 'c-brickell' } };
