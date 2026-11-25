import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddAddressScreen } from './AddAddressScreen';

const meta = {
  title: 'Pantallas/Perfil/05 Agregar dirección',
  component: AddAddressScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof AddAddressScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <AddAddressScreen /> };

export const ConError: StoryObj<typeof meta> = {
  name: 'Con error',
  render: () => (
    <AddAddressScreen
      initial={{ label: 'office', customLabel: '', street: '2601 S Bayshore Dr', unit: 'Piso 8', city: 'Coconut Grove', state: 'FL', zip: '90210', reference: '' }}
      zipError
    />
  ),
};
