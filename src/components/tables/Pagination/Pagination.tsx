import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import Box from '@mui/material/Box';
import MuiPagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { formatNumber } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { bs } from '../../../theme/theme';
import { Button } from '../../actions/Button/Button';
import { Select } from '../../selection/Select/Select';

export interface PaginationProps {
  /** Current page, 1-based. */
  page: number;
  pageSize: number;
  /** Total number of rows across every page. */
  total: number;
  onPageChange: (page: number) => void;
  /** Adds the "Filas por página" selector. */
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  /** Accessible name of the navigation ("Paginación de la agenda"). */
  label?: string;
}

const messages = {
  es: {
    nav: 'Paginación',
    range: (a: string, b: string, n: string) => `Mostrando ${a}–${b} de ${n}`,
    none: 'Sin resultados',
    perPage: 'Filas por página',
    perPageOption: (n: number) => `${n} por página`,
    prev: 'Anterior',
    next: 'Siguiente',
    pageOf: (p: number, n: number) => `Página ${p} de ${n}`,
    item: (type: string, page: number | null, selected: boolean) =>
      type === 'page' ? (selected ? `Página ${page}, actual` : `Ir a la página ${page}`) : type === 'next' ? 'Página siguiente' : type === 'previous' ? 'Página anterior' : type === 'first' ? 'Primera página' : 'Última página',
  },
  en: {
    nav: 'Pagination',
    range: (a: string, b: string, n: string) => `Showing ${a}–${b} of ${n}`,
    none: 'No results',
    perPage: 'Rows per page',
    perPageOption: (n: number) => `${n} per page`,
    prev: 'Previous',
    next: 'Next',
    pageOf: (p: number, n: number) => `Page ${p} of ${n}`,
    item: (type: string, page: number | null, selected: boolean) =>
      type === 'page' ? (selected ? `Page ${page}, current` : `Go to page ${page}`) : type === 'next' ? 'Next page' : type === 'previous' ? 'Previous page' : type === 'first' ? 'First page' : 'Last page',
  },
};

/**
 * Pagination for tables and trays: range summary, numbered pages and an optional page-size selector.
 * In a narrow container (< 560 px) it collapses to Anterior / Siguiente with "Página 2 de 5".
 */
export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 25, 50], label }: PaginationProps) {
  const t = useT(messages);
  const locale = useLocale();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const range = total === 0 ? t.none : t.range(formatNumber(from, locale), formatNumber(to, locale), formatNumber(total, locale));
  const navLabel = label ?? t.nav;

  return (
    <Box sx={{ containerType: 'inline-size', width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          alignItems: 'stretch',
          '@container (min-width: 560px)': { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        }}
      >
        <Typography variant="body2" aria-live="polite" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
          {range}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {onPageSizeChange && (
            <Box sx={{ width: 160 }}>
              <Select
                label={t.perPage}
                hideLabel
                size="md"
                native
                value={String(pageSize)}
                onChange={(v) => onPageSizeChange(Number(v))}
                options={pageSizeOptions.map((n) => ({ value: String(n), label: t.perPageOption(n) }))}
              />
            </Box>
          )}

          <Box component="nav" aria-label={navLabel} sx={{ display: 'none', '@container (min-width: 560px)': { display: 'block' } }}>
            <MuiPagination count={pages} page={page} onChange={(_, p) => onPageChange(p)} siblingCount={1} boundaryCount={1} getItemAriaLabel={(type, p, selected) => t.item(type, p, selected)} />
          </Box>

          <Box component="nav" aria-label={navLabel} sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1, justifyContent: 'space-between', '@container (min-width: 560px)': { display: 'none' } }}>
            <Button variant="secondary" size="md" startIcon={<ChevronLeftRounded />} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              {t.prev}
            </Button>
            <Typography variant="body2" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums', textAlign: 'center' }}>
              <Box component="span" sx={visuallyHidden}>
                {navLabel}:{' '}
              </Box>
              {t.pageOf(page, pages)}
            </Typography>
            <Button variant="secondary" size="md" endIcon={<ChevronRightRounded />} disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
              {t.next}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
