/**
 * Bookings mock: every status combination (booking × assignment × payment), today's operator jobs
 * across the three units, status histories, receipts and the #ParaTi content.
 * `BS-24117` is the customer's next appointment: confirmed + unassigned + payment pending.
 */
import dayjs from 'dayjs';
import type { AddressData } from '../components/address/LocationCard/LocationCard';
import { formatAddress } from '../components/address/LocationCard/LocationCard';
import type {
  AuctionPickup,
  Booking,
  BookingDetail,
  GalleryItem,
  Job,
  JobAction,
  Localized,
  Offer,
  PriceLine,
  Receipt,
  Review,
  StatusActor,
  StatusChange,
} from '../domain/booking';
import type { AssignmentStatus, BookingStatus, PaymentStatus } from '../domain/status';
import { auctionName, getCenter, getPackage, getPaymentMethod, getYard, mockTodayIso } from './catalog';
import { getCustomer, getProfessional, getVehicle } from './people';

const SYSTEM: StatusActor = { name: 'Black Seat', role: 'system' };
const SUPERVISOR: StatusActor = { name: 'Natalia Cruz', role: 'admin' };

interface Seed {
  id: string;
  pkg: string;
  cus: string;
  veh: string;
  date: string;
  time: string;
  center?: string;
  address?: AddressData;
  auction?: AuctionPickup;
  status: BookingStatus;
  pro?: string;
  pay: PaymentStatus;
  method: string;
  ref?: string;
  extra?: PriceLine[];
  notes?: string;
}

/** Builds a plausible, chronological history from the seed's final state. */
function buildHistory(s: Seed, durationMin: number): StatusChange[] {
  const t0 = `${dayjs(s.date).subtract(3, 'day').format('YYYY-MM-DD')}T10:20`;
  const at = (iso: string, plusMin: number) => dayjs(iso).add(plusMin, 'minute').format('YYYY-MM-DDTHH:mm');
  const customer: StatusActor = { name: getCustomer(s.cus).name, role: 'customer' };
  const pro = s.pro ? getProfessional(s.pro) : undefined;
  const proActor: StatusActor | undefined = pro ? { name: pro.name, role: 'operator' } : undefined;
  const out: StatusChange[] = [];
  const b = (status: BookingStatus, when: string, by: StatusActor, note?: Localized) => out.push({ id: `${s.id}-b-${status}`, dimension: 'booking', status, at: when, by, note });
  const a = (status: AssignmentStatus, when: string, by: StatusActor) => out.push({ id: `${s.id}-a-${status}`, dimension: 'assignment', status, at: when, by });
  const p = (status: PaymentStatus, when: string, by: StatusActor, note?: Localized) => out.push({ id: `${s.id}-p-${status}`, dimension: 'payment', status, at: when, by, note });

  b('pending_confirmation', t0, customer, { es: 'Reserva creada desde la app.', en: 'Booking created from the app.' });
  a('unassigned', t0, SYSTEM);
  if (s.status !== 'pending_confirmation') b('confirmed', at(t0, 30), SYSTEM, s.status === 'cancelled' ? undefined : { es: 'Fecha y hora reservadas.', en: 'Date and time booked.' });
  if (s.pay === 'paid' || s.pay === 'refunded') p('paid', at(t0, 31), SYSTEM);
  if (s.pay === 'failed') p('failed', at(t0, 31), SYSTEM, { es: 'La tarjeta fue rechazada por el banco.', en: 'The card was declined by the bank.' });
  if (s.pro && s.status !== 'cancelled') a('assigned', `${dayjs(s.date).subtract(1, 'day').format('YYYY-MM-DD')}T16:40`, SUPERVISOR);
  const startAt = `${s.date}T${s.time}`;
  if (s.status === 'in_progress' || s.status === 'completed') b('in_progress', at(startAt, 5), proActor ?? SUPERVISOR);
  if (s.status === 'completed') b('completed', at(startAt, durationMin), proActor ?? SUPERVISOR);
  if (s.status === 'cancelled') {
    const when = `${dayjs(s.date).subtract(1, 'day').format('YYYY-MM-DD')}T18:05`;
    b('cancelled', when, customer, { es: 'Cancelada por el cliente con más de 24 h.', en: 'Cancelled by the customer more than 24 h ahead.' });
    if (s.pay === 'refunded') p('refunded', at(when, 60), SYSTEM);
  }
  return out.sort((x, y) => x.at.localeCompare(y.at));
}

