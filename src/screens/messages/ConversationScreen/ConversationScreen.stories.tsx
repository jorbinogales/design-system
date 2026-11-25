import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConversationScreen } from './ConversationScreen';

const meta = {
  title: 'Pantallas/Mensajes/02 Conversación',
  component: ConversationScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'light' } },
} satisfies Meta<typeof ConversationScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const Escribiendo: Story = {
  args: { defaultDraft: 'Gracias Mateo, te espero en la puerta de casa.' },
};

export const OpcionesDeAdjunto: Story = {
  name: 'Opciones de adjunto',
  args: { initialSheetOpen: true },
};
