import type { Dayjs } from 'dayjs';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { emptyAuctionPickup, type AuctionPickupValue } from '../blacksix/AuctionPickupForm/AuctionPickupForm';
import type { AppearanceMode } from '../components/preferences/AppearanceSelect/AppearanceSelect';
import type { BookingDetail, PriceLine } from '../domain/booking';
import type { BusinessUnit } from '../domain/units';
import type { Locale } from '../i18n/locale';
import { buildBooking, getPackage, initialBookings, me, myAddresses, myVehicle, packagesFor, totalOf, type Seed } from './data';

/* ─────────────── Rutas (hash) ─────────────── */

export type Surface = 'c' | 'o';
export type ClientRoute =
  | { name: 'home' }
  | { name: 'unit'; unit: BusinessUnit }
  | { name: 'schedule' }
  | { name: 'towing' }
  | { name: 'address' }
  | { name: 'checkout' }
  | { name: 'confirmed'; id: string }
  | { name: 'bookings' }
  | { name: 'booking'; id: string }
  | { name: 'vip' }
  | { name: 'account' };

const units: BusinessUnit[] = ['detailing', 'towing', 'personal-washing'];

export function parseHash(hash: string): { surface: Surface; route: ClientRoute } {
  const [, s, name, arg] = hash.replace(/^#/, '').split('/');
  const surface: Surface = s === 'o' ? 'o' : 'c';
  if (surface === 'o') return { surface, route: { name: 'home' } };
  switch (name) {
    case 'unit':
      return { surface, route: units.includes(arg as BusinessUnit) ? { name: 'unit', unit: arg as BusinessUnit } : { name: 'home' } };
    case 'confirmed':
    case 'booking':
      return { surface, route: arg ? { name, id: arg } : { name: 'bookings' } };
    case 'schedule':
    case 'towing':
    case 'address':
    case 'checkout':
    case 'bookings':
    case 'vip':
    case 'account':
      return { surface, route: { name } };
    default:
      return { surface, route: { name: 'home' } };
  }
}

export function toHash(surface: Surface, route?: ClientRoute): string {
  if (surface === 'o') return '#/o/today';
  if (!route) return '#/c/home';
  if (route.name === 'unit') return `#/c/unit/${route.unit}`;
  if (route.name === 'confirmed' || route.name === 'booking') return `#/c/${route.name}/${route.id}`;
  return `#/c/${route.name}`;
}

/* ─────────────── Borrador de reserva ─────────────── */

export interface Draft {
  unit: BusinessUnit;
  packageId: string;
  day: Dayjs | null;
  time: string | null;
  addressId: string;
  auction: AuctionPickupValue;
  methodId: string;
  vip: boolean;
}

const newDraft = (unit: BusinessUnit): Draft => ({
  unit,
  packageId: (packagesFor(unit).find((p) => p.popular) ?? packagesFor(unit)[0]).id,
  day: null,
  time: null,
  addressId: myAddresses[0].id,
  auction: emptyAuctionPickup,
  methodId: 'pm-card',
  vip: false,
});

/** Steps of the booking flow per unit; Detailing happens at the center, so it has no address step. */
export function flowSteps(unit: BusinessUnit, locale: Locale) {
  const es = locale === 'es';
  if (unit === 'towing') return [es ? 'Servicio' : 'Service', es ? 'Recogida' : 'Pickup', es ? 'Entrega' : 'Delivery', es ? 'Pago' : 'Payment'];
  if (unit === 'detailing') return [es ? 'Paquete' : 'Package', es ? 'Fecha y hora' : 'Date and time', es ? 'Pago' : 'Payment'];
  return [es ? 'Servicio' : 'Service', es ? 'Fecha y hora' : 'Date and time', es ? 'Dirección' : 'Address', es ? 'Pago' : 'Payment'];
}

export const vipDiscount = 0.1;

/** Price lines of the draft, with the VIP 10 % when the customer is a member. */
export function draftLines(d: Draft, vip: boolean, locale: Locale): PriceLine[] {
  const pkg = getPackage(d.packageId);
  const lines: PriceLine[] = [{ label: pkg.name, amount: pkg.price }];
  if (vip) lines.push({ label: { es: 'Descuento VIP 10 %', en: 'VIP 10% off' }, amount: Math.round(pkg.price * vipDiscount), kind: 'discount' });
  void locale;
  return lines;
}

/* ─────────────── Contexto ─────────────── */

interface Store {
  surface: Surface;
  route: ClientRoute;
  go: (route: ClientRoute) => void;
  back: () => void;
  setSurface: (s: Surface) => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  appearance: AppearanceMode;
  setAppearance: (a: AppearanceMode) => void;
  bookings: BookingDetail[];
  setBookings: (fn: (all: BookingDetail[]) => BookingDetail[]) => void;
  draft: Draft;
  setDraft: (patch: Partial<Draft>) => void;
  startBooking: (unit: BusinessUnit) => void;
  confirmDraft: () => string;
  isVip: boolean;
  setVip: (v: boolean) => void;
}

const Ctx = createContext<Store | null>(null);

export function useProto() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useProto outside PrototypeProvider');
  return s;
}

