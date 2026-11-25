import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Job, JobAction } from '../../domain/booking';
import { getStatusLabel } from '../../domain/status';
import { unitMeta } from '../../domain/units';
import { useLocale, useT } from '../../i18n/locale';
import { unitIcon } from '../../icons/unitIcon';
import { Button } from '../../components/actions/Button/Button';
import { formatSlotTime } from '../../components/date-time/TimeSlot/TimeSlot';
import { IdentifierBlock } from '../../components/data-display/IdentifierBlock/IdentifierBlock';
import { InitialsAvatar } from '../../components/data-display/InitialsAvatar/InitialsAvatar';
import { StatusBadge } from '../../components/data-display/StatusBadge/StatusBadge';
import { Card } from '../../components/layout/Card/Card';
import { bs } from '../../theme/theme';
import { radius } from '../../theme/tokens';
import { auctionLabel } from '../shared/format';

export interface OperatorJobCardProps {
  job: Job;
  /** Display name of `job.assigneeId`. Omit when unassigned. */
  assigneeName?: string;
  /** `card` (default): its own surface, for lists on mobile. `embedded`: no surface, for `DataTable.renderMobileCard` (it already draws the card). */
  variant?: 'card' | 'embedded';
  /** Called by the next-action button. Click propagation is stopped so the row/card detail does not open. */
  onAction?: (action: JobAction, job: Job) => void;
}

const messages = {
  es: {
    assign: 'Asignar operador',
    start: 'Iniciar servicio',
    complete: 'Completar',
    view: 'Ver detalle',
    delivery: 'Entrega',
    lot: 'Lote',
    code: 'Código de recogida',
    codeShort: 'Código',
    pickup: 'Recogida en',
    job: 'Trabajo',
  },
  en: {
    assign: 'Assign operator',
    start: 'Start service',
    complete: 'Complete',
    view: 'View detail',
    delivery: 'Delivery',
    lot: 'Lot',
    code: 'Pickup code',
    codeShort: 'Code',
    pickup: 'Pickup at',
    job: 'Job',
  },
};

/** The one available next action. Orange only when it is "Asignar operador" (the one action that unblocks the job). */
export function JobNextAction({ job, onAction, size = 'md', fullWidth = false }: { job: Job; onAction?: OperatorJobCardProps['onAction']; size?: 'sm' | 'md'; fullWidth?: boolean }) {
  const t = useT(messages);
  const label = t[job.nextAction];
  return (
    <Button
      size={size}
      fullWidth={fullWidth}
      variant={job.nextAction === 'assign' ? 'primary' : job.nextAction === 'view' ? 'quiet' : 'secondary'}
      onClick={(e) => {
        e.stopPropagation();
        onAction?.(job.nextAction, job);
      }}
      aria-label={`${label}: ${job.customer}, ${job.id}`}
      sx={{ whiteSpace: 'nowrap' }}
    >
      {label}
    </Button>
  );
}

export function JobAssignee({ job, assigneeName }: { job: Job; assigneeName?: string }) {
  const locale = useLocale();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <InitialsAvatar name={assigneeName} size="sm" />
      <Typography variant="body2" sx={{ fontWeight: assigneeName ? 500 : 400, color: assigneeName ? bs.text.primary : bs.text.secondary }}>
        {assigneeName ?? getStatusLabel('assignment', job.assignment, locale, true)}
      </Typography>
    </Box>
  );
}

/**
 * Towing quick access: auction, yard, lot and pickup code, each with its own label and copy action.
 * `compact` (desktop table rows): no panel, lot and code share one line with icon-only copy buttons.
 */
export function JobAuctionBlock({ job, compact = false }: { job: Job; compact?: boolean }) {
  const t = useT(messages);
  if (!job.auction) return null;
  if (compact)
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="caption" sx={{ color: bs.text.secondary }}>
          {t.pickup} {auctionLabel[job.auction.auction]} · {job.auction.yard}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 3, rowGap: 0.5 }}>
          <IdentifierBlock compact variant="inline" label={t.lot} value={job.auction.lot} groupSize={4} />
          <IdentifierBlock compact variant="inline" label={t.codeShort} value={job.auction.code} />
        </Box>
      </Box>
    );
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 3, borderRadius: `${radius.md}px`, backgroundColor: bs.surface.subtle }}>
      <Typography variant="caption" sx={{ color: bs.text.secondary }}>
        {t.pickup} {auctionLabel[job.auction.auction]} · {job.auction.yard}
      </Typography>
      <IdentifierBlock variant="inline" label={t.lot} value={job.auction.lot} groupSize={4} />
      <IdentifierBlock variant="inline" label={t.code} value={job.auction.code} />
    </Box>
  );
}

/**
 * Mobile job card of the operator: time, unit, customer, location, status and next action.
 * Towing jobs show auction, lot and pickup code. Works standalone (`card`) or as `DataTable.renderMobileCard` (`embedded`).
 */
export function OperatorJobCard({ job, assigneeName, variant = 'card', onAction }: OperatorJobCardProps) {
  const t = useT(messages);
  const locale = useLocale();
  const Icon = unitIcon[job.unit];
  const body = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 3 }}>
        <Typography variant="h3" component="p" sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {formatSlotTime(job.time, locale)}
        </Typography>
        <Typography variant="caption" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
          {job.id}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Icon aria-hidden sx={{ fontSize: 20, color: bs.text.secondary, flexShrink: 0 }} />
        <Typography variant="label">
          {unitMeta[job.unit].name} · <Box component="span" sx={{ fontWeight: 400 }}>{job.service[locale]}</Box>
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {job.customer}
      </Typography>
      <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
        {job.auction && (
          <Box component="span" sx={{ color: bs.text.secondary }}>
            {t.delivery}:{' '}
          </Box>
        )}
        {job.location}
      </Typography>
      <JobAuctionBlock job={job} />
      <JobAssignee job={job} assigneeName={assigneeName} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <StatusBadge dimension="booking" status={job.status} size="sm" />
        {job.payment !== 'paid' && <StatusBadge dimension="payment" status={job.payment} size="sm" variant="outline" />}
      </Box>
      <Box sx={{ display: 'flex' }}>
        <JobNextAction job={job} onAction={onAction} fullWidth />
      </Box>
    </Box>
  );
  if (variant === 'embedded') return body;
  return (
    <Card component="article" density="comfortable" label={undefined}>
      <Box role="group" aria-label={`${t.job} ${job.id}: ${job.customer}, ${formatSlotTime(job.time, locale)}`}>
        {body}
      </Box>
    </Card>
  );
}
