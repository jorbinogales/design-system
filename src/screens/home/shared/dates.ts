import { intlLocale } from '../../../i18n/format';
import type { Locale } from '../../../i18n/locale';

/** "2026-12-15" → "15 dic" / "Dec 15". Date-only strings are read as UTC so the day never shifts. */
export const blackSixDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(intlLocale[locale], { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso.slice(0, 10)}T00:00:00Z`)).replace(/\./g, '');
