import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { useLocale, useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { formatSlotTime } from '../../date-time/TimeSlot/TimeSlot';
import { DataTable, sortRows, type SortState } from './DataTable';
import { AgendaDetailDrawer, AgendaMobileCard, TodayAgenda, agendaRows, useAgendaColumns, useAgendaRowActions, type AgendaRow } from './todayAgendaExample';

const m = {
  es: {
    table: 'Agenda de hoy',
    loading: 'Cargando',
    empty: 'Vacío: con acción para limpiar filtros',
    emptyTitle: 'Hoy no tienes trabajos',
    emptyBody: 'Cuando llegue una reserva para esta fecha aparecerá aquí.',
    comfortable: 'Densidad cómoda',
    sticky: 'Cabecera fija con desplazamiento vertical',
    cards: 'Tarjetas de trabajo en móvil (contenedor de 390 px)',
    cardsNote: 'La tabla se transforma en tarjeta por el ancho de su propio contenedor, no de la ventana.',
    sortedBy: 'Ordenada por hora',
    scroll: 'Contenedor de 720 px: la tabla se desplaza dentro de su propio recuadro',
  },
  en: {
    table: "Today's agenda",
    loading: 'Loading',
    empty: 'Empty: with an action to clear filters',
    emptyTitle: 'No jobs today',
    emptyBody: 'When a booking for this date arrives it will show up here.',
    comfortable: 'Comfortable density',
    sticky: 'Sticky header with vertical scroll',
    cards: 'Job cards on mobile (390 px container)',
    cardsNote: "The table turns into cards based on its own container's width, not the window's.",
    sortedBy: 'Sorted by time',
    scroll: '720 px container: the table scrolls inside its own frame',
  },
};

const rows = agendaRows.slice(0, 6);

function Interactive({ density, stickyHeader, loading }: { density?: 'compact' | 'comfortable'; stickyHeader?: boolean; loading?: boolean }) {
  const t = useT(m);
  const locale = useLocale();
  const columns = useAgendaColumns();
  const [sort, setSort] = useState<SortState | null>({ columnId: 'time', direction: 'asc' });
  const [open, setOpen] = useState<AgendaRow | null>(null);
  const sorted = useMemo(() => sortRows(rows, columns, sort, locale), [columns, sort, locale]);
  const actions = useAgendaRowActions(setOpen);
  return (
    <Box sx={{ width: '100%' }}>
      <DataTable
        label={t.table}
        columns={columns}
        rows={sorted}
        getRowId={(r) => r.id}
        sort={sort}
        onSortChange={setSort}
        onRowClick={setOpen}
        activeRowId={open?.id ?? null}
        rowActions={actions}
        getRowLabel={(r) => `${r.customer}, ${formatSlotTime(r.time, locale)}`}
        density={density}
        stickyHeader={stickyHeader}
        maxHeight={stickyHeader ? 320 : undefined}
        loading={loading}
      />
      <AgendaDetailDrawer row={open} onClose={() => setOpen(null)} />
    </Box>
  );
}

function StatesDemo() {
  const t = useT(m);
  const locale = useLocale();
  const columns = useAgendaColumns();
  const actions = useAgendaRowActions(() => undefined);
  const base = { label: t.table, columns, getRowId: (r: AgendaRow) => r.id, rowActions: actions, getRowLabel: (r: AgendaRow) => `${r.customer}, ${formatSlotTime(r.time, locale)}` };
  return (
    <Showcase>
      <Specimen label={t.loading} direction="column" align="stretch">
        <DataTable {...base} rows={[]} loading />
      </Specimen>
      <Specimen label={t.empty} direction="column" align="stretch">
        <DataTable
          {...base}
          rows={[]}
          empty={
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="p">
                {t.emptyTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                {t.emptyBody}
              </Typography>
            </Box>
          }
        />
      </Specimen>
      <Specimen label={t.comfortable} direction="column" align="stretch">
        <DataTable {...base} rows={rows.slice(0, 3)} density="comfortable" />
      </Specimen>
      <Specimen label={t.sticky} direction="column" align="stretch">
        <DataTable {...base} rows={rows} stickyHeader maxHeight={260} />
      </Specimen>
      <Specimen label={t.scroll} direction="column" align="stretch">
        <Box sx={{ width: 720, maxWidth: '100%' }}>
          <DataTable {...base} rows={rows.slice(0, 3)} />
        </Box>
      </Specimen>
    </Showcase>
  );
}

function CardsDemo() {
  const t = useT(m);
  const locale = useLocale();
  const columns = useAgendaColumns();
  const [open, setOpen] = useState<AgendaRow | null>(null);
  const actions = useAgendaRowActions(setOpen);
  return (
    <Showcase>
      <Specimen label={t.cards} direction="column" align="stretch">
        <Typography variant="body2" sx={{ color: bs.text.secondary }}>
          {t.cardsNote}
        </Typography>
        <Box sx={{ width: 390, maxWidth: '100%' }}>
          <DataTable
            label={t.table}
            columns={columns}
            rows={[agendaRows[1], agendaRows[2], agendaRows[3]]}
            getRowId={(r) => r.id}
            onRowClick={setOpen}
            activeRowId={open?.id ?? null}
            rowActions={actions}
            getRowLabel={(r) => `${r.customer}, ${formatSlotTime(r.time, locale)}`}
            renderMobileCard={(r) => <AgendaMobileCard row={r} />}
          />
        </Box>
      </Specimen>
      <AgendaDetailDrawer row={open} onClose={() => setOpen(null)} />
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Tablas y bandejas/Tabla',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Tabla **genérica y tipada** para las bandejas del operador: columnas definidas por datos, cabeceras ordenables, clic en la fila para abrir el detalle, menú de acciones por fila y su propio desplazamiento horizontal. En móvil cada fila se transforma en una **tarjeta de trabajo**.',
          anatomy: ['**Contenedor** con borde y su propio desplazamiento horizontal', '**Cabecera** (fija si se pide) con celdas ordenables', '**Filas** con hover, foco y estado “abierta”', '**Columna de acciones** al final, fija a la derecha, con el menú por fila', '**Estados** de carga (esqueleto) y vacío (contenido propio)', '**Lista de tarjetas** alternativa para contenedores estrechos'],
          props: [
            '`columns: Column<Row>[]` con `{ id, header, cell(row), sortValue?, align?, minWidth?, hideHeader? }`. Una columna con `sortValue` es ordenable.',
            'Orden controlado: `sort` + `onSortChange`. El ciclo es ascendente, descendente, ascendente. `sortRows(filas, columnas, orden, idioma)` ordena una copia (números como números, texto por idioma con dígitos numéricos).',
            '`onRowClick` abre el detalle; `activeRowId` marca la fila abierta. `rowActions(row)` devuelve los elementos del menú (Menú por fila).',
            '`density`: `compact` (por defecto, escritorio) o `comfortable`. `stickyHeader` + `maxHeight` fijan la cabecera.',
            '`renderMobileCard(row)` define la tarjeta que sustituye a la fila por debajo de `mobileBreakpoint` (640 px **del contenedor**, con container query). La tarjeta de trabajo real llegará aparte; la historia usa una tarjeta simple.',
            '`getRowLabel(row)` da el nombre accesible de la fila (menú y tarjeta). Hay tipado genérico: `<DataTable<MiFila> … />`.',
          ],
          states: ['Reposo · hover de fila (puntero) · foco visible en fila, cabecera y botones · fila abierta (fondo de selección) · ordenada (flecha en la columna) · cargando (esqueleto, `aria-busy`) · vacío · cabecera fija.'],
          tokens: [
            ['Contenedor', 'surface.raised · border.subtle · radius.lg'],
            ['Cabecera', 'surface.subtle · text.secondary (typeScale.label)'],
            ['Hover / abierta', 'action.hover · selection.bg'],
            ['Foco de fila', 'focus.ring'],
            ['Padding de celda', '12×16 cómodo · 8×12 compacto'],
            ['Tarjeta móvil', 'surface.raised · border.subtle · radius.lg'],
          ],
          responsive: [
            'Escritorio: tabla con columnas de ancho mínimo y desplazamiento horizontal **dentro de su contenedor** (la página no se desplaza); la columna de acciones queda fija a la derecha.',
            'Móvil (contenedor < 640 px): la tabla se oculta y aparece una lista de tarjetas; el cambio depende del ancho del contenedor, no de la ventana.',
            'Direcciones largas hacen salto de línea: nunca se truncan.',
          ],
          a11y: [
            '`<table>` real con `aria-label`; cabeceras `th` con `aria-sort` (`ascending`, `descending` o `none`) y botón de orden con foco visible. Un `role="status"` anuncia “Ordenado por Hora, ascendente”.',
            'Fila clicable con `tabIndex=0`: Enter o Espacio abren el detalle; los controles internos (acciones, menú) no disparan el clic de la fila.',
            'Fila abierta con `aria-current`. Tarjeta móvil: un único botón “Abrir Valeria Ortiz, 8:00 a. m.” cubre la tarjeta; el menú y las acciones quedan por encima.',
            'El menú por fila nombra a la fila (“Acciones de Valeria Ortiz, 8:00 a. m.”). Los estados llevan texto e icono, no solo color.',
          ],
          content: [
            ['Hora · Unidad · Cliente · Ubicación · Responsable · Estado · Siguiente acción', 'Time · Unit · Customer · Location · Assignee · Status · Next action'],
            ['Pendiente de asignación · Asignar operador', 'Awaiting assignment · Assign operator'],
            ['Hoy no tienes trabajos', 'No jobs today'],
          ],
          example: '**Ejemplo de negocio**: agenda “Hoy” del operador (25 de noviembre, Miami) con filtros, orden, paginación y detalle. Towing muestra subasta, código y lote; Asignar operador es la única acción en naranja.',
        }),
      },
    },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { label: '', columns: [], rows: [], getRowId: () => '' };

export const Interactivo: Story = {
  name: 'Interactivo',
  args: { ...base, density: 'compact', stickyHeader: false, loading: false },
  render: (args) => <Interactive density={args.density} stickyHeader={args.stickyHeader} loading={args.loading} />,
};

export const States: Story = { name: 'Estados', args: base, render: () => <StatesDemo /> };

export const MobileCards: Story = { name: 'Tarjetas en móvil', args: base, render: () => <CardsDemo /> };

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: base,
  parameters: { layout: 'fullscreen' },
  render: function Render() {
    const l = useStoryLabels();
    const t = useT(m);
    return (
      <Box sx={{ p: { xs: 5, md: 8 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="caption" sx={{ color: bs.text.secondary }}>
          {l.businessExample} · {t.sortedBy}
        </Typography>
        <TodayAgenda pageSize={5} />
      </Box>
    );
  },
};
