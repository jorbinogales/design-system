import Box from '@mui/material/Box';
import { bs } from '../theme/theme';
import { bGlyphPath, bGlyphViewBox } from './logoPaths';

export type MarkVariant = 'orange' | 'inverse' | 'glyph';

export interface BlackSeatMarkProps {
  /** Rendered size in px (square). */
  size?: number;
  /**
   * `orange`: orange tile, charcoal B (default; 5.75:1).
   * `inverse`: charcoal tile, orange B (use on light canvases only).
   * `glyph`: the B alone in `currentColor`.
   */
  variant?: MarkVariant;
  /** Accessible name. Omit when the mark sits next to the wordmark (it becomes decorative). */
  title?: string;
}

/**
 * App mark for tight spaces (collapsed sidebar, app icon): the B of the official BLACKSEAT
 * logo on a soft square tile. The client has no separate symbol yet; this one is derived from the logo.
 */
export function BlackSeatMark({ size = 40, variant = 'orange', title }: BlackSeatMarkProps) {
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
      <svg x="9.5" y="7.5" width="13" height="17" viewBox={bGlyphViewBox} preserveAspectRatio="xMidYMid meet">
        <path d={bGlyphPath} fillRule="evenodd" style={{ fill: glyph }} />
      </svg>
    </Box>
  );
}
