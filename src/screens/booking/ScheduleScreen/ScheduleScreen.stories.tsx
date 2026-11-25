import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScheduleScreen } from './ScheduleScreen';

const meta = {
  title: 'Pantallas/Reserva/04 Agendar',
  component: ScheduleScreen,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
} satisfies Meta<typeof ScheduleScreen>;
export default meta;

export const Predeterminado: StoryObj<typeof meta> = { name: 'Predeterminado', render: () => <ScheduleScreen /> };
export const SinHorario: StoryObj<typeof meta> = { name: 'Sin horario elegido', render: () => <ScheduleScreen empty /> };
export const HorarioOcupado: StoryObj<typeof meta> = {
  name: 'Horario ocupado',
  parameters: { docs: { description: { story: 'Mientras la clienta terminaba la reserva, alguien tomó las 10:00. Se conservan todos sus datos (día, tipo de servicio, nota) y debe elegir otro horario.' } } },
  render: () => <ScheduleScreen slotTaken />,
};
