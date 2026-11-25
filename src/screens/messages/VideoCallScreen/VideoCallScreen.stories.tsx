import type { Meta, StoryObj } from '@storybook/react-vite';
import { VideoCallScreen } from './VideoCallScreen';

const meta = {
  title: 'Pantallas/Mensajes/03 Videollamada',
  component: VideoCallScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'light' } },
} satisfies Meta<typeof VideoCallScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const CamaraApagadaYSilenciada: Story = {
  name: 'Cámara apagada y silenciada',
  args: { initialCameraOff: true, initialMuted: true },
};