function build(s: Seed): Booking {
  const pkg = getPackage(s.pkg)!;
  const lines: PriceLine[] = [{ label: { es: `Paquete ${pkg.name.es}`, en: `${pkg.name.en} package` }, amount: pkg.price }, ...(s.extra ?? [])];
  const total = lines.reduce((sum, l) => sum + (l.kind === 'discount' ? -l.amount : l.kind === 'free' ? 0 : l.amount), 0);
  return {
    id: s.id,
    unit: pkg.unit,
    packageId: s.pkg,
    customerId: s.cus,
    vehicleId: s.veh,
    date: s.date,
    time: s.time,
    centerId: s.center,
    address: s.address,
    auction: s.auction,
    status: s.status,
    assignment: { status: s.pro && s.status !== 'cancelled' ? 'assigned' : 'unassigned', professionalId: s.status === 'cancelled' ? undefined : s.pro },
    payment: { status: s.pay, methodId: s.method, reference: s.ref ?? (s.pay === 'paid' || s.pay === 'refunded' ? `PAY-${s.id.slice(3)}K` : undefined) },
    lines,
    total,
    history: buildHistory(s, pkg.durationMin),
    notes: s.notes,
  };
}

const T = mockTodayIso;
const addr = (line1: string, city: string, zip: string, line2?: string, reference?: string): AddressData => ({ line1, line2, city, state: 'FL', zip, reference });
const welcome: PriceLine = { label: { es: 'Cupón BIENVENIDA', en: 'WELCOME coupon' }, amount: 20, kind: 'discount' };

