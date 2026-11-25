import type { Meta, StoryObj } from '@storybook/react-vite';
import { HelpCenterScreen } from './HelpCenterScreen';

const meta = {
  title: 'Pantallas/Perfil/11 Centro de ayuda',
  component: HelpCenterScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof HelpCenterScreen>;
export default meta;

export const FAQ: StoryObj<typeof meta> = { name: 'Preguntas frecuentes', render: () => <HelpCenterScreen /> };
export const Contactanos: StoryObj<typeof meta> = { name: 'Contáctanos', render: () => <HelpCenterScreen initialTab="contact" /> };
export const SinResultados: StoryObj<typeof meta> = { name: 'Sin resultados', render: () => <HelpCenterScreen initialQuery="remolque aéreo" /> };
