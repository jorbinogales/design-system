import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { layout } from '../../../theme/tokens';

/** Horizontal scroll-snap row that bleeds to the screen edges and keeps the 20px gutter at the start. */
export function Carousel({ label, children, gap = 3 }: { label: string; children: ReactNode; gap?: number }) {
  return (
    <Box
      role="group"
      aria-label={label}
      sx={{
        display: 'flex',
        gap,
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        px: `${layout.gutter.mobile}px`,
        scrollPaddingLeft: `${layout.gutter.mobile}px`,
        pb: 1,
        '& > *': { flex: '0 0 auto', scrollSnapAlign: 'start' },
        // Keeps the last card from sticking to the screen edge.
        '&::after': { content: '""', flex: '0 0 1px' },
      }}
    >
      {children}
    </Box>
  );
}
