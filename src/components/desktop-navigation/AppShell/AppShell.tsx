import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';

export interface AppShellProps {
  /** `<Sidebar />`. */
  sidebar: ReactNode;
  /** The page: usually `<PageHeader />` followed by its content. */
  children: ReactNode;
  /** Content max width. `wide` 1280 (default) or `full` for wide tables. */
  width?: 'wide' | 'full';
  /** Fixed height (px or CSS) for previews; default fills the viewport. */
  height?: number | string;
}

const messages = { es: { skip: 'Saltar al contenido' }, en: { skip: 'Skip to content' } };

/**
 * Operator desktop frame: sidebar on the left, scrollable content area on the right with a skip link
 * and a `main` landmark. Operator screens (Hoy, Trabajos, Agenda…) are mounted inside it.
 */
export function AppShell({ sidebar, children, width = 'wide', height = '100vh' }: AppShellProps) {
  const t = useT(messages);
  const mainId = 'bs-main-content';
  return (
    <Box sx={{ display: 'flex', height, minHeight: 0, backgroundColor: bs.surface.canvas, color: bs.text.primary }}>
      <Box
        component="a"
        href={`#${mainId}`}
        sx={{
          position: 'absolute',
          left: 8,
          top: -64,
          zIndex: 2000,
          px: 4,
          py: 3,
          borderRadius: '8px',
          backgroundColor: bs.surface.raised,
          color: bs.text.primary,
          boxShadow: bs.elevation.e2,
          fontWeight: 600,
          '&:focus-visible': { top: 8, outline: `2px solid ${bs.focus.ring}`, outlineOffset: '2px' },
        }}
      >
        {t.skip}
      </Box>
      {sidebar}
      <Box component="main" id={mainId} tabIndex={-1} sx={{ flex: 1, minWidth: 0, overflowY: 'auto', outline: 'none' }}>
        <Box sx={{ maxWidth: width === 'wide' ? layout.maxWidth.wide : undefined, mx: 'auto', px: { xs: `${layout.gutter.mobile}px`, sm: `${layout.gutter.tablet}px`, lg: `${layout.gutter.desktop}px` }, pt: 8, pb: 10 }}>{children}</Box>
      </Box>
    </Box>
  );
}
