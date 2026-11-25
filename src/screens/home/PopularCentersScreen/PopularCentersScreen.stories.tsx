import type { Meta, StoryObj } from '@storybook/react-vite';
import { PopularCentersScreen } from './PopularCentersScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/10 Centros populares',
  component: PopularCentersScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof PopularCentersScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = {};
