/**
 * Prototype data — Carolina del Norte (Charlotte / Raleigh), USD.
 * Auction yards are real public addresses. Customers, customer addresses, the Black Seat center
 * and phone numbers (555-01xx) are invented. Prices and the VIP plan are placeholders to validate
 * with the business (see docs/prototype-notes.md).
 */
import dayjs from 'dayjs';
import type {
  AuctionPickup,
  AuctionYard,
  BookingDetail,
  Center,
  Customer,
  CustomerAddress,
  Job,
  JobAction,
  Localized,
  OpeningHours,
  PaymentMethod,
  PriceLine,
  Professional,
  ServicePackage,
  StatusActor,
  StatusChange,
  Vehicle,
} from '../domain/booking';
import type { AssignmentStatus, BookingStatus, PaymentStatus } from '../domain/status';
import type { BusinessUnit } from '../domain/units';
import type { AddressData } from '../components/address/LocationCard/LocationCard';
import { formatAddress } from '../components/address/LocationCard/LocationCard';
import { getPackage as getDsPackage, paymentMethods as dsPaymentMethods } from '../mocks/catalog';

export const TODAY_ISO = '2026-11-25';
export const TODAY = dayjs(TODAY_ISO);

/* ─────────────── Catálogo ─────────────── */

const monSat = (hours: string): OpeningHours => ({ days: { es: 'Lunes a sábado', en: 'Monday to Saturday' }, hours });
const closedSun: OpeningHours = { days: { es: 'Domingo', en: 'Sunday' }, hours: '' };

export const unitHours: Record<BusinessUnit, OpeningHours[]> = {
  detailing: [monSat('08:00–18:00'), closedSun],
  towing: [{ days: { es: 'Lunes a viernes', en: 'Monday to Friday' }, hours: '07:00–17:00' }, { days: { es: 'Sábado', en: 'Saturday' }, hours: '08:00–12:00' }, closedSun],
  'personal-washing': [monSat('07:00–19:00'), closedSun],
};

const detailing = ['det-essential', 'det-premium', 'det-ceramic'].map((id) => getDsPackage(id)!);

const towing: ServicePackage[] = [
  {
    id: 'tow-local',
    unit: 'towing',
    name: { es: 'Recogida local', en: 'Local pickup' },
    tagline: { es: 'Retiramos tu compra de Copart o IAA y la entregamos en el área de Charlotte o Raleigh.', en: 'We collect your Copart or IAA purchase and deliver it around Charlotte or Raleigh.' },
    includes: {
      es: ['Retiro en el patio con tu código y lote', 'Entrega hasta 50 millas del patio', 'Fotos del vehículo al cargarlo', 'Estado de la recogida en la app'],
      en: ['Yard pickup with your code and lot', 'Delivery up to 50 miles from the yard', 'Photos when the vehicle is loaded', 'Pickup status in the app'],
    },
    notIncluded: { es: ['Pago de la subasta', 'Cargos de almacenamiento del patio'], en: ['Auction payment', 'Yard storage fees'] },
    durationMin: 120,
    price: 150,
    priceFrom: true,
    categories: ['towing'],
    popular: true,
  },
  {
    id: 'tow-long',
    unit: 'towing',
    name: { es: 'Larga distancia', en: 'Long distance' },
    tagline: { es: 'De la subasta a cualquier punto de Carolina del Norte, Carolina del Sur o Virginia.', en: 'From the auction to anywhere in North Carolina, South Carolina or Virginia.' },
    includes: {
      es: ['Retiro en el patio de la subasta', 'Traslado en plataforma', 'Seguro de carga incluido', 'Aviso al salir y al llegar'],
      en: ['Pickup at the auction yard', 'Flatbed transport', 'Cargo insurance included', 'Departure and arrival alerts'],
    },
    notIncluded: { es: ['Pago de la subasta', 'Peajes fuera de NC (se cotizan)'], en: ['Auction payment', 'Tolls outside NC (quoted)'] },
    durationMin: 360,
    price: 450,
    priceFrom: true,
    categories: ['towing'],
  },
];

