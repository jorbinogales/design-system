import Box from '@mui/material/Box';
import { bs } from '../theme/theme';
import { BlackSixMark, type MarkVariant } from './BlackSixMark';

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
 * PROVISIONAL typographic wordmark until the official logo is supplied.
 * "BLACK" in Archivo Black-weight Expanded against "SIX" in Light Expanded: the name's
 * own contrast, carried by one family. Color follows `text.primary`, so it works on
 * light, dark and inverse surfaces.
 */
export function Wordmark({ size = 'md', withMark = false, orientation = 'horizontal', markVariant = 'orange' }: WordmarkProps) {
  const s = scale[size];
  const stacked = orientation === 'stacked';
  return (
    <Box
      role="img"
      aria-label="Black Six"
      sx={{
        display: 'inline-flex',
        flexDirection: stacked ? 'column' : 'row',
        alignItems: 'center',
        gap: `${s.gap}px`,
        color: bs.text.primary,
      }}
    >
      {withMark && <BlackSixMark size={s.mark} variant={markVariant} />}
      <Box
        component="span"
        aria-hidden
        sx={{
          fontSize: s.font,
          lineHeight: 1,
          fontStretch: '125%',
          letterSpacing: '0.01em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        <Box component="span" sx={{ fontWeight: 900 }}>
          Black
        </Box>
        <Box component="span" sx={{ fontWeight: 300 }}>
          {' '}
          Six
        </Box>
      </Box>
    </Box>
  );
}
