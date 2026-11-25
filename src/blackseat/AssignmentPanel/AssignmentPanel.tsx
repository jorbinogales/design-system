import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Job, Professional } from '../../domain/booking';
import { getStatusLabel } from '../../domain/status';
import { unitMeta } from '../../domain/units';
import { useLocale, useT } from '../../i18n/locale';
import { Button } from '../../components/actions/Button/Button';
import { formatSlotTime } from '../../components/date-time/TimeSlot/TimeSlot';
import { InitialsAvatar } from '../../components/data-display/InitialsAvatar/InitialsAvatar';
import { Tag } from '../../components/data-display/Tag/Tag';
import { InlineAlert } from '../../components/feedback/InlineAlert/InlineAlert';
import { Card } from '../../components/layout/Card/Card';
import { ResponsiveDetail } from '../../components/overlays/ResponsiveDetail/ResponsiveDetail';
import { RadioGroup } from '../../components/selection/Radio/Radio';
import { bs } from '../../theme/theme';
import { addMinutes, auctionLabel } from '../shared/format';

export type AssignmentConflict =
  | { kind: 'overlap'; other: Job }
  /** The professional does not work this unit. Blocks the assignment. */
  | { kind: 'unit' }
  /** The professional is off that day. Blocks the assignment. */
  | { kind: 'dayoff' };

const toMin = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/** Conflicts of assigning `pro` to `job`, given every job of the day. `unit` and `dayoff` block; `overlap` only warns. */
export function getAssignmentConflicts(job: Job, pro: Professional, jobs: Job[]): AssignmentConflict[] {
  const out: AssignmentConflict[] = [];
  if (!pro.units.includes(job.unit)) out.push({ kind: 'unit' });
  if (pro.daysOff?.includes(job.date)) out.push({ kind: 'dayoff' });
  const start = toMin(job.time);
  const end = start + job.durationMin;
  jobs
    .filter((j) => j.id !== job.id && j.assigneeId === pro.id && j.date === job.date && j.status !== 'cancelled' && j.status !== 'completed')
    .forEach((j) => {
      const s = toMin(j.time);
      if (s < end && s + j.durationMin > start) out.push({ kind: 'overlap', other: j });
    });
  return out;
}

export interface AssignmentPanelProps {
  open: boolean;
  onClose: () => void;
  /** The selected job. `null` keeps the panel closed. */
  job: Job | null;
  /** Staff that could take it (everyone; conflicts are computed per person). */
  professionals: Professional[];
  /** Every job of the day, to detect overlaps. */
  jobs: Job[];
  /** Chosen professional id. */
  value: string | null;
  onChange: (id: string) => void;
  /** Confirms the change with the chosen professional. */
  onConfirm: (id: string) => void;
  confirming?: boolean;
  disablePortal?: boolean;
}

const messages = {
  es: {
    assign: 'Asignar operador',
    reassign: 'Reasignar operador',
    schedule: 'Horario',
    current: 'Responsable actual',
    staff: 'Personal disponible',
    available: 'Libre en ese horario',
    jobsToday: (n: number) => (n === 1 ? '1 trabajo hoy' : `${n} trabajos hoy`),
    conflictTitle: 'Conflicto de horario',
    overlap: (n: string, id: string, from: string, to: string, svc: string) => `${n} ya tiene ${id} (${svc}) de ${from} a ${to}. Puedes asignar igual, pero se solaparán.`,
    unit: (n: string, u: string) => `${n} no trabaja en ${u}.`,
    dayoff: (n: string) => `${n} está de descanso ese día.`,
    blocked: 'No disponible',
    change: 'Cambio de responsable',
    changeBody: (a: string, b: string) => `${a} pasa el trabajo a ${b}. Se avisará a ambos y al cliente.`,
    firstBody: (b: string) => `${b} recibirá el trabajo y el cliente verá su nombre.`,
    confirm: (n: string) => `Asignar a ${n}`,
    reconfirm: (n: string) => `Reasignar a ${n}`,
    anyway: 'Asignar de todos modos',
    cancel: 'Cancelar',
    pickOne: 'Elige a alguien para continuar.',
    lot: 'Lote',
  },
  en: {
    assign: 'Assign operator',
    reassign: 'Reassign operator',
    schedule: 'Schedule',
    current: 'Current assignee',
    staff: 'Available staff',
    available: 'Free at that time',
    jobsToday: (n: number) => (n === 1 ? '1 job today' : `${n} jobs today`),
    conflictTitle: 'Schedule conflict',
    overlap: (n: string, id: string, from: string, to: string, svc: string) => `${n} already has ${id} (${svc}) from ${from} to ${to}. You can assign anyway, but they will overlap.`,
    unit: (n: string, u: string) => `${n} does not work ${u}.`,
    dayoff: (n: string) => `${n} is off that day.`,
    blocked: 'Unavailable',
    change: 'Assignee change',
    changeBody: (a: string, b: string) => `${a} hands the job to ${b}. Both and the customer will be notified.`,
    firstBody: (b: string) => `${b} will receive the job and the customer will see their name.`,
    confirm: (n: string) => `Assign to ${n}`,
    reconfirm: (n: string) => `Reassign to ${n}`,
    anyway: 'Assign anyway',
    cancel: 'Cancel',
    pickOne: 'Choose someone to continue.',
    lot: 'Lot',
  },
};

