import type { AddressData } from '../../components/address/LocationCard/LocationCard';
import type { L } from './ui';

/** Fixed "today" so grouped lists (Hoy / Ayer) render the same in every story. */
export const TODAY = '2026-11-25';

export const user = {
  name: 'Andrea Salcedo',
  email: 'andrea.salcedo@example.com',
  phone: '(305) 555-0188',
};

export const walletBalance = 120;

// ---------------------------------------------------------------- payment methods

export type PaymentMethodId = 'visa-4242' | 'mc-0937' | 'wallet' | 'apple-pay' | 'google-pay';

export interface PaymentMethodData {
  id: PaymentMethodId;
  kind: 'card' | 'wallet' | 'apple-pay' | 'google-pay';
  title: L;
  description: L;
}

export const paymentMethods: PaymentMethodData[] = [
  { id: 'visa-4242', kind: 'card', title: { es: 'Visa •••• 4242', en: 'Visa •••• 4242' }, description: { es: 'Vence 08/28', en: 'Expires 08/28' } },
  { id: 'mc-0937', kind: 'card', title: { es: 'Mastercard •••• 0937', en: 'Mastercard •••• 0937' }, description: { es: 'Vence 02/27', en: 'Expires 02/27' } },
  { id: 'wallet', kind: 'wallet', title: { es: 'Wallet Black Six', en: 'Black Six Wallet' }, description: { es: 'Saldo disponible', en: 'Available balance' } },
  { id: 'apple-pay', kind: 'apple-pay', title: { es: 'Apple Pay', en: 'Apple Pay' }, description: { es: 'Con Face ID en este iPhone', en: 'With Face ID on this iPhone' } },
  { id: 'google-pay', kind: 'google-pay', title: { es: 'Google Pay', en: 'Google Pay' }, description: { es: 'Con tu cuenta de Google', en: 'With your Google account' } },
];

// ---------------------------------------------------------------- addresses

export interface SavedAddress {
  id: string;
  label: L;
  isDefault?: boolean;
  address: AddressData;
}

export const savedAddresses: SavedAddress[] = [
  {
    id: 'home',
    label: { es: 'Casa', en: 'Home' },
    isDefault: true,
    address: { line1: '7845 NW 36th St', line2: 'Apt 210', city: 'Doral', state: 'FL', zip: '33166', reference: 'Portón negro, junto a la farmacia' },
  },
  {
    id: 'office',
    label: { es: 'Oficina', en: 'Office' },
    address: { line1: '800 Brickell Ave', line2: 'Suite 1500', city: 'Miami', state: 'FL', zip: '33131', reference: 'Estacionamiento P3, espacio 214' },
  },
  {
    id: 'mom',
    label: { es: 'Casa de mamá', en: "Mom's place" },
    address: { line1: '4410 SW 8th St', city: 'Coral Gables', state: 'FL', zip: '33134' },
  },
];

// ---------------------------------------------------------------- wallet

export type TxKind = 'topup' | 'charge' | 'refund';

export interface WalletTx {
  id: string;
  kind: TxKind;
  /** Positive amount in USD; the sign comes from `kind`. */
  amount: number;
  /** Order reference (BS-xxxxx) for charges and refunds. */
  ref?: string;
  unit?: L;
  date: string;
  time: string;
  balanceAfter: number;
}

/** History older than the mock bookings (ids below BS-24000), so no entry contradicts a mock booking's payment method or amount. */
export const walletTransactions: WalletTx[] = [
  { id: 't1', kind: 'topup', amount: 50, date: '2026-11-25', time: '07:30', balanceAfter: 120 },
  { id: 't2', kind: 'charge', amount: 45, ref: 'BS-23994', unit: { es: 'Personal Washing', en: 'Personal Washing' }, date: '2026-11-21', time: '17:45', balanceAfter: 70 },
  { id: 't3', kind: 'refund', amount: 35, ref: 'BS-23976', unit: { es: 'Personal Washing', en: 'Personal Washing' }, date: '2026-11-20', time: '10:05', balanceAfter: 115 },
  { id: 't4', kind: 'charge', amount: 35, ref: 'BS-23976', unit: { es: 'Personal Washing', en: 'Personal Washing' }, date: '2026-11-18', time: '08:20', balanceAfter: 80 },
  { id: 't5', kind: 'topup', amount: 100, date: '2026-11-18', time: '08:12', balanceAfter: 115 },
  { id: 't6', kind: 'charge', amount: 145, ref: 'BS-23988', unit: { es: 'Towing', en: 'Towing' }, date: '2026-11-02', time: '13:10', balanceAfter: 15 },
];

