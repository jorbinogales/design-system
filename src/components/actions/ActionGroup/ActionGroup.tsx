import Box, { type BoxProps } from '@mui/material/Box';
import type { ReactNode } from 'react';

export type ActionGroupLayout = 'inline' | 'stacked' | 'responsive';

export interface ActionGroupProps extends Omit<BoxProps, 'children'> {
  children: ReactNode;
  /**
   * `inline`: side by side (Restablecer | Aplicar). `stacked`: one per row, full width.
   * `responsive`: stacked on mobile, inline from 600px (dialogs, desktop forms).
   */
  layout?: ActionGroupLayout;
  /** `stretch` gives every action equal width (the reference's two-button footers). */
  align?: 'start' | 'end' | 'center' | 'stretch';
  /** Accessible name of the group when the actions need context (`role="group"`). */
  label?: string;
}

const justify = { start: 'flex-start', end: 'flex-end', center: 'center', stretch: 'stretch' } as const;

/**
 * Lays out related actions with consistent spacing.
 * DOM order rule: inline → secondary first, primary last (right). Stacked → primary first (top).
 */
export function ActionGroup({ children, layout = 'inline', align = 'stretch', label, sx, ...rest }: ActionGroupProps) {
  const inline = {
    flexDirection: 'row',
    justifyContent: justify[align],
    '& > *': align === 'stretch' ? { flex: '1 1 0', minWidth: 0 } : {},
  } as const;
  const stacked = { flexDirection: 'column', alignItems: 'stretch', '& > *': { width: '100%' } } as const;
  return (
    <Box
      role={label ? 'group' : undefined}
      aria-label={label}
      sx={[
        { display: 'flex', gap: 3 },
        layout === 'inline' && inline,
        layout === 'stacked' && stacked,
        layout === 'responsive' && { ...stacked, '@media (min-width:600px)': { ...inline, '& > *': align === 'stretch' ? inline['& > *'] : { width: 'auto' } } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </Box>
  );
}
