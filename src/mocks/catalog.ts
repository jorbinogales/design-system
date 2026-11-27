/**
 * Shared Black Seat catalog mock: units, categories, packages, services, centers, auction yards and
 * payment methods. Miami-area, USD. Screens import from here instead of inventing data.
 */
import dayjs from 'dayjs';
import type {
  AuctionYard,
  Center,
  OpeningHours,
  PaymentMethod,
  ServiceCategory,
  ServiceCategoryId,
  ServiceOffering,
  ServicePackage,
} from '../domain/booking';
import { businessUnits, unitMeta, type BusinessUnit } from '../domain/units';
import type { Locale } from '../i18n/locale';

/** "Today" of every mock: Wednesday 2026-11-25. */
export const mockTodayIso = '2026-11-25';
export const mockToday = dayjs(mockTodayIso);

export const mockUnits = businessUnits.map((unit) => ({
  unit,
  name: unitMeta[unit].name,
  summary: unitMeta[unit].summary,
  /** Lowest package price of the unit. */
  fromPrice: unit === 'detailing' ? 89 : unit === 'towing' ? 140 : 45,
}));

export const getUnit = (unit: BusinessUnit) => mockUnits.find((u) => u.unit === unit)!;

export const serviceCategories: ServiceCategory[] = [
  { id: 'exterior', name: { es: 'Lavado exterior', en: 'Exterior wash' } },
  { id: 'interior', name: { es: 'Interior', en: 'Interior' } },
  { id: 'vacuum', name: { es: 'Aspirado', en: 'Vacuum' } },
  { id: 'engine-bay', name: { es: 'Motor', en: 'Engine bay' } },
  { id: 'polish', name: { es: 'Pulido', en: 'Polish' } },
  { id: 'tires', name: { es: 'Llantas', en: 'Tires' } },
  { id: 'towing', name: { es: 'Grúa', en: 'Towing' } },
];

export const getCategoryName = (id: ServiceCategoryId, locale: Locale) => serviceCategories.find((c) => c.id === id)!.name[locale];

