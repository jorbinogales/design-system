import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { breakpoints, layout } from '../../../theme/tokens';
import { BottomActionBar } from '../../actions/BottomActionBar/BottomActionBar';
import { TopBar } from '../../navigation/TopBar/TopBar';
import { SidePanel } from '../SidePanel/SidePanel';

export interface ResponsiveDetailProps {
  open: boolean;
  onClose: () => void;
  /** Plain text: it names the dialog on both layouts. */
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Primary and secondary actions. Sticky footer on both layouts. */
  actions?: ReactNode;
  /** "Volver a Trabajos": destination-specific label for the mobile back button. */
  backLabel?: string;
  closeLabel?: string;
  /** Mount inside the nearest positioned ancestor (device frames, previews). */
  disablePortal?: boolean;
}

/**
 * The same detail as a right-hand panel from 900 px and as a full-screen page (TopBar with back) below.
 * Content is written once; only the container changes.
 */
export function ResponsiveDetail({ open, onClose, title, subtitle, children, actions, backLabel, closeLabel, disablePortal = false }: ResponsiveDetailProps) {
  const wide = useMediaQuery(`(min-width:${breakpoints.md}px)`);
  if (wide) {
    return (
      <SidePanel open={open} onClose={onClose} title={title} subtitle={subtitle} actions={actions} closeLabel={closeLabel} disablePortal={disablePortal}>
        {children}
      </SidePanel>
    );
  }
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      aria-label={title}
      disablePortal={disablePortal}
      slotProps={{
        root: disablePortal ? { sx: { position: 'absolute' } } : undefined,
        backdrop: disablePortal ? { sx: { position: 'absolute' } } : undefined,
        paper: { sx: { display: 'flex', flexDirection: 'column', backgroundColor: bs.surface.canvas, ...(disablePortal && { position: 'absolute' }) } },
      }}
    >
      <TopBar title={title} subtitle={subtitle} onBack={onClose} backLabel={backLabel} sticky />
      <Box sx={{ flex: 1, px: `${layout.gutter.mobile}px`, py: 4 }}>{children}</Box>
      {actions && <BottomActionBar>{actions}</BottomActionBar>}
    </Dialog>
  );
}
