import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatsScreen } from './ChatsScreen';

const meta = {
  title: 'Pantallas/Mensajes/01 Chats',
  component: ChatsScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'light' } },
} satisfies Meta<typeof ChatsScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const Cargando: Story = { args: { loading: true } };

export const Vacio: Story = {
  name: 'Vacío',
  args: { conversations: [] },
};

export const SinResultados: Story = {
  name: 'Sin resultados',
  args: { defaultQuery: 'Zafiro' },
};
