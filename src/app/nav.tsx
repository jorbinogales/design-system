import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

/** One entry of the in-app stack. `params` carries ids (unit, booking, conversation…) between screens. */
export interface Route {
  name: string;
  params?: Record<string, string>;
}

export interface Nav {
  route: Route;
  /** Stack size and how we got here; drives the screen transition direction. */
  depth: number;
  action: 'push' | 'pop' | 'reset';
  /** Push a screen. */
  go: (name: string, params?: Record<string, string>) => void;
  /** Pop one screen (same as Android back). */
  back: () => void;
  /** Replace the whole stack: bottom-nav tabs, finishing a flow, signing in/out. */
  reset: (name: string, params?: Record<string, string>) => void;
}

const noop = () => {};
/** Outside the app (Storybook) navigation is inert, so screens keep working as isolated stories. */
const inert: Nav = { route: { name: '' }, depth: 1, action: 'reset', go: noop, back: noop, reset: noop };

const NavContext = createContext<Nav>(inert);
export const useNav = () => useContext(NavContext);

/** True inside the app shell, which draws one persistent BottomNav; screens' own BottomNav then renders nothing. */
export const ShellNavContext = createContext(false);

/** Bottom-nav tab each root route belongs to. */
export const tabOf: Record<string, string> = {
  home: 'home', explore: 'explore', bookings: 'bookings', 'active-bookings': 'bookings', 'completed-bookings': 'bookings', 'cancelled-bookings': 'bookings', chat: 'chat', profile: 'profile',
};

/**
 * Stack navigation on top of the History API: every `go` is a pushState, so the Android back button
 * (Capacitor calls WebView.goBack) and browser back pop the stack with no native plugin.
 */
export function NavProvider({ initial, children }: { initial: Route; children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([initial]);
  const [action, setAction] = useState<Nav['action']>('reset');

  useEffect(() => {
    history.replaceState({ depth: 0 }, '');
    const onPop = (e: PopStateEvent) => {
      const depth = (e.state?.depth as number | undefined) ?? 0;
      setAction('pop');
      setStack((s) => s.slice(0, Math.max(1, depth + 1)));
    };
    addEventListener('popstate', onPop);
    // Android back (MainActivity): pop one screen; false at the root so the activity closes.
    const w = window as Window & { bsBack?: () => boolean };
    w.bsBack = () => {
      if ((history.state?.depth ?? 0) > 0) return history.back(), true;
      // At a tab root other than Inicio, back goes to Inicio; only Inicio (or a pre-login root) leaves the app.
      const name = routeRef.current.name;
      if (tabOf[name] && name !== 'home') return resetRef.current('home'), true;
      return false;
    };
    return () => {
      removeEventListener('popstate', onPop);
      delete w.bsBack;
    };
  }, []);

  const go = useCallback((name: string, params?: Record<string, string>) => {
    setAction('push');
    setStack((s) => {
      history.pushState({ depth: s.length }, '');
      return [...s, { name, params }];
    });
  }, []);

  const back = useCallback(() => {
    if ((history.state?.depth ?? 0) > 0) history.back();
  }, []);

  const reset = useCallback((name: string, params?: Record<string, string>) => {
    // ponytail: leaves old history entries behind; popstate clamps to depth so back past root is a no-op.
    history.replaceState({ depth: 0 }, '');
    setAction('reset');
    setStack([{ name, params }]);
  }, []);

  const route = stack[stack.length - 1];
  const routeRef = useRef(route);
  routeRef.current = route;
  const resetRef = useRef(reset);
  resetRef.current = reset;
  const depth = stack.length;
  const value = useMemo(() => ({ route, depth, action, go, back, reset }), [route, depth, action, go, back, reset]);
  return <NavContext value={value}>{children}</NavContext>;
}
