/**
 * Black Seat design tokens (source of truth).
 *
 * The first block of every color scheme is the brand brief's table, verbatim:
 * orange #FF5000, charcoal #111111 and white #FFFFFF as the base.
 * Orange buttons always carry charcoal text (5.75:1); white on orange is only 3.28:1.
 *
 * Everything after `border.subtle` extends the brief. Every text/background pair is
 * contrast-checked by `node scripts/contrast.mjs` (WCAG AA).
 *
 * Rule: raw hex values live only in `src/theme/**`. Components read tokens through
 * `bs` (CSS variables, see `theme.ts`) so light, dark and scoped subtrees just work.
 */

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';

export interface ToneColors {
  /** Soft background of badges, banners and inline alerts. */
  bg: string;
  /** Text and icon on `bg` (AA 4.5:1). */
  fg: string;
  /** Hairline around the soft background. */
  border: string;
  /** Solid mark: dots, icons on canvas, progress (3:1 on canvas). */
  solid: string;
}

export interface ColorScheme {
  // ── Brief (verbatim) ──────────────────────────────────────────────
  brand: { primary: string };
  action: {
    primary: { bg: string; fg: string; hover: string; pressed: string };
    // ── Extensions ──
    secondary: { bg: string; fg: string; hover: string; pressed: string };
    destructive: { bg: string; fg: string; hover: string; pressed: string };
    /** Translucent wash for quiet buttons, rows and icon buttons. */
    hover: string;
    pressed: string;
  };
  surface: {
    canvas: string;
    subtle: string;
    raised: string;
    // ── Extensions ──
    /** Black header ("encabezado negro") and other inverse blocks. */
    inverse: string;
    /** Secondary fill one step above `subtle` (track of segmented control, skeleton). */
    muted: string;
  };
  text: {
    primary: string;
    secondary: string;
    link: string;
    // ── Extensions ──
    /** Disabled text. Exempt from contrast rules, still kept legible. */
    disabled: string;
    /** Text on `action.destructive.bg`. */
    onDestructive: string;
  };
  selection: { bg: string; border: string };
  border: {
    subtle: string;
    // ── Extensions ──
    /** Control outlines (checkbox, radio, switch track, outlined icon button): 3:1 on canvas. */
    strong: string;
    /** Field outline at rest. Invisible in light (matches the fill), hairline in dark. */
    field: string;
  };
  // ── Extensions ──────────────────────────────────────────────────────
  status: Record<StatusTone, ToneColors>;
  focus: {
    /** Keyboard focus ring: ≥3:1 on canvas, subtle and raised. */
    ring: string;
  };
  /** Backdrop behind dialogs and bottom sheets. */
  scrim: string;
  disabled: { bg: string; fg: string; border: string };
  /** Shadow recipes; dark mode leans on surface steps, shadows only add depth. */
  elevation: { e0: string; e1: string; e2: string; e3: string };
}

const lightStatus: Record<StatusTone, ToneColors> = {
  success: { bg: '#E7F6EC', fg: '#136C34', border: '#A9DDBA', solid: '#1E8E47' },
  warning: { bg: '#FFF4D6', fg: '#734A00', border: '#F0CF7A', solid: '#A86F00' },
  danger: { bg: '#FDECEC', fg: '#A8161C', border: '#F3B5B7', solid: '#D0201A' },
  info: { bg: '#E8F1FD', fg: '#1452A6', border: '#B4CEF4', solid: '#2F6FD6' },
  neutral: { bg: '#EEEFF1', fg: '#45474B', border: '#D3D5D8', solid: '#6B6E72' },
  brand: { bg: '#FFF0E8', fg: '#A33200', border: '#FFC4A6', solid: '#FF5000' },
};

const darkStatus: Record<StatusTone, ToneColors> = {
  success: { bg: '#10261A', fg: '#6FD495', border: '#24523A', solid: '#3DBA6B' },
  warning: { bg: '#2B2210', fg: '#F2C14E', border: '#5A4719', solid: '#E0A82E' },
  danger: { bg: '#2E1515', fg: '#FF8A85', border: '#5E2A2A', solid: '#F2554F' },
  info: { bg: '#13213A', fg: '#8AB6FF', border: '#2A4675', solid: '#5B95F5' },
  neutral: { bg: '#242424', fg: '#C4C6C9', border: '#3D3D3D', solid: '#8E9196' },
  brand: { bg: '#381D12', fg: '#FF8A55', border: '#6B3115', solid: '#FF6926' },
};

