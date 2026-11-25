import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import InfoRounded from '@mui/icons-material/InfoRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ElementType, ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { IconButton } from '../../actions/IconButton/IconButton';

export type BannerSeverity = 'success' | 'warning' | 'error' | 'info';

export interface BannerProps {
  severity: BannerSeverity;
  title: ReactNode;
  children?: ReactNode;
  /** One action (quiet Button or Link): "Ver reserva", "Reintentar". */
  action?: ReactNode;
  /** `true`: shows ✕ and calls `onDismiss`. Default `false` = persistent (confirmed booking, offline, maintenance). */
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
}

const tone = { success: 'success', warning: 'warning', error: 'danger', info: 'info' } as const;
const icons: Record<BannerSeverity, ElementType> = { success: CheckCircleRounded, warning: WarningAmberRounded, error: ErrorRounded, info: InfoRounded };
const messages = { es: { dismiss: 'Cerrar mensaje' }, en: { dismiss: 'Dismiss message' } };

/**
 * Page-level message at the top of a view, edge to edge. Persistent by default
 * (a confirmed booking stays until the person leaves); dismissible for tips and notices.
 */
export function Banner({ severity, title, children, action, dismissible = false, onDismiss, dismissLabel }: BannerProps) {
  const t = useT(messages);
  const Icon = icons[severity];
  const colors = bs.status[tone[severity]];
  return (
    <Box
      role={severity === 'error' ? 'alert' : 'status'}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 3,
        py: 3.5,
        px: `${layout.gutter.mobile}px`,
        backgroundColor: colors.bg,
        color: colors.fg,
        borderBottom: `1px solid ${colors.border}`,
        '@media (min-width:600px)': { px: `${layout.gutter.tablet}px` },
      }}
    >
      <Icon aria-hidden sx={{ fontSize: 22, mt: '1px', flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box>
          <Typography variant="label" component="p" sx={{ color: 'inherit', overflowWrap: 'anywhere' }}>
            {title}
          </Typography>
          {children && (
            <Typography variant="body2" component="div" sx={{ color: 'inherit', mt: 0.5, overflowWrap: 'anywhere' }}>
              {children}
            </Typography>
          )}
        </Box>
        {action && <Box sx={{ alignSelf: 'flex-start', ml: -2 }}>{action}</Box>}
      </Box>
      {dismissible && <IconButton label={dismissLabel ?? t.dismiss} icon={<CloseRounded />} size="sm" onClick={onDismiss} sx={{ color: 'inherit', mr: -1.5, mt: -1 }} />}
    </Box>
  );
}
