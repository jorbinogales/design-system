/**
 * Business example shared by the Tablas y bandejas stories: the operator's "Hoy" agenda.
 * Data is inline on purpose (Miami area, USD market, Copart / IAA lots with leading zeros);
 * `src/mocks` will replace it once the shared mock layer exists.
 */
import CloseRounded from '@mui/icons-material/CloseRounded';
import EventRepeatOutlined from '@mui/icons-material/EventRepeatOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ManageAccountsOutlined from '@mui/icons-material/ManageAccountsOutlined';
import OpenInFullRounded from '@mui/icons-material/OpenInFullRounded';
import BlockRounded from '@mui/icons-material/BlockRounded';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import dayjs, { type Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { getStatusLabel, type BookingStatus, type PaymentStatus } from '../../../domain/status';
import { unitMeta, type BusinessUnit } from '../../../domain/units';
import { useLocale, useT } from '../../../i18n/locale';
import { unitIcon } from '../../../icons/unitIcon';
import { bs } from '../../../theme/theme';
import { Button } from '../../actions/Button/Button';
import { IconButton } from '../../actions/IconButton/IconButton';
import { formatSlotTime } from '../../date-time/TimeSlot/TimeSlot';
import { IdentifierBlock } from '../../data-display/IdentifierBlock/IdentifierBlock';
import { InitialsAvatar } from '../../data-display/InitialsAvatar/InitialsAvatar';
import { StatusBadge } from '../../data-display/StatusBadge/StatusBadge';
import { KeyValue, KeyValueList } from '../../layout/KeyValue/KeyValue';
import { FilterBar, emptyTrayFilters, type TrayFilters } from '../FilterBar/FilterBar';
import { Pagination } from '../Pagination/Pagination';
import type { RowMenuItem } from '../RowMenu/RowMenu';
import { DataTable, sortRows, type Column, type SortState } from './DataTable';

export type AgendaAction = 'assign' | 'start' | 'complete' | 'view';

export interface AgendaRow {
  id: string;
  /** "HH:mm" 24 h. */
  time: string;
  unit: BusinessUnit;
  service: { es: string; en: string };
  customer: string;
  /** Service or delivery address, complete. */
  location: string;
  /** Towing only. Lot and code are strings: they keep their leading zeros. */
  auction?: { yard: string; lot: string; code: string };
  assignee?: string;
  booking: BookingStatus;
  payment: PaymentStatus;
  action: AgendaAction;
}

export const agendaDay: Dayjs = dayjs('2026-11-25');

export const agendaRows: AgendaRow[] = [
  { id: 'BK-2041', time: '08:00', unit: 'detailing', service: { es: 'Detailing Completo', en: 'Full Detailing' }, customer: 'Valeria Ortiz', location: '2150 NW 87th Ave, Apt 4B, Doral, FL 33172', assignee: 'Luis Herrera', booking: 'confirmed', payment: 'paid', action: 'start' },
  { id: 'BK-2042', time: '08:30', unit: 'towing', service: { es: 'Recogida de subasta', en: 'Auction pickup' }, customer: 'Marcos Peña', location: '10400 NW 25th Street, Suite 300-B, Doral, FL 33172', auction: { yard: 'IAA Miami North', lot: '04217753', code: '0093' }, booking: 'confirmed', payment: 'pending', action: 'assign' },
  { id: 'BK-2043', time: '09:00', unit: 'personal-washing', service: { es: 'Lavado a mano', en: 'Hand wash' }, customer: 'Camila Reyes', location: '1111 Brickell Ave, Miami, FL 33131', assignee: 'Andrés Molina', booking: 'in_progress', payment: 'paid', action: 'complete' },
  { id: 'BK-2044', time: '09:30', unit: 'towing', service: { es: 'Recogida de subasta', en: 'Auction pickup' }, customer: 'Carlos Duarte', location: '7900 NW 36th St, Doral, FL 33166', auction: { yard: 'Copart Medley', lot: '00583122', code: '7710' }, assignee: 'Luis Herrera', booking: 'in_progress', payment: 'paid', action: 'complete' },
  { id: 'BK-2045', time: '10:15', unit: 'detailing', service: { es: 'Pulido y sellado', en: 'Polish and seal' }, customer: 'Sofía Navarro', location: '8250 NW 25th St, Doral, FL 33122', booking: 'pending_confirmation', payment: 'pending', action: 'assign' },
  { id: 'BK-2046', time: '11:00', unit: 'personal-washing', service: { es: 'Lavado a mano', en: 'Hand wash' }, customer: 'Diego Alarcón', location: '1450 Brickell Bay Dr, Unit 2207, Miami, FL 33131', assignee: 'Andrés Molina', booking: 'confirmed', payment: 'pending', action: 'start' },
  { id: 'BK-2047', time: '11:30', unit: 'towing', service: { es: 'Recogida de subasta', en: 'Auction pickup' }, customer: 'Elena Cabrera', location: '2100 NW 84th Ave, Doral, FL 33122', auction: { yard: 'Copart Miami North', lot: '00112045', code: '0314' }, booking: 'confirmed', payment: 'paid', action: 'assign' },
  { id: 'BK-2048', time: '12:30', unit: 'detailing', service: { es: 'Interior profundo', en: 'Deep interior' }, customer: 'Roberto Gil', location: '3401 NW 79th Ave, Doral, FL 33122', assignee: 'Luis Herrera', booking: 'completed', payment: 'paid', action: 'view' },
  { id: 'BK-2049', time: '13:00', unit: 'personal-washing', service: { es: 'Lavado a mano', en: 'Hand wash' }, customer: 'Paola Mena', location: '9700 NW 41st St, Doral, FL 33178', booking: 'cancelled', payment: 'refunded', action: 'view' },
  { id: 'BK-2050', time: '14:00', unit: 'towing', service: { es: 'Recogida de subasta', en: 'Auction pickup' }, customer: 'Javier Soto', location: '5250 NW 72nd Ave, Miami, FL 33166', auction: { yard: 'IAA Fort Lauderdale', lot: '02957310', code: '0460' }, assignee: 'Luis Herrera', booking: 'confirmed', payment: 'paid', action: 'start' },
  { id: 'BK-2051', time: '15:30', unit: 'detailing', service: { es: 'Detailing Completo', en: 'Full Detailing' }, customer: 'Lucía Vargas', location: '7100 NW 52nd St, Miami, FL 33166', booking: 'confirmed', payment: 'pending', action: 'assign' },
  { id: 'BK-2052', time: '16:00', unit: 'personal-washing', service: { es: 'Lavado a mano', en: 'Hand wash' }, customer: 'Tomás Ibarra', location: '300 S Biscayne Blvd, Miami, FL 33131', assignee: 'Andrés Molina', booking: 'confirmed', payment: 'paid', action: 'start' },
];

export const agendaAssignees = [
  { value: 'Luis Herrera', label: 'Luis Herrera' },
  { value: 'Andrés Molina', label: 'Andrés Molina' },
];

/** All filters combine (AND). Search matches customer, address, auction yard, lot and code. */
export function filterAgenda(rows: AgendaRow[], f: TrayFilters): AgendaRow[] {
  const q = f.query.trim().toLocaleLowerCase();
  return rows.filter(
    (r) =>
      (!q || [r.customer, r.location, r.auction?.yard, r.auction?.lot, r.auction?.code].filter(Boolean).join(' ').toLocaleLowerCase().includes(q)) &&
      (!f.units.length || f.units.includes(r.unit)) &&
      (f.assignee === 'all' || (f.assignee === 'unassigned' ? !r.assignee : r.assignee === f.assignee)) &&
      (f.status === 'all' || r.booking === f.status),
  );
}

export const countByUnit = (rows: AgendaRow[]): Partial<Record<BusinessUnit, number>> =>
  rows.reduce<Partial<Record<BusinessUnit, number>>>((acc, r) => ({ ...acc, [r.unit]: (acc[r.unit] ?? 0) + 1 }), {});

const messages = {
  es: {
    time: 'Hora',
    unit: 'Unidad',
    customer: 'Cliente',
    location: 'Ubicación',
    assignee: 'Responsable',
    status: 'Estado',
    next: 'Siguiente acción',
    assign: 'Asignar operador',
    start: 'Iniciar servicio',
    complete: 'Completar',
    view: 'Ver detalle',
    pickup: 'Recogida',
    delivery: 'Entrega',
    lot: 'Lote',
    code: 'Código',
    table: 'Agenda de hoy',
    menuView: 'Ver detalle',
    menuReassign: 'Reasignar operador',
    menuReschedule: 'Reprogramar',
    menuCancel: 'Cancelar reserva',
    menuEdit: 'Editar ubicación',
    detail: 'Detalle de la reserva',
    close: 'Cerrar detalle',
    service: 'Servicio',
    where: 'Ubicación',
    booking: 'Reserva',
    empty: 'Ningún trabajo coincide con los filtros.',
    auction: 'Datos de la subasta',
  },
  en: {
    time: 'Time',
    unit: 'Unit',
    customer: 'Customer',
    location: 'Location',
    assignee: 'Assignee',
    status: 'Status',
    next: 'Next action',
    assign: 'Assign operator',
    start: 'Start service',
    complete: 'Complete',
    view: 'View detail',
    pickup: 'Pickup',
    delivery: 'Delivery',
    lot: 'Lot',
    code: 'Code',
    table: "Today's agenda",
    menuView: 'View detail',
    menuReassign: 'Reassign operator',
    menuReschedule: 'Reschedule',
    menuCancel: 'Cancel booking',
    menuEdit: 'Edit location',
    detail: 'Booking detail',
    close: 'Close detail',
    service: 'Service',
    where: 'Location',
    booking: 'Booking',
    empty: 'No job matches the filters.',
    auction: 'Auction details',
  },
};

/** The one orange action is the available one: Asignar operador. Other next actions are secondary or quiet. */
export function NextAction({ row }: { row: AgendaRow }) {
  const t = useT(messages);
  const label = t[row.action];
  return (
    <Button
      size="sm"
      variant={row.action === 'assign' ? 'primary' : row.action === 'view' ? 'quiet' : 'secondary'}
      onClick={(e) => e.stopPropagation()}
      aria-label={`${label}: ${row.customer}`}
      sx={{ whiteSpace: 'nowrap' }}
    >
      {label}
    </Button>
  );
}

function UnitCell({ row }: { row: AgendaRow }) {
  const locale = useLocale();
  const Icon = unitIcon[row.unit];
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Icon aria-hidden sx={{ fontSize: 20, mt: '1px', color: bs.text.secondary }} />
      <Box>
        <Typography variant="label" component="div">
          {unitMeta[row.unit].name}
        </Typography>
        <Typography variant="caption" sx={{ color: bs.text.secondary }}>
          {row.service[locale]}
        </Typography>
      </Box>
    </Box>
  );
}