let seq = 31200;

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [{ surface, route }, setLoc] = useState(() => parseHash(window.location.hash));
  const [locale, setLocale] = useState<Locale>('es');
  const [appearance, setAppearance] = useState<AppearanceMode>('light');
  const [bookings, setBookingsState] = useState<BookingDetail[]>(initialBookings);
  const [draft, setDraftState] = useState<Draft>(() => newDraft('detailing'));
  const [isVip, setVip] = useState(false);

  useEffect(() => {
    const on = () => setLoc(parseHash(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const go = useCallback((r: ClientRoute) => {
    window.location.hash = toHash('c', r);
  }, []);
  const back = useCallback(() => {
    if (window.history.length > 1) window.history.back();
    else window.location.hash = toHash('c');
  }, []);
  const setSurface = useCallback((s: Surface) => {
    window.location.hash = toHash(s);
  }, []);

  const setDraft = useCallback((patch: Partial<Draft>) => setDraftState((d) => ({ ...d, ...patch })), []);
  const startBooking = useCallback((unit: BusinessUnit) => setDraftState((d) => (d.unit === unit ? d : newDraft(unit))), []);
  const setBookings = useCallback((fn: (all: BookingDetail[]) => BookingDetail[]) => setBookingsState(fn), []);

  const confirmDraft = useCallback(() => {
    const id = `BS-${++seq}`;
    const pkg = getPackage(draft.packageId);
    const online = draft.methodId === 'pm-card' || draft.methodId === 'pm-apple-pay';
    const address = myAddresses.find((a) => a.id === draft.addressId);
    const seed: Seed = {
      id,
      pkg: pkg.id,
      cus: me.id,
      veh: pkg.unit === 'personal-washing' ? undefined : myVehicle.id,
      date: (draft.day ?? undefined)?.format('YYYY-MM-DD') ?? draft.auction.date?.format('YYYY-MM-DD') ?? '2026-11-27',
      time: draft.time ?? '08:00',
      address: pkg.unit === 'detailing' ? undefined : address,
      auction: pkg.unit === 'towing' && draft.auction.auction ? { auction: draft.auction.auction, yardId: draft.auction.yardId, lot: draft.auction.lot, code: draft.auction.code } : undefined,
      status: 'confirmed',
      pay: online ? 'paid' : 'pending',
      method: draft.methodId,
    };
    const built = buildBooking(seed);
    const lines = draftLines(draft, isVip, locale);
    const booking = { ...built, lines, total: totalOf(lines) };
    setBookingsState((all) => [booking, ...all]);
    setDraftState(newDraft(draft.unit));
    return id;
  }, [draft, isVip, locale]);

  const value = useMemo<Store>(
    () => ({ surface, route, go, back, setSurface, locale, setLocale, appearance, setAppearance, bookings, setBookings, draft, setDraft, startBooking, confirmDraft, isVip, setVip }),
    [surface, route, go, back, setSurface, locale, appearance, bookings, setBookings, draft, setDraft, startBooking, confirmDraft, isVip],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