export const servicePackages: ServicePackage[] = [
  {
    id: 'det-essential',
    unit: 'detailing',
    name: { es: 'Esencial', en: 'Essential' },
    tagline: { es: 'Limpieza completa para el día a día.', en: 'A complete clean for everyday driving.' },
    includes: {
      es: ['Lavado exterior a mano', 'Aspirado de interior y cajuelas', 'Limpieza de vidrios', 'Brillo de llantas'],
      en: ['Hand exterior wash', 'Interior and trunk vacuum', 'Glass cleaning', 'Tire shine'],
    },
    notIncluded: { es: ['Pulido de pintura', 'Limpieza de motor'], en: ['Paint polish', 'Engine bay cleaning'] },
    durationMin: 150,
    price: 89,
    categories: ['exterior', 'vacuum', 'tires'],
  },
  {
    id: 'det-premium',
    unit: 'detailing',
    name: { es: 'Premium', en: 'Premium' },
    tagline: { es: 'Interior profundo, descontaminado y sellador.', en: 'Deep interior, decontamination and sealant.' },
    includes: {
      es: ['Todo lo del paquete Esencial', 'Limpieza profunda de tapicería', 'Descontaminación de pintura con arcilla', 'Sellador de pintura de 3 meses', 'Limpieza de motor'],
      en: ['Everything in Essential', 'Deep upholstery cleaning', 'Clay-bar paint decontamination', '3-month paint sealant', 'Engine bay cleaning'],
    },
    notIncluded: { es: ['Corrección de pintura'], en: ['Paint correction'] },
    durationMin: 240,
    price: 189,
    categories: ['exterior', 'interior', 'vacuum', 'engine-bay', 'polish'],
    popular: true,
  },
  {
    id: 'det-ceramic',
    unit: 'detailing',
    name: { es: 'Cerámico', en: 'Ceramic' },
    tagline: { es: 'Corrección de pintura y recubrimiento cerámico de 2 años.', en: 'Paint correction and a 2-year ceramic coating.' },
    includes: {
      es: ['Todo lo del paquete Premium', 'Corrección de pintura en una etapa', 'Recubrimiento cerámico de 2 años', 'Tratamiento cerámico de llantas y vidrios', 'Revisión de seguimiento a los 30 días'],
      en: ['Everything in Premium', 'Single-stage paint correction', '2-year ceramic coating', 'Ceramic treatment for wheels and glass', '30-day follow-up check'],
    },
    durationMin: 480,
    price: 449,
    priceFrom: true,
    categories: ['exterior', 'interior', 'vacuum', 'engine-bay', 'polish', 'tires'],
  },
  {
    id: 'wash-exterior',
    unit: 'personal-washing',
    name: { es: 'Exterior', en: 'Exterior' },
    tagline: { es: 'Lavado a mano en tu casa u oficina.', en: 'Hand wash at your home or office.' },
    includes: {
      es: ['Lavado a mano con shampoo pH neutro', 'Secado con microfibra', 'Limpieza de rines y llantas', 'Vidrios exteriores'],
      en: ['Hand wash with pH-neutral shampoo', 'Microfiber dry', 'Wheel and tire cleaning', 'Exterior glass'],
    },
    notIncluded: { es: ['Aspirado', 'Limpieza de interior'], en: ['Vacuum', 'Interior cleaning'] },
    durationMin: 45,
    price: 45,
    categories: ['exterior', 'tires'],
  },
  {
    id: 'wash-interior',
    unit: 'personal-washing',
    name: { es: 'Interior', en: 'Interior' },
    tagline: { es: 'Aspirado y limpieza de cabina sin salir de casa.', en: 'Vacuum and cabin cleaning without leaving home.' },
    includes: {
      es: ['Aspirado de asientos, alfombras y cajuela', 'Limpieza de tablero y consola', 'Paneles de puertas', 'Vidrios interiores'],
      en: ['Seat, carpet and trunk vacuum', 'Dashboard and console cleaning', 'Door panels', 'Interior glass'],
    },
    notIncluded: { es: ['Lavado exterior', 'Limpieza de tapicería con extractor'], en: ['Exterior wash', 'Extractor upholstery cleaning'] },
    durationMin: 60,
    price: 65,
    categories: ['interior', 'vacuum'],
  },
  {
    id: 'wash-complete',
    unit: 'personal-washing',
    name: { es: 'Completo', en: 'Complete' },
    tagline: { es: 'Exterior e interior en una sola visita.', en: 'Exterior and interior in a single visit.' },
    includes: {
      es: ['Todo lo del lavado Exterior', 'Todo lo del lavado Interior', 'Cera líquida en carrocería', 'Brillo de llantas'],
      en: ['Everything in Exterior', 'Everything in Interior', 'Liquid wax on the body', 'Tire shine'],
    },
    durationMin: 105,
    price: 95,
    categories: ['exterior', 'interior', 'vacuum', 'tires'],
    popular: true,
  },
  {
    id: 'tow-local',
    unit: 'towing',
    name: { es: 'Recogida local en subasta', en: 'Local auction pickup' },
    tagline: { es: 'Recogemos tu compra de Copart o IAA y la llevamos dentro del sur de Florida.', en: 'We pick up your Copart or IAA purchase and deliver it within South Florida.' },
    includes: {
      es: ['Recogida en el patio de la subasta con tu código y lote', 'Entrega en Miami-Dade y Broward', 'Fotos del vehículo al retirarlo', 'Seguimiento del estado de la recogida'],
      en: ['Pickup at the auction yard with your code and lot', 'Delivery in Miami-Dade and Broward', 'Photos of the vehicle at pickup', 'Pickup status tracking'],
    },
    notIncluded: { es: ['Cargos de almacenamiento de la subasta', 'Pago de la subasta'], en: ['Auction storage fees', 'Auction payment'] },
    durationMin: 90,
    price: 140,
    priceFrom: true,
    categories: ['towing'],
    popular: true,
  },
  {
    id: 'tow-long',
    unit: 'towing',
    name: { es: 'Larga distancia', en: 'Long distance' },
    tagline: { es: 'Traslado desde la subasta a cualquier punto de Florida.', en: 'Transport from the auction to anywhere in Florida.' },
    includes: {
      es: ['Recogida en el patio de la subasta', 'Traslado en plataforma a todo Florida', 'Seguro de carga incluido', 'Aviso al salir y al llegar'],
      en: ['Pickup at the auction yard', 'Flatbed transport across Florida', 'Cargo insurance included', 'Departure and arrival alerts'],
    },
    durationMin: 300,
    price: 420,
    priceFrom: true,
    categories: ['towing'],
  },
];

export const getPackage = (id: string) => servicePackages.find((p) => p.id === id);
export const getPackagesForUnit = (unit: BusinessUnit) => servicePackages.filter((p) => p.unit === unit);

