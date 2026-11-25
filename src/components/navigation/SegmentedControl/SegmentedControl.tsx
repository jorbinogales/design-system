import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { ReactNode } from 'react';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group ("Tipo de servicio"). */
  label: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const muiSize = { sm: 'small', md: 'medium', lg: 'large' } as const;

/**
 * Exclusive switch between 2–4 modes of the same view (Recogida / En el taller, Día / Semana).
 * Always one value selected; it never deselects.
 */
export function SegmentedControl<T extends string>({ options, value, onChange, label, fullWidth = false, size = 'md' }: SegmentedControlProps<T>) {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      onChange={(_, next: T | null) => {
        if (next !== null) onChange(next);
      }}
      aria-label={label}
      size={muiSize[size]}
      fullWidth={fullWidth}
      sx={{ display: fullWidth ? 'flex' : 'inline-flex', maxWidth: '100%' }}
    >
      {options.map((o) => (
        <ToggleButton key={o.value} value={o.value} disabled={o.disabled} sx={{ gap: 1.5, flex: fullWidth ? '1 1 0' : undefined, '& .MuiSvgIcon-root': { fontSize: 18 } }}>
          {o.icon}
          {o.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
