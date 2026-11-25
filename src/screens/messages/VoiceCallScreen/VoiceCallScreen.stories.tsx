import type { Meta, StoryObj } from '@storybook/react-vite';
import { VoiceCallScreen } from './VoiceCallScreen';

const meta = {
  title: 'Pantallas/Mensajes/04 Llamada de voz',
  component: VoiceCallScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'light' } },
} satisfies Meta<typeof VoiceCallScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const Silenciada: Story = { args: { initialMuted: true } };
