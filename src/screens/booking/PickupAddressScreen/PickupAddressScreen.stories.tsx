import type { Meta, StoryObj } from '@storybook/react-vite';
import { PickupAddressScreen } from './PickupAddressScreen';

const meta = {
  title: 'Pantallas/Reserva/06 Recogida y entrega',
  component: PickupAddressScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof PickupAddressScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <PickupAddressScreen /> };
export const SinSeleccion: StoryObj<typeof meta> = { name: 'Sin selección', render: () => <PickupAddressScreen initialId={null} /> };