const seeds: Seed[] = [
  // Today's operator jobs (mixed units).
  { id: 'BS-24101', pkg: 'det-premium', cus: 'cus-valeria', veh: 'veh-valeria', date: T, time: '08:00', center: 'c-doral', status: 'confirmed', pro: 'pro-luis', pay: 'paid', method: 'pm-card' },
  { id: 'BS-24102', pkg: 'tow-local', cus: 'cus-marcos', veh: 'veh-marcos', date: T, time: '08:30', address: addr('10400 NW 25th Street', 'Doral', '33172', 'Suite 300-B'), auction: { auction: 'iaa', yardId: 'iaa-miami-north', lot: '04217753', code: '0093' }, status: 'confirmed', pay: 'pending', method: 'pm-zelle', notes: 'Entregar en el muelle trasero; preguntar por Marcos.' },
  { id: 'BS-24103', pkg: 'wash-complete', cus: 'cus-camila', veh: 'veh-camila', date: T, time: '09:00', address: addr('1111 Brickell Ave', 'Miami', '33131', undefined, 'Estacionamiento visitantes P2'), status: 'in_progress', pro: 'pro-andres', pay: 'paid', method: 'pm-apple-pay' },
  { id: 'BS-24104', pkg: 'tow-local', cus: 'cus-carlos', veh: 'veh-carlos', date: T, time: '09:30', address: addr('7900 NW 36th St', 'Doral', '33166'), auction: { auction: 'copart', yardId: 'copart-medley', lot: '00583122', code: '7710' }, status: 'in_progress', pro: 'pro-mateo', pay: 'paid', method: 'pm-card' },
  { id: 'BS-24105', pkg: 'det-premium', cus: 'cus-sofia', veh: 'veh-sofia', date: T, time: '10:15', center: 'c-brickell', status: 'pending_confirmation', pay: 'pending', method: 'pm-cash' },
  { id: 'BS-24106', pkg: 'wash-exterior', cus: 'cus-diego', veh: 'veh-diego', date: T, time: '11:00', address: addr('1450 Brickell Bay Dr', 'Miami', '33131', 'Unit 2207'), status: 'confirmed', pro: 'pro-andres', pay: 'pending', method: 'pm-zelle' },
  { id: 'BS-24107', pkg: 'tow-local', cus: 'cus-elena', veh: 'veh-elena', date: T, time: '11:30', address: addr('2100 NW 84th Ave', 'Doral', '33122'), auction: { auction: 'copart', yardId: 'copart-miami-north', lot: '00112045', code: '0314' }, status: 'confirmed', pay: 'paid', method: 'pm-card' },
  { id: 'BS-24108', pkg: 'det-essential', cus: 'cus-roberto', veh: 'veh-roberto', date: T, time: '12:30', center: 'c-doral', status: 'completed', pro: 'pro-luis', pay: 'paid', method: 'pm-apple-pay' },
  { id: 'BS-24109', pkg: 'wash-exterior', cus: 'cus-paola', veh: 'veh-paola', date: T, time: '13:00', address: addr('9700 NW 41st St', 'Doral', '33178'), status: 'cancelled', pay: 'refunded', method: 'pm-card' },
  { id: 'BS-24110', pkg: 'tow-local', cus: 'cus-javier', veh: 'veh-javier', date: T, time: '14:00', address: addr('5250 NW 72nd Ave', 'Miami', '33166'), auction: { auction: 'iaa', yardId: 'iaa-fort-lauderdale', lot: '02957310', code: '0460' }, status: 'confirmed', pro: 'pro-mateo', pay: 'paid', method: 'pm-card' },
  { id: 'BS-24111', pkg: 'det-premium', cus: 'cus-lucia', veh: 'veh-lucia', date: T, time: '15:30', center: 'c-doral', status: 'confirmed', pay: 'pending', method: 'pm-zelle' },
  { id: 'BS-24112', pkg: 'wash-interior', cus: 'cus-tomas', veh: 'veh-tomas', date: T, time: '16:00', address: addr('300 S Biscayne Blvd', 'Miami', '33131'), status: 'confirmed', pro: 'pro-andres', pay: 'paid', method: 'pm-card' },
  { id: 'BS-24113', pkg: 'wash-complete', cus: 'cus-hernan', veh: 'veh-hernan', date: T, time: '17:00', address: addr('6780 SW 8th St', 'Miami', '33144'), status: 'confirmed', pay: 'failed', method: 'pm-card' },
  // The signed-in customer (Andrea Salcedo).
  { id: 'BS-24117', pkg: 'det-premium', cus: 'cus-andrea', veh: 'veh-andrea-1', date: '2026-11-27', time: '10:00', center: 'c-doral', status: 'confirmed', pay: 'pending', method: 'pm-zelle', extra: [welcome] },
  { id: 'BS-24118', pkg: 'wash-complete', cus: 'cus-andrea', veh: 'veh-andrea-2', date: '2026-11-28', time: '09:00', address: addr('7845 NW 36th St', 'Doral', '33166', 'Apt 210', 'Portón negro, junto a la farmacia'), status: 'confirmed', pro: 'pro-andres', pay: 'paid', method: 'pm-card' },
  { id: 'BS-24120', pkg: 'tow-local', cus: 'cus-andrea', veh: 'veh-andrea-1', date: '2026-11-30', time: '14:00', address: addr('7845 NW 36th St', 'Doral', '33166', 'Apt 210'), auction: { auction: 'copart', yardId: 'copart-miami-south', lot: '05503318', code: '0071' }, status: 'pending_confirmation', pay: 'pending', method: 'pm-card' },
  { id: 'BS-24119', pkg: 'det-ceramic', cus: 'cus-andrea', veh: 'veh-andrea-1', date: '2026-12-03', time: '11:00', center: 'c-brickell', status: 'confirmed', pay: 'failed', method: 'pm-card' },
  { id: 'BS-24090', pkg: 'wash-exterior', cus: 'cus-andrea', veh: 'veh-andrea-2', date: '2026-11-12', time: '10:00', address: addr('7845 NW 36th St', 'Doral', '33166', 'Apt 210'), status: 'completed', pro: 'pro-andres', pay: 'paid', method: 'pm-card', ref: 'PAY-9F4K2L' },
  { id: 'BS-24071', pkg: 'det-essential', cus: 'cus-andrea', veh: 'veh-andrea-1', date: '2026-10-30', time: '15:00', center: 'c-doral', status: 'cancelled', pay: 'refunded', method: 'pm-apple-pay' },
];

export const bookings: Booking[] = seeds.map(build);
export const getBooking = (id: string) => bookings.find((b) => b.id === id);

