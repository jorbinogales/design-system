import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddVehicleScreen } from './AddVehicleScreen';

const meta = {
  title: 'Pantallas/Reserva/02 Agregar vehículo',
  component: AddVehicleScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof AddVehicleScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <AddVehicleScreen /> };
export const ConErrores: StoryObj<typeof meta> = { name: 'Con errores', render: () => <AddVehicleScreen showErrors /> };
