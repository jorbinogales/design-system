import Box from '@mui/material/Box';
import { bs } from '../theme/theme';

export type MarkVariant = 'orange' | 'inverse' | 'glyph';

export interface BlackSixMarkProps {
  /** Rendered size in px (square). */
  size?: number;
  /**
   * `orange`: orange tile, charcoal six (default; 5.75:1).
   * `inverse`: charcoal tile, orange six (use on light canvases only).
   * `glyph`: the six alone in `currentColor`.
   */
  variant?: MarkVariant;
  /** Accessible name. Omit when the mark sits next to the wordmark (it becomes decorative). */
  title?: string;
}

/**
 * PROVISIONAL logo mark until the official Black Six logo is supplied: a geometric
 * numeral six on a soft square tile. Drawn as strokes so it never depends on a font.
 */
export function BlackSixMark({ size = 40, variant = 'orange', title }: BlackSixMarkProps) {
  const tile = variant === 'orange' ? bs.brand.primary : variant === 'inverse' ? bs.surface.inverse : 'transparent';
  const glyph = variant === 'orange' ? bs.action.primary.fg : variant === 'inverse' ? bs.brand.primary : 'currentColor';
  return (
    <Box
      component="svg"
      viewBox="0 0 32 32"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      sx={{ width: size, height: size, flexShrink: 0, display: 'block' }}
    >
      {variant !== 'glyph' && <rect width="32" height="32" rx="9" style={{ fill: tile }} />}
      <g fill="none" style={{ stroke: glyph }} strokeWidth="4" strokeLinejoin="round">
        <circle cx="16" cy="19.5" r="5.75" />
        <path d="M10.25 19.5v-3.75C10.25 10.6 13.6 7 19.75 7" strokeLinecap="butt" />
      </g>
    </Box>
  );
}
