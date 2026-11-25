import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResultsScreen } from './ResultsScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/04 Resultados',
  component: ResultsScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ResultsScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const Cargando: Story = { args: { loading: true } };

export const SinResultados: Story = { name: 'Sin resultados', args: { defaultQuery: 'Tesla' } };

export const ConError: Story = { name: 'Con error', args: { error: true } };