const washing: ServicePackage[] = [
  {
    id: 'pw-bins',
    unit: 'personal-washing',
    name: { es: 'Botes de basura', en: 'Trash bins' },
    tagline: { es: 'Lavado a presión y desodorizado de tus botes en la acera, después del día de recogida.', en: 'Pressure wash and deodorize your bins at the curb, right after pickup day.' },
    includes: { es: ['Hasta 3 botes', 'Agua caliente a presión', 'Desinfectante y desodorizante', 'Agua residual recogida por nosotros'], en: ['Up to 3 bins', 'Hot pressure water', 'Disinfectant and deodorizer', 'Wastewater collected by us'] },
    durationMin: 30,
    price: 35,
    categories: ['exterior'],
    popular: true,
  },
  {
    id: 'pw-driveway',
    unit: 'personal-washing',
    name: { es: 'Entrada y aceras', en: 'Driveway and sidewalks' },
    tagline: { es: 'Pressure washing de entrada, aceras y escalones de concreto.', en: 'Pressure washing for your driveway, sidewalks and concrete steps.' },
    includes: { es: ['Hasta 800 ft² de concreto', 'Tratamiento previo de manchas de aceite', 'Limpieza de bordes', 'Enjuague final'], en: ['Up to 800 sq ft of concrete', 'Oil stain pre-treatment', 'Edge cleaning', 'Final rinse'] },
    notIncluded: { es: ['Sellado de concreto', 'Techos y fachadas'], en: ['Concrete sealing', 'Roofs and siding'] },
    durationMin: 120,
    price: 149,
    priceFrom: true,
    categories: ['exterior'],
  },
  {
    id: 'pw-carpet',
    unit: 'personal-washing',
    name: { es: 'Alfombras', en: 'Carpets' },
    tagline: { es: 'Limpieza profunda con extractor en tu casa.', en: 'Deep extraction cleaning at your home.' },
    includes: { es: ['Hasta 3 habitaciones', 'Pretratamiento de manchas', 'Extracción con agua caliente', 'Secado rápido con ventiladores'], en: ['Up to 3 rooms', 'Stain pre-treatment', 'Hot water extraction', 'Fast drying with air movers'] },
    notIncluded: { es: ['Tapicería de muebles', 'Alfombras persas o de lana'], en: ['Furniture upholstery', 'Persian or wool rugs'] },
    durationMin: 150,
    price: 129,
    priceFrom: true,
    categories: ['interior'],
  },
];

export const packages: ServicePackage[] = [...detailing, ...towing, ...washing];
export const getPackage = (id: string) => packages.find((p) => p.id === id)!;
export const packagesFor = (unit: BusinessUnit) => packages.filter((p) => p.unit === unit);
export const fromPrice = (unit: BusinessUnit) => Math.min(...packagesFor(unit).map((p) => p.price));

export const unitCopy: Record<BusinessUnit, { description: Localized; place: 'center' | 'customer-address' | 'auction-yard'; note?: Localized }> = {
  detailing: {
    place: 'center',
    description: {
      es: 'Tu auto entra a nuestra bahía en Charlotte y sale con la pintura limpia, protegida y el interior como nuevo. Cada paquete termina con una revisión de calidad y fotos del antes y el después.',
      en: 'Your car goes into our Charlotte bay and comes out with clean, protected paint and a like-new interior. Every package ends with a quality check and before-and-after photos.',
    },
  },
  towing: {
    place: 'auction-yard',
    description: {
      es: 'Compraste en Copart o IAA y necesitas que alguien lo retire. Con tu código de recogida y el número de lote, nuestra grúa va al patio y lo lleva a tu dirección. Sin llamadas ni mensajes.',
      en: 'You bought at Copart or IAA and need someone to pick it up. With your pickup code and lot number, our tow truck goes to the yard and delivers it to your address. No calls or messages.',
    },
  },
  'personal-washing': {
    place: 'customer-address',
    description: {
      es: 'Llegamos a tu casa con agua, equipo y productos propios. Pressure washing de entrada y aceras, botes de basura y alfombras.',
      en: 'We come to your home with our own water, equipment and products. Pressure washing for driveways and sidewalks, trash bins and carpets.',
    },
    note: { es: 'Temporada alta en marzo y abril: reserva con anticipación.', en: 'Peak season is March and April: book ahead.' },
  },
};

export const center: Center = {
  id: 'c-charlotte',
  name: 'Black Seat Charlotte',
  address: { line1: '3115 N Graham St', city: 'Charlotte', state: 'NC', zip: '28206', reference: 'Portón negro, bahía 2' },
  phone: '(704) 555-0142',
  hours: unitHours.detailing,
  units: ['detailing', 'towing', 'personal-washing'],
};

