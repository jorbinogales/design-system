import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import type { ReactNode } from 'react';
import { useT } from '../../../i18n/locale';

export type InlineAlertSeverity = 'success' | 'warning' | 'error' | 'info';

export interface InlineAlertProps {
  severity: InlineAlertSeverity;
  title?: ReactNode;
  children: ReactNode;
  /** One follow-up action (a quiet Button or Link): "Reintentar", "Ver horarios". */
  action?: ReactNode;
  /** Makes it dismissible. Leave out for messages the person must not lose (errors that block). */
  onClose?: () => void;
  closeLabel?: string;
}

const messages = { es: { close: 'Cerrar aviso' }, en: { close: 'Dismiss alert' } };

/**
 * In-context message inside a page or form: success, warning, error or info.
 * Errors and warnings are announced assertively; success and info politely.
 */
export function InlineAlert({ severity, title, children, action, onClose, closeLabel }: InlineAlertProps) {
  const t = useT(messages);
  return (
    <Alert severity={severity} role={severity === 'error' || severity === 'warning' ? 'alert' : 'status'} action={action} onClose={onClose} slotProps={{ closeButton: { 'aria-label': closeLabel ?? t.close } }}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </Alert>
  );
}