function AssigneeCell({ row }: { row: AgendaRow }) {
  const locale = useLocale();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <InitialsAvatar name={row.assignee} size="sm" />
      <Typography variant="body2" sx={{ fontWeight: row.assignee ? 500 : 400, color: row.assignee ? bs.text.primary : bs.text.secondary }}>
        {row.assignee ?? getStatusLabel('assignment', 'unassigned', locale, true)}
      </Typography>
    </Box>
  );
}

function LocationCell({ row }: { row: AgendaRow }) {
  const t = useT(messages);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {row.auction && (
        <Box>
          <Typography variant="caption" sx={{ color: bs.text.secondary, display: 'block' }}>
            {t.pickup}: {row.auction.yard}
          </Typography>
          <Typography variant="code" component="span" sx={{ fontSize: '0.8125rem', fontVariantNumeric: 'tabular-nums slashed-zero' }}>
            {t.lot} {row.auction.lot} · {t.code} {row.auction.code}
          </Typography>
        </Box>
      )}
      <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
        {row.auction ? <Box component="span" sx={{ color: bs.text.secondary }}>{t.delivery}: </Box> : null}
        {row.location}
      </Typography>
    </Box>
  );
}

function StatusCell({ row }: { row: AgendaRow }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
      <StatusBadge dimension="booking" status={row.booking} size="sm" />
      <StatusBadge dimension="payment" status={row.payment} size="sm" variant="outline" />
    </Box>
  );
}

