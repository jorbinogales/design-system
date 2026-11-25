import type { Meta, StoryObj } from '@storybook/react-vite';
import { WriteReviewScreen } from './WriteReviewScreen';

const meta = {
  title: 'Pantallas/Servicio/10 Escribir reseña',
  component: WriteReviewScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof WriteReviewScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Predeterminado: Story = {};

export const ListaParaEnviar: Story = {
  name: 'Lista para enviar',
  args: { defaultRating: 5, defaultText: 'Dejaron el SUV impecable y me mandaron fotos del antes y el después.', defaultPhotos: 2 },
};
