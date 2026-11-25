import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ElementType, ReactNode } from 'react';
import { bs } from '../../../theme/theme';

export type FieldMessageTone = 'hint' | 'error' | 'success' | 'warning' | 'info';

export interface FieldMessageProps {
  tone?: FieldMessageTone;
  children: ReactNode;
  /** Link it from the control or group with `aria-describedby`. */
  id?: string;
  /**
   * Announce it when it appears. Default: errors only (`role="alert"`).
   * Set `false` for a message that is already on screen at load.
   */
  live?: boolean;
}

const icons: Record<Exclude<FieldMessageTone, 'hint'>, ElementType> = {
  error: ErrorOutlineRounded,
  success: CheckCircleOutlineRounded,
  warning: WarningAmberRounded,
  info: InfoOutlined,
};

/**
 * Standalone message for a group of controls (a set of radios, a date + time pair, a code field),
 * where the helper text of a single field does not fit. Always icon + text; never color alone.
 */
export function FieldMessage({ tone = 'hint', children, id, live }: FieldMessageProps) {
  const Icon = tone === 'hint' ? null : icons[tone];
  const announce = live ?? tone === 'error';
  return (
    <Box
      id={id}
      role={announce ? (tone === 'error' ? 'alert' : 'status') : undefined}
      sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, color: tone === 'hint' ? bs.text.secondary : bs.status[tone === 'error' ? 'danger' : tone].fg }}
    >
      {Icon && <Icon aria-hidden sx={{ fontSize: 18, mt: '1px', flexShrink: 0 }} />}
      <Typography variant="body2" component="p" sx={{ color: 'inherit', overflowWrap: 'anywhere' }}>
        {children}
      </Typography>
    </Box>
  );
}
