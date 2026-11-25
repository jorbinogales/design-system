import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { typeScale, type Density } from '../../../theme/tokens';

export interface KeyValueProps {
  label: ReactNode;
  value: ReactNode;
  /** `inline`: label left, value right (summaries). `stacked`: label above value (detail panels, long values like addresses). */
  layout?: 'inline' | 'stacked';
  /** Bold, larger value for totals. */
  emphasis?: boolean;
  density?: Density;
  /** Monospaced-feel figures for codes, plates and times. */
  tabular?: boolean;
}

/** Description list (`<dl>`) container for KeyValue rows. */
export function KeyValueList({ children, gap = 3 }: { children: ReactNode; gap?: number }) {
  return (
    <Box component="dl" sx={{ m: 0, display: 'flex', flexDirection: 'column', gap }}>
      {children}
    </Box>
  );
}

/** Label–value pair (`<dt>`/`<dd>`). Use inside `KeyValueList`. */
export function KeyValue({ label, value, layout = 'inline', emphasis = false, density = 'comfortable', tabular = false }: KeyValueProps) {
  const size = density === 'compact' ? typeScale.body2 : typeScale.body1;
  const stacked = layout === 'stacked';
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: stacked ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: stacked ? 'flex-start' : 'baseline',
        gap: stacked ? 0.5 : 4,
      }}
    >
      <Box component="dt" sx={{ ...(stacked ? typeScale.caption : size), color: bs.text.secondary, ...(emphasis && !stacked && { color: bs.text.primary, fontWeight: 600 }), flexShrink: 0 }}>
        {label}
      </Box>
      <Box
        component="dd"
        sx={{
          ...size,
          m: 0,
          color: bs.text.primary,
          fontWeight: emphasis ? 750 : 500,
          ...(emphasis && { fontSize: '1.125rem' }),
          textAlign: stacked ? 'left' : 'right',
          minWidth: 0,
          overflowWrap: 'anywhere',
          ...(tabular && { fontVariantNumeric: 'tabular-nums slashed-zero', letterSpacing: '0.02em' }),
        }}
      >
        {value}
      </Box>
    </Box>
  );
}