export const yards: AuctionYard[] = [
  { id: 'iaa-charlotte', auction: 'iaa', name: 'IAA Charlotte', address: { line1: '1710 Starita Rd', city: 'Charlotte', state: 'NC', zip: '28206' }, hours: '08:00–16:00' },
  { id: 'copart-china-grove', auction: 'copart', name: 'Copart China Grove', address: { line1: '1081 Recovery Rd', city: 'China Grove', state: 'NC', zip: '28023' }, hours: '08:00–16:00' },
  { id: 'copart-raleigh-north', auction: 'copart', name: 'Copart Raleigh North', address: { line1: '1900 Old Crews Rd', city: 'Knightdale', state: 'NC', zip: '27545' }, hours: '08:00–16:00' },
  { id: 'iaa-raleigh', auction: 'iaa', name: 'IAA Raleigh', address: { line1: '60 Sadisco Rd', city: 'Clayton', state: 'NC', zip: '27520' }, hours: '08:00–16:00' },
];
export const getYard = (id: string) => yards.find((y) => y.id === id);

export const paymentMethods: PaymentMethod[] = dsPaymentMethods;
export const getPaymentMethod = (id: string) => paymentMethods.find((m) => m.id === id)!;

/* ─────────────── Personas ─────────────── */

export const professionals: Professional[] = [
  { id: 'pro-elio', name: 'Elio Jiménez', role: { es: 'Líder · Detailing y Towing', en: 'Lead · Detailing and Towing' }, roleKind: 'detailer', units: ['detailing', 'towing'], centerId: 'c-charlotte', rating: 4.9 },
  { id: 'pro-jesus', name: 'Jesús Rondón', role: { es: 'Líder · Personal Washing', en: 'Lead · Personal Washing' }, roleKind: 'washer', units: ['personal-washing'], centerId: 'c-charlotte', rating: 4.9 },
  { id: 'pro-luis', name: 'Luis Herrera', role: { es: 'Detailer', en: 'Detailer' }, roleKind: 'detailer', units: ['detailing'], centerId: 'c-charlotte', rating: 4.8 },
  { id: 'pro-mateo', name: 'Mateo Salazar', role: { es: 'Conductor de grúa', en: 'Tow driver' }, roleKind: 'tow-driver', units: ['towing'], centerId: 'c-charlotte', rating: 4.8 },
  { id: 'pro-andres', name: 'Andrés Molina', role: { es: 'Técnico de pressure washing', en: 'Pressure washing tech' }, roleKind: 'washer', units: ['personal-washing'], centerId: 'c-charlotte', rating: 4.7 },
  { id: 'pro-ricardo', name: 'Ricardo Paz', role: { es: 'Conductor de grúa', en: 'Tow driver' }, roleKind: 'tow-driver', units: ['towing'], centerId: 'c-charlotte', rating: 4.6, daysOff: [TODAY_ISO] },
];
export const getProfessional = (id?: string) => professionals.find((p) => p.id === id);
export const staff = professionals.map((p) => ({ id: p.id, name: p.name }));

export const me: Customer = { id: 'cus-emily', name: 'Emily Carter', email: 'emily.carter@example.com', phone: '(704) 555-0188' };

const customers: Customer[] = [
  me,
  { id: 'cus-jake', name: 'Jake Morrison', email: 'jake.m@example.com', phone: '(704) 555-0121' },
  { id: 'cus-priya', name: 'Priya Shah', email: 'priya.shah@example.com', phone: '(980) 555-0134' },
  { id: 'cus-marcus', name: 'Marcus Johnson', email: 'marcus.j@example.com', phone: '(919) 555-0165' },
  { id: 'cus-ana', name: 'Ana Lucía Torres', email: 'ana.torres@example.com', phone: '(704) 555-0172' },
  { id: 'cus-brandon', name: 'Brandon Lee', email: 'brandon.lee@example.com', phone: '(980) 555-0153' },
  { id: 'cus-olivia', name: 'Olivia Bennett', email: 'olivia.b@example.com', phone: '(704) 555-0196' },
  { id: 'cus-carlos', name: 'Carlos Duarte', email: 'carlos.duarte@example.com', phone: '(919) 555-0147' },
  { id: 'cus-hannah', name: 'Hannah Price', email: 'hannah.price@example.com', phone: '(704) 555-0109' },
];
const getCustomer = (id: string) => customers.find((c) => c.id === id)!;

