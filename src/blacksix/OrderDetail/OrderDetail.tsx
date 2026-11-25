import CallOutlined from '@mui/icons-material/CallOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { BookingDetail } from '../../domain/booking';
import { unitMeta } from '../../domain/units';
import { useLocale, useT } from '../../i18n/locale';
import { unitIcon } from '../../icons/unitIcon';
import { Button } from '../../components/actions/Button/Button';
import { LocationCard } from '../../components/address/LocationCard/LocationCard';
import { formatSlotTime } from '../../components/date-time/TimeSlot/TimeSlot';
import { AmountBreakdown } from '../../components/data-display/AmountBreakdown/AmountBreakdown';
import { IdentifierBlock } from '../../components/data-display/IdentifierBlock/IdentifierBlock';
import { InitialsAvatar } from '../../components/data-display/InitialsAvatar/InitialsAvatar';
import { StatusBadge } from '../../components/data-display/StatusBadge/StatusBadge';
import { InlineAlert } from '../../components/feedback/InlineAlert/InlineAlert';
import { KeyValue, KeyValueList } from '../../components/layout/KeyValue/KeyValue';
import type { StaffRole } from '../../components/desktop-navigation/Sidebar/Sidebar';
import { bs } from '../../theme/theme';
import { StatusHistory } from '../StatusHistory/StatusHistory';
import { addMinutes, auctionLabel, formatDateLong, formatDuration } from '../shared/format';

export type OrderAction = 'assign' | 'reassign' | 'start' | 'complete' | 'reschedule' | 'mark-paid' | 'refund' | 'cancel';

export interface OrderActionSpec {
  id: OrderAction;
  /** At most one per order: the available next step. Rendered orange only for `assign`. */
  primary?: boolean;
  destructive?: boolean;
}

/**
 * The actions this role may take on this order. Operators move the job forward (assign, start, complete);
 * admins also reassign, reschedule, collect, refund and cancel. Finished or cancelled orders are read-only for operators.
 */
export function getOrderActions(order: BookingDetail, role: StaffRole): OrderActionSpec[] {
  const active = order.status === 'pending_confirmation' || order.status === 'confirmed';
  const out: OrderActionSpec[] = [];
  if (order.status !== 'cancelled' && order.status !== 'completed' && order.assignment.status === 'unassigned') out.push({ id: 'assign', primary: true });
  if (order.status === 'confirmed' && order.assignment.status === 'assigned') out.push({ id: 'start', primary: true });
  if (order.status === 'in_progress') out.push({ id: 'complete', primary: true });
  if (role === 'admin') {
    if (active && order.assignment.status === 'assigned') out.push({ id: 'reassign' });
    if (active) out.push({ id: 'reschedule' });
    if (order.payment.status === 'pending' && order.status !== 'cancelled') out.push({ id: 'mark-paid' });
    if (order.status === 'cancelled' && order.payment.status === 'paid') out.push({ id: 'refund' });
    if (active) out.push({ id: 'cancel', destructive: true });
  }
  return out;
}

const messages = {
  es: {
    assign: 'Asignar operador',
    reassign: 'Reasignar',
    start: 'Iniciar servicio',
    complete: 'Completar servicio',
    reschedule: 'Reprogramar',
    'mark-paid': 'Registrar pago',
    refund: 'Reembolsar',
    cancel: 'Cancelar reserva',
    service: 'Servicio',
    when: 'Fecha y hora',
    customer: 'Cliente',
    vehicle: 'Vehículo',
    where: 'Ubicación del servicio',
    delivery: 'Entrega',
    pickup: 'Datos de recogida',
    auction: 'Subasta',
    lot: 'Número de lote',
    code: 'Código de recogida',
    assignee: 'Responsable',
    payment: 'Pago',
    reference: 'Referencia de pago',
    note: 'Nota de la reserva',
    history: 'Historial de estados',
    call: 'Llamar',
    restricted: 'Tu rol no permite reprogramar, cobrar ni cancelar. Pide a administración si hace falta.',
    noActions: 'No hay acciones disponibles para este estado.',
    actions: 'Acciones',
    yardTitle: (n: string) => `Patio ${n}`,
    ends: (t: string) => `termina aprox. ${t}`,
  },
  en: {
    assign: 'Assign operator',
    reassign: 'Reassign',
    start: 'Start service',
    complete: 'Complete service',
    reschedule: 'Reschedule',
    'mark-paid': 'Record payment',
    refund: 'Refund',
    cancel: 'Cancel booking',
    service: 'Service',
    when: 'Date and time',
    customer: 'Customer',
    vehicle: 'Vehicle',
    where: 'Service location',
    delivery: 'Delivery',
    pickup: 'Pickup details',
    auction: 'Auction',
    lot: 'Lot number',
    code: 'Pickup code',
    assignee: 'Assignee',
    payment: 'Payment',
    reference: 'Payment reference',
    note: 'Booking note',
    history: 'Status history',
    call: 'Call',
    restricted: 'Your role cannot reschedule, collect or cancel. Ask an admin if needed.',
    noActions: 'No actions available for this status.',
    actions: 'Actions',
    yardTitle: (n: string) => `${n} yard`,
    ends: (t: string) => `ends about ${t}`,
  },
};

export interface OrderActionButtonsProps {
  order: BookingDetail;
  role: StaffRole;
  onAction?: (action: OrderAction) => void;
}

