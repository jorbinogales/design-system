import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { TimeSlot, type SlotStatus } from './TimeSlot';

const m = {
  es: { group: 'Horario de la cita', available: 'Disponible', full: 'Completo', closed: 'Fuera de horario', taken: 'Se ocupó', morning: 'Mañana libre para el lavado a domicilio' },
  en: { group: 'Appointment time', available: 'Available', full: 'Full', closed: 'Outside hours', taken: 'Just taken', morning: 'Free morning for the mobile wash' },
};

function InteractiveDemo({ time, status }: { time: string; status: SlotStatus }) {
  const t = useT(m);
  const [selected, setSelected] = useState(false);
  return (
    <Box role="radiogroup" aria-label={t.group} sx={{ width: 120 }}>
      <TimeSlot time={time} status={status} selected={selected && status === 'available'} onSelect={() => setSelected(true)} tabIndex={0} />
    </Box>
  );
}

function StatesDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const cell = { width: 112 };
  return (
    <Showcase>
      <Specimen label={`${t.available} · ${l.selected} · ${t.full} · ${t.closed} · ${t.taken}`}>
        <Box role="radiogroup" aria-label={t.group} sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={cell}>
            <TimeSlot time="09:00" tabIndex={0} />
          </Box>
          <Box sx={cell}>
            <TimeSlot time="10:00" selected tabIndex={-1} />
          </Box>
          <Box sx={cell}>
            <TimeSlot time="11:00" status="full" tabIndex={-1} />
          </Box>
          <Box sx={cell}>
            <TimeSlot time="07:00" status="closed" tabIndex={-1} />
          </Box>
          <Box sx={cell}>
            <TimeSlot time="13:30" status="taken" tabIndex={-1} />
          </Box>
        </Box>
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  const [value, setValue] = useState('09:30');
  const slots: { time: string; status?: SlotStatus }[] = [{ time: '08:30', status: 'full' }, { time: '09:30' }, { time: '10:30' }, { time: '11:30', status: 'full' }];
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <Specimen label={t.morning} direction="column" align="stretch">
        <Box role="radiogroup" aria-label={t.group} sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 2 }}>
          {slots.map((s) => (
            <TimeSlot key={s.time} time={s.time} status={s.status} selected={value === s.time} tabIndex={value === s.time ? 0 : -1} onSelect={() => setValue(s.time)} />
          ))}
        </Box>
      </Specimen>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Fecha y hora/Franja horaria',
  component: TimeSlot,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Una **hora de inicio** que el cliente puede elegir. Es un radio con aspecto de botón; normalmente vive dentro de un Grupo de horarios.',
          anatomy: ['**Hora** en el formato del idioma (“9:00 a. m.” / “9:00 AM”)', '**Texto de estado** bajo la hora: Completo, Cerrado, Ocupado (opcional)', '**Marca de selección** (check) en la esquina'],
          props: ['`time` va en formato 24 h `"HH:mm"`; el componente la formatea según el idioma.', '`status`: `available`, `full`, `closed` o `taken` (se ocupó mientras el cliente decidía).', 'Usa `formatSlotTime(time, locale)` para mostrar la misma hora en resúmenes.'],
          states: [
            'Reposo · hover (puntero) · foco visible.',
            'Seleccionado: fondo naranja suave, borde naranja y check.',
            'Completo: borde discontinuo, hora tachada y texto “Completo”.',
            'Fuera de horario: fondo y texto deshabilitados con icono de bloqueo y texto “Cerrado”.',
            'Ocupado: fondo de peligro suave, icono de evento ocupado, hora tachada y texto “Ocupado”.',
          ],
          tokens: [
            ['Reposo', 'surface.subtle · border.subtle'],
            ['Seleccionado', 'selection.bg · selection.border'],
            ['Completo', 'text.secondary · border.subtle (discontinuo)'],
            ['Fuera de horario', 'disabled.bg · disabled.fg · disabled.border'],
            ['Ocupado', 'status.danger.bg · status.danger.fg · status.danger.border'],
            ['Radio · alto', 'radius.md · 52 px'],
          ],
          responsive: ['Ocupa el ancho de su celda (mínimo 96 px) y mide 52 px de alto: objetivo táctil cómodo.', 'La hora no se parte en dos líneas.'],
          a11y: [
            '`role="radio"` con `aria-checked`; las franjas no disponibles llevan `aria-disabled` y su estado en el nombre: “11:00 a. m., completo”.',
            'El estado se ve en texto, forma (borde discontinuo, tachado) e icono, no solo en color.',
            'El foco usa `focus.ring`; el grupo contenedor gestiona el tab stop y las flechas.',
          ],
          content: [
            ['9:00 a. m. · Completo · Cerrado · Ocupado', '9:00 AM · Full · Closed · Taken'],
            ['11:00 a. m., fuera del horario de atención', '11:00 AM, outside business hours'],
          ],
          example: '**Ejemplo de negocio**: ventana de la mañana para Personal Washing, con 8:30 y 11:30 completas y 9:30 elegida.',
        }),
      },
    },
  },
} satisfies Meta<typeof TimeSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { time: '10:00', status: 'available' },
  argTypes: { status: { control: 'inline-radio', options: ['available', 'full', 'closed', 'taken'] } },
  render: (args) => <InteractiveDemo time={args.time} status={args.status ?? 'available'} />,
};

export const States: Story = { name: 'Estados', args: { time: '09:00' }, render: () => <StatesDemo /> };

export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: { time: '09:30' }, render: () => <BusinessDemo /> };
