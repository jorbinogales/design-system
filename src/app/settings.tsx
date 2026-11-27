import { createContext, useContext } from 'react';
import type { Locale } from '../i18n/locale';
import type { ThemeMode } from '../theme/AppProviders';

export interface Settings {
  mode: ThemeMode;
  locale: Locale;
  setMode: (m: ThemeMode) => void;
  setLocale: (l: Locale) => void;
}

const noop = () => {};
const SettingsContext = createContext<Settings>({ mode: 'system', locale: 'es', setMode: noop, setLocale: noop });
export const SettingsProvider = SettingsContext;
/** App-level appearance and language. Inert in Storybook (toolbar drives it there). */
export const useSettings = () => useContext(SettingsContext);
