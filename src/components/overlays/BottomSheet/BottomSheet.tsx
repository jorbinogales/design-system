import CloseRounded from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { useId, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout, radius, transition } from '../../../theme/tokens';
import { IconButton } from '../../actions/IconButton/IconButton';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Centered title (also the accessible name of the dialog). */
  title: ReactNode;
  description?: ReactNode;
  /** Scrollable body (previews, options, forms). */
  children?: ReactNode;
  /** Sticky footer: usually two buttons. Pads the bottom safe area. */
  actions?: ReactNode;
  /** Close (✕) button in the header. Off for short confirmations that already have Cancelar. */
  showClose?: boolean;
  closeLabel?: string;
  /**
   * `true` (default): Esc, scrim tap and swipe-down close it (calls `onClose`).
   * `false`: only the actions inside can close it (use for a pending decision).
   */
  dismissible?: boolean;
  /** Mount inside the element instead of `document.body` (device frames, scoped screens). */
  disablePortal?: boolean;
}

const messages = { es: { close: 'Cerrar' }, en: { close: 'Close' } };
const DRAG_CLOSE_PX = 96;

/**
 * Mobile bottom sheet: grab handle, title, optional description, close, scrollable body and sticky actions.
 * Focus is trapped and returned to the trigger; Esc and scrim tap close it unless `dismissible` is off.
 */
export function BottomSheet({ open, onClose, title, description, children, actions, showClose = false, closeLabel, dismissible = true, disablePortal = false }: BottomSheetProps) {
  const t = useT(messages);
  const id = useId();
  const [dy, setDy] = useState(0);
  const startY = useRef<number | null>(null);

  const down = (e: PointerEvent<HTMLElement>) => {
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent<HTMLElement>) => {
    if (startY.current !== null) setDy(Math.max(0, e.clientY - startY.current));
  };
  const up = () => {
    if (startY.current === null) return;
    startY.current = null;
    if (dy > DRAG_CLOSE_PX && dismissible) onClose();
    setDy(0);
  };

  return (
    <Drawer
      anchor="bottom"
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
          'aria-describedby': description ? `${id}-desc` : undefined,
          style: { transform: dy ? `translateY(${dy}px)` : undefined, transition: dy ? 'none' : undefined },
          sx: { maxWidth: layout.maxWidth.mobile, mx: 'auto', display: 'flex', flexDirection: 'column', ...(disablePortal && { position: 'absolute' }) },
        },
      }}
    >
      <Box
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        aria-hidden
        sx={{ display: 'flex', justifyContent: 'center', pt: 2.5, pb: 1.5, touchAction: 'none', cursor: dismissible ? 'grab' : 'default', flexShrink: 0 }}
      >
        <Box sx={{ width: 40, height: 4, borderRadius: `${radius.pill}px`, backgroundColor: bs.border.strong }} />
      </Box>
      <Box sx={{ position: 'relative', px: `${layout.gutter.mobile}px`, pt: 2, pb: 3, textAlign: 'center', borderBottom: `1px solid ${bs.border.subtle}`, flexShrink: 0 }}>
        <Typography id={`${id}-title`} variant="h3" component="h2" sx={{ px: showClose ? 8 : 0 }}>
          {title}
        </Typography>
        {showClose && (
          <Box sx={{ position: 'absolute', right: layout.gutter.mobile - 8, top: 0 }}>
            <IconButton label={closeLabel ?? t.close} icon={<CloseRounded />} onClick={onClose} sx={{ transition: transition('background-color') }} />
          </Box>
        )}
      </Box>
      <Box sx={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', px: `${layout.gutter.mobile}px`, py: 4 }}>
        {description && (
          <Typography id={`${id}-desc`} variant="body1" sx={{ color: bs.text.secondary, textAlign: children ? 'left' : 'center', mb: children ? 4 : 0 }}>
            {description}
          </Typography>
        )}
        {children}
      </Box>
      {actions && <Box sx={{ flexShrink: 0, px: `${layout.gutter.mobile}px`, pt: 2, pb: 4 }}>{actions}</Box>}
    </Drawer>
  );
}
