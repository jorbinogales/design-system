import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopUpSuccessScreen } from './TopUpSuccessScreen';

const meta = {
  title: 'Pantallas/Perfil/09 Recarga exitosa',
  component: TopUpSuccessScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof TopUpSuccessScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <TopUpSuccessScreen /> };
