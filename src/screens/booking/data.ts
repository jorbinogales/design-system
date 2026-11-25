/**
 * Data shared by the booking flow screens. Andrea Salcedo books Detailing Premium for her RAV4;
 * the result is BS-24117 (see `src/mocks/bookings.ts`). Everything here is read-only mock content.
 */
import type { CustomerAddress, Localized, Vehicle } from '../../domain/booking';
import type { Locale } from '../../i18n/locale';
import { mockToday } from '../../mocks/catalog';
import { addressesOf, currentCustomerId, vehicles } from '../../mocks/people';

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