/** Columns of the Hoy agenda: time, unit, customer, location, assignee, status badges and next action. */
export function useAgendaColumns(): Column<AgendaRow>[] {
  const t = useT(messages);
  const locale = useLocale();
  return [
    {
      id: 'time',
      header: t.time,
      minWidth: 96,
      sortValue: (r) => r.time,
      cell: (r) => (
        <Typography variant="label" sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {formatSlotTime(r.time, locale)}
        </Typography>
      ),
    },
    { id: 'unit', header: t.unit, minWidth: 170, sortValue: (r) => unitMeta[r.unit].name, cell: (r) => <UnitCell row={r} /> },
    { id: 'customer', header: t.customer, minWidth: 150, sortValue: (r) => r.customer, cell: (r) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.customer}</Typography> },
    { id: 'location', header: t.location, minWidth: 280, cell: (r) => <LocationCell row={r} /> },
    { id: 'assignee', header: t.assignee, minWidth: 210, sortValue: (r) => r.assignee ?? '', cell: (r) => <AssigneeCell row={r} /> },
    { id: 'status', header: t.status, minWidth: 190, cell: (r) => <StatusCell row={r} /> },
    { id: 'next', header: t.next, minWidth: 170, cell: (r) => <NextAction row={r} /> },
  ];
}

