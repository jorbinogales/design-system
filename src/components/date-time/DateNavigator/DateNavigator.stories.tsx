import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { InitialsAvatar } from '../../data-display/InitialsAvatar/InitialsAvatar';
import { DateNavigator } from './DateNavigator';

const TODAY = dayjs('2026-11-25');

const m = {
  es: {
    title: 'Agenda de trabajos',
    count: (n: number) => (n === 1 ? '1 trabajo' : `${n} trabajos`),
    first: 'Primero del día',
    job1: 'Detailing Completo · Valeria Ortiz · 9:00 a. m.',
    job2: 'Towing · IAA Miami North · lote 04217753 · 11:30 a. m.',
    today: 'Hoy',
    other: 'Mañana y otro día',
  },
  en: {
    title: 'Jobs agenda',
    count: (n: number) => (n === 1 ? '1 job' : `${n} jobs`),
    first: 'First of the day',
    job1: 'Full Detailing · Valeria Ortiz · 9:00 AM',
    job2: 'Towing · IAA Miami North · lot 04217753 · 11:30 AM',
    today: 'Today',
    other: 'Tomorrow and another day',
  },
};

function Demo({ size = 'md', initial = TODAY }: { size?: 'sm' | 'md'; initial?: Dayjs }) {
  const [day, setDay] = useState(initial);
  return <DateNavigator value={day} onChange={setDay} today={TODAY} size={size} />;
}

function StatesDemo() {
  const l = useStoryLabels();
  const t = useT(m);
  return (
    <Showcase>
      <Specimen label={t.today}>
        <Demo />
      </Specimen>
      <Specimen label={t.other}>
        <Demo initial={TODAY.add(1, 'day')} />
        <Demo initial={TODAY.add(9, 'day')} />
      </Specimen>
      <Specimen label={l.compact}>
        <Demo size="sm" initial={TODAY.subtract(1, 'day')} />
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  const [day, setDay] = useState<Dayjs>(TODAY);
  const jobs = day.isSame(TODAY, 'day') ? 2 : day.day() === 0 ? 0 : 1;
  return (
    <Box sx={{ width: 720, maxWidth: '100%', border: `1px solid ${bs.border.subtle}`, borderRadius: 4, p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
        <Typography variant="h3" component="h2">
          {t.title}
        </Typography>
        <DateNavigator value={day} onChange={setDay} today={TODAY} size="sm" />
      </Box>
      <Typography variant="body2" aria-live="polite" sx={{ color: bs.text.secondary }}>
        {t.count(jobs)}
      </Typography>
      {jobs > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <InitialsAvatar name="Luis Herrera" size="sm" />
            <Typography variant="body2">{t.job1}</Typography>
          </Box>
          {jobs > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <InitialsAvatar size="sm" />
              <Typography variant="body2">{t.job2}</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

const meta = {
  title: 'Componentes/Fecha y hora/Navegación entre fechas',
  component: DateNavigator,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Mueve la bandeja del operador **día a día**: anterior, siguiente, atajo **Hoy** y la fecha activa con etiqueta relativa (Hoy, Mañana, Ayer).',
          anatomy: ['**Botón anterior** (icono con nombre accesible)', '**Etiqueta**: palabra relativa o día de la semana + fecha completa', '**Botón siguiente**', '**Hoy**: atajo que se deshabilita cuando ya estás en hoy'],
          props: ['`value` / `onChange` con `Dayjs`; `today` fija la referencia de “Hoy”.', '`size`: `md` 44 px (táctil) · `sm` 36 px (barras densas de escritorio).'],
          states: ['Reposo · hover (puntero) · foco visible · presionado · “Hoy” deshabilitado cuando la fecha activa es hoy.'],
          tokens: [
            ['Botones de flecha', 'border.subtle (IconButton outlined)'],
            ['Etiqueta', 'typeScale.label · text.primary'],
            ['Fecha completa', 'typeScale.caption · text.secondary'],
            ['Atajo Hoy', 'action.secondary.*'],
          ],
          responsive: ['En escritorio vive en el encabezado de la bandeja, junto a los filtros.', 'En 390 px el conjunto mide unos 340 px; si el contenedor es más estrecho se mantiene en una línea y la etiqueta ocupa el espacio sobrante.'],
          a11y: [
            'Grupo con nombre (“Navegación por día”); los botones de flecha dicen “Día anterior” / “Día siguiente” y muestran tooltip con teclado y puntero.',
            'La etiqueta es una región `aria-live="polite"`: el lector anuncia el día nuevo tras cada cambio.',
            '“Hoy” deshabilitado evita acciones sin efecto; el estado no depende solo del color.',
          ],
          content: [
            ['Día anterior · Día siguiente · Hoy · Mañana · Ayer', 'Previous day · Next day · Today · Tomorrow · Yesterday'],
            ['mié 25 nov 2026', 'Wed, Nov 25, 2026'],
          ],
          example: '**Ejemplo de negocio**: encabezado de la agenda del operador con dos trabajos de hoy (Detailing y Towing en IAA Miami North, lote 04217753); al cambiar de día cambia el conteo.',
        }),
      },
    },
  },
} satisfies Meta<typeof DateNavigator>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { value: TODAY, onChange: () => undefined };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, size: 'md' },
  render: (args) => <Demo size={args.size} />,
};

export const States: Story = { name: 'Estados', args: base, render: () => <StatesDemo /> };

export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: base, render: () => <BusinessDemo /> };
