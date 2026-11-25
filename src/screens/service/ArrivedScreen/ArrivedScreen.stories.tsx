import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrivedScreen } from './ArrivedScreen';

const meta = {
  title: 'Pantallas/Servicio/07 Has llegado',
  component: ArrivedScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ArrivedScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = {};
