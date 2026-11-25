import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingScreen } from './OnboardingScreen';

const meta = {
  title: 'Pantallas/Acceso/05 Onboarding 3',
  component: OnboardingScreen,
  tags: ['!autodocs'],
  args: { initialStep: 2 },
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto', background: 'subtle' } },
} satisfies Meta<typeof OnboardingScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};
