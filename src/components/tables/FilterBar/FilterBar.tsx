import FilterAltOffRounded from '@mui/icons-material/FilterAltOffRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Dayjs } from 'dayjs';
import { bookingStatuses, getStatusLabel, type BookingStatus } from '../../../domain/status';
import { businessUnits, unitMeta, type BusinessUnit } from '../../../domain/units';
import { formatNumber } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { unitIcon } from '../../../icons/unitIcon';
import { bs } from '../../../theme/theme';
import { Button } from '../../actions/Button/Button';
import { DateNavigator } from '../../date-time/DateNavigator/DateNavigator';
import { SearchField } from '../../fields/SearchField/SearchField';
import { FilterChipGroup } from '../../selection/FilterChip/FilterChip';
import { Select } from '../../selection/Select/Select';

/** `all` and `unassigned` are reserved; any other value is an operator id. */
export interface TrayFilters {
  query: string;
  units: BusinessUnit[];
  assignee: string;
  status: BookingStatus | 'all';
}

export const emptyTrayFilters: TrayFilters = { query: '', units: [], assignee: 'all', status: 'all' };

/** How many filter groups differ from the default (search, units, assignee and status count once each). */
export const countActiveFilters = (f: TrayFilters) => (f.query.trim() ? 1 : 0) + (f.units.length ? 1 : 0) + (f.assignee !== 'all' ? 1 : 0) + (f.status !== 'all' ? 1 : 0);

export interface FilterBarProps {
  value: TrayFilters;
  onChange: (next: TrayFilters) => void;
  /** Operators for the Responsable filter. "Todos" and "Pendiente de asignación" are added automatically. */
  assignees: { value: string; label: string }[];
  /** Active day. Adds the date navigation (the "Hoy" view). */
  date?: { value: Dayjs; onChange: (day: Dayjs) => void; today?: Dayjs };
  /** Rows per unit for the chip counters. */
  unitCounts?: Partial<Record<BusinessUnit, number>>;
  /** Rows after filtering: announced politely when it changes. */
  resultCount?: number;
  searchPlaceholder?: string;
}

const messages = {
  es: {
    group: 'Filtros de la bandeja',
    search: 'Buscar en la bandeja',
    searchPlaceholder: 'Cliente, lote, código o dirección',
    unit: 'Unidad de negocio',
    assignee: 'Responsable',
    status: 'Estado de la reserva',
    allAssignees: 'Todos',
    unassigned: 'Pendiente de asignación',
    allStatuses: 'Todos los estados',
    clear: (n: number) => `Limpiar filtros (${n})`,
    results: (n: string) => (n === '1' ? '1 trabajo' : `${n} trabajos`),
  },
  en: {
    group: 'Tray filters',
    search: 'Search the tray',
    searchPlaceholder: 'Customer, lot, code or address',
    unit: 'Business unit',
    assignee: 'Assignee',
    status: 'Booking status',
    allAssignees: 'Everyone',
    unassigned: 'Awaiting assignment',
    allStatuses: 'All statuses',
    clear: (n: number) => `Clear filters (${n})`,
    results: (n: string) => (n === '1' ? '1 job' : `${n} jobs`),
  },
};

/**
 * Filters of the operator's daily tray: date navigation, search, unit chips (multiple), assignee and status.
 * Everything combines; "Limpiar filtros" resets all but the date. It does not filter by itself: apply the value
 * to your rows (the story shows how) and pass the count back as `resultCount`.
 */
export function FilterBar({ value, onChange, assignees, date, unitCounts, resultCount, searchPlaceholder }: FilterBarProps) {
  const t = useT(messages);
  const locale = useLocale();
  const active = countActiveFilters(value);
  const patch = (p: Partial<TrayFilters>) => onChange({ ...value, ...p });

  return (
    <Box role="group" aria-label={t.group} sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', minWidth: 0 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4 }}>
        {date && <DateNavigator value={date.value} onChange={date.onChange} today={date.today} size="sm" />}
        <Box sx={{ flex: '1 1 280px', maxWidth: date ? 440 : undefined, minWidth: 0 }}>
          <SearchField
            size="md"
            hideLabel
            label={t.search}
            placeholder={searchPlaceholder ?? t.searchPlaceholder}
            value={value.query}
            onChange={(e) => patch({ query: e.target.value })}
            onClear={() => patch({ query: '' })}
          />
        </Box>
      </Box>

      <FilterChipGroup
        selectionMode="multiple"
        overflow="wrap"
        label={t.unit}
        value={value.units}
        onChange={(units) => patch({ units })}
        options={businessUnits.map((u) => {
          const Icon = unitIcon[u];
          return { value: u, label: unitMeta[u].name, icon: <Icon />, count: unitCounts?.[u] };
        })}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 4 }}>
        <Box sx={{ flex: '1 1 200px', maxWidth: 260 }}>
          <Select
            size="md"
            label={t.assignee}
            value={value.assignee}
            onChange={(assignee) => patch({ assignee })}
            options={[{ value: 'all', label: t.allAssignees }, { value: 'unassigned', label: t.unassigned }, ...assignees]}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', maxWidth: 260 }}>
          <Select
            size="md"
            label={t.status}
            value={value.status}
            onChange={(status) => patch({ status })}
            options={[{ value: 'all', label: t.allStatuses }, ...bookingStatuses.map((s) => ({ value: s, label: getStatusLabel('booking', s, locale) }))]}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minHeight: 44, ml: { sm: 'auto' } }}>
          {resultCount !== undefined && (
            <Typography variant="body2" aria-live="polite" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
              {t.results(formatNumber(resultCount, locale))}
            </Typography>
          )}
          <Button variant="quiet" size="md" startIcon={<FilterAltOffRounded />} disabled={active === 0} onClick={() => onChange({ ...emptyTrayFilters })}>
            {t.clear(active)}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
