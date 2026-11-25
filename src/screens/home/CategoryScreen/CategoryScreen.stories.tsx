import type { Meta, StoryObj } from '@storybook/react-vite';
import { CategoryScreen } from './CategoryScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/07 Lavado exterior',
  component: CategoryScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof CategoryScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const Grua: Story = { name: 'Otra categoría: Grúa', args: { categoryId: 'towing' } };
