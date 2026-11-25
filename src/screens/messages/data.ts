import type { BusinessUnit } from '../../domain/units';
import type { Locale } from '../../i18n/locale';

type L = Record<Locale, string>;

export interface ConversationBooking {
  /** Booking reference, e.g. BS-24117. */
  code: string;
  /** Auction lot, only for Towing. Always a string: keeps leading zeros. */
  lot?: string;
  unit: BusinessUnit;
  /** What the booking is, one line. */
  title: L;
  /** Secondary line: vehicle and route or place. */
  detail: L;
}

export interface Conversation {
  id: string;
  name: string;
  kind: 'support' | 'professional' | 'center';
  role: L;
  online: boolean;
  /** Last message preview. */
  last: L;
  lastFromMe?: boolean;
  /** Time or day shown in the list. */
  when: L;
  unread: number;
  booking?: ConversationBooking;
}

export const conversations: Conversation[] = [
  {
    id: 'mateo',
    name: 'Mateo Salazar',
    kind: 'professional',
    role: { es: 'Conductor de Towing', en: 'Towing driver' },
    online: true,
    last: { es: 'Listo, el lunes 30 salgo hacia Copart Miami South y te aviso apenas recoja tu RAV4.', en: 'All set, on Monday the 30th I head to Copart Miami South and will message you as soon as I pick up your RAV4.' },
    when: { es: '9:41 a. m.', en: '9:41 AM' },
    unread: 2,
    booking: {
      code: 'BS-24120',
      lot: '05503318',
      unit: 'towing',
      title: { es: 'Recogida en subasta', en: 'Auction pickup' },
      detail: { es: 'Toyota RAV4 2022 · Copart Miami South a Doral', en: 'Toyota RAV4 2022 · Copart Miami South to Doral' },
    },
  },
  {
    id: 'soporte',
    name: 'Soporte Black Seat',
    kind: 'support',
    role: { es: 'Atención al cliente', en: 'Customer support' },
    online: true,
    last: { es: 'El pago con tarjeta de tu lavado del sábado quedó registrado. ¿Hay algo más en lo que podamos ayudarte?', en: 'The card payment for your Saturday wash is recorded. Is there anything else we can help with?' },
    when: { es: 'Ayer', en: 'Yesterday' },
    unread: 0,
  },
  {
    id: 'doral',
    name: 'Black Seat Doral',
    kind: 'center',
    role: { es: 'Centro de Detailing', en: 'Detailing center' },
    online: false,
    last: { es: 'Tu Detailing Premium del viernes 27 a las 10:00 a. m. está confirmado. Te enviamos los datos para el pago por Zelle.', en: 'Your Premium Detailing on Friday the 27th at 10:00 AM is confirmed. We sent you the Zelle payment details.' },
    when: { es: 'Ayer', en: 'Yesterday' },
    unread: 1,
    booking: {
      code: 'BS-24117',
      unit: 'detailing',
      title: { es: 'Detailing Premium', en: 'Premium Detailing' },
      detail: { es: 'Toyota RAV4 · Black Seat Doral', en: 'Toyota RAV4 · Black Seat Doral' },
    },
  },
  {
    id: 'andres',
    name: 'Andrés Molina',
    kind: 'professional',
    role: { es: 'Personal Washing', en: 'Personal Washing' },
    online: false,
    last: { es: 'El sábado a las 9:00 a. m. llego a tu casa en Doral. Te escribo al salir.', en: 'On Saturday at 9:00 AM I will be at your home in Doral. I will message you when I set off.' },
    when: { es: 'lun', en: 'Mon' },
    unread: 0,
    booking: {
      code: 'BS-24118',
      unit: 'personal-washing',
      title: { es: 'Lavado Completo a domicilio', en: 'Complete wash at home' },
      detail: { es: 'Honda Civic 2019 · 7845 NW 36th St, Apt 210', en: 'Honda Civic 2019 · 7845 NW 36th St, Apt 210' },
    },
  },
  {
    id: 'brickell',
    name: 'Black Seat Brickell',
    kind: 'center',
    role: { es: 'Centro de Detailing', en: 'Detailing center' },
    online: false,
    last: { es: 'Hola, Andrea. Tu cita del 3 de dic. sigue en pie, pero el pago con tarjeta falló. ¿Lo reintentas?', en: 'Hi, Andrea. Your Dec 3 appointment still stands, but the card payment failed. Can you try again?' },
    lastFromMe: false,
    when: { es: 'mar', en: 'Tue' },
    unread: 0,
  },
];

export type ThreadMessage =
  | { id: string; from: 'them' | 'me'; time: L; kind: 'text'; text: L; read?: boolean }
  | { id: string; from: 'them' | 'me'; time: L; kind: 'photo'; alt: L; read?: boolean }
  | { id: string; from: 'them' | 'me'; time: L; kind: 'voice'; duration: number; read?: boolean };

/** Thread with the Towing driver for BS-24120 (Copart Miami South, lot 05503318, pickup code 0071, Monday Nov 30). */
export const mateoThread: ThreadMessage[] = [
  {
    id: 'm1',
    from: 'them',
    kind: 'text',
    time: { es: '9:12 a. m.', en: '9:12 AM' },
    text: {
      es: 'Buen día, Andrea. Soy Mateo, tu conductor de Towing. El lunes 30 iré a Copart Miami South por tu RAV4, lote 05503318.',
      en: 'Good morning, Andrea. I am Mateo, your Towing driver. On Monday the 30th I will go to Copart Miami South for your RAV4, lot 05503318.',
    },
  },
  { id: 'm2', from: 'me', kind: 'text', time: { es: '9:14 a. m.', en: '9:14 AM' }, read: true, text: { es: 'Perfecto, Mateo. El código de recogida es 0071.', en: 'Perfect, Mateo. The pickup code is 0071.' } },
  { id: 'm3', from: 'them', kind: 'text', time: { es: '9:31 a. m.', en: '9:31 AM' }, text: { es: 'Recibido. Confirmo con el patio que el lote esté liberado antes del lunes.', en: 'Got it. I will confirm with the yard that the lot is released before Monday.' } },
  { id: 'm4', from: 'them', kind: 'photo', time: { es: '9:38 a. m.', en: '9:38 AM' }, alt: { es: 'Foto de la grúa de plataforma que irá por tu Toyota RAV4', en: 'Photo of the flatbed truck that will pick up your Toyota RAV4' } },
  { id: 'm5', from: 'me', kind: 'voice', time: { es: '9:40 a. m.', en: '9:40 AM' }, duration: 13, read: true },
  {
    id: 'm6',
    from: 'them',
    kind: 'text',
    time: { es: '9:41 a. m.', en: '9:41 AM' },
    text: { es: 'Listo, el lunes 30 salgo hacia Copart Miami South y te aviso apenas recoja tu RAV4.', en: 'All set, on Monday the 30th I head to Copart Miami South and will message you as soon as I pick up your RAV4.' },
  },
];

/** Bar heights (0-1) of the voice-note waveform; fixed so the story is deterministic. */
export const waveform = [0.3, 0.5, 0.8, 0.4, 0.65, 0.9, 0.55, 0.35, 0.7, 1, 0.6, 0.45, 0.8, 0.5, 0.3, 0.6, 0.85, 0.4, 0.55, 0.75, 0.35, 0.5, 0.65, 0.3];

export const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
