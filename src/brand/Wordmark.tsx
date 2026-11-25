import Box from '@mui/material/Box';
import { bs } from '../theme/theme';
import { BlackSeatMark, type MarkVariant } from './BlackSeatMark';
import { wordmarkPath, wordmarkViewBox } from './logoPaths';

export type WordmarkSize = 'sm' | 'md' | 'lg' | 'xl';

export interface WordmarkProps {
  size?: WordmarkSize;
  /** Show the logo mark before (horizontal) or above (stacked) the name. */
  withMark?: boolean;
  orientation?: 'horizontal' | 'stacked';
  markVariant?: MarkVariant;
}

const scale: Record<WordmarkSize, { font: number; mark: number; gap: number }> = {
  sm: { font: 15, mark: 24, gap: 8 },
  md: { font: 20, mark: 32, gap: 10 },
  lg: { font: 28, mark: 44, gap: 12 },
  xl: { font: 40, mark: 72, gap: 20 },
};

/**
 * Official BLACKSEAT logo (vector, traced from the client's artwork). `size` sets the cap height
 * from the scale's font size. Color follows `text.primary`, so it works on light, dark and inverse surfaces.
 */
export function Wordmark({ size = 'md', withMark = false, orientation = 'horizontal', markVariant = 'orange' }: WordmarkProps) {
  const s = scale[size];
  const stacked = orientation === 'stacked';
  return (
    <Box
      role="img"
      aria-label="Black Seat"
      sx={{
        display: 'inline-flex',
        flexDirection: stacked ? 'column' : 'row',
        alignItems: 'center',
        gap: `${s.gap}px`,
        color: bs.text.primary,
      }}
    >
      {withMark && <BlackSeatMark size={s.mark} variant={markVariant} />}
      <Box component="svg" viewBox={wordmarkViewBox} aria-hidden sx={{ height: Math.round(s.font * 0.8), width: 'auto', display: 'block', flexShrink: 0 }}>
        <path d={wordmarkPath} fillRule="evenodd" fill="currentColor" />
      </Box>
    </Box>
  );
}
