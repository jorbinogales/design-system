import AutorenewRounded from '@mui/icons-material/AutorenewRounded';
import BlockRounded from '@mui/icons-material/BlockRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import EventAvailableRounded from '@mui/icons-material/EventAvailableRounded';
import HourglassTopRounded from '@mui/icons-material/HourglassTopRounded';
import HowToRegRounded from '@mui/icons-material/HowToRegRounded';
import PaidRounded from '@mui/icons-material/PaidRounded';
import PersonSearchRounded from '@mui/icons-material/PersonSearchRounded';
import ReplayRounded from '@mui/icons-material/ReplayRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import Box from '@mui/material/Box';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { ComponentType } from 'react';
import { dimensionLabel, getStatusLabel, getStatusMeta, type StatusByDimension, type StatusDimension } from '../../../domain/status';
import { useLocale } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { bs } from '../../../theme/theme';
import { radius, typeScale } from '../../../theme/tokens';

/** Icon per status. Exported so timelines and tables reuse the same glyphs. */
export const statusIcon: { [D in StatusDimension]: Record<StatusByDimension[D], ComponentType<SvgIconProps>> } = {
  booking: {
    pending_confirmation: HourglassTopRounded,
    confirmed: EventAvailableRounded,
    in_progress: AutorenewRounded,
    completed: CheckCircleRounded,
    cancelled: BlockRounded,
  },
  assignment: { unassigned: PersonSearchRounded, assigned: HowToRegRounded },
  payment: { pending: ScheduleRounded, paid: PaidRounded, failed: ErrorRounded, refunded: ReplayRounded },
};

export type StatusBadgeProps = {
  [D in StatusDimension]: {
    dimension: D;
    status: StatusByDimension[D];
    /** Prefer the customer-facing long label ("Pendiente de asignación"). */
    long?: boolean;
    size?: 'sm' | 'md';
    /** `soft` (default) tinted fill · `outline` for dense tables. */
    variant?: 'soft' | 'outline';
    /** Prefix the dimension for screen readers ("Pago: Pagado"). On by default. */
    announceDimension?: boolean;
  };
}[StatusDimension];

/**
 * Status of one dimension (booking, assignment or payment) from `src/domain/status.ts`.
 * Always icon + text + tone; never color alone.
 */
export function StatusBadge({ dimension, status, long = false, size = 'md', variant = 'soft', announceDimension = true }: StatusBadgeProps) {
  const locale = useLocale();
  const meta = getStatusMeta(dimension, status);
  const label = getStatusLabel(dimension, status, locale, long);
  const Icon = (statusIcon[dimension] as Record<string, ComponentType<SvgIconProps>>)[status];
  const tone = bs.status[meta.tone];
  return (
    <Box
      component="span"
      title={meta.description[locale]}
      sx={{
        ...typeScale.caption,
        fontWeight: 650,
        fontSize: size === 'sm' ? '0.6875rem' : '0.8125rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        height: size === 'sm' ? 22 : 28,
        pl: size === 'sm' ? 1.5 : 2,
        pr: size === 'sm' ? 2 : 2.75,
        borderRadius: `${radius.pill}px`,
        border: `1px solid ${tone.border}`,
        backgroundColor: variant === 'soft' ? tone.bg : 'transparent',
        color: variant === 'soft' ? tone.fg : bs.text.primary,
        whiteSpace: 'nowrap',
        maxWidth: '100%',
      }}
    >
      <Icon aria-hidden sx={{ fontSize: size === 'sm' ? 14 : 16, color: tone.fg }} />
      {announceDimension && (
        <Box component="span" sx={visuallyHidden}>
          {dimensionLabel[dimension][locale]}:{' '}
        </Box>
      )}
      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {label}
      </Box>
    </Box>
  );
}
