import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { Button } from '../../components/actions/Button/Button';
import type { SlotOption } from '../../components/date-time/TimeSlotGroup/TimeSlotGroup';
import type { BusinessUnit } from '../../domain/units';
import { useT } from '../../i18n/locale';
import { getDayState, getSlots, mockSlotDay } from '../../mocks/availability';
import { getPackage, mockToday } from '../../mocks/catalog';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { AppointmentPicker, type AppointmentValue } from './AppointmentPicker';

const m = {
  es: { simulate: 'Simular: otro cliente reserva el horario elegido', reset: 'Restablecer', unit: { detailing: 'Detailing · Premium', towing: 'Towing · Recogida local', 'personal-washing': 'Personal Washing · Completo' } },
  en: { simulate: 'Simulate: another customer books the chosen slot', reset: 'Reset', unit: { detailing: 'Detailing · Premium', towing: 'Towing · Local pickup', 'personal-washing': 'Personal Washing · Complete' } },
};

const pkgByUnit: Record<BusinessUnit, string> = { detailing: 'det-premium', towing: 'tow-local', 'personal-washing': 'wash-complete' };

function Demo({ unit = 'detailing', simulate = false, calendar = false, initial = { day: mockSlotDay, time: '10:00' } as AppointmentValue, loading = false }: { unit?: BusinessUnit; simulate?: boolean; calendar?: boolean; initial?: AppointmentValue; loading?: boolean }) {
  const t = useT(m);
  const [value, setValue] = useState<AppointmentValue>(initial);
  const [taken, setTaken] = useState<string | null>(null);
  const slots = useMemo<SlotOption[]>(() => (value.day ? getSlots(value.day, unit).map((s) => (s.value === taken ? { ...s, status: 'taken' as const } : s)) : []), [value.day, unit, taken]);
  return (
    <Box sx={{ width: 390, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <AppointmentPicker
        value={value}
        onChange={setValue}
        start={mockToday}
        today={mockToday}
        getDayState={(d: Dayjs) => getDayState(d, unit)}
        slots={slots}
        loading={loading}
        durationMin={getPackage(pkgByUnit[unit])!.durationMin}
        showCalendar={calendar}
      />
      {simulate && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="secondary" size="md" disabled={!value.time || Boolean(taken)} onClick={() => setTaken(value.time)}>
            {t.simulate}
          </Button>
          <Button variant="quiet" size="md" onClick={() => setTaken(null)}>
            {t.reset}
          </Button>
        </Box>
      )}
    </Box>
  );
}

const meta = {
  title: 'Black Seat/Selector de cita',
  component: AppointmentPicker,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Elige día y horario de una reserva y muestra la selección actual. Si el horario elegido se ocupa antes de confirmar, **conserva los datos** y permite elegir otro.',
          anatomy: ['**Tira de días** (`DayStrip`) con Hoy, Mañana y estados por día', '**Calendario del mes** (opcional, `showCalendar`)', '**Grupo de horarios** (`TimeSlotGroup`) por Mañana / Tarde / Noche', '**Selección actual**: día, hora y hora estimada de término'],
          props: ['Componente controlado: `value { day, time }` + `onChange`. Cambiar de día conserva la hora elegida.', '`slots` son los horarios del día elegido; vuelve a pasarlos para reflejar cambios de disponibilidad.', '`getDayState` marca días disponibles, completos o cerrados (domingos, feriados).', '`durationMin` muestra cuándo termina aproximadamente el servicio.'],
          states: ['Sin selección', 'Día elegido sin hora', 'Día y hora elegidos (fondo y borde de selección)', 'Horario perdido: aviso de advertencia, datos conservados', 'Cargando disponibilidad (esqueleto)', 'Día cerrado o completo (no seleccionable)'],
          tokens: [['Selección vigente', 'selection.bg · selection.border'], ['Resumen sin selección', 'surface.subtle · border.subtle'], ['Aviso de franja perdida', 'status.warning.fg'], ['Radio', 'radius.lg']],
          responsive: ['La tira de días se desplaza horizontalmente en 390 px; los horarios usan 3 columnas.', 'En escritorio el calendario del mes ofrece una vista más amplia.'],
          a11y: ['Días y horarios son grupos de radios con flechas; un solo tab stop por grupo.', 'El resumen es una región `role="status"` que anuncia cambios.', 'Los estados Completo, Cerrado y Ocupado se dicen con texto e icono.'],
          content: [['Elige un día y un horario para continuar.', 'Pick a day and a time to continue.'], ['Ese horario ya no está disponible. Tus datos siguen guardados: elige otro horario.', 'That time is no longer available. Your details are still saved: choose another time.']],
          example: '**Ejemplo de negocio**: Detailing Premium (4 h) con el viernes 27 de noviembre a las 10:00; el jueves 26 aparece cerrado (Acción de Gracias). La historia “Se ocupó el horario” lo simula.',
        }),
      },
    },
  },
} satisfies Meta<typeof AppointmentPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { value: { day: null, time: null }, onChange: () => undefined, start: mockToday, getDayState: () => 'available' as const, slots: [] };

export const Interactive: Story = { name: 'Interactivo', args: base, render: () => <Demo calendar /> };

export const States: Story = {
  name: 'Estados',
  args: base,
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label={`${l.rest} · sin selección`} direction="column" align="stretch">
          <Demo initial={{ day: null, time: null }} />
        </Specimen>
        <Specimen label="Día sin hora / Day without time" direction="column" align="stretch">
          <Demo initial={{ day: mockSlotDay, time: null }} />
        </Specimen>
        <Specimen label={l.loading} direction="column" align="stretch">
          <Demo loading />
        </Specimen>
      </Showcase>
    );
  },
};

export const SlotTaken: Story = { name: 'Se ocupó el horario', args: base, render: () => <Demo simulate /> };

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: base,
  render: function Render() {
    const l = useStoryLabels();
    const t = useT(m);
    return (
      <Showcase>
        {(['detailing', 'towing', 'personal-washing'] as const).map((u) => (
          <Specimen key={u} label={`${l.businessExample} · ${t.unit[u]}`} direction="column" align="stretch">
            <Demo unit={u} simulate={u === 'towing'} />
          </Specimen>
        ))}
      </Showcase>
    );
  },
};
