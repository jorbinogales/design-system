import type { Locale } from '../i18n/locale';
import type { ThemeMode } from '../theme/AppProviders';

/** Toolbar value that renders every story twice: light and dark, side by side. */
export const SIDE_BY_SIDE = 'side-by-side';

export type ThemeGlobal = ThemeMode | typeof SIDE_BY_SIDE;

export interface BsGlobals {
  theme: ThemeGlobal;
  locale: Locale;
}

export const defaultGlobals: BsGlobals = { theme: 'light', locale: 'es' };

/** Reads `?globals=theme:dark;locale:en` from the preview iframe URL. */
export function readUrlGlobals(search: string): Partial<BsGlobals> {
  const raw = new URLSearchParams(search).get('globals');
  if (!raw) return {};
  const out: Record<string, string> = {};
  for (const pair of raw.split(';')) {
    const [key, value] = pair.split(':');
    if (key && value) out[key] = value;
  }
  const theme = ['light', 'dark', 'system', SIDE_BY_SIDE].includes(out.theme ?? '') ? (out.theme as ThemeGlobal) : undefined;
  const locale = out.locale === 'en' || out.locale === 'es' ? out.locale : undefined;
  return { ...(theme && { theme }), ...(locale && { locale }) };
}
