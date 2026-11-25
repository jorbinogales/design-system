import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChoosePackageScreen } from './ChoosePackageScreen';

const meta = {
  title: 'Pantallas/Reserva/03 Elegir paquete',
  component: ChoosePackageScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ChoosePackageScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <ChoosePackageScreen /> };
export const SinSeleccion: StoryObj<typeof meta> = { name: 'Sin selección', render: () => <ChoosePackageScreen initialId={null} /> };
