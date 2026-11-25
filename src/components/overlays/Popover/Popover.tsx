import CloseRounded from '@mui/icons-material/CloseRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import MuiPopover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useId, useState, type ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { Button } from '../../actions/Button/Button';
import { IconButton } from '../../actions/IconButton/IconButton';

export interface PopoverProps {
  /** Accessible name of the trigger ("Qué es el código de recogida"). */
  triggerLabel: string;
  /** Visible text trigger (quiet button). Without it the trigger is an info icon button. */
  triggerText?: string;
  title: string;
  /** Short explanation: one or two sentences. */
  children: ReactNode;
  /** Optional single follow-up action ("Ver guía"). */
  actionLabel?: string;
  onAction?: () => void;
  placement?: 'bottom' | 'top';
}

const messages = { es: { close: 'Cerrar' }, en: { close: 'Close' } };

/**
 * Informational popover (title, body, optional action) opened by a trigger.
 * Esc or outside click closes it and returns focus to the trigger. Not for forms or critical decisions: use a dialog.
 */
export function Popover({ triggerLabel, triggerText, title, children, actionLabel, onAction, placement = 'bottom' }: PopoverProps) {
  const t = useT(messages);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const id = useId();
  const open = Boolean(anchor);
  const aria = { 'aria-haspopup': 'dialog' as const, 'aria-expanded': open || undefined, 'aria-controls': open ? `${id}-pop` : undefined };
  const close = () => setAnchor(null);

  return (
    <>
      {triggerText ? (
        <Button variant="quiet" size="sm" startIcon={<InfoOutlined />} onClick={(e) => setAnchor(e.currentTarget)} {...aria}>
          {triggerText}
        </Button>
      ) : (
        <IconButton label={triggerLabel} icon={<InfoOutlined />} size="sm" onClick={(e) => setAnchor(e.currentTarget)} {...aria} />
      )}
      <MuiPopover
        id={`${id}-pop`}
        anchorEl={anchor}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: placement === 'bottom' ? 'bottom' : 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: placement === 'bottom' ? 'top' : 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { role: 'dialog', 'aria-labelledby': `${id}-title`, sx: { mt: placement === 'bottom' ? 1 : -1, maxWidth: 'min(320px, calc(100vw - 32px))', p: 4 } },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1 }}>
          <Typography id={`${id}-title`} variant="h4" component="h2">
            {title}
          </Typography>
          <IconButton label={t.close} icon={<CloseRounded />} size="sm" onClick={close} sx={{ mt: -1, mr: -1 }} />
        </Box>
        <Typography variant="body2" component="div" sx={{ color: 'text.secondary' }}>
          {children}
        </Typography>
        {actionLabel && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                close();
                onAction?.();
              }}
            >
              {actionLabel}
            </Button>
          </Box>
        )}
      </MuiPopover>
    </>
  );
}
