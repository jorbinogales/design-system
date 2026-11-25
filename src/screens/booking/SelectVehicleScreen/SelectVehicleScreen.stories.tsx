import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectVehicleScreen } from './SelectVehicleScreen';

const meta = {
  title: 'Pantallas/Reserva/01 Seleccionar vehículo',
  component: SelectVehicleScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof SelectVehicleScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <SelectVehicleScreen /> };
export const SinSeleccion: StoryObj<typeof meta> = { name: 'Sin selección', render: () => <SelectVehicleScreen initialId={null} /> };