const vehicles: Vehicle[] = [
  { id: 'veh-emily', customerId: 'cus-emily', year: 2022, make: 'Toyota', model: 'RAV4', color: { es: 'Gris', en: 'Gray' }, plate: 'PKX-4821', kind: 'suv' },
  { id: 'veh-jake', customerId: 'cus-jake', year: 2019, make: 'Ford', model: 'F-150', color: { es: 'Negro', en: 'Black' }, plate: 'TRL-6620', kind: 'pickup' },
  { id: 'veh-marcus', customerId: 'cus-marcus', year: 2021, make: 'Honda', model: 'Accord', color: { es: 'Blanco', en: 'White' }, plate: 'Subasta', kind: 'sedan' },
  { id: 'veh-brandon', customerId: 'cus-brandon', year: 2020, make: 'Jeep', model: 'Wrangler', color: { es: 'Azul', en: 'Blue' }, plate: 'Subasta', kind: 'suv' },
  { id: 'veh-olivia', customerId: 'cus-olivia', year: 2023, make: 'Tesla', model: 'Model Y', color: { es: 'Blanco', en: 'White' }, plate: 'EVY-2208', kind: 'suv' },
  { id: 'veh-carlos', customerId: 'cus-carlos', year: 2018, make: 'Chevrolet', model: 'Silverado', color: { es: 'Plata', en: 'Silver' }, plate: 'Subasta', kind: 'pickup' },
];
/** Placeholder for services that are not about a vehicle (vehicleId stays ''). */
const noVehicle: Vehicle = { id: '', customerId: '', year: 0, make: '', model: '', color: { es: '', en: '' }, plate: '', kind: 'sedan' };
export const myVehicle = vehicles[0];

export const myAddresses: CustomerAddress[] = [
  { id: 'adr-home', customerId: 'cus-emily', label: 'home', line1: '2418 Selwyn Ave', city: 'Charlotte', state: 'NC', zip: '28209', reference: 'Casa blanca, puerta azul' },
  { id: 'adr-office', customerId: 'cus-emily', label: 'office', line1: '101 N Tryon St', line2: 'Suite 1500', city: 'Charlotte', state: 'NC', zip: '28246', reference: 'Estacionamiento nivel 3' },
];

/* ─────────────── Reservas ─────────────── */

const SYSTEM: StatusActor = { name: 'Black Seat', role: 'system' };
const ELIO: StatusActor = { name: 'Elio Jiménez', role: 'admin' };

export interface Seed {
  id: string;
  pkg: string;
  cus: string;
  veh?: string;
  date: string;
  time: string;
  address?: AddressData;
  auction?: AuctionPickup;
  status: BookingStatus;
  pro?: string;
  pay: PaymentStatus;
  method: string;
  extra?: PriceLine[];
}

export const totalOf = (lines: PriceLine[]) => lines.reduce((sum, l) => sum + (l.kind === 'discount' ? -l.amount : l.kind === 'free' ? 0 : l.amount), 0);

function history(s: Seed): StatusChange[] {
  const t0 = `${dayjs(s.date).subtract(2, 'day').format('YYYY-MM-DD')}T10:20`;
  const at = (iso: string, m: number) => dayjs(iso).add(m, 'minute').format('YYYY-MM-DDTHH:mm');
  const cust: StatusActor = { name: getCustomer(s.cus).name, role: 'customer' };
  const out: StatusChange[] = [];
  out.push({ id: `${s.id}-b0`, dimension: 'booking', status: 'pending_confirmation', at: t0, by: cust, note: { es: 'Reserva creada desde la app.', en: 'Booking created from the app.' } });
  out.push({ id: `${s.id}-a0`, dimension: 'assignment', status: 'unassigned', at: t0, by: SYSTEM });
  if (s.status !== 'pending_confirmation') out.push({ id: `${s.id}-b1`, dimension: 'booking', status: 'confirmed', at: at(t0, 1), by: SYSTEM });
  if (s.pay === 'paid' || s.pay === 'refunded') out.push({ id: `${s.id}-p1`, dimension: 'payment', status: 'paid', at: at(t0, 1), by: SYSTEM });
  if (s.pro && s.status !== 'cancelled') out.push({ id: `${s.id}-a1`, dimension: 'assignment', status: 'assigned' as AssignmentStatus, at: `${dayjs(s.date).subtract(1, 'day').format('YYYY-MM-DD')}T17:10`, by: ELIO });
  const start = `${s.date}T${s.time}`;
  if (s.status === 'in_progress' || s.status === 'completed') out.push({ id: `${s.id}-b2`, dimension: 'booking', status: 'in_progress', at: at(start, 5), by: { name: getProfessional(s.pro)?.name ?? 'Black Seat', role: 'operator' } });
  if (s.status === 'completed') out.push({ id: `${s.id}-b3`, dimension: 'booking', status: 'completed', at: at(start, getPackage(s.pkg).durationMin), by: { name: getProfessional(s.pro)?.name ?? 'Black Seat', role: 'operator' } });
  if (s.status === 'cancelled') {
    const when = `${dayjs(s.date).subtract(1, 'day').format('YYYY-MM-DD')}T18:05`;
    out.push({ id: `${s.id}-b4`, dimension: 'booking', status: 'cancelled', at: when, by: cust });
    if (s.pay === 'refunded') out.push({ id: `${s.id}-p2`, dimension: 'payment', status: 'refunded', at: at(when, 60), by: SYSTEM });
  }
  return out.sort((x, y) => x.at.localeCompare(y.at));
}

