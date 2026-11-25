import type { Meta, StoryObj } from '@storybook/react-vite';
import { DemoVideoScreen } from './DemoVideoScreen';

const meta = {
  title: 'Pantallas/Servicio/08 Video demo',
  component: DemoVideoScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'light' } },
} satisfies Meta<typeof DemoVideoScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const EnPausa: Story = { name: 'En pausa', args: { defaultPlaying: false } };
