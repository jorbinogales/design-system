import CloseRounded from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { useId, type ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { IconButton } from '../../actions/IconButton/IconButton';

export interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Line under the title (reference, date): "BK-20418 · Sáb 14 dic". */
  subtitle?: ReactNode;
  /** Scrollable body. */
  children: ReactNode;
  /** Sticky footer actions (Reasignar, Cancelar reserva). */
  actions?: ReactNode;
  /** 440 px (default) or 560 px for dense details. Never wider than the viewport. */
  width?: 'md' | 'lg';
  closeLabel?: string;
  /** `false`: Esc and scrim do not close it (unsaved edits); the header close still calls `onClose`. */
  dismissible?: boolean;
  /** Mount inside the nearest positioned ancestor instead of `document.body`. */
  disablePortal?: boolean;
}

const messages = { es: { close: 'Cerrar panel' }, en: { close: 'Close panel' } };
const widths = { md: 440, lg: 560 } as const;

/** Right-hand drawer for the desktop detail of a row (order, assignment). Focus trapped, Esc closes. */
export function SidePanel({ open, onClose, title, subtitle, children, actions, width = 'md', closeLabel, dismissible = true, disablePortal = false }: SidePanelProps) {
  const t = useT(messages);
  const id = useId();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        if (dismissible) onClose();
      }}
      disablePortal={disablePortal}
      slotProps={{
        root: disablePortal ? { sx: { position: 'absolute' } } : undefined,
        backdrop: disablePortal ? { sx: { position: 'absolute' } } : undefined,
        paper: {
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': `${id}-title`,
          sx: { width: `min(100vw, ${widths[width]}px)`, display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${bs.border.subtle}`, ...(disablePortal && { position: 'absolute' }) },
        },
      }}
    >
      <Box component="header" sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, px: 6, py: 4, borderBottom: `1px solid ${bs.border.subtle}`, flexShrink: 0 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography id={`${id}-title`} variant="h3" component="h2" sx={{ overflowWrap: 'anywhere' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: bs.text.secondary, mt: 0.5, overflowWrap: 'anywhere' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton label={closeLabel ?? t.close} icon={<CloseRounded />} variant="outlined" size="sm" onClick={onClose} sx={{ flexShrink: 0 }} />
      </Box>
      <Box sx={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', px: 6, py: 5 }}>{children}</Box>
      {actions && (
        <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', gap: 3, flexWrap: 'wrap', px: 6, py: 4, borderTop: `1px solid ${bs.border.subtle}`, backgroundColor: bs.surface.raised }}>
          {actions}
        </Box>
      )}
    </Drawer>
  );
}
