import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { Button } from '../../actions/Button/Button';
import type { SlotStatus } from '../TimeSlot/TimeSlot';
import { TimeSlotGroup, type SlotOption } from './TimeSlotGroup';

const m = {
  es: {
    label: 'Horario de la cita',
    simulate: 'Simular: otro cliente reserva el horario elegido',
    reset: 'Restablecer',
    loading: 'Cargando disponibilidad',
    empty: 'Sin horarios',
    allFull: 'Todo completo',
    lost: 'El horario elegido se ocupó',
    service: 'Towing · Recogida en IAA Miami North',
    window: 'Ventanas de recogida de la subasta. Lote 04217753 · código 0093.',
    chosen: (h: string) => `Elegido: ${h}`,
  },
  en: {
    label: 'Appointment time',
    simulate: 'Simulate: another customer books the chosen slot',
    reset: 'Reset',
    loading: 'Loading availability',
    empty: 'No slots',
    allFull: 'All full',
    lost: 'The chosen slot got taken',
    service: 'Towing · Pickup at IAA Miami North',
    window: 'Auction pickup windows. Lot 04217753 · code 0093.',
    chosen: (h: string) => `Chosen: ${h}`,
  },
};

const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
const full = new Set(['09:00', '13:00', '16:00']);
const closed = new Set(['08:00', '19:00']);
const build = (override: Record<string, SlotStatus> = {}): SlotOption[] =>
  hours.map((value) => ({ value, status: override[value] ?? (closed.has(value) ? 'closed' : full.has(value) ? 'full' : 'available') }));

function Demo({ loading = false, simulate = false, business = false }: { loading?: boolean; simulate?: boolean; business?: boolean }) {
  const t = useT(m);
  const [value, setValue] = useState<string | null>('10:00');
  const [taken, setTaken] = useState<Record<string, SlotStatus>>({});
  const slots = build(taken);
  return (
    <Box sx={{ width: 390, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {business && (
        <Box>
          <Typography variant="h3">{t.service}</Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.window}
          </Typography>
        </Box>
      )}
      <TimeSlotGroup label={t.label} slots={slots} value={value} onChange={setValue} loading={loading} />
      {simulate && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="secondary" size="md" disabled={!value || Boolean(taken[value ?? ''])} onClick={() => value && setTaken({ [value]: 'taken' })}>
            {t.simulate}
          </Button>
          <Button variant="quiet" size="md" onClick={() => setTaken({})}>
            {t.reset}
          </Button>
        </Box>
      )}
    </Box>
  );
}

function StatesDemo() {
  const t = useT(m);
  const allFull: SlotOption[] = hours.slice(1, 7).map((value) => ({ value, status: 'full' }));
  return (
    <Showcase maxWidth={390}>
      <Specimen label={t.loading} direction="column" align="stretch">
        <TimeSlotGroup label={t.label} slots={[]} value={null} onChange={() => undefined} loading />
      </Specimen>
      <Specimen label={t.allFull} direction="column" align="stretch">
        <TimeSlotGroup label={t.label} slots={allFull} value={null} onChange={() => undefined} />
      </Specimen>
      <Specimen label={t.empty} direction="column" align="stretch">
        <TimeSlotGroup label={t.label} slots={[]} value={null} onChange={() => undefined} />
      </Specimen>
      <Specimen label={t.lost} direction="column" align="stretch">
        <TimeSlotGroup label={t.label} slots={build({ '10:00': 'taken' })} value="10:00" onChange={() => undefined} />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Fecha y hora/Grupo de horarios',
  component: TimeSlotGroup,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Reúne las franjas de un día en **Mañana / Tarde / Noche** y permite elegir una. Acepta cambios de disponibilidad en vivo: si la franja elegida se ocupa antes de confirmar, **conserva los datos y deja elegir otra**.',
          anatomy: ['**Aviso de franja perdida** (solo cuando aplica) con acción para elegir la siguiente libre', '**Grupo** de radios con nombre', '**Periodo**: icono, título (Mañana, Tarde, Noche) y conteo de disponibles', '**Franjas** en cuadrícula adaptable (Franja horaria)', '**Esqueleto** y **estado sin horarios**'],
          props: [
            '`slots`: `{ value: "HH:mm", status? }[]`. El periodo se calcula por la hora (antes de 12:00, de 12:00 a 17:59, desde 18:00); los periodos vacíos no se muestran.',
            '`value` lo conserva el padre aunque su franja deje de estar disponible; el grupo la marca, avisa y ofrece la siguiente libre con `onChange`.',
            'Para actualizar la disponibilidad basta con volver a pasar `slots` (sondeo, websocket o refresco al volver a la app).',
          ],
          states: ['Normal · cargando (esqueleto) · sin horarios (aviso informativo) · franja elegida perdida (aviso de advertencia con la franja en estado Ocupado).', 'Cada franja: reposo, hover, foco, seleccionada, completa, fuera de horario, ocupada.'],
          tokens: [
            ['Franja seleccionada', 'selection.bg · selection.border'],
            ['Aviso de franja perdida', 'status.warning.* (Alert)'],
            ['Franja ocupada', 'status.danger.bg · fg · border'],
            ['Título de periodo', 'typeScale.h4 · text.secondary (conteo)'],
            ['Separación', 'space 8 px entre franjas · 20 px entre periodos'],
          ],
          responsive: ['Cuadrícula `auto-fill` con mínimo de 96 px: 3 columnas en 390 px, más en escritorio.', 'Los avisos se envuelven; la acción de “Elegir 11:00 a. m.” baja de línea en móvil.'],
          a11y: [
            '`role="radiogroup"` con nombre y un solo tab stop (la franja elegida o la primera libre). Flechas, Inicio y Fin mueven la selección; las franjas no disponibles se saltan.',
            'Cada periodo es un `group` con su título como nombre.',
            'El aviso de franja perdida usa `role="alert"`: se anuncia al instante sin mover el foco.',
            'Estado por texto, forma e icono, no solo color.',
          ],
          content: [
            ['El horario de 10:00 a. m. ya no está disponible', 'The 10:00 AM slot is no longer available'],
            ['Se ocupó mientras terminabas tu reserva. Conservamos tus datos: elige otro horario para continuar.', 'It was booked while you were finishing your reservation. Your details are saved: pick another time to continue.'],
            ['Sin horarios disponibles · 4 disponibles', 'No time slots available · 4 available'],
          ],
          example: '**Ejemplo de negocio**: ventanas de recogida de Towing en IAA Miami North (lote 04217753, código 0093). La historia “Se ocupó el horario elegido” simula que otro cliente reserva la franja mientras tanto.',
        }),
      },
    },
  },
} satisfies Meta<typeof TimeSlotGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { label: '', slots: [], value: null, onChange: () => undefined };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, loading: false },
  render: (args) => <Demo loading={args.loading} />,
};

export const States: Story = { name: 'Estados', args: base, render: () => <StatesDemo /> };

export const SlotTaken: Story = { name: 'Se ocupó el horario elegido', args: base, render: () => <Demo simulate /> };

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: base,
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase>
        <Specimen label={`${l.businessExample} · Towing`} direction="column" align="stretch">
          <Demo business simulate />
        </Specimen>
      </Showcase>
    );
  },
};