const monSat = (hours: string): OpeningHours => ({ days: { es: 'Lunes a sábado', en: 'Monday to Saturday' }, hours });
const monFri = (hours: string): OpeningHours => ({ days: { es: 'Lunes a viernes', en: 'Monday to Friday' }, hours });
const closedSun: OpeningHours = { days: { es: 'Domingo', en: 'Sunday' }, hours: '' };

export const unitHours: Record<BusinessUnit, OpeningHours[]> = {
  detailing: [monSat('08:00–18:00'), closedSun],
  towing: [monFri('07:00–17:00'), { days: { es: 'Sábado', en: 'Saturday' }, hours: '08:00–12:00' }, closedSun],
  'personal-washing': [monSat('07:00–19:00'), closedSun],
};

export const serviceOfferings: ServiceOffering[] = [
  {
    id: 'svc-detailing',
    unit: 'detailing',
    name: { es: 'Detailing en centro', en: 'Detailing at the center' },
    description: {
      es: 'Tu auto entra a una de nuestras bahías con luz controlada y sale con la pintura limpia, protegida y el interior como nuevo. Trabajamos con productos profesionales y cada paquete termina con una revisión de calidad.',
      en: 'Your car goes into one of our controlled-light bays and comes out with clean, protected paint and a like-new interior. We use professional products and every package ends with a quality check.',
    },
    includes: {
      es: ['Productos profesionales pH neutro', 'Revisión de calidad al terminar', 'Fotos del antes y el después', 'Entrega con resumen del trabajo'],
      en: ['Professional pH-neutral products', 'Quality check at the end', 'Before and after photos', 'Handover with a work summary'],
    },
    notIncluded: {
      es: ['Reparación de golpes o rayones profundos', 'Vehículos con moho severo (se cotiza aparte)'],
      en: ['Dent or deep scratch repair', 'Vehicles with severe mold (quoted separately)'],
    },
    hours: unitHours.detailing,
    packageIds: ['det-essential', 'det-premium', 'det-ceramic'],
    categories: ['exterior', 'interior', 'polish', 'engine-bay'],
    place: 'center',
  },
  {
    id: 'svc-towing',
    unit: 'towing',
    name: { es: 'Recogida en subasta', en: 'Auction pickup' },
    description: {
      es: 'Compraste en Copart o IAA y necesitas que alguien lo retire. Con tu código de recogida y el número de lote, nuestro conductor va al patio, retira el vehículo y lo lleva a la dirección que indiques.',
      en: 'You bought at Copart or IAA and need someone to pick it up. With your pickup code and lot number, our driver goes to the yard, collects the vehicle and delivers it to the address you choose.',
    },
    includes: {
      es: ['Retiro en el patio con tu código y lote', 'Fotos del vehículo al cargarlo', 'Seguimiento del estado', 'Entrega en la dirección elegida'],
      en: ['Yard pickup with your code and lot', 'Photos when loaded', 'Status tracking', 'Delivery to the chosen address'],
    },
    notIncluded: {
      es: ['Pago de la subasta ni cargos de almacenamiento', 'Vehículos sin gestión de salida liberada'],
      en: ['Auction payment or storage fees', 'Vehicles without a released gate pass'],
    },
    hours: unitHours.towing,
    packageIds: ['tow-local', 'tow-long'],
    categories: ['towing'],
    place: 'auction-yard',
  },
  {
    id: 'svc-washing',
    unit: 'personal-washing',
    name: { es: 'Lavado personal a domicilio', en: 'Personal washing at your place' },
    description: {
      es: 'Un profesional llega a tu casa, oficina o estacionamiento con agua, energía y productos propios. Lavamos a mano mientras haces tu día.',
      en: 'A professional arrives at your home, office or parking lot with their own water, power and products. We hand wash while you get on with your day.',
    },
    includes: {
      es: ['Equipo, agua y energía propios', 'Productos pH neutro', 'Aviso cuando el profesional va en camino', 'Pago al terminar o por adelantado'],
      en: ['Own equipment, water and power', 'pH-neutral products', 'Heads-up when the professional is on the way', 'Pay when done or up front'],
    },
    notIncluded: { es: ['Pulido o encerado profundo', 'Zonas sin acceso para el vehículo'], en: ['Polish or deep waxing', 'Locations without vehicle access'] },
    hours: unitHours['personal-washing'],
    packageIds: ['wash-exterior', 'wash-interior', 'wash-complete'],
    categories: ['exterior', 'interior', 'vacuum', 'tires'],
    place: 'customer-address',
  },
];

export const getServiceOffering = (unit: BusinessUnit) => serviceOfferings.find((s) => s.unit === unit)!;