/** A booking with every reference resolved. */
export function getBookingDetail(id: string): BookingDetail {
  const b = getBooking(id);
  if (!b) throw new Error(`Unknown mock booking ${id}`);
  return {
    ...b,
    package: getPackage(b.packageId)!,
    customer: getCustomer(b.customerId),
    vehicle: getVehicle(b.vehicleId),
    center: b.centerId ? getCenter(b.centerId) : undefined,
    assignee: b.assignment.professionalId ? getProfessional(b.assignment.professionalId) : undefined,
    paymentMethod: getPaymentMethod(b.payment.methodId),
    yard: b.auction ? getYard(b.auction.yardId) : undefined,
  };
}

/** Where the service happens, as one complete line. */
export function bookingLocation(b: Booking): string {
  if (b.address) return formatAddress(b.address);
  const center = b.centerId ? getCenter(b.centerId) : undefined;
  return center ? `${center.name} · ${formatAddress(center.address)}` : '';
}

const nextAction = (b: Booking): JobAction =>
  b.status === 'completed' || b.status === 'cancelled' ? 'view' : b.assignment.status === 'unassigned' ? 'assign' : b.status === 'in_progress' ? 'complete' : b.status === 'confirmed' ? 'start' : 'view';

export function bookingToJob(b: Booking): Job {
  const pkg = getPackage(b.packageId)!;
  const yard = b.auction ? getYard(b.auction.yardId) : undefined;
  return {
    id: b.id,
    date: b.date,
    time: b.time,
    unit: b.unit,
    service: pkg.name,
    durationMin: pkg.durationMin,
    customer: getCustomer(b.customerId).name,
    location: bookingLocation(b),
    auction: b.auction && yard ? { auction: b.auction.auction, yard: yard.name, lot: b.auction.lot, code: b.auction.code } : undefined,
    assigneeId: b.assignment.professionalId,
    status: b.status,
    assignment: b.assignment.status,
    payment: b.payment.status,
    nextAction: nextAction(b),
  };
}

/** Today's tray (2026-11-25): 13 jobs across Detailing, Towing and Personal Washing. */
export const todayJobs: Job[] = bookings.filter((b) => b.date === mockTodayIso).map(bookingToJob);
export const getJob = (id: string) => todayJobs.find((j) => j.id === id);
export const jobAuctionLabel = (j: Job) => (j.auction ? `${auctionName[j.auction.auction]} · ${j.auction.yard}` : '');

/** The customer's upcoming bookings, soonest first (excludes completed and cancelled). */
export const customerUpcoming = (customerId: string) =>
  bookings
    .filter((b) => b.customerId === customerId && b.status !== 'completed' && b.status !== 'cancelled')
    .sort((x, y) => `${x.date}${x.time}`.localeCompare(`${y.date}${y.time}`));
export const customerPast = (customerId: string) => bookings.filter((b) => b.customerId === customerId && (b.status === 'completed' || b.status === 'cancelled'));

export const receipts: Receipt[] = [
  {
    id: 'rcp-24090',
    bookingId: 'BS-24090',
    reference: 'PAY-9F4K2L',
    issuedAt: '2026-11-12T11:02',
    methodId: 'pm-card',
    lines: bookings.find((b) => b.id === 'BS-24090')!.lines,
    total: 45,
    status: 'paid',
  },
];
export const getReceipt = (bookingId: string) => receipts.find((r) => r.bookingId === bookingId);

