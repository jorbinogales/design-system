import type { Meta, StoryObj } from '@storybook/react-vite';
import { emptyAuctionPickup } from '../../../blackseat/AuctionPickupForm/AuctionPickupForm';
import { AuctionPickupScreen, invalidPickup } from './AuctionPickupScreen';

const meta = {
  title: 'Pantallas/Reserva/05 Recogida en subasta',
  component: AuctionPickupScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof AuctionPickupScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <AuctionPickupScreen /> };
export const Vacio: StoryObj<typeof meta> = { name: 'Vacío', render: () => <AuctionPickupScreen initial={emptyAuctionPickup} /> };
export const ConErrores: StoryObj<typeof meta> = { name: 'Con errores', render: () => <AuctionPickupScreen initial={invalidPickup} showErrors /> };