export const quickAmounts = [20, 50, 100, 200] as const;
export const TOPUP_MIN = 10;
export const TOPUP_MAX = 1000;

// ---------------------------------------------------------------- help center

export type FaqCategory = 'bookings' | 'towing' | 'washing' | 'payments' | 'wallet';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  q: L;
  a: L;
}

export const faqCategoryLabels: Record<FaqCategory, L> = {
  bookings: { es: 'Reservas', en: 'Bookings' },
  towing: { es: 'Towing', en: 'Towing' },
  washing: { es: 'Personal Washing', en: 'Personal Washing' },
  payments: { es: 'Pagos', en: 'Payments' },
  wallet: { es: 'Wallet', en: 'Wallet' },
};

export const faqItems: FaqItem[] = [
  {
    id: 'cancel',
    category: 'bookings',
    q: { es: '¿Cómo cancelo una reserva?', en: 'How do I cancel a booking?' },
    a: {
      es: 'Entra a Reservas, abre la reserva y toca Cancelar. Si cancelas con más de 24 horas de anticipación no se te cobra nada y el importe vuelve a tu método de pago o a tu wallet. Con menos de 24 horas puede aplicarse un cargo del 20 %.',
      en: 'Go to Bookings, open the booking and tap Cancel. If you cancel more than 24 hours ahead you are not charged and the amount goes back to your payment method or wallet. Under 24 hours, a 20% fee may apply.',
    },
  },
  {
    id: 'reschedule',
    category: 'bookings',
    q: { es: '¿Puedo cambiar la fecha o la hora?', en: 'Can I change the date or time?' },
    a: {
      es: 'Sí. Abre la reserva y elige Cambiar horario. Verás solo las franjas disponibles. Si la franja que querías se ocupa antes de confirmar, conservamos tus datos y te sugerimos la siguiente libre.',
      en: 'Yes. Open the booking and choose Change time. You will only see available slots. If the slot you wanted is taken before you confirm, we keep your details and suggest the next free one.',
    },
  },
  {
    id: 'towing-how',
    category: 'towing',
    q: { es: '¿Cómo funciona la recogida de un vehículo de subasta?', en: 'How does an auction vehicle pickup work?' },
    a: {
      es: 'Para vehículos comprados en Copart o IAA necesitamos la subasta, el número de lote y el código de recogida. Asignamos un operador con grúa, él se presenta en el patio de la subasta con tu información, retira el vehículo y lo lleva a la dirección que indicaste. Te avisamos cuando sale, cuando lo recoge y cuando llega.',
      en: 'For vehicles bought at Copart or IAA we need the auction, the lot number and the pickup code. We assign an operator with a tow truck, who goes to the auction yard with your details, collects the vehicle and takes it to the address you gave us. We notify you when they leave, when they pick it up and when it arrives.',
    },
  },
  {
    id: 'towing-ready',
    category: 'towing',
    q: { es: '¿Qué debo tener listo antes de la recogida?', en: 'What should I have ready before the pickup?' },
    a: {
      es: 'El pago a la subasta debe estar completado y el vehículo liberado para retiro. Ten a mano el número de lote (por ejemplo 05503318) y el código de recogida de 4 dígitos. Si la subasta fija una fecha límite de retiro, reserva con al menos dos días de margen.',
      en: 'Your payment to the auction must be complete and the vehicle released for pickup. Keep the lot number (for example 05503318) and the 4-digit pickup code handy. If the auction sets a pickup deadline, book with at least two days to spare.',
    },
  },
  {
    id: 'washing-area',
    category: 'washing',
    q: { es: '¿Qué zonas cubre Personal Washing?', en: 'Which areas does Personal Washing cover?' },
    a: {
      es: 'Vamos a tu casa u oficina en Miami-Dade y el sur de Broward. Al escribir tu dirección te confirmamos al instante si está dentro de la zona. Solo necesitamos un lugar seguro donde estacionar el vehículo.',
      en: 'We come to your home or office in Miami-Dade and southern Broward. When you enter your address we confirm instantly whether it is inside the service area. We only need a safe spot to park the vehicle.',
    },
  },
  {
    id: 'pay-methods',
    category: 'payments',
    q: { es: '¿Qué métodos de pago aceptan?', en: 'Which payment methods do you accept?' },
    a: {
      es: 'Tarjetas Visa y Mastercard, Apple Pay, Google Pay y tu Wallet Black Six. Los datos de la tarjeta los procesa nuestro proveedor de pagos; Black Six nunca los guarda.',
      en: 'Visa and Mastercard cards, Apple Pay, Google Pay and your Black Six Wallet. Card details are processed by our payment provider; Black Six never stores them.',
    },
  },
  {
    id: 'pay-when',
    category: 'payments',
    q: { es: '¿Cuándo se cobra el servicio?', en: 'When am I charged for the service?' },
    a: {
      es: 'El cobro se hace al confirmar la reserva. Si el servicio no se puede realizar por causa nuestra, te devolvemos el importe completo.',
      en: 'You are charged when you confirm the booking. If the service cannot be performed because of us, we refund the full amount.',
    },
  },
  {
    id: 'wallet-topup',
    category: 'wallet',
    q: { es: '¿Cómo recargo mi wallet?', en: 'How do I top up my wallet?' },
    a: {
      es: 'Ve a Perfil, abre Wallet y toca Agregar dinero. Elige un monto entre $10 y $1,000 y paga con tarjeta, Apple Pay o Google Pay. El saldo se refleja al instante.',
      en: 'Go to Profile, open Wallet and tap Add money. Pick an amount between $10 and $1,000 and pay with a card, Apple Pay or Google Pay. The balance shows up instantly.',
    },
  },
  {
    id: 'wallet-refund',
    category: 'wallet',
    q: { es: '¿Los reembolsos van a mi wallet?', en: 'Do refunds go to my wallet?' },
    a: {
      es: 'Si pagaste con el wallet, el reembolso vuelve al wallet al momento. Si pagaste con tarjeta, vuelve a la tarjeta en 5 a 10 días hábiles, según tu banco.',
      en: 'If you paid with the wallet, the refund returns to the wallet right away. If you paid by card, it goes back to the card in 5 to 10 business days, depending on your bank.',
    },
  },
];

