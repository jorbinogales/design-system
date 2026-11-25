import type { Meta, StoryObj } from '@storybook/react-vite';
import { CenterLocationScreen } from './CenterLocationScreen';

const meta = {
  title: 'Pantallas/Servicio/05 Ubicación del centro',
  component: CenterLocationScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof CenterLocationScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = {};
