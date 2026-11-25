import { createContext, useContext, type ReactNode } from 'react';

export type Locale = 'es' | 'en';

/** Colocated copy for one component: `{ es: {...}, en: {...} }`. */
export type Messages<T> = Record<Locale, T>;

const LocaleContext = createContext<Locale>('es');

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export const useLocale = () => useContext(LocaleContext);

/** Returns the active-locale entry of a colocated dictionary. */
export function useT<T>(messages: Messages<T>): T {
  return messages[useLocale()];
}
