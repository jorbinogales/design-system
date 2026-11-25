import type { Meta, StoryObj } from '@storybook/react-vite';
import { PrivacyPolicyScreen } from './PrivacyPolicyScreen';

const meta = {
  title: 'Pantallas/Perfil/12 Política de privacidad',
  component: PrivacyPolicyScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof PrivacyPolicyScreen>;
export default meta;

/** Sample legal copy: needs legal review before launch. */
export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <PrivacyPolicyScreen /> };