export function buildBooking(s: Seed): BookingDetail {
  const pkg = getPackage(s.pkg);
  const lines: PriceLine[] = [{ label: { es: `${pkg.name.es}`, en: `${pkg.name.en}` }, amount: pkg.price }, ...(s.extra ?? [])];
  const assigned = Boolean(s.pro) && s.status !== 'cancelled';
  return {
    id: s.id,
    unit: pkg.unit,
    packageId: pkg.id,
    customerId: s.cus,
    vehicleId: s.veh ?? '',
    date: s.date,
    time: s.time,
    centerId: pkg.unit === 'detailing' ? center.id : undefined,
    address: s.address,
    auction: s.auction,
    status: s.status,
    assignment: { status: assigned ? 'assigned' : 'unassigned', professionalId: assigned ? s.pro : undefined },
    payment: { status: s.pay, methodId: s.method, reference: s.pay === 'paid' || s.pay === 'refunded' ? `PAY-${s.id.slice(3)}N` : undefined },
    lines,
    total: totalOf(lines),
    history: history(s),
    package: pkg,
    customer: getCustomer(s.cus),
    vehicle: vehicles.find((v) => v.id === s.veh) ?? noVehicle,
    center: pkg.unit === 'detailing' ? center : undefined,
    assignee: assigned ? getProfessional(s.pro) : undefined,
    paymentMethod: getPaymentMethod(s.method),
    yard: s.auction ? getYard(s.auction.yardId) : undefined,
  };
}

const nc = (line1: string, city: string, zip: string, line2?: string): AddressData => ({ line1, line2, city, state: 'NC', zip });
const home = myAddresses[0];

/** Emily's bookings (cliente side). BS-31042 is the next appointment. */
export const myBookingsSeed: Seed[] = [
  { id: 'BS-31042', pkg: 'det-premium', cus: 'cus-emily', veh: 'veh-emily', date: '2026-11-27', time: '10:00', status: 'confirmed', pay: 'pending', method: 'pm-zelle' },
  { id: 'BS-31055', pkg: 'pw-bins', cus: 'cus-emily', date: '2026-12-01', time: '09:00', address: home, status: 'confirmed', pro: 'pro-jesus', pay: 'paid', method: 'pm-card' },
  { id: 'BS-30988', pkg: 'tow-local', cus: 'cus-emily', veh: 'veh-emily', date: '2026-11-18', time: '08:00', address: home, auction: { auction: 'iaa', yardId: 'iaa-charlotte', lot: '04217753', code: '0093' }, status: 'completed', pro: 'pro-mateo', pay: 'paid', method: 'pm-card' },
  { id: 'BS-30911', pkg: 'pw-driveway', cus: 'cus-emily', date: '2026-11-10', time: '14:00', address: home, status: 'cancelled', pay: 'refunded', method: 'pm-apple-pay' },
];

