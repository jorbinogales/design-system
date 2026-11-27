import type { Center, Localized, Offer, ServiceCategoryId, ServicePackage } from '../../domain/booking';
import type { BusinessUnit } from '../../domain/units';
import { unitMeta } from '../../domain/units';
import type { Locale } from '../../i18n/locale';
import { offers } from '../../mocks/bookings';
import { centers, getCenter, getPackagesForUnit, serviceCategories, servicePackages } from '../../mocks/catalog';

/** Extra listing data of a Black Seat center for Home, Explorar and Búsqueda (the shared mock has no rating or distance). */
export interface CenterListing {
  centerId: string;
  /** 0-5. */
  rating: number;
  reviews: number;
  /** Miles from the customer in Doral, FL. */
  distanceMi: number;
  /** Drive time in minutes. */
  driveMin: number;
  /** Position on the Explorar map, 0-100 %. */
  pin: { x: number; y: number };
}

export const centerListings: CenterListing[] = [
  { centerId: 'c-doral', rating: 4.9, reviews: 365, distanceMi: 1.2, driveMin: 4, pin: { x: 43, y: 38 } },
  { centerId: 'c-hialeah', rating: 4.7, reviews: 148, distanceMi: 5.8, driveMin: 14, pin: { x: 24, y: 29 } },
  { centerId: 'c-brickell', rating: 4.8, reviews: 212, distanceMi: 9.1, driveMin: 22, pin: { x: 71, y: 50 } },
  { centerId: 'c-lauderdale', rating: 4.9, reviews: 97, distanceMi: 25.6, driveMin: 38, pin: { x: 79, y: 24 } },
];

export const getListing = (centerId: string) => centerListings.find((l) => l.centerId === centerId)!;
export const listingCenter = (l: CenterListing): Center => getCenter(l.centerId)!;

/** First unit of the center: picks the Media fallback icon. */
export const listingUnit = (l: CenterListing): BusinessUnit => listingCenter(l).units[0];

export const packagesOfCenter = (centerId: string): ServicePackage[] => getCenter(centerId)!.units.flatMap((u) => getPackagesForUnit(u));

/** Lowest package price offered at the center. */
export const centerFromPrice = (centerId: string) => Math.min(...packagesOfCenter(centerId).map((p) => p.price));

/** "Closing time" of today (mock today is a Wednesday): the end of the first opening range. */
export const centerClosing = (c: Center) => c.hours[0].hours.split('–')[1];

// ─── Search and filters ────────────────────────────────────────────────

export type SortKey = 'relevance' | 'distance' | 'rating' | 'price';

export interface SearchFilters {
  unit: BusinessUnit | 'all';
  services: ServiceCategoryId[];
  price: [number, number];
  minRating: number;
  sort: SortKey;
}

export const priceBounds: [number, number] = [0, 500];

export const defaultFilters: SearchFilters = { unit: 'all', services: [], price: priceBounds, minRating: 0, sort: 'relevance' };

export const countActiveFilters = (f: SearchFilters) =>
  (f.unit !== 'all' ? 1 : 0) + (f.services.length ? 1 : 0) + (f.price[0] > priceBounds[0] || f.price[1] < priceBounds[1] ? 1 : 0) + (f.minRating > 0 ? 1 : 0) + (f.sort !== 'relevance' ? 1 : 0);

const plain = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase();

/** Packages of a center narrowed by the unit, service and price filters. */
function matchingPackages(centerId: string, f: SearchFilters): ServicePackage[] {
  return packagesOfCenter(centerId).filter(
    (p) =>
      (f.unit === 'all' || p.unit === f.unit) &&
      (f.services.length === 0 || p.categories.some((c) => f.services.includes(c))) &&
      p.price >= f.price[0] &&
      p.price <= f.price[1],
  );
}

/** Centers that match the text and the filters, ordered by `filters.sort`. */
export function searchCenters(query: string, filters: SearchFilters, locale: Locale, source: CenterListing[] = centerListings): CenterListing[] {
  const tokens = plain(query).split(/\s+/).filter(Boolean);
  const out = source.filter((l) => {
    const c = listingCenter(l);
    if (l.rating < filters.minRating) return false;
    const pkgs = matchingPackages(l.centerId, filters);
    if (pkgs.length === 0) return false;
    const haystack = plain(
      [c.name, c.address.city, ...c.units.map((u) => unitMeta[u].name), ...pkgs.flatMap((p) => [p.name[locale], p.tagline[locale], ...p.categories.map((id) => serviceCategories.find((s) => s.id === id)!.name[locale])])].join(' '),
    );
    return tokens.every((t) => haystack.includes(t));
  });
  const price = (l: CenterListing) => Math.min(...matchingPackages(l.centerId, filters).map((p) => p.price));
  if (filters.sort === 'distance') out.sort((a, b) => a.distanceMi - b.distanceMi);
  if (filters.sort === 'rating') out.sort((a, b) => b.rating - a.rating);
  if (filters.sort === 'price') out.sort((a, b) => price(a) - price(b));
  return out;
}

/** Lowest price of the center under the active filters. */
export const filteredFromPrice = (centerId: string, f: SearchFilters) => Math.min(...matchingPackages(centerId, f).map((p) => p.price));

export const recentSearches: Localized[] = [
  { es: 'Pulido cerámico', en: 'Ceramic polish' },
  { es: 'Lavado a domicilio en Doral', en: 'At-home wash in Doral' },
  { es: 'Recogida Copart Medley', en: 'Copart Medley pickup' },
  { es: 'Interior profundo', en: 'Deep interior' },
  { es: 'Detailing Brickell', en: 'Detailing Brickell' },
];

export const recentlyViewedCenterIds = ['c-doral', 'c-brickell', 'c-hialeah'];

// ─── Offers ────────────────────────────────────────────────────────────

/** The headline #ParaTi promotion: 40 % off at-home washing. Local to the screens (not in the shared offers mock). */
export const offer40: Offer = {
  id: 'off-40',
  unit: 'personal-washing',
  title: { es: 'Hasta 40 % en lavado a domicilio', en: 'Up to 40% off at-home washing' },
  description: { es: 'Tus primeros lavados en casa u oficina, en los tres paquetes. Cupo limitado esta semana.', en: 'Your first washes at home or the office, on all three packages. Limited spots this week.' },
  badge: { es: '-40 %', en: '-40%' },
  validUntil: '2026-12-06',
};

export const forYouOffers: Offer[] = [offer40, ...offers];

/** Discount percentage and the packages each offer applies to. */
export const offerDeals: Record<string, { percent: number; packageIds: string[] }> = {
  'off-40': { percent: 40, packageIds: ['wash-exterior', 'wash-interior', 'wash-complete'] },
  'off-1': { percent: 15, packageIds: ['det-premium'] },
};

export const discountedPrice = (price: number, percent: number) => Math.round(price * (1 - percent / 100));

export const getOfferPackages = (offerId: string): ServicePackage[] => (offerDeals[offerId]?.packageIds ?? []).map((id) => servicePackages.find((p) => p.id === id)!);

export const allCenters = centers;
