import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { bs } from '../theme/theme';

/** Vertical stack of specimens inside a story. */
export function Showcase({ children, maxWidth, sx, ...rest }: BoxProps & { maxWidth?: number }) {
  return (
    <Box {...rest} sx={[{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
    </Box>
  );
}

interface SpecimenProps {
  /** Annotation shown above the specimen (localize it with `useStoryLabels`). */
  label: ReactNode;
  children: ReactNode;
  /** `row` wraps items horizontally (variants); `column` stacks them (fields). */
  direction?: 'row' | 'column';
  gap?: number;
  align?: 'center' | 'flex-start' | 'stretch';
}

/** One labelled group of examples. */
export function Specimen({ label, children, direction = 'row', gap = 3, align = 'center' }: SpecimenProps) {
  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: bs.text.secondary }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: direction, flexWrap: direction === 'row' ? 'wrap' : 'nowrap', gap, alignItems: align, minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  );
}
