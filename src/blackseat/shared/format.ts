import { intlLocale } from '../../i18n/format';
import type { Locale } from '../../i18n/locale';
import { formatSlotTime } from '../../components/date-time/TimeSlot/TimeSlot';

/** Date-only ISO ("2026-11-25") → UTC date so the calendar day never shifts with the viewer's time zone. */
const utc = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);

export function formatDateLong(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(utc(iso));
}

export function formatDateShort(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(utc(iso)).replace(/\./g, '');
}

export function formatDateMedium(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(utc(iso)).replace(/\./g, '');
}

export const monthShort = (iso: string, locale: Locale) => new Intl.DateTimeFormat(intlLocale[locale], { month: 'short', timeZone: 'UTC' }).format(utc(iso)).replace(/\./g, '');
export const weekdayShort = (iso: string, locale: Locale) => new Intl.DateTimeFormat(intlLocale[locale], { weekday: 'short', timeZone: 'UTC' }).format(utc(iso)).replace(/\./g, '');
export const dayNumber = (iso: string) => String(utc(iso).getUTCDate());

/** "2026-11-25T14:05" → "Nov 25 · 2:05 PM". */
export function formatDateTime(iso: string, locale: Locale): string {
  return `${formatDateShort(iso, locale)} · ${formatSlotTime(iso.slice(11, 16), locale)}`;
}

/** 150 → "2 h 30 min"; 45 → "45 min". */
export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`;
}

/** "08:00–18:00" → "8:00 a. m. – 6:00 p. m.". */
export function formatHoursRange(range: string, locale: Locale, closed: string): string {
  if (!range) return closed;
  const [from, to] = range.split('–');
  return `${formatSlotTime(from, locale)} – ${formatSlotTime(to, locale)}`;
}

/** Adds `min` minutes to "HH:mm". */
export function addMinutes(time: string, min: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + min;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export const auctionLabel = { copart: 'Copart', iaa: 'IAA' } as const;
