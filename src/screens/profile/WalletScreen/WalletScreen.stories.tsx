import type { Meta, StoryObj } from '@storybook/react-vite';
import { WalletScreen } from './WalletScreen';

const meta = {
  title: 'Pantallas/Perfil/06 Wallet',
  component: WalletScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof WalletScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <WalletScreen /> };
export const Cargando: StoryObj<typeof meta> = { name: 'Cargando', render: () => <WalletScreen state="loading" /> };
export const Vacio: StoryObj<typeof meta> = { name: 'Vacío', render: () => <WalletScreen state="empty" /> };
