import ManageAccountsOutlined from '@mui/icons-material/ManageAccountsOutlined';
import OpenInFullRounded from '@mui/icons-material/OpenInFullRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import type { Job, JobAction } from '../../domain/booking';
import type { BusinessUnit } from '../../domain/units';
import { unitMeta } from '../../domain/units';
import { useLocale, useT } from '../../i18n/locale';
import { unitIcon } from '../../icons/unitIcon';
import { formatSlotTime } from '../../components/date-time/TimeSlot/TimeSlot';
import { StatusBadge } from '../../components/data-display/StatusBadge/StatusBadge';
import { NoItemsState, NoResultsState } from '../../components/screen-states/StatePresets/StatePresets';
import { DataTable, sortRows, type Column, type SortState } from '../../components/tables/DataTable/DataTable';
import { emptyTrayFilters, FilterBar, type TrayFilters } from '../../components/tables/FilterBar/FilterBar';
import { Pagination } from '../../components/tables/Pagination/Pagination';
import { bs } from '../../theme/theme';
import { JobAssignee, JobAuctionBlock, JobNextAction, OperatorJobCard } from '../OperatorJobCard/OperatorJobCard';

export interface TrayStaff {
  id: string;
  name: string;
}

export interface DailyJobsTrayProps {
  /** Jobs of any day; the tray shows the ones of `day`. */
  jobs: Job[];
  day: Dayjs;
  onDayChange: (day: Dayjs) => void;
  /** Reference "today" for the Hoy / Mañana label of the date navigator. */
  today?: Dayjs;
  /** People shown in the Responsable filter and as assignee names. */
  staff: TrayStaff[];
  /** Row click (or Enter) on a job. */
  onOpenJob?: (job: Job) => void;
  /** Next-action button or row-menu action. */
  onAction?: (action: JobAction, job: Job) => void;
  /** Job whose detail is open: highlighted. */
  activeJobId?: string | null;
  pageSize?: number;
  loading?: boolean;
}

const messages = {
  es: {
    table: 'Pedidos del día',
    time: 'Hora',
    unit: 'Unidad',
    customer: 'Cliente',
    location: 'Ubicación',
    assignee: 'Responsable',
    status: 'Estado',
    next: 'Siguiente acción',
    delivery: 'Entrega',
    view: 'Ver detalle',
    assign: 'Asignar / reasignar',
    emptyTitle: 'Este día no tienes trabajos',
    emptyBody: 'Cuando se confirmen reservas para esta fecha aparecerán aquí.',
  },
  en: {
    table: 'Orders of the day',
    time: 'Time',
    unit: 'Unit',
    customer: 'Customer',
    location: 'Location',
    assignee: 'Assignee',
    status: 'Status',
    next: 'Next action',
    delivery: 'Delivery',
    view: 'View detail',
    assign: 'Assign / reassign',
    emptyTitle: 'No jobs on this day',
    emptyBody: 'Bookings confirmed for this date will show up here.',
  },
};

/** All filters combine (AND). The search matches id, customer, address, yard, lot and pickup code. */
export function filterJobs(rows: Job[], f: TrayFilters): Job[] {
  const q = f.query.trim().toLocaleLowerCase();
  return rows.filter(
    (r) =>
      (!q || [r.id, r.customer, r.location, r.auction?.yard, r.auction?.lot, r.auction?.code].filter(Boolean).join(' ').toLocaleLowerCase().includes(q)) &&
      (!f.units.length || f.units.includes(r.unit)) &&
      (f.assignee === 'all' || (f.assignee === 'unassigned' ? !r.assigneeId : r.assigneeId === f.assignee)) &&
      (f.status === 'all' || r.status === f.status),
  );
}

/**
 * The operator's tray for one day: date navigation, filters, a sortable table on desktop that turns into job cards on mobile,
 * with assignee, status and, for Towing, quick access to auction, lot and pickup code.
 * Use it inside `AppShell` + `Sidebar` on desktop.
 */
