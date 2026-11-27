/**
 * Data shared by the booking flow screens. Andrea Salcedo books Detailing Premium for her RAV4;
 * the result is BS-24117 (see `src/mocks/bookings.ts`). Everything here is read-only mock content.
 */
import type { BookingDetail, CustomerAddress, Localized, Vehicle } from '../../domain/booking';
import type { Locale } from '../../i18n/locale';
import { getBookingDetail } from '../../mocks/bookings';
import { getCenter, getPackage, getPaymentMethod, getYard, mockToday } from '../../mocks/catalog';
import { addressesOf, currentCustomerId, getAddress, getVehicle, vehicles } from '../../mocks/people';

export const TODAY = mockToday;
/** The booking the main flow ends in. */
export const FLOW_BOOKING_ID = 'BS-24117';
/** The Towing variant of the flow ends in this booking. */
export const TOWING_BOOKING_ID = 'BS-24120';

export const myVehicles: Vehicle[] = vehicles.filter((v) => v.customerId === currentCustomerId);
export const myAddresses: CustomerAddress[] = addressesOf(currentCustomerId);

export const vehicleKinds: { value: Vehicle['kind']; label: Localized }[] = [
  { value: 'sedan', label: { es: 'Sedán', en: 'Sedan' } },
  { value: 'suv', label: { es: 'SUV', en: 'SUV' } },
  { value: 'pickup', label: { es: 'Pickup', en: 'Pickup' } },
  { value: 'hatchback', label: { es: 'Hatchback', en: 'Hatchback' } },
  { value: 'van', label: { es: 'Van', en: 'Van' } },
];
export const kindLabel = (kind: Vehicle['kind'], locale: Locale) => vehicleKinds.find((k) => k.value === kind)!.label[locale];

export const vehicleMakes = ['Audi', 'BMW', 'Chevrolet', 'Dodge', 'Ford', 'Honda', 'Hyundai', 'Jeep', 'Kia', 'Mazda', 'Mercedes-Benz', 'Nissan', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen'];

export const vehicleColors: { value: string; label: Localized }[] = [
  { value: 'white', label: { es: 'Blanco', en: 'White' } },
  { value: 'black', label: { es: 'Negro', en: 'Black' } },
  { value: 'gray', label: { es: 'Gris', en: 'Gray' } },
  { value: 'silver', label: { es: 'Plata', en: 'Silver' } },
  { value: 'blue', label: { es: 'Azul', en: 'Blue' } },
  { value: 'red', label: { es: 'Rojo', en: 'Red' } },
  { value: 'green', label: { es: 'Verde', en: 'Green' } },
  { value: 'orange', label: { es: 'Naranja', en: 'Orange' } },
];

/** Model years offered by the "Año" select, newest first. */
export const vehicleYears: string[] = Array.from({ length: 21 }, (_, i) => String(2026 - i));

const addressLabels: Record<CustomerAddress['label'], Localized> = {
  home: { es: 'Casa', en: 'Home' },
  office: { es: 'Oficina', en: 'Office' },
  other: { es: 'Otra', en: 'Other' },
};
/** "Casa", "Oficina" or the custom name ("Casa de mamá"). */
export const addressLabel = (a: CustomerAddress, locale: Locale) => (a.label === 'other' && a.customLabel ? a.customLabel : addressLabels[a.label][locale]);

/** Pins used by the small map of the address step: one position per saved address. */
export const addressPins: Record<string, { x: number; y: number }> = {
  'adr-andrea-home': { x: 38, y: 44 },
  'adr-andrea-office': { x: 66, y: 62 },
  'adr-andrea-other': { x: 52, y: 30 },
};

/** Route params of the booking flow: what each step chose, forwarded to the next one. */
export type FlowParams = Record<string, string>;

/**
 * The booking the flow is building, assembled from the mock one of its unit plus what the steps chose
 * (package, vehicle, day and time, mode, address, payment method, auction data). Keeps Resumen, Confirmación
 * and the payment total consistent without a store: the choices travel in the route params.
 */
export function flowBooking(p: FlowParams = {}): BookingDetail {
  const unit = p.unit === 'towing' || p.unit === 'personal-washing' ? p.unit : 'detailing';
  const base = getBookingDetail(unit === 'towing' ? TOWING_BOOKING_ID : unit === 'personal-washing' ? 'BS-24118' : FLOW_BOOKING_ID);
  let b: BookingDetail = { ...base };
  if (unit === 'personal-washing') b = { ...b, status: 'pending_confirmation', assignee: undefined, assignment: { status: 'unassigned' } };

  const pkg = p.packageId ? getPackage(p.packageId) : undefined;
  if (pkg && pkg.unit === unit) {
    const lines = [{ label: { es: `Paquete ${pkg.name.es}`, en: `${pkg.name.en} package` }, amount: pkg.price }, ...base.lines.slice(1)];
    b = { ...b, packageId: pkg.id, package: pkg, lines, total: lines.reduce((s, l) => s + (l.kind === 'discount' ? -l.amount : l.kind === 'free' ? 0 : l.amount), 0) };
  }
  if (p.vehicleId) b = { ...b, vehicleId: p.vehicleId, vehicle: getVehicle(p.vehicleId) };
  if (p.date) b = { ...b, date: p.date };
  if (p.time) b = { ...b, time: p.time };
  // Detailing at home (pickup mode) and Personal Washing happen at the customer's address; at the center there is none.
  if (unit === 'detailing' && p.mode === 'pickup') b = { ...b, centerId: undefined, center: undefined, address: getAddress(p.addressId ?? myAddresses[0].id) };
  else if (unit === 'personal-washing' && p.addressId) b = { ...b, address: getAddress(p.addressId) };
  else if (unit === 'detailing' && p.centerId && getCenter(p.centerId)) b = { ...b, centerId: p.centerId, center: getCenter(p.centerId) };
  if (p.methodId) {
    const method = getPaymentMethod(p.methodId);
    const online = method.kind === 'card' || method.kind === 'apple-pay';
    b = { ...b, paymentMethod: method, payment: { status: online ? 'paid' : 'pending', methodId: method.id, reference: online ? 'PAY-5C71MQ' : undefined } };
  }
  if (unit === 'towing' && p.lot && p.code && p.yardId) {
    b = { ...b, auction: { auction: p.auction === 'iaa' ? 'iaa' : 'copart', yardId: p.yardId, lot: p.lot, code: p.code }, yard: getYard(p.yardId) };
  }
  return b;
}
