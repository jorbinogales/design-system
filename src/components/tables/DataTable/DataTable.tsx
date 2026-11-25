import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { intlLocale } from '../../../i18n/format';
import { visuallyHidden } from '../../../theme/a11y';
import { bs } from '../../../theme/theme';
import { radius, type Density } from '../../../theme/tokens';
import { RowMenu, type RowMenuItem } from '../RowMenu/RowMenu';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  columnId: string;
  direction: SortDirection;
}

export interface Column<Row> {
  id: string;
  /** Header text. */
  header: string;
  /** Cell content for one row. */
  cell: (row: Row) => ReactNode;
  /** Makes the header sortable. Also the value `sortRows` compares (numbers numerically, text by locale). */
  sortValue?: (row: Row) => string | number;
  align?: 'left' | 'right' | 'center';
  /** Minimum width in px: the table scrolls horizontally inside its own container instead of squeezing the column. */
  minWidth?: number;
  /** Keep the header for screen readers only (icon-only columns). */
  hideHeader?: boolean;
}

export interface DataTableProps<Row> {
  /** Accessible name of the table ("Agenda de hoy"). */
  label: string;
  columns: Column<Row>[];
  rows: Row[];
  getRowId: (row: Row) => string;
  /** Current sort (controlled). Sort the rows yourself or with `sortRows`. */
  sort?: SortState | null;
  onSortChange?: (next: SortState) => void;
  /** Row click (or Enter / Space on the focused row) opens the detail. */
  onRowClick?: (row: Row) => void;
  /** Row whose detail is open: highlighted with the selection tint. */
  activeRowId?: string | null;
  /** Items of each row's "more actions" menu. Adds the actions column. */
  rowActions?: (row: Row) => RowMenuItem[];
  /** Names a row for assistive tech: "Valeria Ortiz, 8:00 a. m.". Used for the menu button and the mobile card. */
  getRowLabel?: (row: Row) => string;
  /** `compact` for operator desktop (default) · `comfortable` for larger touch targets. */
  density?: Density;
  /** Header stays visible while the body scrolls. Set `maxHeight`. */
  stickyHeader?: boolean;
  maxHeight?: number | string;
  /** Below `mobileBreakpoint` (width of the table's own container) each row becomes this card instead of a table row. */
  renderMobileCard?: (row: Row) => ReactNode;
  /** Container width in px under which cards replace the table. Default 640. */
  mobileBreakpoint?: number;
  loading?: boolean;
  /** Shown when there are no rows (a full "Hoy no tienes trabajos" state goes here). */
  empty?: ReactNode;
}

const messages = {
  es: { actions: 'Acciones', actionsOf: (n: string) => `Acciones de ${n}`, actionsRow: 'Acciones de la fila', sorted: (c: string, d: string) => `Ordenado por ${c}, ${d}`, asc: 'ascendente', desc: 'descendente', loading: 'Cargando', open: (n: string) => `Abrir ${n}` },
  en: { actions: 'Actions', actionsOf: (n: string) => `Actions for ${n}`, actionsRow: 'Row actions', sorted: (c: string, d: string) => `Sorted by ${c}, ${d}`, asc: 'ascending', desc: 'descending', loading: 'Loading', open: (n: string) => `Open ${n}` },
};

/** Sorts a copy of `rows` by the column's `sortValue` (numbers numerically, text by locale with digits compared as numbers). */
export function sortRows<Row>(rows: Row[], columns: Column<Row>[], sort: SortState | null | undefined, locale: 'es' | 'en' = 'es'): Row[] {
  const col = columns.find((c) => c.id === sort?.columnId);
  if (!sort || !col?.sortValue) return rows;
  const get = col.sortValue;
  const collator = new Intl.Collator(intlLocale[locale], { numeric: true, sensitivity: 'base' });
  const sign = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = get(a);
    const y = get(b);
    return sign * (typeof x === 'number' && typeof y === 'number' ? x - y : collator.compare(String(x), String(y)));
  });
}

/**
 * Generic typed table for operator trays. Column definitions, sortable headers (`aria-sort`), row click to open
 * a detail, per-row action menu, sticky header, compact density and its own horizontal-scroll container.
 * With `renderMobileCard`, rows turn into cards when the table's container is narrow (job cards on mobile).
 */
