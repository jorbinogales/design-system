import type { Meta, StoryObj } from '@storybook/react-vite';
import { EnterLocationScreen } from './EnterLocationScreen';

const meta = {
  title: 'Pantallas/Acceso/12 Ingresar ubicación',
  component: EnterLocationScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof EnterLocationScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = { args: { defaultQuery: 'Doral' } };

export const Inicial: Story = { args: { defaultQuery: '' } };

export const Cargando: Story = { args: { defaultQuery: 'Brickell', loading: true } };

export const SinResultados: Story = {
  name: 'Sin resultados',
  args: { defaultQuery: 'Calle Zafiro 99' },
};
