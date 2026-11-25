import type { AddressData } from '../components/address/LocationCard/LocationCard';
import type { Locale } from '../i18n/locale';
import type { AssignmentStatus, BookingStatus, PaymentStatus, StatusByDimension, StatusDimension } from './status';
import type { BusinessUnit } from './units';

/**
 * Shared business types for Black Seat (single company, three units). The three status dimensions
 * are independent fields: `booking.status`, `booking.assignment.status`, `booking.payment.status`.
 * Identifiers (lot, pickup code, booking id, ZIP) are always strings so leading zeros survive.
 */
export type Localized = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export type ServiceCategoryId = 'exterior' | 'interior' | 'vacuum' | 'engine-bay' | 'polish' | 'tires' | 'towing';

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: Localized;
}

/** A purchasable package of one unit (Detailing: Esencial / Premium / Cerámico…). */
export interface ServicePackage {
  id: string;
  unit: BusinessUnit;
  name: Localized;
  tagline: Localized;
  includes: LocalizedList;
  notIncluded?: LocalizedList;
  /** Estimated duration in minutes. */
  durationMin: number;
  /** Price in USD major units. */
  price: number;
  /** `true` when the final price depends on distance, vehicle or condition ("Desde $120"). */
  priceFrom?: boolean;
  categories: ServiceCategoryId[];
  popular?: boolean;
}

export interface OpeningHours {
  days: Localized;
  /** "08:00–18:00" (24 h). */
  hours: string;
}

/** The service page of a unit: description, scope, hours and the packages it sells. */
export interface ServiceOffering {
  id: string;
  unit: BusinessUnit;
  name: Localized;
  description: Localized;
  includes: LocalizedList;
  notIncluded: LocalizedList;
  hours: OpeningHours[];
  packageIds: string[];
  categories: ServiceCategoryId[];
  /** Where it happens. */
  place: 'center' | 'customer-address' | 'auction-yard';
}

/** A Black Seat center (detailing bays, tow-truck base). */
export interface Center {
  id: string;
  name: string;
  address: AddressData;
  phone: string;
  hours: OpeningHours[];
  units: BusinessUnit[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  year: number;
  make: string;
  model: string;
  color: Localized;
  plate: string;
  kind: 'sedan' | 'suv' | 'pickup' | 'hatchback' | 'van';
}

export interface CustomerAddress extends AddressData {
  id: string;
  customerId: string;
  label: 'home' | 'office' | 'other';
  /** Custom name when `label` is `other`. */
  customLabel?: string;
}

export type StaffRoleName = 'detailer' | 'washer' | 'tow-driver' | 'supervisor';

/** Black Seat staff member who can be assigned to a job. */
export interface Professional {
  id: string;
  name: string;
  role: Localized;
  roleKind: StaffRoleName;
  units: BusinessUnit[];
  centerId: string;
  photoUrl?: string;
  rating?: number;
  /** Days off ("YYYY-MM-DD"). Used by assignment conflicts. */
  daysOff?: string[];
}

export type AuctionHouse = 'copart' | 'iaa';

export interface AuctionYard {
  id: string;
  auction: AuctionHouse;
  name: string;
  address: AddressData;
  /** Pickup hours of the yard. */
  hours: string;
}

/** Towing data. `lot` and `code` are strings: they keep leading zeros (`04217753`, `0093`). */
export interface AuctionPickup {
  auction: AuctionHouse;
  yardId: string;
  lot: string;
  code: string;
}

export interface PaymentMethod {
  id: string;
  kind: 'card' | 'apple-pay' | 'zelle' | 'cash';
  label: Localized;
  /** "Visa ···· 4242". */
  detail?: Localized;
  description: Localized;
  /** `true` when it is charged online through the payment provider (secure fields belong to the provider). */
  online: boolean;
}

export interface PriceLine {
  label: Localized;
  amount: number;
  kind?: 'charge' | 'discount' | 'free';
}

export interface StatusActor {
  name: string;
  role: 'customer' | 'operator' | 'admin' | 'system';
}

/** One entry of the history. `at` is local Miami time "YYYY-MM-DDTHH:mm". */
export type StatusChange = {
  [D in StatusDimension]: {
    id: string;
    dimension: D;
    status: StatusByDimension[D];
    at: string;
    by: StatusActor;
    /** Short note ("Cliente pidió otra hora"). Operator-only wording. */
    note?: Localized;
  };
}[StatusDimension];

export interface BookingPayment {
  status: PaymentStatus;
  methodId: string;
  /** Provider or receipt reference, once there is one ("PAY-9F4K2L"). */
  reference?: string;
}

export interface BookingAssignment {
  status: AssignmentStatus;
  professionalId?: string;
}

/** The booking. Same id in the confirmation, the history and the operator tray. */
export interface Booking {
  /** "BS-24117". */
  id: string;
  unit: BusinessUnit;
  packageId: string;
  customerId: string;
  /** Empty string for services that are not about a vehicle (home pressure washing, bins, carpets). */
  vehicleId: string;
  /** "YYYY-MM-DD". */
  date: string;
  /** "HH:mm". */
  time: string;
  /** Where it takes place: a center, the customer's address, or (Towing) the delivery address. */
  centerId?: string;
  address?: AddressData;
  auction?: AuctionPickup;
  status: BookingStatus;
  assignment: BookingAssignment;
  payment: BookingPayment;
  lines: PriceLine[];
  total: number;
  history: StatusChange[];
  notes?: string;
}

/** A booking with its references resolved (what components receive). */
export interface BookingDetail extends Booking {
  package: ServicePackage;
  customer: Customer;
  vehicle: Vehicle;
  center?: Center;
  assignee?: Professional;
  paymentMethod: PaymentMethod;
  yard?: AuctionYard;
}

export type JobAction = 'assign' | 'start' | 'complete' | 'view';

/** The operator's view of a booking for one day (tray row / mobile job card). */
export interface Job {
  /** Same as the booking id. */
  id: string;
  /** "YYYY-MM-DD". */
  date: string;
  /** "HH:mm". */
  time: string;
  unit: BusinessUnit;
  service: Localized;
  durationMin: number;
  customer: string;
  /** Service or delivery address, complete (never truncated). */
  location: string;
  auction?: { auction: AuctionHouse; yard: string; lot: string; code: string };
  assigneeId?: string;
  status: BookingStatus;
  assignment: AssignmentStatus;
  payment: PaymentStatus;
  /** The one next action available to the operator. */
  nextAction: JobAction;
}

export interface Receipt {
  id: string;
  bookingId: string;
  /** "PAY-9F4K2L". */
  reference: string;
  /** "YYYY-MM-DDTHH:mm". */
  issuedAt: string;
  methodId: string;
  lines: PriceLine[];
  total: number;
  status: PaymentStatus;
}

export interface Review {
  id: string;
  author: string;
  unit: BusinessUnit;
  rating: number;
  /** "YYYY-MM-DD". */
  date: string;
  text: Localized;
}

/** A #ParaTi offer on Home. */
export interface Offer {
  id: string;
  unit: BusinessUnit;
  title: Localized;
  description: Localized;
  badge: Localized;
  /** "YYYY-MM-DD". */
  validUntil: string;
  packageId?: string;
}

export interface GalleryItem {
  id: string;
  unit: BusinessUnit;
  caption: Localized;
  ratio: '1:1' | '4:5' | '4:3' | '3:4';
}
