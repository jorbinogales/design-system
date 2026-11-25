import type { L } from '../profile/ui';

export type NotificationKind = 'booking-confirmed' | 'operator-assigned' | 'auction-pickup' | 'payment' | 'reminder' | 'promo';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  group: 'today' | 'yesterday';
  title: L;
  body: L;
  /** Relative time label ("12 min"). */
  time: L;
  unread: boolean;
}

export const notificationItems: NotificationItem[] = [
  {
    id: 'n1',
    kind: 'booking-confirmed',
    group: 'today',
    title: { es: 'Reserva confirmada', en: 'Booking confirmed' },
    body: {
      es: 'Tu Detailing Premium del viernes 27 de noviembre a las 10:00 a. m. en Black Six Doral quedó confirmado. Referencia BS-24117.',
      en: 'Your Premium Detailing on Friday, November 27 at 10:00 AM at Black Six Doral is confirmed. Reference BS-24117.',
    },
    time: { es: 'hace 12 min', en: '12 min ago' },
    unread: true,
  },
  {
    id: 'n2',
    kind: 'operator-assigned',
    group: 'today',
    title: { es: 'Operador asignado', en: 'Operator assigned' },
    body: {
      es: 'Andrés Molina será tu operador para tu Personal Washing del sábado 28 a las 9:00 a. m. Puedes escribirle desde Chat.',
      en: 'Andrés Molina will be your operator for your Personal Washing on Saturday the 28th at 9:00 AM. You can message him from Chat.',
    },
    time: { es: 'hace 1 h', en: '1 h ago' },
    unread: true,
  },
  {
    id: 'n3',
    kind: 'payment',
    group: 'today',
    title: { es: 'Pago recibido', en: 'Payment received' },
    body: {
      es: 'Recibimos tu pago de $95.00 con Visa •••• 4242 por tu Personal Washing Completo, BS-24118. Ya está disponible tu comprobante.',
      en: 'We received your $95.00 payment with Visa •••• 4242 for your Complete Personal Washing, BS-24118. Your receipt is ready.',
    },
    time: { es: 'hace 3 h', en: '3 h ago' },
    unread: false,
  },
  {
    id: 'n4',
    kind: 'auction-pickup',
    group: 'yesterday',
    title: { es: 'Recibimos tu solicitud de recogida', en: 'We received your pickup request' },
    body: {
      es: 'Recogida en subasta BS-24120 · Copart Miami South · lote 05503318 para tu Toyota RAV4, lunes 30 a las 2:00 p. m. Pendiente de confirmación.',
      en: 'Auction pickup BS-24120 · Copart Miami South · lot 05503318 for your Toyota RAV4, Monday the 30th at 2:00 PM. Pending confirmation.',
    },
    time: { es: 'ayer, 4:35 p. m.', en: 'Yesterday, 4:35 PM' },
    unread: false,
  },
  {
    id: 'n5',
    kind: 'reminder',
    group: 'yesterday',
    title: { es: 'Recordatorio de cita', en: 'Appointment reminder' },
    body: {
      es: 'Te esperamos el viernes 27 a las 10:00 a. m. en Black Six Doral con tu RAV4. El jueves 26, por Acción de Gracias, estamos cerrados.',
      en: 'We expect you on Friday the 27th at 10:00 AM at Black Six Doral with your RAV4. We are closed on Thursday the 26th for Thanksgiving.',
    },
    time: { es: 'ayer, 9:00 a. m.', en: 'Yesterday, 9:00 AM' },
    unread: false,
  },
  {
    id: 'n6',
    kind: 'promo',
    group: 'yesterday',
    title: { es: 'Premium con 15 % menos', en: '15% off Premium' },
    body: {
      es: 'Detailing Premium en cualquier centro, de lunes a miércoles, hasta el 15 de diciembre. El descuento se aplica solo al pagar.',
      en: 'Premium Detailing at any center, Monday to Wednesday, until December 15. The discount applies automatically at checkout.',
    },
    time: { es: 'ayer, 8:15 a. m.', en: 'Yesterday, 8:15 AM' },
    unread: false,
  },
];