/** Buttons for the allowed actions. Use inside a panel footer or at the end of `OrderDetail`. */
export function OrderActionButtons({ order, role, onAction }: OrderActionButtonsProps) {
  const t = useT(messages);
  const actions = getOrderActions(order, role);
  if (!actions.length) {
    return (
      <Typography variant="body2" sx={{ color: bs.text.secondary }}>
        {t.noActions}
      </Typography>
    );
  }
  return (
    <Box role="group" aria-label={t.actions} sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: { sm: 'flex-end' } }}>
      {actions.map((a) => (
        <Button key={a.id} size="md" variant={a.destructive ? 'destructive' : a.id === 'assign' ? 'primary' : a.primary ? 'secondary' : 'quiet'} onClick={() => onAction?.(a.id)}>
          {t[a.id]}
        </Button>
      ))}
    </Box>
  );
}

export interface OrderDetailProps {
  order: BookingDetail;
  /** Gates which actions appear. */
  role: StaffRole;
  onAction?: (action: OrderAction) => void;
  /** `none` when the container (SidePanel / ResponsiveDetail) renders `OrderActionButtons` in its footer. */
  actions?: 'inline' | 'none';
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <Box component="section" aria-label={title} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Typography variant="h4" component="h3">
      {title}
    </Typography>
    {children}
  </Box>
);

/** The same booking seen from operations: service, schedule, customer, location, pickup data when it applies, payment, history and the actions the role allows. */
export function OrderDetail({ order, role, onAction, actions = 'inline' }: OrderDetailProps) {
  const t = useT(messages);
  const locale = useLocale();
  const Icon = unitIcon[order.unit];
  const loc = order.address ?? order.center?.address;
  const locTitle = order.auction ? t.delivery : (order.center?.name ?? t.where);
  const end = formatSlotTime(addMinutes(order.time, order.package.durationMin), locale);
  const restricted = role === 'operator' && (order.status === 'pending_confirmation' || order.status === 'confirmed');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <StatusBadge dimension="booking" status={order.status} />
          <StatusBadge dimension="assignment" status={order.assignment.status} long />
          <StatusBadge dimension="payment" status={order.payment.status} />
        </Box>
        <KeyValueList gap={4}>
          <KeyValue layout="stacked" label={t.service} value={<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Icon aria-hidden sx={{ fontSize: 20 }} />{unitMeta[order.unit].name} · {order.package.name[locale]}</Box>} />
          <KeyValue layout="stacked" tabular label={t.when} value={`${formatDateLong(order.date, locale)} · ${formatSlotTime(order.time, locale)} (${formatDuration(order.package.durationMin)}, ${t.ends(end)})`} />
        </KeyValueList>
      </Box>

      <Section title={t.customer}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="label" component="p">
              {order.customer.name}
            </Typography>
            <Typography variant="body2" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
              {order.customer.phone}
            </Typography>
          </Box>
          <Button variant="secondary" size="sm" href={`tel:${order.customer.phone.replace(/[^\d+]/g, '')}`} startIcon={<CallOutlined />} aria-label={`${t.call}: ${order.customer.name}`}>
            {t.call}
          </Button>
        </Box>
        <KeyValue layout="stacked" label={t.vehicle} value={`${order.vehicle.year} ${order.vehicle.make} ${order.vehicle.model} · ${order.vehicle.color[locale]} · ${order.vehicle.plate}`} />
      </Section>

      {loc && (
        <Section title={order.auction ? t.delivery : t.where}>
          <LocationCard address={loc} title={locTitle} pinKind={order.auction ? 'destination' : 'address'} showMap={false} layout="stacked" />
        </Section>
      )}

      {order.auction && order.yard && (
        <Section title={t.pickup}>
          <KeyValue layout="stacked" label={t.auction} value={`${auctionLabel[order.auction.auction]} · ${order.yard.name}`} />
          <IdentifierBlock label={t.lot} value={order.auction.lot} groupSize={4} />
          <IdentifierBlock label={t.code} value={order.auction.code} />
          <LocationCard address={order.yard.address} title={t.yardTitle(order.yard.name)} pinKind="auction" showMap={false} layout="stacked" />
        </Section>
      )}

      <Section title={t.assignee}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <InitialsAvatar name={order.assignee?.name} size="md" />
          <Box>
            <Typography variant="label" component="p">
              {order.assignee?.name ?? (locale === 'es' ? 'Pendiente de asignación' : 'Awaiting assignment')}
            </Typography>
            {order.assignee && (
              <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                {order.assignee.role[locale]}
              </Typography>
            )}
          </Box>
        </Box>
      </Section>

      <Section title={t.payment}>
        <KeyValue layout="stacked" label={order.paymentMethod.label[locale]} value={order.paymentMethod.detail?.[locale] ?? order.paymentMethod.description[locale]} />
        {order.payment.reference && <IdentifierBlock label={t.reference} value={order.payment.reference} variant="inline" />}
        <AmountBreakdown lines={order.lines.map((l) => ({ label: l.label[locale], amount: l.amount, kind: l.kind }))} total={order.total} density="compact" />
      </Section>

      {order.notes && (
        <InlineAlert severity="info" title={t.note}>
          {order.notes}
        </InlineAlert>
      )}

      <Section title={t.history}>
        <StatusHistory changes={order.history} audience="operator" order="desc" />
      </Section>

      {actions === 'inline' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 4, borderTop: `1px solid ${bs.border.subtle}` }}>
          {restricted && (
            <Typography variant="caption" sx={{ color: bs.text.secondary }}>
              {t.restricted}
            </Typography>
          )}
          <OrderActionButtons order={order} role={role} onAction={onAction} />
        </Box>
      )}
    </Box>
  );
}