export const centers: Center[] = [
  {
    id: 'c-doral',
    name: 'Black Seat Doral',
    address: { line1: '8890 NW 26th St', city: 'Doral', state: 'FL', zip: '33172', reference: 'Nave 3, portón gris' },
    phone: '(305) 555-0142',
    hours: [monSat('08:00–18:00'), closedSun],
    units: ['detailing', 'towing', 'personal-washing'],
  },
  {
    id: 'c-brickell',
    name: 'Black Seat Brickell',
    address: { line1: '1250 SW 1st Ave', line2: 'Level P2', city: 'Miami', state: 'FL', zip: '33130' },
    phone: '(305) 555-0177',
    hours: [monSat('09:00–19:00'), closedSun],
    units: ['detailing', 'personal-washing'],
  },
  {
    id: 'c-hialeah',
    name: 'Black Seat Hialeah',
    address: { line1: '1850 W 4th Ave', city: 'Hialeah', state: 'FL', zip: '33010' },
    phone: '(305) 555-0119',
    hours: [monSat('08:00–17:00'), closedSun],
    units: ['detailing', 'towing'],
  },
  {
    id: 'c-lauderdale',
    name: 'Black Seat Fort Lauderdale',
    address: { line1: '2200 NW 9th Ave', city: 'Fort Lauderdale', state: 'FL', zip: '33311', reference: 'Entrada por la calle lateral' },
    phone: '(954) 555-0108',
    hours: [monFri('07:00–17:00'), closedSun],
    units: ['towing', 'detailing'],
  },
];

export const getCenter = (id: string) => centers.find((c) => c.id === id);

export const auctionYards: AuctionYard[] = [
  { id: 'iaa-miami-north', auction: 'iaa', name: 'IAA Miami North', address: { line1: '12600 NW 25th St', city: 'Miami', state: 'FL', zip: '33182' }, hours: '08:00–16:00' },
  { id: 'iaa-fort-lauderdale', auction: 'iaa', name: 'IAA Fort Lauderdale', address: { line1: '3880 W Hallandale Beach Blvd', city: 'Pembroke Park', state: 'FL', zip: '33023' }, hours: '08:00–16:00' },
  { id: 'copart-medley', auction: 'copart', name: 'Copart Medley', address: { line1: '10501 NW 121st Way', city: 'Medley', state: 'FL', zip: '33178' }, hours: '08:30–16:30' },
  { id: 'copart-miami-north', auction: 'copart', name: 'Copart Miami North', address: { line1: '1500 NW 133rd St', city: 'Miami', state: 'FL', zip: '33167' }, hours: '08:30–16:30' },
  { id: 'copart-miami-south', auction: 'copart', name: 'Copart Miami South', address: { line1: '14201 SW 120th St', city: 'Miami', state: 'FL', zip: '33186' }, hours: '08:30–16:30' },
];

export const getYard = (id: string) => auctionYards.find((y) => y.id === id);
export const auctionName = { copart: 'Copart', iaa: 'IAA' } as const;

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm-card',
    kind: 'card',
    label: { es: 'Tarjeta de crédito o débito', en: 'Credit or debit card' },
    detail: { es: 'Visa terminada en 4242', en: 'Visa ending in 4242' },
    description: { es: 'Se cobra al confirmar. Los datos de la tarjeta los procesa el proveedor de pagos.', en: 'Charged on confirmation. Card details are handled by the payment provider.' },
    online: true,
  },
  {
    id: 'pm-apple-pay',
    kind: 'apple-pay',
    label: { es: 'Apple Pay', en: 'Apple Pay' },
    description: { es: 'Confirma con Face ID. Se cobra al confirmar.', en: 'Confirm with Face ID. Charged on confirmation.' },
    online: true,
  },
  {
    id: 'pm-zelle',
    kind: 'zelle',
    label: { es: 'Zelle', en: 'Zelle' },
    description: { es: 'Envía el pago a Black Seat antes del servicio. La reserva queda con pago pendiente hasta recibirlo.', en: 'Send the payment to Black Seat before the service. The booking stays payment pending until it arrives.' },
    online: false,
  },
  {
    id: 'pm-cash',
    kind: 'cash',
    label: { es: 'Efectivo al terminar', en: 'Cash when done' },
    description: { es: 'Pagas al profesional al terminar el servicio.', en: 'You pay the professional when the service is done.' },
    online: false,
  },
];

export const getPaymentMethod = (id: string) => paymentMethods.find((m) => m.id === id)!;