export function DailyJobsTray({ jobs, day, onDayChange, today, staff, onOpenJob, onAction, activeJobId, pageSize: initialPageSize = 8, loading = false }: DailyJobsTrayProps) {
  const t = useT(messages);
  const locale = useLocale();
  const [filters, setFilters] = useState<TrayFilters>(emptyTrayFilters);
  const [sort, setSort] = useState<SortState | null>({ columnId: 'time', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const nameOf = (id?: string) => staff.find((s) => s.id === id)?.name;
  const iso = day.format('YYYY-MM-DD');
  const dayRows = useMemo(() => jobs.filter((j) => j.date === iso), [jobs, iso]);
  const filtered = useMemo(() => filterJobs(dayRows, filters), [dayRows, filters]);
  const unitCounts = useMemo(() => dayRows.reduce<Partial<Record<BusinessUnit, number>>>((acc, r) => ({ ...acc, [r.unit]: (acc[r.unit] ?? 0) + 1 }), {}), [dayRows]);

  const columns: Column<Job>[] = [
    {
      id: 'time',
      header: t.time,
      minWidth: 88,
      sortValue: (r) => r.time,
      cell: (r) => (
        <Typography variant="label" sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {formatSlotTime(r.time, locale)}
        </Typography>
      ),
    },
    {
      id: 'unit',
      header: t.unit,
      minWidth: 140,
      sortValue: (r) => unitMeta[r.unit].name,
      cell: (r) => {
        const Icon = unitIcon[r.unit];
        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Icon aria-hidden sx={{ fontSize: 20, mt: '1px', color: bs.text.secondary }} />
            <Box>
              <Typography variant="label" component="div">
                {unitMeta[r.unit].name}
              </Typography>
              <Typography variant="caption" sx={{ color: bs.text.secondary }}>
                {r.service[locale]}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    { id: 'customer', header: t.customer, minWidth: 110, sortValue: (r) => r.customer, cell: (r) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.customer}</Typography> },
    {
      id: 'location',
      header: t.location,
      minWidth: 200,
      cell: (r) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <JobAuctionBlock job={r} compact />
          <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
            {r.auction && (
              <Box component="span" sx={{ color: bs.text.secondary }}>
                {t.delivery}:{' '}
              </Box>
            )}
            {r.location}
          </Typography>
        </Box>
      ),
    },
    { id: 'assignee', header: t.assignee, minWidth: 140, sortValue: (r) => nameOf(r.assigneeId) ?? '', cell: (r) => <JobAssignee job={r} assigneeName={nameOf(r.assigneeId)} /> },
    {
      id: 'status',
      header: t.status,
      minWidth: 130,
      cell: (r) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <StatusBadge dimension="booking" status={r.status} size="sm" />
          <StatusBadge dimension="payment" status={r.payment} size="sm" variant="outline" />
        </Box>
      ),
    },
    { id: 'next', header: t.next, minWidth: 150, cell: (r) => <JobNextAction job={r} onAction={onAction} size="sm" /> },
  ];

  const sorted = useMemo(() => sortRows(filtered, columns, sort, locale), [filtered, sort, locale]); // eslint-disable-line react-hooks/exhaustive-deps
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pages);
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize);
  const closed = (r: Job) => r.status === 'completed' || r.status === 'cancelled';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%', minWidth: 0 }}>
      <FilterBar
        value={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
        assignees={staff.map((s) => ({ value: s.id, label: s.name }))}
        date={{ value: day, onChange: (d) => { onDayChange(d); setPage(1); }, today }}
        unitCounts={unitCounts}
        resultCount={sorted.length}
      />
      <DataTable
        label={t.table}
        columns={columns}
        rows={visible}
        getRowId={(r) => r.id}
        sort={sort}
        onSortChange={setSort}
        onRowClick={onOpenJob}
        activeRowId={activeJobId ?? null}
        loading={loading}
        rowActions={(r) => [
          { id: 'view', label: t.view, icon: <OpenInFullRounded />, onClick: () => onOpenJob?.(r) },
          { id: 'assign', label: t.assign, icon: <ManageAccountsOutlined />, onClick: () => onAction?.('assign', r), disabled: closed(r) },
        ]}
        getRowLabel={(r) => `${r.customer}, ${formatSlotTime(r.time, locale)}`}
        renderMobileCard={(r) => <OperatorJobCard job={r} variant="embedded" assigneeName={nameOf(r.assigneeId)} onAction={onAction} />}
        empty={dayRows.length === 0 ? <NoItemsState layout="inline" title={t.emptyTitle} description={t.emptyBody} /> : <NoResultsState layout="inline" onClear={() => setFilters(emptyTrayFilters)} />}
      />
      <Pagination page={current} pageSize={pageSize} total={sorted.length} onPageChange={setPage} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} pageSizeOptions={[8, 16, 24]} />
    </Box>
  );
}
