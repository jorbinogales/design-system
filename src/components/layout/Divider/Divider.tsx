import MuiDivider from '@mui/material/Divider';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';

export interface DividerProps {
  /** Centered text ("o continúa con"). */
  label?: ReactNode;
  /** `dashed` before totals (receipts), as in the reference. */
  variant?: 'solid' | 'dashed';
  /** Indent from the left (list rows with a leading icon/avatar). */
  inset?: number;
  /** Vertical margin around the line. */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  /** Purely visual by default (`role="presentation"`); set true to announce a separator. */
  semantic?: boolean;
}

const gap = { none: 0, sm: 2, md: 4, lg: 6 } as const;

/** Hairline separator in `border.subtle`. */
export function Divider({ label, variant = 'solid', inset = 0, spacing = 'none', orientation = 'horizontal', semantic = false }: DividerProps) {
  const vertical = orientation === 'vertical';
  return (
    <MuiDivider
      orientation={orientation}
      flexItem={vertical}
      role={semantic ? 'separator' : 'presentation'}
      sx={{
        borderStyle: variant,
        borderColor: bs.border.subtle,
        ...(vertical ? { mx: gap[spacing] } : { my: gap[spacing], ml: `${inset}px` }),
        ...(label ? { '&::before, &::after': { borderStyle: variant } } : {}),
      }}
    >
      {label}
    </MuiDivider>
  );
}
