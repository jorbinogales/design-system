import CheckRounded from '@mui/icons-material/CheckRounded';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import type { ReactElement } from 'react';

export interface FilterChipOption<T extends string = string> {
  value: T;
  label: string;
  /** Leading icon at rest (replaced by a check when selected). */
  icon?: ReactElement;
  /** Result count shown after the label. */
  count?: number;
  disabled?: boolean;
}

interface BaseProps<T extends string> {
  options: FilterChipOption<T>[];
  /** Accessible name of the group ("Servicios", "Unidad"). */
  label: string;
  /** `scroll`: one horizontal row (mobile, reference). `wrap`: multiple rows (desktop filter bars). */
  overflow?: 'scroll' | 'wrap';
  size?: 'sm' | 'md';
}

export type FilterChipGroupProps<T extends string = string> = BaseProps<T> &
  ({ selectionMode: 'single'; value: T | null; onChange: (value: T) => void } | { selectionMode: 'multiple'; value: T[]; onChange: (value: T[]) => void });

/**
 * Filter chips. `single` behaves as a radio group (one active, e.g. Todos / Exterior / Interior);
 * `multiple` as toggles that combine (inbox filters). Selected = soft orange + border + check.
 */
export function FilterChipGroup<T extends string>(props: FilterChipGroupProps<T>) {
  const { options, label, overflow = 'scroll', size = 'md' } = props;
  const single = props.selectionMode === 'single';
  const isSelected = (v: T) => (props.selectionMode === 'single' ? props.value === v : props.value.includes(v));
  const toggle = (v: T) => {
    if (props.selectionMode === 'single') props.onChange(v);
    else props.onChange(props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v]);
  };
  return (
    <Box
      role={single ? 'radiogroup' : 'group'}
      aria-label={label}
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: overflow === 'wrap' ? 'wrap' : 'nowrap',
        ...(overflow === 'scroll' && { overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }, py: 0.5, mx: -0.5, px: 0.5 }),
      }}
    >
      {options.map((o) => {
        const selected = isSelected(o.value);
        return (
          <Chip
            key={o.value}
            clickable
            disabled={o.disabled}
            size={size === 'sm' ? 'small' : 'medium'}
            onClick={() => toggle(o.value)}
            role={single ? 'radio' : undefined}
            aria-checked={single ? selected : undefined}
            aria-pressed={single ? undefined : selected}
            icon={selected ? <CheckRounded /> : o.icon}
            label={o.count === undefined ? o.label : `${o.label} · ${o.count}`}
            sx={{ flexShrink: 0 }}
          />
        );
      })}
    </Box>
  );
}
