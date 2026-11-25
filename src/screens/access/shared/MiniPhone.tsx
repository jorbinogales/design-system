import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';

const NATURAL_W = 390;
const NATURAL_H = 844;

/**
 * Scaled phone preview for the onboarding slides: renders a real 390x844 screen at natural size
 * and shrinks it, so the preview is always the product, never a drawing. Inert and hidden from
 * assistive tech (the slide's text carries the meaning). The bottom edge is open: the slide's
 * white panel overlaps it.
 */
export function MiniPhone({ children, width = 236, height = 330 }: { children: ReactNode; width?: number; height?: number }) {
  const scale = (width - 12) / NATURAL_W;
  return (
    <Box
      aria-hidden
      sx={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        borderRadius: '38px 38px 0 0',
        border: `6px solid ${bs.surface.inverse}`,
        borderBottom: 'none',
        boxShadow: `0 0 0 1px ${bs.border.strong}, ${bs.elevation.e3}`,
        backgroundColor: bs.surface.canvas,
      }}
    >
      <Box sx={{ position: 'absolute', top: 8, left: '50%', width: 62, height: 18, ml: '-31px', borderRadius: '9px', backgroundColor: bs.surface.inverse, zIndex: 3 }} />
      <Box inert sx={{ width: NATURAL_W, height: NATURAL_H, transformOrigin: 'top left', transform: `scale(${scale})`, pointerEvents: 'none', position: 'relative' }}>
        {children}
      </Box>
    </Box>
  );
}
