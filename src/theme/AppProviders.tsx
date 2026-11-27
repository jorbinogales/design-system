import '@fontsource-variable/archivo/wdth.css';
import 'dayjs/locale/es';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, useColorScheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, type ReactNode } from 'react';
import { LocaleProvider, type Locale } from '../i18n/locale';
import { themes } from './theme';

export type ThemeMode = 'light' | 'dark' | 'system';

/** Keeps MUI's color scheme in step with the mode chosen outside (Storybook toolbar, app settings). */
function ModeSync({ mode }: { mode: ThemeMode }) {
  const { setMode } = useColorScheme();
  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);
  return null;
}

/** Keeps `<html lang>` in step so screen readers pronounce ES/EN correctly. */
function LangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}

interface AppProvidersProps {
  mode?: ThemeMode;
  locale?: Locale;
  children: ReactNode;
}

/**
 * Everything a Black Seat tree needs: theme (per locale), CSS baseline, color mode,
 * date-picker localization (dayjs) and the ES/EN locale context.
 */
export function AppProviders({ mode = 'system', locale = 'es', children }: AppProvidersProps) {
  return (
    <ThemeProvider theme={themes[locale]} defaultMode={mode} storageManager={null}>
      <CssBaseline enableColorScheme />
      <ModeSync mode={mode} />
      <LangSync locale={locale} />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
