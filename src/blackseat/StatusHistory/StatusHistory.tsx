import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { StatusChange, StatusActor } from '../../domain/booking';
import { dimensionLabel, getStatusLabel, getStatusMeta, type BookingStatus, type StatusDimension } from '../../domain/status';
import { useLocale, useT } from '../../i18n/locale';
import { statusIcon } from '../../components/data-display/StatusBadge/StatusBadge';
import { bs } from '../../theme/theme';
import { formatDateTime } from '../shared/format';

export interface StatusHistoryProps {
  changes: StatusChange[];
  /**
   * `customer` (Track Order): friendly labels, only the changes that matter to them, no internal notes.
   * `operator`: every change on every dimension, with who made it and the internal note.
   */
  audience?: 'customer' | 'operator';
  /** `asc` = oldest first (Track Order timeline, default) · `desc` = newest first (operator log). */
  order?: 'asc' | 'desc';
  /** Adds the steps still to come (muted) after the latest booking status. */
  showUpcoming?: boolean;
  /** Accessible name of the list. */
  label?: string;
}

const messages = {
  es: {
    label: 'Historial de estados',
    current: 'Actual',
    upcoming: 'Pendiente',
    by: (n: string) => `por ${n}`,
    roles: { customer: 'Cliente', operator: 'Operador', admin: 'Administración', system: 'Automático' } as Record<StatusActor['role'], string>,
    you: 'tú',
    empty: 'Aún no hay cambios de estado.',
  },
  en: {
    label: 'Status history',
    current: 'Current',
    upcoming: 'Upcoming',
    by: (n: string) => `by ${n}`,
    roles: { customer: 'Customer', operator: 'Operator', admin: 'Admin', system: 'Automatic' } as Record<StatusActor['role'], string>,
    you: 'you',
    empty: 'No status changes yet.',
  },
};

const nextSteps: Record<BookingStatus, BookingStatus[]> = {
  pending_confirmation: ['confirmed', 'in_progress', 'completed'],
  confirmed: ['in_progress', 'completed'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
};

const customerVisible = (c: StatusChange) => c.dimension === 'booking' || (c.dimension === 'assignment' && c.status === 'assigned') || c.dimension === 'payment';

type Entry = { key: string; dimension: StatusDimension; status: string; at?: string; by?: StatusActor; note?: string; state: 'done' | 'current' | 'upcoming' };

/**
 * Timeline of status changes: status, date, time and who made the change (confirmed, started, completed, cancelled).
 * The customer's Track Order reuses it with `audience="customer"`.
 */
export function StatusHistory({ changes, audience = 'operator', order = 'asc', showUpcoming = false, label }: StatusHistoryProps) {
  const t = useT(messages);
  const locale = useLocale();
  const visible = (audience === 'customer' ? changes.filter(customerVisible) : changes).slice().sort((a, b) => a.at.localeCompare(b.at));
  const lastBooking = [...visible].reverse().find((c) => c.dimension === 'booking');

  const entries: Entry[] = visible.map((c) => ({ key: c.id, dimension: c.dimension, status: c.status, at: c.at, by: c.by, note: audience === 'operator' ? c.note?.[locale] : undefined, state: c === lastBooking ? 'current' : 'done' }));
  if (showUpcoming && lastBooking) {
    const done = new Set(visible.filter((c) => c.dimension === 'booking').map((c) => c.status));
    nextSteps[lastBooking.status as BookingStatus].filter((s) => !done.has(s)).forEach((s) => entries.push({ key: `next-${s}`, dimension: 'booking', status: s, state: 'upcoming' }));
  }
  const ordered = order === 'desc' ? [...entries].reverse() : entries;

  if (!ordered.length) {
    return (
      <Typography variant="body2" sx={{ color: bs.text.secondary }}>
        {t.empty}
      </Typography>
    );
  }

  return (
    <Box component="ol" aria-label={label ?? t.label} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {ordered.map((e, i) => {
        const dim = e.dimension;
        const meta = getStatusMeta(dim, e.status as never);
        const tone = bs.status[meta.tone];
        const Icon = (statusIcon[dim] as Record<string, typeof statusIcon.booking.confirmed>)[e.status];
        const title = getStatusLabel(dim, e.status as never, locale, audience === 'customer');
        const upcoming = e.state === 'upcoming';
        const last = i === ordered.length - 1;
        const who = e.by ? (e.by.role === 'customer' && audience === 'customer' ? t.you : e.by.name) : undefined;
        return (
          <Box component="li" key={e.key} aria-current={e.state === 'current' ? 'step' : undefined} sx={{ display: 'flex', gap: 4, position: 'relative', pb: last ? 0 : 5 }}>
            {!last && <Box aria-hidden sx={{ position: 'absolute', left: 15, top: 32, bottom: 0, width: 0, borderLeft: `2px ${upcoming || ordered[i + 1]?.state === 'upcoming' ? 'dashed' : 'solid'} ${bs.border.subtle}` }} />}
            <Box
              aria-hidden
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                backgroundColor: upcoming ? bs.surface.canvas : tone.bg,
                color: upcoming ? bs.text.secondary : tone.fg,
                border: `${e.state === 'current' ? 2 : 1}px ${upcoming ? 'dashed' : 'solid'} ${upcoming ? bs.border.strong : tone.border}`,
              }}
            >
              {Icon && <Icon sx={{ fontSize: 18 }} />}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1, pt: 0.5, opacity: upcoming ? 0.85 : 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="label" component="p" sx={{ color: upcoming ? bs.text.secondary : bs.text.primary }}>
                  {dim !== 'booking' && audience === 'operator' && (
                    <Box component="span" sx={{ color: bs.text.secondary, fontWeight: 400 }}>
                      {dimensionLabel[dim][locale]}:{' '}
                    </Box>
                  )}
                  {title}
                </Typography>
                {e.state === 'current' && (
                  <Typography variant="caption" component="span" sx={{ color: bs.text.secondary, fontWeight: 600 }}>
                    · {t.current}
                  </Typography>
                )}
                {upcoming && (
                  <Typography variant="caption" component="span" sx={{ color: bs.text.secondary }}>
                    · {t.upcoming}
                  </Typography>
                )}
              </Box>
              {e.at && (
                <Typography variant="body2" component="p" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
                  <time dateTime={e.at}>{formatDateTime(e.at, locale)}</time>
                  {who && ` · ${t.by(who)}`}
                  {audience === 'operator' && e.by && ` (${t.roles[e.by.role]})`}
                </Typography>
              )}
              {e.note && (
                <Typography variant="body2" component="p" sx={{ mt: 0.5 }}>
                  {e.note}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
