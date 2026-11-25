import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useLocale, useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { formatSlotTime } from '../../date-time/TimeSlot/TimeSlot';
import { agendaAssignees, agendaDay, agendaRows, countByUnit, filterAgenda } from '../DataTable/todayAgendaExample';
import { FilterBar, emptyTrayFilters, type TrayFilters } from './FilterBar';

const m = {
  es: {
    base: 'Sin filtros activos',
    active: 'Filtros combinados: Towing + sin asignar',
    hoy: 'Vista Hoy: Towing sin asignar',
    hint: 'Combina unidad, responsable, estado y búsqueda: se aplican todos a la vez.',
    none: 'Ningún trabajo coincide.',
    narrow: 'En 390 px las filas pasan a una columna',
  },
  en: {
    base: 'No active filters',
    active: 'Combined filters: Towing + unassigned',
    hoy: 'Today view: unassigned Towing',
    hint: 'Combine unit, assignee, status and search: all apply together.',
    none: 'No job matches.',
    narrow: 'At 390 px the rows collapse into one column',
  },
};

function Demo({ initial = emptyTrayFilters, withDate = true, showResults = false }: { initial?: TrayFilters; withDate?: boolean; showResults?: boolean }) {
  const t = useT(m);
  const locale = useLocale();
  const [filters, setFilters] = useState(initial);
  const [day, setDay] = useState(agendaDay);
  const rows = day.isSame(agendaDay, 'day') ? filterAgenda(agendaRows, filters) : [];
  return (
    <Box sx={{ width: 880, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <FilterBar
        value={filters}
        onChange={setFilters}
        assignees={agendaAssignees}
        date={withDate ? { value: day, onChange: setDay, today: agendaDay } : undefined}
        unitCounts={countByUnit(agendaRows)}
        resultCount={rows.length}
      />
      {showResults && (
        <Box component="ul" aria-label="resultados" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2, borderTop: `1px solid ${bs.border.subtle}`, pt: 3 }}>
          {rows.length === 0 && (
            <Typography variant="body2" sx={{ color: bs.text.secondary }}>
              {t.none}
            </Typography>
          )}
          {rows.map((r) => (
            <Box component="li" key={r.id} sx={{ display: 'flex', gap: 3, alignItems: 'baseline' }}>
              <Typography variant="label" sx={{ width: 84, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {formatSlotTime(r.time, locale)}
              </Typography>
              <Typography variant="body2">
                {r.customer} · {r.auction ? `${r.auction.yard}, lote ${r.auction.lot}` : r.location}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

function StatesDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase>
      <Specimen label={t.base} direction="column" align="stretch">
        <Demo />
      </Specimen>
      <Specimen label={t.active} direction="column" align="stretch">
        <Demo initial={{ query: '', units: ['towing'], assignee: 'unassigned', status: 'all' }} />
      </Specimen>
      <Specimen label={`${t.narrow} · ${l.fullWidth}`} direction="column" align="stretch">
        <Box sx={{ width: 390, maxWidth: '100%' }}>
          <FilterBar value={{ query: 'IAA', units: ['towing', 'detailing'], assignee: 'all', status: 'confirmed' }} onChange={() => undefined} assignees={agendaAssignees} date={{ value: agendaDay, onChange: () => undefined, today: agendaDay }} resultCount={3} />
        </Box>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Tablas y bandejas/Barra de filtros',
  component: FilterBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Controles de la bandeja del operador: **vista Hoy** con navegación de fecha, búsqueda, filtro por **unidad** (Detailing, Towing, Personal Washing), **responsable** y **estado**. Los filtros **se combinan** y se limpian de una vez.',
          anatomy: ['**Navegación entre fechas** (opcional)', '**Búsqueda** por cliente, lote, código o dirección', '**Chips de unidad** de selección múltiple, con icono y contador', '**Selectores** de responsable (con “Todos” y “Pendiente de asignación”) y de estado de la reserva', '**Conteo de resultados** y **Limpiar filtros (n)**'],
          props: [
            '`value: TrayFilters` = `{ query, units[], assignee, status }`; `onChange` recibe el objeto nuevo. `emptyTrayFilters` es el valor inicial y `countActiveFilters(valor)` cuenta los grupos activos.',
            '`assignees`: personal disponible; “Todos” y “Pendiente de asignación” se añaden solos.',
            '`date` añade la navegación de fecha. “Limpiar filtros” **no** cambia la fecha.',
            '`unitCounts` y `resultCount` muestran contadores; el segundo se anuncia al cambiar.',
            'El componente no filtra: el padre aplica `value` a sus filas (ver la historia y `filterAgenda`).',
          ],
          states: ['Sin filtros (Limpiar deshabilitado) · con filtros (Limpiar muestra el número) · chips seleccionados (fondo naranja suave, borde y check) · foco visible · búsqueda con texto (botón para borrar).'],
          tokens: [
            ['Chips', 'surface.subtle · selection.bg · selection.border'],
            ['Campos y selects', 'surface.subtle (44 px, tamaño md)'],
            ['Contador', 'text.secondary · typeScale.body2'],
            ['Separación', 'space 16 px entre grupos'],
          ],
          responsive: ['Escritorio: fecha y búsqueda en una fila, chips en otra y selectores con Limpiar al final; todo envuelve si falta espacio.', 'Móvil (390 px): cada grupo ocupa su propia fila; los selectores se apilan.', 'Textos largos (“Pendiente de asignación”, “Pendiente de confirmación”) caben en el select sin recortarse.'],
          a11y: [
            'Contenedor `role="group"` con nombre; cada control tiene etiqueta visible o accesible (la búsqueda usa etiqueta oculta).',
            'Chips múltiples como botones con `aria-pressed`, con check además del color.',
            'El conteo de resultados es una región `aria-live="polite"`; el botón Limpiar se deshabilita cuando no hay nada que limpiar.',
          ],
          content: [
            ['Todos · Pendiente de asignación · Todos los estados', 'Everyone · Awaiting assignment · All statuses'],
            ['Limpiar filtros (2) · 7 trabajos', 'Clear filters (2) · 7 jobs'],
            ['Cliente, lote, código o dirección', 'Customer, lot, code or address'],
          ],
          example: '**Ejemplo de negocio**: bandeja de hoy con 12 trabajos. Prueba Towing + Pendiente de asignación (2 resultados) o busca “0093” o “IAA”.',
        }),
      },
    },
  },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { value: emptyTrayFilters, onChange: () => undefined, assignees: [] };

export const Interactive: Story = { name: 'Interactivo', args: base, render: () => <Demo /> };

export const States: Story = { name: 'Estados', args: base, render: () => <StatesDemo /> };

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: base,
  render: function Render() {
    const t = useT(m);
    return (
      <Showcase>
        <Specimen label={t.hoy} direction="column" align="stretch">
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.hint}
          </Typography>
          <Demo initial={{ query: '', units: ['towing'], assignee: 'unassigned', status: 'all' }} showResults />
        </Specimen>
      </Showcase>
    );
  },
};
