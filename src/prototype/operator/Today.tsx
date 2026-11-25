import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { AssignmentPanel } from '../../blacksix/AssignmentPanel/AssignmentPanel';
import { DailyJobsTray } from '../../blacksix/DailyJobsTray/DailyJobsTray';
import { OrderActionButtons, OrderDetail, type OrderAction } from '../../blacksix/OrderDetail/OrderDetail';
import { AppShell } from '../../components/desktop-navigation/AppShell/AppShell';
import { PageHeader } from '../../components/desktop-navigation/PageHeader/PageHeader';
import { Sidebar } from '../../components/desktop-navigation/Sidebar/Sidebar';
import { UserMenu } from '../../components/desktop-navigation/UserMenu/UserMenu';
import { useToast } from '../../components/feedback/Toast/Toast';
import { Card } from '../../components/layout/Card/Card';
import { ResponsiveDetail } from '../../components/overlays/ResponsiveDetail/ResponsiveDetail';
import type { BookingDetail, Job, JobAction } from '../../domain/booking';
import type { BookingStatus } from '../../domain/status';
import { formatMoney } from '../../i18n/format';
import { useLocale, useT } from '../../i18n/locale';
import { bs } from '../../theme/theme';
import { getProfessional, professionals, staff, TODAY, toJob } from '../data';
import { useProto } from '../store';

const messages = {
  es: {
    title: 'Hoy',
    date: (n: number) => `Miércoles 25 de noviembre · ${n} trabajos`,
    total: 'Activos hoy',
    unassigned: 'Sin asignar',
    inProgress: 'En curso',
    pending: 'Por cobrar',
    assigned: (name: string) => `Asignado a ${name}.`,
    started: 'Trabajo iniciado.',
    done: 'Trabajo completado.',
    soon: 'Acción disponible en la versión funcional.',
  },
  en: {
    title: 'Today',
    date: (n: number) => `Wednesday, November 25 · ${n} jobs`,
    total: 'Active today',
    unassigned: 'Unassigned',
    inProgress: 'In progress',
    pending: 'To collect',
    assigned: (name: string) => `Assigned to ${name}.`,
    started: 'Job started.',
    done: 'Job completed.',
    soon: 'Available in the working version.',
  },
};

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'brand' }) {
  return (
    <Card variant="outlined" density="compact">
      <Typography variant="caption" component="p" sx={{ color: bs.text.secondary }}>
        {label}
      </Typography>
      <Typography variant="h2" component="p" sx={{ fontVariantNumeric: 'tabular-nums', color: tone === 'brand' ? bs.text.link : bs.text.primary }}>
        {value}
      </Typography>
    </Card>
  );
}

/** Operador · Hoy: counters, the day's tray (filters, table/cards), order detail side panel and assignment. */
export function OperatorToday() {
  const t = useT(messages);
  const locale = useLocale();
  const toast = useToast();
  const { bookings, setBookings, locale: lang, setLocale, appearance, setAppearance } = useProto();
  const [nav, setNav] = useState('today');
  const [day, setDay] = useState<Dayjs>(TODAY);
  const [openId, setOpenId] = useState<string | null>(null);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [pick, setPick] = useState<string | null>(null);

  const jobs = useMemo(() => bookings.map(toJob), [bookings]);
  const dayIso = day.format('YYYY-MM-DD');
  const todays = jobs.filter((j) => j.date === dayIso);
  const live = bookings.filter((b) => b.date === dayIso && b.status !== 'cancelled');
  const opened = bookings.find((b) => b.id === openId) ?? null;
  const assigning = jobs.find((j) => j.id === assignId) ?? null;

  const patch = (id: string, fn: (b: BookingDetail) => BookingDetail) => setBookings((all) => all.map((b) => (b.id === id ? fn(b) : b)));
  const setStatus = (id: string, status: BookingStatus) => patch(id, (b) => ({ ...b, status }));

  const onJob = (action: JobAction, job: Job) => {
    if (action === 'assign') {
      setAssignId(job.id);
      setPick(null);
    } else if (action === 'start') {
      setStatus(job.id, 'in_progress');
      toast.show({ message: t.started, severity: 'success' });
    } else if (action === 'complete') {
      setStatus(job.id, 'completed');
      toast.show({ message: t.done, severity: 'success' });
    } else setOpenId(job.id);
  };
  const onOrder = (a: OrderAction) => {
    if (!opened) return;
    if (a === 'assign' || a === 'reassign') {
      setOpenId(null);
      setAssignId(opened.id);
      setPick(opened.assignment.professionalId ?? null);
    } else if (a === 'start') setStatus(opened.id, 'in_progress');
    else if (a === 'complete') setStatus(opened.id, 'completed');
    else toast.show({ message: t.soon, severity: 'info' });
  };

  return (
    <AppShell
      width="full"
      height="100%"
      sidebar={
        <Sidebar
          value={nav}
          onChange={setNav}
          role="admin"
          footer={
            <UserMenu
              name="Elio Márquez"
              role="admin"
              language={lang}
              onLanguageChange={setLocale}
              appearance={appearance}
              onAppearanceChange={setAppearance}
              onProfile={() => toast.show({ message: t.soon, severity: 'info' })}
              onLogout={() => toast.show({ message: t.soon, severity: 'info' })}
            />
          }
        />
      }
    >
      <PageHeader title={t.title} description={t.date(todays.length)} />
      <Box component="section" aria-label={t.total} sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }, gap: 3, mb: 6 }}>
        <Stat label={t.total} value={String(live.length)} />
        <Stat label={t.unassigned} value={String(live.filter((b) => b.assignment.status === 'unassigned').length)} tone="brand" />
        <Stat label={t.inProgress} value={String(live.filter((b) => b.status === 'in_progress').length)} />
        <Stat label={t.pending} value={formatMoney(live.filter((b) => b.payment.status === 'pending').reduce((s, b) => s + b.total, 0), locale)} />
      </Box>
      <DailyJobsTray jobs={jobs} day={day} onDayChange={setDay} today={TODAY} staff={staff} onOpenJob={(j) => setOpenId(j.id)} onAction={onJob} activeJobId={openId} />

      {opened && (
        <ResponsiveDetail
          open
          title={opened.customer.name}
          subtitle={opened.id}
          onClose={() => setOpenId(null)}
          actions={<OrderActionButtons order={opened} role="admin" onAction={onOrder} />}
        >
          <OrderDetail order={opened} role="admin" actions="none" />
        </ResponsiveDetail>
      )}

      <AssignmentPanel
        open={Boolean(assigning)}
        onClose={() => setAssignId(null)}
        job={assigning}
        professionals={professionals}
        jobs={jobs}
        value={pick}
        onChange={setPick}
        onConfirm={(id) => {
          if (!assignId) return;
          const pro = getProfessional(id);
          patch(assignId, (b) => ({ ...b, assignment: { status: 'assigned', professionalId: id }, assignee: pro }));
          setAssignId(null);
          if (pro) toast.show({ message: t.assigned(pro.name), severity: 'success' });
        }}
      />
    </AppShell>
  );
}
