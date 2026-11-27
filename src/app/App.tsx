import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import type { Locale } from '../i18n/locale';
import { AppProviders, type ThemeMode } from '../theme/AppProviders';
import { bs } from '../theme/theme';
import { AnimatePresence, MotionConfig, motion, type Variants } from 'motion/react';
import { BottomNav } from '../components/navigation/BottomNav/BottomNav';
import { conversations } from '../screens/messages/data';
import { NavProvider, ShellNavContext, tabOf, useNav, type Nav, type Route } from './nav';
import { ScreenSkeleton, skeletonFor } from './ScreenSkeleton';
import { routes } from './routes';
import { SettingsProvider } from './settings';

function read<T extends string>(key: string, fallback: T): T {
  try {
    return (localStorage.getItem(key) as T | null) ?? fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode: settings just don't persist */
  }
}

// ponytail: fake latency so the skeletons are visible; replace with real loading state when the backend lands.
const SKELETON_MS = 450;
const MIN_SPLASH_MS = 1400;

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]; // easing.enter
const variants: Variants = {
  enter: (a: Nav['action']) => (a === 'reset' ? { opacity: 0, scale: 0.98 } : { opacity: 0, x: a === 'push' ? 48 : -48 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.32, ease } },
  exit: (a: Nav['action']) => ({ opacity: 0, x: a === 'reset' ? 0 : a === 'push' ? -24 : 24, transition: { duration: 0.15, ease: 'easeIn' } }),
};

/** One screen: its skeleton first (on push/reset), then the content fading in. */
function Screen({ route, action }: { route: Route; action: Nav['action'] }) {
  const kind = action === 'pop' ? undefined : skeletonFor(route.name);
  const [ready, setReady] = useState(!kind);
  useEffect(() => {
    if (ready) return;
    const id = setTimeout(() => setReady(true), SKELETON_MS);
    return () => clearTimeout(id);
  }, [ready]);
  const render = routes[route.name] ?? routes.home;
  return (
    <AnimatePresence mode="wait" initial={false}>
      {ready || !kind ? (
        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.22 } }} style={column}>
          {render(route.params ?? {})}
        </motion.div>
      ) : (
        <motion.div key="skeleton" exit={{ opacity: 0, transition: { duration: 0.09 } }} style={column}>
          <ScreenSkeleton kind={kind} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const unreadChats = conversations.reduce((n, c) => n + c.unread, 0);
const column = { flex: 1, display: 'flex', flexDirection: 'column' } as const;

function CurrentScreen() {
  const { route, depth, action, reset } = useNav();
  // Splash doubles as the preloader: fonts ready + a minimum beat, then Welcome.
  useEffect(() => {
    if (route.name !== 'splash') return;
    let alive = true;
    Promise.all([document.fonts?.ready, new Promise((r) => setTimeout(r, MIN_SPLASH_MS))]).then(() => alive && reset('welcome'));
    return () => {
      alive = false;
    };
  }, [route, reset]);
  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: bs.surface.canvas, color: bs.text.primary, overflowX: 'clip' }}>
      <AnimatePresence mode="wait" initial={false} custom={action} onExitComplete={() => scrollTo(0, 0)}>
        <motion.div key={`${depth}:${route.name}:${JSON.stringify(route.params ?? {})}`} custom={action} variants={variants} initial="enter" animate="center" exit="exit" style={column}>
          <Screen route={route} action={action} />
        </motion.div>
      </AnimatePresence>
      {/* One persistent bar for the tab roots: it stays put (with the active tab) while screens animate and load. */}
      {tabOf[route.name] && <BottomNav shell side="client" value={tabOf[route.name]} badges={{ chat: unreadChats }} />}
    </Box>
  );
}

export function App() {
  const [mode, setModeState] = useState<ThemeMode>(() => read('bs-mode', 'system'));
  const [locale, setLocaleState] = useState<Locale>(() => read('bs-locale', 'es'));
  const settings = {
    mode,
    locale,
    setMode: (m: ThemeMode) => (setModeState(m), write('bs-mode', m)),
    setLocale: (l: Locale) => (setLocaleState(l), write('bs-locale', l)),
  };
  return (
    <SettingsProvider value={settings}>
      <AppProviders mode={mode} locale={locale}>
        <MotionConfig reducedMotion="user">
          <NavProvider initial={{ name: 'splash' }}>
            <ShellNavContext value>
              <CurrentScreen />
            </ShellNavContext>
          </NavProvider>
        </MotionConfig>
      </AppProviders>
    </SettingsProvider>
  );
}