/** Menu of each row (View, Reassign, Reschedule, Cancel). Callbacks are no-ops in stories. */
export function useAgendaRowActions(onView: (row: AgendaRow) => void) {
  const t = useT(messages);
  return (row: AgendaRow): RowMenuItem[] => [
    { id: 'view', label: t.menuView, icon: <OpenInFullRounded />, onClick: () => onView(row) },
    { id: 'reassign', label: t.menuReassign, icon: <ManageAccountsOutlined />, onClick: () => undefined, disabled: row.booking === 'completed' || row.booking === 'cancelled' },
    { id: 'reschedule', label: t.menuReschedule, icon: <EventRepeatOutlined />, onClick: () => undefined, disabled: row.booking === 'completed' || row.booking === 'cancelled' },
    { id: 'edit', label: t.menuEdit, icon: <EditOutlined />, onClick: () => undefined },
    { id: 'cancel', label: t.menuCancel, icon: <BlockRounded />, onClick: () => undefined, destructive: true, dividerBefore: true, disabled: row.booking === 'completed' || row.booking === 'cancelled' },
  ];
}

/** Simple job card for mobile: stands in for the real "Tarjeta de trabajo del operador" built later. */
export function AgendaMobileCard({ row }: { row: AgendaRow }) {
  const locale = useLocale();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2.5, pr: 1 }}>
        <Typography variant="h3" component="p" sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {formatSlotTime(row.time, locale)}
        </Typography>
        <Typography variant="label" sx={{ color: bs.text.secondary }}>
          {unitMeta[row.unit].name} · {row.service[locale]}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {row.customer}
      </Typography>
      <LocationCell row={row} />
      <AssigneeCell row={row} />
      <StatusCell row={row} />
      <Box sx={{ display: 'flex' }}>
        <NextAction row={row} />
      </Box>
    </Box>
  );
}

