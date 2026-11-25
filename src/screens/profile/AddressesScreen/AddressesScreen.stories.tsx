import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddressesScreen } from './AddressesScreen';

const meta = {
  title: 'Pantallas/Perfil/04 Direcciones',
  component: AddressesScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof AddressesScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <AddressesScreen /> };
export const Cargando: StoryObj<typeof meta> = { name: 'Cargando', render: () => <AddressesScreen state="loading" /> };
export const Vacio: StoryObj<typeof meta> = { name: 'Vacío', render: () => <AddressesScreen state="empty" /> };