export const reviews: Review[] = [
  { id: 'rev-1', author: 'Laura M.', unit: 'detailing', rating: 5, date: '2026-11-18', text: { es: 'Entregaron el SUV como nuevo. El interior no tenía ni una mancha y me mandaron fotos del antes y el después.', en: 'They returned the SUV like new. Not a single stain in the interior and they sent before and after photos.' } },
  { id: 'rev-2', author: 'Esteban R.', unit: 'towing', rating: 5, date: '2026-11-16', text: { es: 'Compré en Copart un viernes y el lunes ya estaba en mi taller. Avisaron cuando salió del patio y cuando llegó.', en: 'I bought at Copart on a Friday and it was at my shop on Monday. They alerted me when it left the yard and when it arrived.' } },
  { id: 'rev-3', author: 'Marisol P.', unit: 'personal-washing', rating: 4, date: '2026-11-14', text: { es: 'Llegaron puntuales a la oficina y lavaron sin molestar. Faltó un poco de brillo en las llantas.', en: 'They arrived on time at the office and washed without disturbing anyone. The tires could have had more shine.' } },
  { id: 'rev-4', author: 'Joel T.', unit: 'detailing', rating: 5, date: '2026-11-09', text: { es: 'El paquete cerámico vale cada dólar. La pintura se ve mejor que el día que lo compré.', en: 'The ceramic package is worth every dollar. The paint looks better than the day I bought it.' } },
  { id: 'rev-5', author: 'Gabriela S.', unit: 'personal-washing', rating: 5, date: '2026-11-06', text: { es: 'Reservé desde el celular en dos minutos y el lavado fue en mi estacionamiento. Muy cómodo.', en: 'I booked from my phone in two minutes and the wash happened in my parking spot. Very convenient.' } },
  { id: 'rev-6', author: 'Alberto C.', unit: 'towing', rating: 4, date: '2026-11-02', text: { es: 'Todo bien con la recogida; solo tuve que esperar 40 minutos en el patio por la salida del lote.', en: 'The pickup went well; I just had to wait 40 minutes at the yard for the lot release.' } },
];

export const offers: Offer[] = [
  { id: 'off-1', unit: 'detailing', title: { es: 'Premium con 15 % menos', en: '15% off Premium' }, description: { es: 'Detailing Premium en cualquier centro, de lunes a miércoles.', en: 'Premium detailing at any center, Monday to Wednesday.' }, badge: { es: '-15 %', en: '-15%' }, validUntil: '2026-12-15', packageId: 'det-premium' },
  { id: 'off-2', unit: 'personal-washing', title: { es: 'Lavado Completo + brillo de llantas', en: 'Complete wash + tire shine' }, description: { es: 'Llantas con acabado brillante incluido en tu primer lavado a domicilio.', en: 'Glossy tire finish included on your first at-home wash.' }, badge: { es: 'Nuevo', en: 'New' }, validUntil: '2026-12-31', packageId: 'wash-complete' },
  { id: 'off-3', unit: 'towing', title: { es: 'Segunda recogida sin cargo de salida', en: 'Second pickup with no dispatch fee' }, description: { es: 'Compra dos vehículos en la misma subasta y la segunda recogida no paga cargo de salida.', en: 'Buy two vehicles at the same auction and the second pickup pays no dispatch fee.' }, badge: { es: '2x1 salida', en: '2-for-1 dispatch' }, validUntil: '2026-12-20', packageId: 'tow-local' },
  { id: 'off-4', unit: 'detailing', title: { es: 'Cerámico: revisión gratis a los 30 días', en: 'Ceramic: free 30-day check' }, description: { es: 'Reserva el paquete Cerámico y agenda tu revisión sin costo.', en: 'Book the Ceramic package and schedule your check at no cost.' }, badge: { es: 'Incluido', en: 'Included' }, validUntil: '2027-01-10', packageId: 'det-ceramic' },
];

export const galleryItems: GalleryItem[] = [
  { id: 'gal-1', unit: 'detailing', caption: { es: 'Corrección de pintura en un sedán negro', en: 'Paint correction on a black sedan' }, ratio: '4:5' },
  { id: 'gal-2', unit: 'towing', caption: { es: 'Camioneta cargada en el patio de Copart Medley', en: 'Pickup truck loaded at Copart Medley' }, ratio: '4:3' },
  { id: 'gal-3', unit: 'personal-washing', caption: { es: 'Lavado a mano en un estacionamiento de Brickell', en: 'Hand wash in a Brickell parking lot' }, ratio: '1:1' },
  { id: 'gal-4', unit: 'detailing', caption: { es: 'Interior de cuero después del paquete Premium', en: 'Leather interior after the Premium package' }, ratio: '3:4' },
  { id: 'gal-5', unit: 'detailing', caption: { es: 'Recubrimiento cerámico en un SUV gris', en: 'Ceramic coating on a gray SUV' }, ratio: '4:3' },
  { id: 'gal-6', unit: 'towing', caption: { es: 'Entrega en Doral desde IAA Miami North', en: 'Delivery in Doral from IAA Miami North' }, ratio: '1:1' },
];
