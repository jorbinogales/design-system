import type { Meta, StoryObj } from '@storybook/react-vite';
import { SavedScreen } from './SavedScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/12 Quitar de guardados',
  component: SavedScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof SavedScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = { args: { defaultRemoving: { kind: 'center', id: 'c-doral' } } };

export const Paquete: Story = { name: 'Quitar un paquete', args: { defaultRemoving: { kind: 'package', id: 'det-premium' } } };
