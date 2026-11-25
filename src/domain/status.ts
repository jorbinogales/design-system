import type { Locale } from '../i18n/locale';
import type { StatusTone } from '../theme/tokens';

/**
 * Three independent status dimensions (brief §5). A booking can be confirmed, awaiting
 * assignment and with payment pending at the same time, so never merge them into one field.
 * The exact list still needs business validation (see brief: does choosing a payment method
 * confirm the booking, or does Black Seat charge inside the PWA?).
 */
export const bookingStatuses = ['pending_confirmation', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const;
export const assignmentStatuses = ['unassigned', 'assigned'] as const;
export const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'] as const;

export type BookingStatus = (typeof bookingStatuses)[number];
export type AssignmentStatus = (typeof assignmentStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];

export interface StatusByDimension {
  booking: BookingStatus;
  assignment: AssignmentStatus;
  payment: PaymentStatus;
}
export type StatusDimension = keyof StatusByDimension;

export interface StatusMeta {
  /** Color tone; meaning is always carried by `label` + icon too, never color alone. */
  tone: StatusTone;
  /** Short label for badges, tables and operator views. */
  label: Record<Locale, string>;
  /** Longer customer-facing wording, when it differs. */
  longLabel?: Record<Locale, string>;
  /** One sentence for tooltips, history entries and screen readers. */
  description: Record<Locale, string>;
}

export const statusMeta: { [D in StatusDimension]: Record<StatusByDimension[D], StatusMeta> } = {
  booking: {
    pending_confirmation: {
      tone: 'warning',
      label: { es: 'Pendiente de confirmación', en: 'Awaiting confirmation' },
      description: { es: 'Recibimos la solicitud; falta confirmar fecha y hora.', en: 'We have the request; date and time still need confirming.' },
    },
    confirmed: {
      tone: 'info',
      label: { es: 'Confirmada', en: 'Confirmed' },
      description: { es: 'La fecha y la hora están reservadas.', en: 'The date and time are booked.' },
    },
    in_progress: {
      tone: 'brand',
      label: { es: 'En curso', en: 'In progress' },
      description: { es: 'El servicio se está realizando ahora.', en: 'The service is under way.' },
    },
    completed: {
      tone: 'success',
      label: { es: 'Completada', en: 'Completed' },
      description: { es: 'El servicio terminó.', en: 'The service is finished.' },
    },
    cancelled: {
      tone: 'neutral',
      label: { es: 'Cancelada', en: 'Cancelled' },
      description: { es: 'La reserva se canceló y no se realizará.', en: 'The booking was cancelled and will not take place.' },
    },
  },
  assignment: {
    unassigned: {
      tone: 'warning',
      label: { es: 'Sin asignar', en: 'Unassigned' },
      longLabel: { es: 'Pendiente de asignación', en: 'Awaiting assignment' },
      description: { es: 'Aún no hay un profesional asignado.', en: 'No professional has been assigned yet.' },
    },
    assigned: {
      tone: 'success',
      label: { es: 'Asignada', en: 'Assigned' },
      description: { es: 'Un profesional tiene este trabajo.', en: 'A professional has this job.' },
    },
  },
  payment: {
    pending: {
      tone: 'warning',
      label: { es: 'Pago pendiente', en: 'Payment pending' },
      description: { es: 'El pago aún no se ha recibido.', en: 'Payment has not been received yet.' },
    },
    paid: {
      tone: 'success',
      label: { es: 'Pagado', en: 'Paid' },
      description: { es: 'Recibimos el pago completo.', en: 'Payment received in full.' },
    },
    failed: {
      tone: 'danger',
      label: { es: 'Pago fallido', en: 'Payment failed' },
      description: { es: 'El cobro no se completó; hay que reintentar o cambiar el método.', en: 'The charge did not go through; retry or change the method.' },
    },
    refunded: {
      tone: 'info',
      label: { es: 'Reembolsado', en: 'Refunded' },
      description: { es: 'Devolvimos el importe al método de pago.', en: 'The amount was returned to the payment method.' },
    },
  },
};

/** Metadata for one status of one dimension. */
export function getStatusMeta<D extends StatusDimension>(dimension: D, status: StatusByDimension[D]): StatusMeta {
  return (statusMeta[dimension] as Record<string, StatusMeta>)[status];
}

/** Localized label; `long` prefers the customer-facing wording when one exists. */
export function getStatusLabel<D extends StatusDimension>(dimension: D, status: StatusByDimension[D], locale: Locale, long = false): string {
  const meta = getStatusMeta(dimension, status);
  return (long && meta.longLabel ? meta.longLabel : meta.label)[locale];
}

/** Localized names of the dimensions themselves (for visually hidden prefixes and table headers). */
export const dimensionLabel: Record<StatusDimension, Record<Locale, string>> = {
  booking: { es: 'Reserva', en: 'Booking' },
  assignment: { es: 'Asignación', en: 'Assignment' },
  payment: { es: 'Pago', en: 'Payment' },
};
