import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServiceDetailScreen } from './ServiceDetailScreen';

const meta = {
  title: 'Pantallas/Servicio/02 Detalle · Servicios',
  component: ServiceDetailScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ServiceDetailScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = { args: { initialTab: 'services' } };
