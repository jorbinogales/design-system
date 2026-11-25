import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopUpWalletScreen } from './TopUpWalletScreen';

const meta = {
  title: 'Pantallas/Perfil/08 Recargar wallet',
  component: TopUpWalletScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof TopUpWalletScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <TopUpWalletScreen /> };
export const Cargando: StoryObj<typeof meta> = { name: 'Cargando', render: () => <TopUpWalletScreen submitting /> };
export const ConError: StoryObj<typeof meta> = { name: 'Con error', render: () => <TopUpWalletScreen declined /> };
