import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { bs } from '../theme/theme';
import { radius } from '../theme/tokens';

/** WCAG relative-luminance contrast for #RRGGBB pairs. */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string) => {
    const h = hex.replace('#', '');
    const [r, g, bl] = [0, 2, 4].map((i) => {
      const c = parseInt(h.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Page shell for Fundamentos stories. */
export function FoundationPage({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <Box sx={{ maxWidth: 1120, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 8, p: { xs: 0, sm: 2 } }}>
      <Box sx={{ maxWidth: '68ch' }}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: bs.text.secondary }}>
          {intro}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}

export function FoundationSection({ title, children, description }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h3" component="h2">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ color: bs.text.secondary, mt: 1, maxWidth: '68ch' }}>
            {description}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  );
}

/** Simple responsive table used across foundations. */
export function SpecTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <Box sx={{ overflowX: 'auto', border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px` }}>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', '& td, & th': { textAlign: 'left', p: '10px 14px', borderBottom: `1px solid ${bs.border.subtle}`, verticalAlign: 'middle' }, '& tr:last-child td': { borderBottom: 0 }, '& th': { color: bs.text.secondary, fontWeight: 600, backgroundColor: bs.surface.subtle, whiteSpace: 'nowrap' } }}>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}

export const mono = { fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em', fontWeight: 600 } as const;
