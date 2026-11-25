import type { Meta, StoryObj } from '@storybook/react-vite';
import { towingAssigned } from '../data';
import { LiveLocationScreen } from './LiveLocationScreen';

const meta = {
  title: 'Pantallas/Mis reservas/05 Ubicación en vivo',
  component: LiveLocationScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof LiveLocationScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado (Personal Washing, BS-24118)', render: () => <LiveLocationScreen /> };
export const Towing: StoryObj<typeof meta> = {
  name: 'Towing (del patio a la entrega, BS-24120)',
  render: () => <LiveLocationScreen booking={towingAssigned} etaMin={32} />,
};
