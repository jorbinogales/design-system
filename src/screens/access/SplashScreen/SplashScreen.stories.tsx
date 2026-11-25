import type { Meta, StoryObj } from '@storybook/react-vite';
import { SplashScreen } from './SplashScreen';

const meta = {
  title: 'Pantallas/Acceso/01 Splash',
  component: SplashScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'light' } },
} satisfies Meta<typeof SplashScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};
