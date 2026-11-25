import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhotoViewerScreen } from './PhotoViewerScreen';

const meta = {
  title: 'Pantallas/Servicio/09 Galería',
  component: PhotoViewerScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'light' } },
} satisfies Meta<typeof PhotoViewerScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = { args: { defaultIndex: 2 } };
