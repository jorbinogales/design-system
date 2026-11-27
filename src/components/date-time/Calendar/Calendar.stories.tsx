import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { useLocale, useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { Calendar, type DayState } from './Calendar';

const TODAY = dayjs('2026-11-25');

const m = {
  es: {
    label: 'Fecha del servicio',
    picked: (d: string) => `Elegiste ${d}`,
    none: 'Ningún día elegido',
    allNone: 'Mes sin disponibilidad',
    detailing: 'Detailing Completo · 3 h',
    note: 'Domingos cerrados. 26 y 30 de noviembre completos. Del 8 al 10 de diciembre el equipo no atiende.',
  },
  en: {
    label: 'Service date',
    picked: (d: string) => `You picked ${d}`,
    none: 'No day picked',
    allNone: 'Month without availability',
    detailing: 'Full Detailing · 3 h',
    note: 'Closed on Sundays. Nov 26 and Nov 30 are full. The team is off Dec 8–10.',
  },
};

/** Demo availability: Sundays closed, two full days, a week without service. */
const stateOf = (d: Dayjs): DayState => {
  if (d.day() === 0) return 'closed';
  if (d.month() === 10 && (d.date() === 26 || d.date() === 30)) return 'full';
  if (d.month() === 11 && d.date() >= 8 && d.date() <= 10) return 'none';
  return 'available';
};

function Demo({ showLegend = true, loading = false, business = false }: { showLegend?: boolean; loading?: boolean; business?: boolean }) {
  const t = useT(m);
  const locale = useLocale();
  const [value, setValue] = useState<Dayjs | null>(TODAY.add(2, 'day'));
  return (
    <Box sx={{ width: 390, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {business && (
        <Box>
          <Typography variant="h3">{t.detailing}</Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.note}
          </Typography>
        </Box>
      )}
      <Calendar label={t.label} value={value} onChange={setValue} getDayState={stateOf} minDate={TODAY} loading={loading} showLegend={showLegend} />
      <Typography variant="body2" aria-live="polite" sx={{ color: bs.text.secondary }}>
        {value ? t.picked(value.locale(locale).format('dddd D MMM')) : t.none}
      </Typography>
    </Box>
  );
}

function StatesDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={390}>
      <Specimen label={l.loading} direction="column" align="stretch">
        <Calendar label={t.label} value={null} onChange={() => undefined} getDayState={stateOf} loading showLegend={false} />
      </Specimen>
      <Specimen label={t.allNone} direction="column" align="stretch">
        <Calendar label={t.label} value={null} onChange={() => undefined} getDayState={() => 'none'} minDate={TODAY} showLegend={false} />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Fecha y hora/Calendario',
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Vista mensual para elegir el **día del servicio**. Construido sobre el `DateCalendar` de MUI X con el tema de Black Seat; cada día comunica su disponibilidad y solo se pueden elegir los disponibles.',
          anatomy: ['**Encabezado** de mes con flechas', '**Cuadrícula** de días (6 semanas fijas para que no salte la altura)', '**Marca** dentro de cada día: punto, tachado con trama, guion o contorno discontinuo', '**Leyenda** de los estados (opcional, activa por defecto)'],
          props: ['`getDayState(día)` devuelve `available`, `full`, `closed` o `none`; todo lo que no sea `available` queda deshabilitado.', '`onMonthChange` + `loading`: carga la disponibilidad del mes nuevo y muestra el esqueleto mientras tanto.', '`minDate` / `maxDate` deshabilitan por rango (por ejemplo, días pasados).'],
          states: [
            '**Disponible**: punto verde bajo el número.',
            '**Seleccionado**: fondo naranja suave, borde naranja y marca de selección.',
            '**Completo**: número tachado con trama diagonal.',
            '**Fuera del horario laboral**: texto atenuado con guion.',
            '**Sin disponibilidad**: contorno discontinuo y texto atenuado.',
            'Hoy: borde fino · hover (solo puntero) · foco visible · cargando (esqueleto).',
          ],
          tokens: [
            ['Seleccionado', 'selection.bg · selection.border'],
            ['Disponible', 'status.success.solid'],
            ['Completo / trama', 'text.secondary · border.subtle'],
            ['Atenuado', 'text.disabled · border.strong'],
            ['Radio del día', 'radius.pill (40 px)'],
          ],
          responsive: ['El ancho máximo es 360 px: cabe en 390 px con márgenes de 20 px y se centra en escritorio.', 'Cada día mide 40 px más margen; el objetivo táctil queda cerca de 44 px.', 'La leyenda se parte en varias líneas sin desbordar.'],
          a11y: [
            'Cada día tiene nombre accesible con fecha completa y estado: “jueves 26 de noviembre, completo”.',
            'Navegación con flechas, Inicio/Fin y Re Pág/Av Pág (comportamiento de MUI X).',
            'El estado nunca depende solo del color: punto, tachado, guion o contorno, más la leyenda en texto.',
            'El grupo tiene nombre (`label`).',
          ],
          content: [
            ['Disponible · Completo · Fuera de horario · Sin disponibilidad · Seleccionado', 'Available · Full · Outside business hours · No availability · Selected'],
            ['jueves 26 de noviembre, completo', 'Thursday, November 26, full'],
          ],
          example: '**Ejemplo de negocio**: reserva de Detailing Completo (3 h). Domingos cerrados, 26 y 30 de noviembre completos, y del 8 al 10 de diciembre sin disponibilidad.',
        }),
      },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { label: '', value: null, onChange: () => undefined, getDayState: () => 'available' as const };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, showLegend: true, loading: false },
  render: (args) => <Demo showLegend={args.showLegend} loading={args.loading} />,
};

export const States: Story = { name: 'Estados', args: base, render: () => <StatesDemo /> };

export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: base, render: () => <Demo business /> };