/**
 * Assignment of a job: selected job and schedule, current assignee, available staff, conflicts and the change confirmation.
 * Opens as a SidePanel on desktop and a full-screen page on mobile (`ResponsiveDetail`).
 */
export function AssignmentPanel({ open, onClose, job, professionals, jobs, value, onChange, onConfirm, confirming = false, disablePortal }: AssignmentPanelProps) {
  const t = useT(messages);
  const locale = useLocale();
  if (!job) return null;

  const current = professionals.find((p) => p.id === job.assigneeId);
  const chosen = professionals.find((p) => p.id === value);
  const end = addMinutes(job.time, job.durationMin);
  const rank = (p: Professional) => (p.units.includes(job.unit) ? 0 : 1);
  const staff = professionals.filter((p) => p.roleKind !== 'supervisor').sort((a, b) => rank(a) - rank(b));
  const conflictsOf = (p: Professional) => getAssignmentConflicts(job, p, jobs);
  const chosenConflicts = chosen ? conflictsOf(chosen) : [];
  const overlaps = chosenConflicts.filter((c): c is Extract<AssignmentConflict, { kind: 'overlap' }> => c.kind === 'overlap');
  const jobsOf = (p: Professional) => jobs.filter((j) => j.assigneeId === p.id && j.status !== 'cancelled').length;
  const sameAsCurrent = Boolean(chosen && current && chosen.id === current.id);

  const describe = (p: Professional) => {
    const c = conflictsOf(p);
    const block = c.find((x) => x.kind === 'unit' || x.kind === 'dayoff');
    if (block?.kind === 'unit') return t.unit(p.name, unitMeta[job.unit].name);
    if (block?.kind === 'dayoff') return t.dayoff(p.name);
    const ov = c.filter((x) => x.kind === 'overlap');
    return ov.length ? t.conflictTitle : `${t.available} · ${t.jobsToday(jobsOf(p))}`;
  };

  const confirmLabel = chosen ? (overlaps.length ? t.anyway : current ? t.reconfirm(chosen.name) : t.confirm(chosen.name)) : t.confirm('…');

  return (
    <ResponsiveDetail
      open={open}
      onClose={onClose}
      title={current ? t.reassign : t.assign}
      subtitle={`${job.id} · ${job.customer}`}
      disablePortal={disablePortal}
      actions={
        <Box sx={{ display: 'flex', gap: 3, width: '100%', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'flex-end' }}>
          <Button variant="quiet" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button variant={overlaps.length ? 'secondary' : 'primary'} disabled={!chosen || sameAsCurrent || chosenConflicts.some((c) => c.kind !== 'overlap')} loading={confirming} onClick={() => chosen && onConfirm(chosen.id)}>
            {confirmLabel}
          </Button>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Card variant="filled" density="compact">
          <Typography variant="caption" sx={{ color: bs.text.secondary }}>
            {t.schedule}
          </Typography>
          <Typography variant="h3" component="p" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatSlotTime(job.time, locale)} – {formatSlotTime(end, locale)}
          </Typography>
          <Typography variant="body2">
            {unitMeta[job.unit].name} · {job.service[locale]}
          </Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary, overflowWrap: 'anywhere' }}>
            {job.location}
          </Typography>
          {job.auction && (
            <Typography variant="code" component="p" sx={{ mt: 1, fontVariantNumeric: 'tabular-nums slashed-zero', fontSize: '0.8125rem' }}>
              {auctionLabel[job.auction.auction]} · {t.lot} {job.auction.lot}
            </Typography>
          )}
        </Card>

        <Box>
          <Typography variant="caption" sx={{ color: bs.text.secondary, display: 'block', mb: 2 }}>
            {t.current}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <InitialsAvatar name={current?.name} size="md" />
            <Box>
              <Typography variant="label" component="p">
                {current?.name ?? getStatusLabel('assignment', 'unassigned', locale, true)}
              </Typography>
              {current && (
                <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                  {current.role[locale]}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <RadioGroup<string>
          label={t.staff}
          value={value}
          onChange={onChange}
          options={staff.map((p) => {
            const blocked = conflictsOf(p).some((c) => c.kind !== 'overlap');
            return {
              value: p.id,
              disabled: blocked,
              label: (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                  <InitialsAvatar name={p.name} size="xs" />
                  <span>
                    {p.name} <Box component="span" sx={{ color: bs.text.secondary }}>· {p.role[locale]}</Box>
                  </span>
                  {blocked && <Tag tone="outline" size="sm" label={t.blocked} />}
                  {p.id === current?.id && <Tag tone="success" size="sm" label={t.current} />}
                </Box>
              ),
              description: describe(p),
            };
          })}
        />

        {overlaps.length > 0 && chosen && (
          <InlineAlert severity="warning" title={t.conflictTitle}>
            {overlaps.map((c) => (
              <Box component="span" key={c.other.id} sx={{ display: 'block' }}>
                {t.overlap(chosen.name, c.other.id, formatSlotTime(c.other.time, locale), formatSlotTime(addMinutes(c.other.time, c.other.durationMin), locale), c.other.service[locale])}
              </Box>
            ))}
          </InlineAlert>
        )}

        {chosen && !sameAsCurrent && (
          <InlineAlert severity="info" title={current ? t.change : undefined}>
            {current ? t.changeBody(current.name, chosen.name) : t.firstBody(chosen.name)}
          </InlineAlert>
        )}
        {!chosen && (
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.pickOne}
          </Typography>
        )}
      </Box>
    </ResponsiveDetail>
  );
}
