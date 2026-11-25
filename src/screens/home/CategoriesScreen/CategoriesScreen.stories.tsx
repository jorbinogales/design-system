import type { Meta, StoryObj } from '@storybook/react-vite';
import { CategoriesScreen } from './CategoriesScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/06 Categorías',
  component: CategoriesScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof CategoriesScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = {};