/** Today's jobs (operator side). */
const todaySeed: Seed[] = [
  { id: 'BS-31101', pkg: 'tow-local', cus: 'cus-marcus', veh: 'veh-marcus', date: TODAY_ISO, time: '07:30', address: nc('5120 Six Forks Rd', 'Raleigh', '27609'), auction: { auction: 'copart', yardId: 'copart-raleigh-north', lot: '07193245', code: '0412' }, status: 'in_progress', pro: 'pro-mateo', pay: 'paid', method: 'pm-card' },
  { id: 'BS-31102', pkg: 'det-essential', cus: 'cus-jake', veh: 'veh-jake', date: TODAY_ISO, time: '08:00', status: 'completed', pro: 'pro-luis', pay: 'paid', method: 'pm-apple-pay' },
  { id: 'BS-31103', pkg: 'pw-bins', cus: 'cus-priya', date: TODAY_ISO, time: '09:00', address: nc('8421 Ballantyne Commons Pkwy', 'Charlotte', '28277'), status: 'confirmed', pro: 'pro-jesus', pay: 'paid', method: 'pm-card' },
  { id: 'BS-31104', pkg: 'det-ceramic', cus: 'cus-olivia', veh: 'veh-olivia', date: TODAY_ISO, time: '09:30', status: 'confirmed', pay: 'pending', method: 'pm-zelle' },
  { id: 'BS-31105', pkg: 'tow-local', cus: 'cus-brandon', veh: 'veh-brandon', date: TODAY_ISO, time: '10:00', address: nc('1320 Central Ave', 'Charlotte', '28205'), auction: { auction: 'iaa', yardId: 'iaa-charlotte', lot: '00482716', code: '0093' }, status: 'confirmed', pay: 'paid', method: 'pm-card' },
  { id: 'BS-31106', pkg: 'pw-driveway', cus: 'cus-ana', date: TODAY_ISO, time: '11:00', address: nc('3907 Providence Rd', 'Charlotte', '28211'), status: 'confirmed', pay: 'pending', method: 'pm-cash' },
  { id: 'BS-31107', pkg: 'tow-long', cus: 'cus-carlos', veh: 'veh-carlos', date: TODAY_ISO, time: '12:00', address: nc('210 E Main St', 'Rock Hill', '29730'), auction: { auction: 'copart', yardId: 'copart-china-grove', lot: '05561902', code: '2207' }, status: 'pending_confirmation', pay: 'pending', method: 'pm-zelle' },
  { id: 'BS-31108', pkg: 'pw-carpet', cus: 'cus-hannah', date: TODAY_ISO, time: '14:00', address: nc('6517 Old Monroe Rd', 'Matthews', '28104'), status: 'confirmed', pro: 'pro-andres', pay: 'paid', method: 'pm-card' },
  { id: 'BS-31109', pkg: 'det-premium', cus: 'cus-emily', veh: 'veh-emily', date: TODAY_ISO, time: '15:00', status: 'cancelled', pay: 'refunded', method: 'pm-card' },
];

export const initialBookings: BookingDetail[] = [...myBookingsSeed, ...todaySeed].map(buildBooking);

export function bookingLocation(b: BookingDetail): string {
  if (b.address) return formatAddress(b.address);
  if (b.center) return `${b.center.name} · ${formatAddress(b.center.address)}`;
  return '';
}

const nextAction = (b: BookingDetail): JobAction =>
  b.status === 'completed' || b.status === 'cancelled' ? 'view' : b.assignment.status === 'unassigned' ? 'assign' : b.status === 'in_progress' ? 'complete' : 'start';

export function toJob(b: BookingDetail): Job {
  return {
    id: b.id,
    date: b.date,
    time: b.time,
    unit: b.unit,
    service: b.package.name,
    durationMin: b.package.durationMin,
    customer: b.customer.name,
    location: bookingLocation(b),
    auction: b.auction && b.yard ? { auction: b.auction.auction, yard: b.yard.name, lot: b.auction.lot, code: b.auction.code } : undefined,
    assigneeId: b.assignment.professionalId,
    status: b.status,
    assignment: b.assignment.status,
    payment: b.payment.status,
    nextAction: nextAction(b),
  };
}

/* ─────────────── VIP ─────────────── */

export const vipPlans = { monthly: 29, yearly: 290 } as const;
export const vipBenefits: { title: Localized; detail: Localized; icon: 'priority' | 'discount' | 'reschedule' | 'bins' }[] = [
  { icon: 'priority', title: { es: 'Prioridad en días llenos', en: 'Priority on full days' }, detail: { es: 'Si la agenda está completa, tu cita entra primero.', en: 'When the schedule is full, your booking goes first.' } },
  { icon: 'discount', title: { es: '10 % en todos los servicios', en: '10% off every service' }, detail: { es: 'Detailing, Towing y Personal Washing.', en: 'Detailing, Towing and Personal Washing.' } },
  { icon: 'bins', title: { es: 'Botes de basura cada mes', en: 'Trash bins every month' }, detail: { es: 'Una limpieza mensual incluida.', en: 'One monthly cleaning included.' } },
  { icon: 'reschedule', title: { es: 'Cambios sin costo', en: 'Free changes' }, detail: { es: 'Reprograma hasta 2 horas antes.', en: 'Reschedule up to 2 hours ahead.' } },
];