export function DataTable<Row>({
  label,
  columns,
  rows,
  getRowId,
  sort,
  onSortChange,
  onRowClick,
  activeRowId,
  rowActions,
  getRowLabel,
  density = 'compact',
  stickyHeader = false,
  maxHeight,
  renderMobileCard,
  mobileBreakpoint = 640,
  loading = false,
  empty,
}: DataTableProps<Row>) {
  const t = useT(messages);
  const [announce, setAnnounce] = useState('');
  const hasActions = Boolean(rowActions);
  const colSpan = columns.length + (hasActions ? 1 : 0);
  const cards = Boolean(renderMobileCard);
  const narrow = `@container (max-width: ${mobileBreakpoint - 1}px)`;
  const nameOf = (row: Row) => getRowLabel?.(row) ?? '';

  const requestSort = (col: Column<Row>) => {
    const direction: SortDirection = sort?.columnId === col.id && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange?.({ columnId: col.id, direction });
    setAnnounce(t.sorted(col.header, direction === 'asc' ? t.asc : t.desc));
  };

  const onRowKeyDown = (e: KeyboardEvent<HTMLElement>, row: Row) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRowClick?.(row);
    }
  };

  const stickyActionCell = (bg: string) => ({ position: 'sticky' as const, right: 0, backgroundColor: bg, backgroundImage: 'none', boxShadow: `-1px 0 0 ${bs.border.subtle}` });

  return (
    <Box sx={{ containerType: 'inline-size', width: '100%', minWidth: 0 }}>
      <TableContainer sx={{ maxHeight, ...(cards && { [narrow]: { display: 'none' } }) }}>
        <Table size={density === 'compact' ? 'small' : 'medium'} stickyHeader={stickyHeader} aria-label={label} aria-busy={loading || undefined} sx={{ minWidth: columns.reduce((n, c) => n + (c.minWidth ?? 96), hasActions ? 56 : 0) }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => {
                const sortable = Boolean(col.sortValue && onSortChange);
                const active = sort?.columnId === col.id;
                return (
                  <TableCell
                    key={col.id}
                    align={col.align}
                    aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : sortable ? 'none' : undefined}
                    sx={{ minWidth: col.minWidth }}
                  >
                    {sortable ? (
                      <TableSortLabel active={active} direction={active ? sort.direction : 'asc'} onClick={() => requestSort(col)}>
                        {col.header}
                      </TableSortLabel>
                    ) : col.hideHeader ? (
                      <Box component="span" sx={visuallyHidden}>
                        {col.header}
                      </Box>
                    ) : (
                      col.header
                    )}
                  </TableCell>
                );
              })}
              {hasActions && (
                <TableCell align="right" sx={{ width: 56, ...stickyActionCell(bs.surface.subtle) }}>
                  <Box component="span" sx={visuallyHidden}>
                    {t.actionsRow}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={`s${i}`}>
                  {Array.from({ length: colSpan }, (_, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" width={j === 0 ? '60%' : '85%'} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={colSpan} sx={{ py: 6 }}>
                  {empty}
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              rows.map((row) => {
                const id = getRowId(row);
                const active = activeRowId === id;
                const clickable = Boolean(onRowClick);
                return (
                  <TableRow
                    key={id}
                    hover={clickable}
                    selected={active}
                    aria-current={active ? 'true' : undefined}
                    tabIndex={clickable ? 0 : undefined}
                    onClick={clickable ? () => onRowClick?.(row) : undefined}
                    onKeyDown={clickable ? (e) => onRowKeyDown(e, row) : undefined}
                    sx={{
                      cursor: clickable ? 'pointer' : 'default',
                      '&:focus-visible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: -2 },
                      '& > td': { verticalAlign: 'top' },
                      ...(hasActions && {
                        '&:hover > .bs-row-actions': { backgroundImage: `linear-gradient(${bs.action.hover}, ${bs.action.hover})` },
                        '&.Mui-selected > .bs-row-actions': { backgroundColor: bs.surface.raised, backgroundImage: `linear-gradient(${bs.selection.bg}, ${bs.selection.bg})` },
                      }),
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align}>
                        {col.cell(row)}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell className="bs-row-actions" align="right" sx={stickyActionCell(bs.surface.raised)}>
                        <RowMenu items={rowActions!(row)} label={t.actionsOf(nameOf(row) || id)} size="sm" />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {cards && (
        <Box
          component="ul"
          aria-label={label}
          aria-busy={loading || undefined}
          sx={{ display: 'none', [narrow]: { display: 'flex' }, flexDirection: 'column', gap: 3, listStyle: 'none', m: 0, p: 0 }}
        >
          {loading &&
            [0, 1, 2].map((i) => (
              <Box component="li" key={i} sx={{ listStyle: 'none' }}>
                <Skeleton variant="rounded" height={132} sx={{ borderRadius: `${radius.lg}px` }} />
              </Box>
            ))}
          {!loading && rows.length === 0 && <Box component="li" sx={{ listStyle: 'none' }}>{empty}</Box>}
          {!loading &&
            rows.map((row) => {
              const id = getRowId(row);
              const active = activeRowId === id;
              return (
                <Box
                  component="li"
                  key={id}
                  aria-current={active ? 'true' : undefined}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-start',
                    listStyle: 'none',
                    borderRadius: `${radius.lg}px`,
                    border: `1px solid ${active ? bs.selection.border : bs.border.subtle}`,
                    backgroundColor: active ? bs.selection.bg : bs.surface.raised,
                    boxShadow: active ? `inset 0 0 0 1px ${bs.selection.border}` : 'none',
                    minWidth: 0,
                  }}
                >
                  {onRowClick && (
                    <ButtonBase
                      aria-label={t.open(nameOf(row) || id)}
                      onClick={() => onRowClick(row)}
                      sx={{ position: 'absolute', inset: 0, borderRadius: `${radius.lg}px`, '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 } }}
                    />
                  )}
                  <Box sx={{ position: 'relative', flex: 1, minWidth: 0, p: 4, pointerEvents: onRowClick ? 'none' : 'auto', '& a, & button, & [role="button"]': { pointerEvents: 'auto', position: 'relative' } }}>{renderMobileCard!(row)}</Box>
                  {hasActions && (
                    <Box sx={{ position: 'relative', p: 1 }}>
                      <RowMenu items={rowActions!(row)} label={t.actionsOf(nameOf(row) || id)} size="md" />
                    </Box>
                  )}
                </Box>
              );
            })}
        </Box>
      )}

      <Box role="status" aria-live="polite" sx={visuallyHidden}>
        {loading ? t.loading : announce}
      </Box>
    </Box>
  );
}