/** Detail opened from a row: a simple right-hand drawer (the real SidePanel arrives with Capas y menús). */
export function AgendaDetailDrawer({ row, onClose }: { row: AgendaRow | null; onClose: () => void }) {
  const t = useT(messages);
  const locale = useLocale();
  return (
    <Drawer anchor="right" open={Boolean(row)} onClose={onClose} slotProps={{ paper: { sx: { width: 440, maxWidth: '100vw' }, 'aria-label': t.detail } }}>
      {row && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, p: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
                {row.id}
              </Typography>
              <Typography variant="h2" component="h2">
                {row.customer}
              </Typography>
            </Box>
            <IconButton label={t.close} icon={<CloseRounded />} variant="plain" onClick={onClose} />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <StatusBadge dimension="booking" status={row.booking} />
            <StatusBadge dimension="payment" status={row.payment} />
            <StatusBadge dimension="assignment" status={row.assignee ? 'assigned' : 'unassigned'} long />
          </Box>
          <KeyValueList gap={4}>
            <KeyValue layout="stacked" label={t.time} value={formatSlotTime(row.time, locale)} tabular />
            <KeyValue layout="stacked" label={t.service} value={`${unitMeta[row.unit].name} · ${row.service[locale]}`} />
            <KeyValue layout="stacked" label={t.assignee} value={row.assignee ?? getStatusLabel('assignment', 'unassigned', locale, true)} />
            <KeyValue layout="stacked" label={row.auction ? t.delivery : t.where} value={row.location} />
          </KeyValueList>
          {row.auction && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h4" component="h3">
                {t.auction}: {row.auction.yard}
              </Typography>
              <IdentifierBlock label={t.lot} value={row.auction.lot} groupSize={4} />
              <IdentifierBlock label={t.code} value={row.auction.code} />
            </Box>
          )}
          {row.action === 'assign' && (
            <Button fullWidth size="lg">
              {t.assign}
            </Button>
          )}
        </Box>
      )}
    </Drawer>
  );
}

/** The full "Hoy" tray: filter bar, sortable table (cards on mobile), pagination and a detail drawer. */
export function TodayAgenda({ pageSize: initialPageSize = 5 }: { pageSize?: number }) {
  const t = useT(messages);
  const locale = useLocale();
  const columns = useAgendaColumns();
  const [day, setDay] = useState(agendaDay);
  const [filters, setFilters] = useState<TrayFilters>(emptyTrayFilters);
  const [sort, setSort] = useState<SortState | null>({ columnId: 'time', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [open, setOpen] = useState<AgendaRow | null>(null);
  const dayRows = day.isSame(agendaDay, 'day') ? agendaRows : [];
  const filtered = useMemo(() => filterAgenda(dayRows, filters), [dayRows, filters]);
  const sorted = useMemo(() => sortRows(filtered, columns, sort, locale), [filtered, columns, sort, locale]);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pages);
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize);
  const actions = useAgendaRowActions(setOpen);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%', minWidth: 0 }}>
      <FilterBar
        value={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
        assignees={agendaAssignees}
        date={{ value: day, onChange: (d: Dayjs) => { setDay(d); setPage(1); }, today: agendaDay }}
        unitCounts={countByUnit(dayRows)}
        resultCount={sorted.length}
      />
      <DataTable
        label={t.table}
        columns={columns}
        rows={visible}
        getRowId={(r) => r.id}
        sort={sort}
        onSortChange={setSort}
        onRowClick={setOpen}
        activeRowId={open?.id ?? null}
        rowActions={actions}
        getRowLabel={(r) => `${r.customer}, ${formatSlotTime(r.time, locale)}`}
        renderMobileCard={(r) => <AgendaMobileCard row={r} />}
        empty={<Typography variant="body2" sx={{ color: bs.text.secondary }}>{t.empty}</Typography>}
      />
      <Pagination page={current} pageSize={pageSize} total={sorted.length} onPageChange={setPage} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} pageSizeOptions={[5, 10, 25]} />
      <AgendaDetailDrawer row={open} onClose={() => setOpen(null)} />
    </Box>
  );
}