export const color: Record<'light' | 'dark', ColorScheme> = {
  light: {
    brand: { primary: '#FF5000' },
    action: {
      primary: { bg: '#FF5000', fg: '#111111', hover: '#FF6926', pressed: '#E84900' },
      secondary: { bg: '#EDEEF0', fg: '#111111', hover: '#E2E4E7', pressed: '#D6D9DC' },
      destructive: { bg: '#C4161C', fg: '#FFFFFF', hover: '#D9262C', pressed: '#A81217' },
      hover: 'rgba(17, 17, 17, 0.06)',
      pressed: 'rgba(17, 17, 17, 0.11)',
    },
    surface: {
      canvas: '#FFFFFF',
      subtle: '#F4F5F6',
      raised: '#FFFFFF',
      inverse: '#111111',
      muted: '#EBECEE',
    },
    text: {
      primary: '#111111',
      secondary: '#57595D',
      link: '#B33700',
      disabled: '#9A9DA1',
      onDestructive: '#FFFFFF',
    },
    selection: { bg: '#FFF0E8', border: '#FF5000' },
    border: { subtle: '#DFE1E3', strong: '#7C7F84', field: '#F4F5F6' },
    status: lightStatus,
    focus: { ring: '#B33700' },
    scrim: 'rgba(17, 17, 17, 0.52)',
    disabled: { bg: '#EDEEF0', fg: '#9A9DA1', border: '#DFE1E3' },
    elevation: {
      e0: 'none',
      e1: '0 1px 2px rgba(17, 17, 17, 0.06), 0 1px 3px rgba(17, 17, 17, 0.04)',
      e2: '0 6px 16px -4px rgba(17, 17, 17, 0.10), 0 2px 4px rgba(17, 17, 17, 0.05)',
      e3: '0 24px 48px -12px rgba(17, 17, 17, 0.22), 0 6px 14px rgba(17, 17, 17, 0.08)',
    },
  },
  dark: {
    brand: { primary: '#FF5000' },
    action: {
      primary: { bg: '#FF5000', fg: '#111111', hover: '#FF6926', pressed: '#E84900' },
      secondary: { bg: '#2E2E2E', fg: '#FFFFFF', hover: '#383838', pressed: '#424242' },
      destructive: { bg: '#F2554F', fg: '#111111', hover: '#F56E69', pressed: '#E34E48' },
      hover: 'rgba(255, 255, 255, 0.07)',
      pressed: 'rgba(255, 255, 255, 0.12)',
    },
    surface: {
      canvas: '#111111',
      subtle: '#1C1C1C',
      raised: '#282828',
      inverse: '#000000',
      muted: '#242424',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B8BABD',
      link: '#FF8A55',
      disabled: '#6B6E72',
      onDestructive: '#111111',
    },
    selection: { bg: '#381D12', border: '#FF6926' },
    border: { subtle: '#383838', strong: '#7A7D82', field: '#383838' },
    status: darkStatus,
    focus: { ring: '#FF8A55' },
    scrim: 'rgba(0, 0, 0, 0.66)',
    disabled: { bg: '#232323', fg: '#6B6E72', border: '#333333' },
    elevation: {
      e0: 'none',
      e1: '0 1px 2px rgba(0, 0, 0, 0.5)',
      e2: '0 8px 20px -6px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)',
      e3: '0 28px 56px -12px rgba(0, 0, 0, 0.72), 0 8px 16px rgba(0, 0, 0, 0.5)',
    },
  },
};