export interface ContactChannel {
  id: 'phone' | 'whatsapp' | 'web' | 'instagram';
  title: L;
  value: string;
  hint: L;
}

export const contactChannels: ContactChannel[] = [
  { id: 'phone', title: { es: 'Servicio al cliente', en: 'Customer service' }, value: '+1 (305) 555-0142', hint: { es: 'Lun a sáb, 8:00 a. m. a 7:00 p. m.', en: 'Mon to Sat, 8:00 AM to 7:00 PM' } },
  { id: 'whatsapp', title: { es: 'WhatsApp', en: 'WhatsApp' }, value: '+1 (305) 555-0143', hint: { es: 'Respondemos en menos de 15 minutos', en: 'We reply in under 15 minutes' } },
  { id: 'web', title: { es: 'Sitio web', en: 'Website' }, value: 'blacksixmiami.com', hint: { es: 'Servicios, precios y zonas', en: 'Services, prices and areas' } },
  { id: 'instagram', title: { es: 'Instagram', en: 'Instagram' }, value: '@blacksixmiami', hint: { es: 'Trabajos recientes y promociones', en: 'Recent work and promotions' } },
];

// ---------------------------------------------------------------- privacy (sample content, needs legal review)

export interface PrivacySection {
  id: string;
  title: L;
  body: L[];
}

export const privacyUpdated: L = { es: 'Última actualización: 12 de noviembre de 2026', en: 'Last updated: November 12, 2026' };

