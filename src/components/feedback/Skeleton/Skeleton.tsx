import Box from '@mui/material/Box';
import MuiSkeleton from '@mui/material/Skeleton';
import type { ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { bs } from '../../../theme/theme';
import { density as densities, layout, radius, type Density } from '../../../theme/tokens';

const messages = { es: { loading: 'Cargando contenido' }, en: { loading: 'Loading content' } };

/**
 * Wrap one or more skeleton patterns while data loads. Marks the region busy and gives
 * screen readers a single "Cargando…" instead of reading empty shapes.
 */
export function SkeletonGroup({ children, label }: { children: ReactNode; label?: string }) {
  const t = useT(messages);
  return (
    <Box role="status" aria-busy="true">
      <Box component="span" sx={visuallyHidden}>
        {label ?? t.loading}
      </Box>
      <Box aria-hidden>{children}</Box>
    </Box>
  );
}

/** Paragraph placeholder; the last line is shorter. */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {Array.from({ length: lines }, (_, i) => (
        <MuiSkeleton key={i} variant="text" height={14} width={i === lines - 1 && lines > 1 ? '62%' : '100%'} />
      ))}
    </Box>
  );
}

/** One list row: avatar, two lines, trailing badge. Same metrics as ListRow. */
export function SkeletonListRow({ density = 'comfortable', inset = 'gutter' }: { density?: Density; inset?: 'gutter' | 'none' }) {
  const d = densities[density];
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, minHeight: d.rowMinHeight, py: `${d.rowPaddingY}px`, px: inset === 'gutter' ? `${layout.gutter.mobile}px` : 0, borderBottom: `1px solid ${bs.border.subtle}` }}>
      <MuiSkeleton variant="circular" width={density === 'compact' ? 32 : 40} height={density === 'compact' ? 32 : 40} sx={{ flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <MuiSkeleton variant="text" height={16} width="55%" />
        <MuiSkeleton variant="text" height={12} width="80%" />
      </Box>
      <MuiSkeleton variant="rounded" width={56} height={24} sx={{ borderRadius: `${radius.pill}px`, flexShrink: 0 }} />
    </Box>
  );
}

/** Generic content card: title, text and an action. */
export function SkeletonCard({ density = 'comfortable' }: { density?: Density }) {
  return (
    <Box sx={{ p: `${densities[density].cardPadding}px`, border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, backgroundColor: bs.surface.raised, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <MuiSkeleton variant="text" height={20} width="45%" />
      <SkeletonText lines={2} />
      <MuiSkeleton variant="rounded" height={layout.controlHeight.md} sx={{ borderRadius: `${radius.pill}px` }} />
    </Box>
  );
}

/** Photo card (unit, service): image, badge line, title and price. */
export function SkeletonPhotoCard() {
  return (
    <Box sx={{ border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, backgroundColor: bs.surface.raised, overflow: 'hidden' }}>
      <MuiSkeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '4 / 3', height: 'auto' }} />
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <MuiSkeleton variant="text" height={12} width="30%" />
        <MuiSkeleton variant="text" height={20} width="70%" />
        <MuiSkeleton variant="text" height={16} width="40%" />
      </Box>
    </Box>
  );
}
