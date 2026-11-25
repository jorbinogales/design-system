import type { Meta, StoryObj } from '@storybook/react-vite';
import { OfferScreen } from './OfferScreen';

const meta = {
  title: 'Pantallas/Inicio y exploración/09 Oferta 40%',
  component: OfferScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof OfferScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const PremiumConDescuento: Story = { name: 'Premium con 15 %', args: { offerId: 'off-1' } };