/** SAMPLE CONTENT: plausible placeholder text that must be reviewed by legal counsel before launch. */
export const privacySections: PrivacySection[] = [
  {
    id: 'collect',
    title: { es: 'Datos que recopilamos', en: 'Data we collect' },
    body: [
      {
        es: 'Cuando creas tu cuenta y reservas un servicio recopilamos tu nombre, correo electrónico, número de teléfono y los datos de tus vehículos (marca, modelo, año y placa).',
        en: 'When you create your account and book a service we collect your name, email address, phone number and your vehicle details (make, model, year and plate).',
      },
      {
        es: 'Para recogidas en subasta también guardamos la subasta, el número de lote y el código de recogida que nos indicas.',
        en: 'For auction pickups we also store the auction, lot number and pickup code you give us.',
      },
    ],
  },
  {
    id: 'use',
    title: { es: 'Cómo usamos tu información', en: 'How we use your information' },
    body: [
      {
        es: 'Usamos tus datos para confirmar y realizar tus reservas, asignar a un operador, avisarte del estado de cada servicio, darte soporte y mejorar Black Six.',
        en: 'We use your data to confirm and carry out your bookings, assign an operator, keep you updated on each service, give you support and improve Black Six.',
      },
      {
        es: 'Solo te enviamos promociones si activaste esa opción, y puedes desactivarla cuando quieras desde Notificaciones.',
        en: 'We only send promotions if you turned that option on, and you can turn it off at any time from Notifications.',
      },
    ],
  },
  {
    id: 'location',
    title: { es: 'Ubicación', en: 'Location' },
    body: [
      {
        es: 'Con tu permiso usamos la ubicación del dispositivo para sugerir tu dirección y mostrarte el avance del operador en el mapa. La ubicación del operador solo es visible durante tu servicio.',
        en: 'With your permission we use your device location to suggest your address and show your operator’s progress on the map. The operator’s location is only visible during your service.',
      },
      {
        es: 'Puedes retirar el permiso en los ajustes de tu dispositivo; podrás seguir escribiendo tu dirección a mano.',
        en: 'You can withdraw permission in your device settings; you can still type your address by hand.',
      },
    ],
  },
  {
    id: 'payments',
    title: { es: 'Pagos', en: 'Payments' },
    body: [
      {
        es: 'Los pagos con tarjeta, Apple Pay y Google Pay los procesa un proveedor de pagos certificado. Black Six no almacena el número completo de tu tarjeta ni su código de seguridad; solo conserva los últimos cuatro dígitos y la fecha de vencimiento para que reconozcas el método.',
        en: 'Card, Apple Pay and Google Pay payments are processed by a certified payment provider. Black Six does not store your full card number or security code; we only keep the last four digits and the expiry date so you can recognize the method.',
      },
    ],
  },
  {
    id: 'sharing',
    title: { es: 'Con quién compartimos datos', en: 'Who we share data with' },
    body: [
      {
        es: 'No vendemos tus datos. Los compartimos únicamente con proveedores que nos ayudan a operar (pagos, mapas, mensajería) y con las subastas cuando es necesario para retirar tu vehículo, o cuando la ley lo exige.',
        en: 'We do not sell your data. We share it only with providers that help us operate (payments, maps, messaging) and with auctions when needed to collect your vehicle, or when the law requires it.',
      },
    ],
  },
  {
    id: 'rights',
    title: { es: 'Tus derechos', en: 'Your rights' },
    body: [
      {
        es: 'Puedes ver y corregir tus datos desde Tu perfil, y pedirnos que eliminemos tu cuenta y la información asociada. Conservamos solo lo que la ley nos obliga a guardar, como los comprobantes de pago.',
        en: 'You can view and correct your data from Your profile, and ask us to delete your account and associated information. We keep only what the law requires, such as payment receipts.',
      },
    ],
  },
  {
    id: 'contact',
    title: { es: 'Contacto', en: 'Contact' },
    body: [
      {
        es: 'Si tienes preguntas sobre esta política escríbenos a privacidad@blacksixmiami.com o llama al +1 (305) 555-0142.',
        en: 'If you have questions about this policy write to privacidad@blacksixmiami.com or call +1 (305) 555-0142.',
      },
    ],
  },
];

// ---------------------------------------------------------------- invite

export const inviteCode = 'ANDREA10';
export const inviteReward = 10;

export interface InviteContact {
  id: string;
  name: string;
  phone: string;
}

export const inviteContacts: InviteContact[] = [
  { id: 'c1', name: 'Carla Schoen', phone: '(786) 555-0119' },
  { id: 'c2', name: 'Esteban Rojas', phone: '(305) 555-0122' },
  { id: 'c3', name: 'Roberto Fox', phone: '(954) 555-0108' },
  { id: 'c4', name: 'Jacobo Jiménez', phone: '(786) 555-0116' },
  { id: 'c5', name: 'Darlene Robertson', phone: '(305) 555-0129' },
  { id: 'c6', name: 'Ralph Edwards', phone: '(954) 555-0106' },
];