// ── Typography ───────────────────────────────────────────────────────
/** Archivo (variable: weight 100–900, width 62–125%). Self-hosted via @fontsource-variable/archivo/wdth.css. */
export const fontFamily = {
  sans: "'Archivo Variable', 'Archivo', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

export interface TypeStyle {
  fontSize: string;
  lineHeight: number;
  fontWeight: number;
  letterSpacing?: string;
  fontStretch?: string;
}

/** Mobile-first scale (rem, base 16px). Display steps use Archivo's width axis (expanded). */
export const typeScale = {
  display: { fontSize: '2.25rem', lineHeight: 1.08, fontWeight: 800, letterSpacing: '-0.025em', fontStretch: '112%' },
  h1: { fontSize: '1.75rem', lineHeight: 1.15, fontWeight: 750, letterSpacing: '-0.02em', fontStretch: '108%' },
  h2: { fontSize: '1.375rem', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.015em', fontStretch: '104%' },
  h3: { fontSize: '1.125rem', lineHeight: 1.3, fontWeight: 700, letterSpacing: '-0.01em' },
  h4: { fontSize: '1rem', lineHeight: 1.35, fontWeight: 650 },
  body1: { fontSize: '1rem', lineHeight: 1.5, fontWeight: 400 },
  body2: { fontSize: '0.875rem', lineHeight: 1.45, fontWeight: 400 },
  label: { fontSize: '0.875rem', lineHeight: 1.3, fontWeight: 600 },
  caption: { fontSize: '0.75rem', lineHeight: 1.35, fontWeight: 500, letterSpacing: '0.01em' },
  button: { fontSize: '1rem', lineHeight: 1.25, fontWeight: 650, letterSpacing: '0' },
  /** Pickup codes, lot numbers, plates: tabular figures, slightly open tracking. */
  code: { fontSize: '1rem', lineHeight: 1.3, fontWeight: 650, letterSpacing: '0.06em' },
  /** Prices and totals. */
  price: { fontSize: '1.125rem', lineHeight: 1.2, fontWeight: 750, letterSpacing: '-0.01em' },
} satisfies Record<string, TypeStyle>;

// ── Spacing (px). MUI `theme.spacing(1)` = 4px, so `spacing(4)` = 16px. ──
export const spacingUnit = 4;
export const space = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

/** Page gutters and widths. */
export const layout = {
  gutter: { mobile: 20, tablet: 32, desktop: 40 },
  maxWidth: { mobile: 480, content: 840, wide: 1280 },
  /** Minimum touch target. */
  touchTarget: 44,
  controlHeight: { sm: 36, md: 44, lg: 52 },
  fieldHeight: 52,
  topBarHeight: 56,
  bottomNavHeight: 64,
  /**
   * Safe-area custom properties. The device frame sets them in Storybook; in the PWA they
   * fall back to `env(safe-area-inset-*)` (needs `viewport-fit=cover`).
   */
  safeAreaTop: 'var(--bs-safe-area-top, env(safe-area-inset-top, 0px))',
  safeAreaBottom: 'var(--bs-safe-area-bottom, env(safe-area-inset-bottom, 0px))',
} as const;

/** Densities: `comfortable` for the cliente (touch), `compact` for operador desktop. */
export type Density = 'comfortable' | 'compact';
export const density = {
  comfortable: { rowMinHeight: 64, rowPaddingY: 14, cardPadding: 16, gap: 16 },
  compact: { rowMinHeight: 44, rowPaddingY: 8, cardPadding: 12, gap: 10 },
} as const satisfies Record<Density, Record<string, number>>;

// ── Radii (px) ───────────────────────────────────────────────────────
export const radius = {
  none: 0,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

// ── Motion ───────────────────────────────────────────────────────────
export const duration = {
  instant: 90,
  fast: 150,
  base: 220,
  slow: 320,
  /** Copy confirmation and other transient messages stay this long. */
  confirm: 2000,
} as const;

export const easing = {
  /** Most UI changes. */
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  /** Things arriving (sheets, menus): exponential ease-out. */
  enter: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** Things leaving. */
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

/** `transition` helper: `transition('background-color', 'box-shadow')`. Reduced motion is handled globally. */
export const transition = (...props: string[]) =>
  props.map((p) => `${p} ${duration.fast}ms ${easing.standard}`).join(', ');

// ── Breakpoints (px, min-width) ──────────────────────────────────────
export const breakpoints = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1440 } as const;

/** z-index layers on top of MUI's defaults. */
export const zLayer = { bottomBar: 1100, topBar: 1100, statusBar: 1600 } as const;

/** Storybook device frame chrome (not product UI). */
export const deviceChrome = {
  bezel: '#0B0B0C',
  bezelEdge: '#3A3A3C',
  island: '#000000',
  screen: { width: 390, height: 844, radius: 47 },
  safeArea: { top: 54, bottom: 34 },
} as const;
