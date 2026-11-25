import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useLocale, useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { DateRangePicker, type DateRange } from './DateRangePicker';

const TODAY = dayjs('2026-11-25');

const m = {
  es: {
    label: 'Fechas del servicio',
    invalid: 'Rango inválido (fin antes del inicio)',
    summary: (n: number, from: string, to: string) => `${n} trabajos entre ${from} y ${to}`,
    pick: 'Elige un rango para filtrar la bandeja.',
    business: 'Historial de Towing: recogidas completadas',
  },
  en: {
    label: 'Service dates',
    invalid: 'Invalid range (end before start)',
    summary: (n: number, from: string, to: string) => `${n} jobs between ${from} and ${to}`,
    pick: 'Pick a range to filter the tray.',
    business: 'Towing history: completed pickups',
  },
};

function Demo({ initial, presets = true, business = false }: { initial: DateRange; presets?: boolean; business?: boolean }) {
  const t = useT(m);
  const locale = useLocale();
  const [range, setRange] = useState<DateRange>(initial);
  const fmt = (d: dayjs.Dayjs) => d.locale(locale).format('D MMM');
  const days = range.from && range.to && !range.to.isBefore(range.from, 'day') ? range.to.diff(range.from, 'day') + 1 : 0;
  return (
    <Box sx={{ width: 390, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {business && <Typography variant="h3">{t.business}</Typography>}
      <DateRangePicker label={t.label} value={range} onChange={setRange} presets={presets} today={TODAY} />
      {business && (
        <Typography variant="body2" aria-live="polite" sx={{ color: bs.text.secondary }}>
          {range.from && range.to && days > 0 ? t.summary(days * 3, fmt(range.from), fmt(range.to)) : t.pick}
        </Typography>
      )}
    </Box>
  );
}

function StatesDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={390}>
      <Specimen label={l.rest} direction="column" align="stretch">
        <Demo initial={{ from: null, to: null }} />
      </Specimen>
      <Specimen label={l.selected} direction="column" align="stretch">
        <Demo initial={{ from: TODAY.subtract(6, 'day'), to: TODAY }} />
      </Specimen>
      <Specimen label={t.invalid} direction="column" align="stretch">
        <Demo initial={{ from: TODAY, to: TODAY.subtract(3, 'day') }} presets={false} />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Fecha y hora/Selector de rango',
  component: DateRangePicker,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Rango **desde–hasta** para los filtros del operador (historial, reportes, bandeja por varios días). Dos campos de fecha con calendario y rangos rápidos.',
          anatomy: ['**Título** del grupo', '**Rangos rápidos**: Hoy, Últimos 7 días, Este mes (opcional)', '**Desde** y **Hasta**: campos con selector de MUI X', '**Limpiar fechas** (aparece cuando hay valor)', '**Mensaje de error** si el fin es anterior al inicio'],
          props: ['`value: { from, to }` con `Dayjs | null`; escribe, elige en el calendario o usa un rango rápido.', '`today` fija el día de referencia de los rangos rápidos.', '`minDate` / `maxDate` limitan ambos campos; “Hasta” nunca permite elegir antes de “Desde”.'],
          states: ['Vacío · con rango · rango rápido activo (chip seleccionado) · foco visible · error de rango (borde de peligro + mensaje de texto) · deshabilitado por límites de fecha.'],
          tokens: [
            ['Campos', 'surface.subtle · border.field (tema de pickers)'],
            ['Foco', 'selection.border (2 px)'],
            ['Error', 'status.danger.solid · status.danger.fg'],
            ['Chips', 'selection.bg · selection.border'],
          ],
          responsive: ['Los dos campos se colocan en una fila cuando caben (≥ 160 px cada uno) y se apilan en 390 px o menos.', 'Los rangos rápidos se envuelven en varias filas.'],
          a11y: [
            'El grupo tiene nombre visible (`role="group"` + `aria-labelledby`); cada campo tiene su etiqueta (Desde, Hasta).',
            'Los campos de MUI X permiten escribir con el teclado por secciones (día, mes, año) y abrir el calendario con el botón.',
            'El error de rango se anuncia con `role="alert"` y se ve en texto, no solo en rojo.',
          ],
          content: [
            ['Desde · Hasta · Hoy · Últimos 7 días · Este mes · Limpiar fechas', 'From · To · Today · Last 7 days · This month · Clear dates'],
            ['La fecha final no puede ser anterior a la inicial.', 'The end date cannot be earlier than the start date.'],
          ],
          example: '**Ejemplo de negocio**: historial de Towing, recogidas completadas entre dos fechas, con el resumen que se actualiza al cambiar el rango.',
        }),
      },
    },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { label: '', value: { from: null, to: null }, onChange: () => undefined };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, presets: true },
  render: (args) => <Demo initial={{ from: null, to: null }} presets={args.presets} />,
};

export const States: Story = { name: 'Estados', args: base, render: () => <StatesDemo /> };

export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: base, render: () => <Demo business initial={{ from: TODAY.subtract(6, 'day'), to: TODAY }} /> };
