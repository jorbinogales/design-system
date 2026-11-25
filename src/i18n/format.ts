import type { Locale } from './locale';

/** BCP-47 tag used for Intl formatting. US market: Spanish (US) and English (US). */
export const intlLocale: Record<Locale, string> = { es: 'es-US', en: 'en-US' };

/** `formatMoney(89, 'es')` → "$89.00". Amounts are in major units (dollars, not cents). */
export function formatMoney(amount: number, locale: Locale, currency = 'USD'): string {
  return new Intl.NumberFormat(intlLocale[locale], { style: 'currency', currency }).format(amount);
}

/** Plain number with locale grouping: `formatNumber(1250, 'es')` → "1,250". */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale]).format(value);
}
