import type { Meta, StoryObj } from '@storybook/react-vite';
import { ForYouScreen } from './ForYouScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/08 Para ti',
  component: ForYouScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ForYouScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = {};
