import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReviewSummaryScreen } from './ReviewSummaryScreen';

const meta = {
  title: 'Pantallas/Reserva/09 Resumen',
  component: ReviewSummaryScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ReviewSummaryScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado (Detailing Premium, BS-24117)', render: () => <ReviewSummaryScreen /> };
export const SinCupon: StoryObj<typeof meta> = { name: 'Sin cupón', render: () => <ReviewSummaryScreen couponApplied={false} /> };
export const Towing: StoryObj<typeof meta> = { name: 'Towing (BS-24120)', render: () => <ReviewSummaryScreen bookingId="BS-24120" couponApplied={false} /> };
