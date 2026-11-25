import SearchRounded from '@mui/icons-material/SearchRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import Box from '@mui/material/Box';
import type { KeyboardEvent } from 'react';
import { useT } from '../../../i18n/locale';
import { radius } from '../../../theme/tokens';
import { IconButton } from '../../actions/IconButton/IconButton';
import { TextField, type TextFieldProps } from '../TextField/TextField';

export interface SearchFieldProps extends Omit<TextFieldProps, 'type' | 'label' | 'startIcon' | 'onSubmit'> {
  /** Defaults to "Buscar" / "Search". Usually hidden with `hideLabel`. */
  label?: string;
  /** Called with the current value on Enter. */
  onSubmit?: (value: string) => void;
  /** Shows the adjacent filter button (reference: search + filters). */
  onFilterClick?: () => void;
  filterLabel?: string;
  /** Number of active filters, shown as a badge on the filter button. */
  activeFilters?: number;
}

const messages = {
  es: { search: 'Buscar', filters: 'Filtros', filtersN: (n: number) => `Filtros, ${n} activos` },
  en: { search: 'Search', filters: 'Filters', filtersN: (n: number) => `Filters, ${n} active` },
};

/** Search input with clear action and optional filter button. Clearable by default. */
export function SearchField({ label, onSubmit, onFilterClick, filterLabel, activeFilters = 0, clearable = true, value, onKeyDown, slotProps, ...rest }: SearchFieldProps) {
  const t = useT(messages);
  const field = (
    <TextField
      {...rest}
      role="search"
      type="search"
      label={label ?? t.search}
      value={value}
      clearable={clearable}
      startIcon={<SearchRounded />}
      autoComplete="off"
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && onSubmit) onSubmit(String(value ?? ''));
        onKeyDown?.(e);
      }}
      slotProps={{ ...slotProps, htmlInput: { enterKeyHint: 'search', ...(typeof slotProps?.htmlInput === 'object' ? slotProps.htmlInput : {}) } }}
    />
  );
  if (!onFilterClick) return field;
  const name = filterLabel ?? (activeFilters ? t.filtersN(activeFilters) : t.filters);
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>{field}</Box>
      <IconButton
        variant="filled"
        size="lg"
        label={name}
        badge={activeFilters || undefined}
        icon={<TuneRounded />}
        onClick={onFilterClick}
        sx={{ borderRadius: `${radius.md}px`, flexShrink: 0 }}
      />
    </Box>
  );
}
