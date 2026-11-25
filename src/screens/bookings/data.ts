/**
 * Data of the "Mis reservas" flow. Active bookings come straight from the mock (`customerUpcoming`).
 * The mock holds one completed and one cancelled booking for Andrea, so the lists are padded with a few
 * derived ones (same shape, own ids) to show a realistic history. Read-only.
 */
import type { BookingDetail, PriceLine, StatusChange } from '../../domain/booking';
import { customerPast, customerUpcoming, getBookingDetail } from '../../mocks/bookings';
import { getCenter, getPackage, getPaymentMethod } from '../../mocks/catalog';
import { currentCustomerId, getAddress, getProfessional, getVehicle } from '../../mocks/people';

const customer = currentCustomerId;

interface Derive {
  base: string;
  id: string;
  pkg: string;
  vehicle: string;
  date: string;
  time: string;
  center?: string;
  addressId?: string;
  pro?: string;
  method?: string;
  payment?: BookingDetail['payment'];
}

/** A booking derived from a mock one, with its own package, date and place. */
function derive(d: Derive): BookingDetail {
  const base = getBookingDetail(d.base);
  const pkg = getPackage(d.pkg)!;
  const lines: PriceLine[] = [{ label: { es: `Paquete ${pkg.name.es}`, en: `${pkg.name.en} package` }, amount: pkg.price }];
  const method = getPaymentMethod(d.method ?? base.payment.methodId);
  const pro = d.pro ? getProfessional(d.pro) : undefined;
  return {
    ...base,
    id: d.id,
    unit: pkg.unit,
    packageId: pkg.id,
    package: pkg,
    vehicle: getVehicle(d.vehicle),
    vehicleId: d.vehicle,
    date: d.date,
    time: d.time,
    centerId: d.center,
    center: d.center ? getCenter(d.center) : undefined,
    address: d.addressId ? getAddress(d.addressId) : undefined,
    assignee: pro,
    assignment: { status: pro ? 'assigned' : 'unassigned', professionalId: pro?.id },
    paymentMethod: method,
    payment: d.payment ?? { ...base.payment, methodId: method.id },
    lines,
    total: pkg.price,
    history: base.history.map((h) => ({ ...h, id: h.id.replace(base.id, d.id) })),
  };
}

export const activeBookings: BookingDetail[] = customerUpcoming(customer).map((b) => getBookingDetail(b.id));

export const completedBookings: BookingDetail[] = [
  ...customerPast(customer)
    .filter((b) => b.status === 'completed')
    .map((b) => getBookingDetail(b.id)),
  derive({ base: 'BS-24090', id: 'BS-24055', pkg: 'wash-complete', vehicle: 'veh-andrea-2', date: '2026-11-05', time: '09:00', addressId: 'adr-andrea-home', pro: 'pro-andres', payment: { status: 'paid', methodId: 'pm-card', reference: 'PAY-3D8H1R' } }),
  derive({ base: 'BS-24090', id: 'BS-24032', pkg: 'det-essential', vehicle: 'veh-andrea-1', date: '2026-10-14', time: '14:00', center: 'c-doral', pro: 'pro-luis', method: 'pm-apple-pay', payment: { status: 'paid', methodId: 'pm-apple-pay', reference: 'PAY-7M2Q9T' } }),
];

export const cancelledBookings: BookingDetail[] = [
  ...customerPast(customer)
    .filter((b) => b.status === 'cancelled')
    .map((b) => getBookingDetail(b.id)),
  // Cancelled before paying: Zelle never arrived, so there is nothing to refund.
  derive({ base: 'BS-24071', id: 'BS-24044', pkg: 'wash-interior', vehicle: 'veh-andrea-2', date: '2026-10-22', time: '11:00', addressId: 'adr-andrea-office', method: 'pm-zelle', payment: { status: 'pending', methodId: 'pm-zelle' } }),
];

/** Rating the customer already left, by booking id. A completed booking without an entry still asks for a review. */
export const reviewedRatings: Record<string, number> = { 'BS-24055': 5 };

/** What happened with the money of a cancelled booking. */
export const refundOf = (b: BookingDetail): { kind: 'refunded'; amount: number } | { kind: 'none' } =>
  b.payment.status === 'refunded' ? { kind: 'refunded', amount: b.total } : { kind: 'none' };

const SYSTEM = { name: 'Black Seat', role: 'system' } as const;
const towingBase = getBookingDetail('BS-24120');
const towingHistoryExtra: StatusChange[] = [
  { id: 'BS-24120-b-confirmed', dimension: 'booking', status: 'confirmed', at: '2026-11-27T10:50', by: SYSTEM },
  { id: 'BS-24120-p-paid', dimension: 'payment', status: 'paid', at: '2026-11-27T10:51', by: SYSTEM },
  { id: 'BS-24120-a-assigned', dimension: 'assignment', status: 'assigned', at: '2026-11-29T16:40', by: { name: 'Natalia Cruz', role: 'admin' } },
];

/**
 * BS-24120 (Towing, Copart lot 05503318, code 0071) as it looks once confirmed, paid and with a driver. The mock keeps it
 * pending and unassigned; the live-location and tracking stories need a driver, so this is the same booking one step later.
 */
export const towingAssigned: BookingDetail = {
  ...towingBase,
  status: 'confirmed',
  assignment: { status: 'assigned', professionalId: 'pro-mateo' },
  assignee: getProfessional('pro-mateo'),
  payment: { status: 'paid', methodId: 'pm-card', reference: 'PAY-5C71MQ' },
  history: [...towingBase.history, ...towingHistoryExtra].sort((a, b) => a.at.localeCompare(b.at)),
};

/** Cancellation reasons offered to the customer. */
export const cancelReasons = ['no-need', 'reschedule', 'price', 'other-service', 'mistake', 'other'] as const;
export type CancelReason = (typeof cancelReasons)[number];
