import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import InfoRounded from '@mui/icons-material/InfoRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiIconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ElementType, type ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { layout } from '../../../theme/tokens';

export type ToastSeverity = 'neutral' | 'success' | 'warning' | 'error' | 'info';

export interface ToastOptions {
  message: string;
  severity?: ToastSeverity;
  /** One action ("Deshacer", "Reintentar"). A toast with an action stays until closed unless `duration` is set. */
  actionLabel?: string;
  onAction?: () => void;
  /** Milliseconds. Default 5000 (6000 for errors); `null` keeps it until closed. */
  duration?: number | null;
}

interface ToastApi {
  /** Queue a toast. Returns its id. Toasts show one at a time. */
  show: (options: ToastOptions) => string;
  /** Close the toast with this id, or the visible one. */
  dismiss: (id?: string) => void;
}

interface ToastItem extends ToastOptions {
  id: string;
}

const ToastContext = createContext<ToastApi | null>(null);

/** `const toast = useToast(); toast.show({ message: 'Dirección guardada', severity: 'success' })`. Needs `<ToastProvider>`. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

const icons: Record<Exclude<ToastSeverity, 'neutral'>, ElementType> = { success: CheckCircleRounded, warning: WarningAmberRounded, error: ErrorRounded, info: InfoRounded };
const messages = { es: { close: 'Cerrar aviso' }, en: { close: 'Dismiss notification' } };

export interface ToastProviderProps {
  children: ReactNode;
  /** Extra px above the bottom edge on mobile (e.g. 64 over a BottomNav). */
  offsetBottom?: number;
}

/**
 * Mount once per screen. Snackbar-based queue: one toast at a time, bottom center on desktop and
 * above the bottom safe area on mobile. Hover and focus pause the timer.
 */
export function ToastProvider({ children, offsetBottom = 0 }: ToastProviderProps) {
  const t = useT(messages);
  const [queue, setQueue] = useState<ToastItem[]>([]);
  const [open, setOpen] = useState(false);
  const counter = useRef(0);

  const show = useCallback((options: ToastOptions) => {
    const id = `toast-${++counter.current}`;
    setQueue((q) => [...q, { ...options, id }]);
    setOpen(true);
    return id;
  }, []);
  const currentId = useRef<string | undefined>(undefined);
  const dismiss = useCallback((id?: string) => {
    if (!id || id === currentId.current) setOpen(false);
    else setQueue((q) => q.filter((x) => x.id !== id));
  }, []);
  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  const current = queue[0];
  currentId.current = current?.id;
  const severity = current?.severity ?? 'neutral';
  const Icon = severity === 'neutral' ? null : icons[severity];
  const sticky = current ? (current.duration === undefined ? Boolean(current.actionLabel) : current.duration === null) : false;
  const duration = current ? (current.duration === undefined ? (severity === 'error' ? 6000 : 5000) : current.duration) : null;

  return (
    <ToastContext value={api}>
      {children}
      {current && (
        <Snackbar
          key={current.id}
          open={open}
          autoHideDuration={sticky ? null : duration}
          onClose={(_, reason) => {
            if (reason !== 'clickaway') setOpen(false);
          }}
          slotProps={{
            transition: {
              onExited: () => {
                setQueue((q) => q.slice(1));
                setOpen(true);
              },
            },
            content: { role: severity === 'error' ? 'alert' : 'status', 'aria-live': severity === 'error' ? 'assertive' : 'polite' },
          }}
          message={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {Icon && <Icon aria-hidden sx={{ fontSize: 20, flexShrink: 0 }} />}
              <span>{current.message}</span>
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {current.actionLabel && (
                <Button
                  size="small"
                  onClick={() => {
                    current.onAction?.();
                    setOpen(false);
                  }}
                  sx={{ fontWeight: 700, textDecoration: 'underline' }}
                >
                  {current.actionLabel}
                </Button>
              )}
              {sticky && (
                <MuiIconButton size="small" aria-label={t.close} onClick={() => setOpen(false)} sx={{ color: 'inherit', minWidth: layout.touchTarget, minHeight: layout.touchTarget }}>
                  <CloseRounded fontSize="small" />
                </MuiIconButton>
              )}
            </Box>
          }
          sx={{ '@media (max-width:599.95px)': { bottom: `calc(${16 + offsetBottom}px + ${layout.safeAreaBottom})` } }}
        />
      )}
    </ToastContext>
  );
}
