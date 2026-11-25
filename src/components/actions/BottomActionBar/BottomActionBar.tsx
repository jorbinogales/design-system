import Box, { type BoxProps } from '@mui/material/Box';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { layout, radius, zLayer } from '../../../theme/tokens';

export interface BottomActionBarProps extends Omit<BoxProps, 'children' | 'position'> {
  /** The action(s): usually one full-width primary Button, or an ActionGroup. */
  children: ReactNode;
  /** Optional left side, e.g. the total (`<Price>`) next to a compact CTA. */
  summary?: ReactNode;
  /**
   * `sticky` (default) sits at the end of a scrolling flex column and stays visible.
   * `fixed` pins to the viewport (inside the device frame it pins to the screen).
   */
  position?: 'sticky' | 'fixed' | 'static';
}

/**
 * Bottom bar for the screen's main action (Continuar, Confirmar reserva). Rounded top,
 * raised surface and bottom padding that clears the home indicator (safe area).
 */
export function BottomActionBar({ children, summary, position = 'sticky', sx, ...rest }: BottomActionBarProps) {
  return (
    <Box
      sx={[
        {
          position,
          ...(position !== 'static' && { bottom: 0, left: 0, right: 0, zIndex: zLayer.bottomBar }),
          mt: 'auto',
          backgroundColor: bs.surface.raised,
          borderTop: `1px solid ${bs.border.subtle}`,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          boxShadow: bs.elevation.e2,
          pt: 4,
          px: `${layout.gutter.mobile}px`,
          pb: `calc(16px + ${layout.safeAreaBottom})`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      <Box
        sx={{
          maxWidth: layout.maxWidth.content,
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          '& > :last-child': { flex: summary ? '0 1 auto' : '1 1 auto', minWidth: 0 },
        }}
      >
        {summary && <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>{summary}</Box>}
        {children}
      </Box>
    </Box>
  );
}
