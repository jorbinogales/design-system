import './augmentation';
import { createElement } from 'react';
import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { enUS as coreEnUS, esES as coreEsES } from '@mui/material/locale';
import { enUS as pickersEnUS, esES as pickersEsES } from '@mui/x-date-pickers/locales';
import type { Locale } from '../i18n/locale';
import {
  CheckboxCheckedIcon,
  CheckboxIcon,
  CheckboxIndeterminateIcon,
  RadioCheckedIcon,
  RadioIcon,
} from './controlIcons';
import {
  breakpoints,
  color,
  duration,
  easing,
  fontFamily,
  layout,
  radius,
  spacingUnit,
  transition,
  typeScale,
  type ColorScheme,
} from './tokens';

// ── CSS-variable references for every token ──────────────────────────
type VarTree<T> = { [K in keyof T]: T[K] extends string ? string : VarTree<T[K]> };

function toVars<T extends object>(node: T, path: string[]): VarTree<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    const next = [...path, key];
    out[key] = typeof value === 'string' ? `var(--mui-palette-bs-${next.join('-')})` : toVars(value as object, next);
  }
  return out as VarTree<T>;
}

/**
 * Token references as CSS variables: `bs.surface.canvas` → `var(--mui-palette-bs-surface-canvas)`.
 * Use these everywhere outside `src/theme`. They follow light/dark and scoped subtrees
 * (`<SchemeScope>`), which plain hex values cannot.
 */
export const bs: VarTree<ColorScheme> = toVars(color.light, []);

// ── Small style helpers ──────────────────────────────────────────────
/** Hover styles only for devices with a real pointer (no sticky hover on touch). */
const onHover = (style: Record<string, unknown>) => ({ '@media (hover: hover)': { '&:hover': style } });
const ring = { outline: `2px solid ${bs.focus.ring}`, outlineOffset: '2px' } as const;
const insetRing = { outline: `2px solid ${bs.focus.ring}`, outlineOffset: '-2px' } as const;

const fillButton = (bg: string, fg: string, hoverBg: string, pressedBg: string) => ({
  backgroundColor: bg,
  color: fg,
  ...onHover({ backgroundColor: hoverBg }),
  '&:active': { backgroundColor: pressedBg },
  '&.Mui-disabled': { backgroundColor: bs.disabled.bg, color: bs.disabled.fg },
  '&.MuiButton-loading': { backgroundColor: bg },
  '& .MuiButton-loadingIndicator': { color: fg },
});

const quietButton = {
  backgroundColor: 'transparent',
  color: bs.text.primary,
  ...onHover({ backgroundColor: bs.action.hover }),
  '&:active': { backgroundColor: bs.action.pressed },
  '&.Mui-disabled': { color: bs.disabled.fg },
  '& .MuiButton-loadingIndicator': { color: bs.text.primary },
};

const outlinedButton = {
  backgroundColor: 'transparent',
  color: bs.text.primary,
  border: `1px solid ${bs.border.strong}`,
  ...onHover({ backgroundColor: bs.action.hover }),
  '&:active': { backgroundColor: bs.action.pressed },
  '&.Mui-disabled': { color: bs.disabled.fg, borderColor: bs.disabled.border },
};

/** Shared look for every text input (OutlinedInput, FilledInput, pickers). */
const fieldRoot = {
  backgroundColor: bs.surface.subtle,
  borderRadius: radius.md,
  color: bs.text.primary,
  transition: transition('background-color', 'box-shadow', 'border-color'),
};

const statusAlert = (tone: 'success' | 'warning' | 'danger' | 'info') => ({
  backgroundColor: bs.status[tone].bg,
  color: bs.status[tone].fg,
  border: `1px solid ${bs.status[tone].border}`,
  '& .MuiAlert-icon': { color: bs.status[tone].fg, opacity: 1 },
});

const selectedSoft = {
  backgroundColor: bs.selection.bg,
  color: bs.text.primary,
  boxShadow: `inset 0 0 0 2px ${bs.selection.border}`,
  fontWeight: 700,
};

const shadowScale = [
  'none',
  bs.elevation.e1,
  bs.elevation.e1,
  bs.elevation.e2,
  bs.elevation.e2,
  bs.elevation.e2,
  bs.elevation.e2,
  bs.elevation.e2,
  bs.elevation.e3,
  ...Array<string>(16).fill(bs.elevation.e3),
] as ThemeOptions['shadows'];

const scheme = (c: ColorScheme) => ({
  palette: {
    bs: c,
    primary: {
      main: c.action.primary.bg,
      light: c.action.primary.hover,
      dark: c.action.primary.pressed,
      contrastText: c.action.primary.fg,
    },
    secondary: {
      main: c.action.secondary.bg,
      light: c.action.secondary.hover,
      dark: c.action.secondary.pressed,
      contrastText: c.action.secondary.fg,
    },
    error: { main: c.status.danger.solid, contrastText: c.text.onDestructive, light: c.status.danger.bg, dark: c.status.danger.fg },
    warning: { main: c.status.warning.solid, light: c.status.warning.bg, dark: c.status.warning.fg },
    info: { main: c.status.info.solid, light: c.status.info.bg, dark: c.status.info.fg },
    success: { main: c.status.success.solid, light: c.status.success.bg, dark: c.status.success.fg },
    background: { default: c.surface.canvas, paper: c.surface.raised },
    text: { primary: c.text.primary, secondary: c.text.secondary, disabled: c.text.disabled },
    divider: c.border.subtle,
    action: {
      hover: c.action.hover,
      selected: c.selection.bg,
      disabled: c.disabled.fg,
      disabledBackground: c.disabled.bg,
      focus: c.action.hover,
    },
  },
});

const typography: ThemeOptions['typography'] = {
  fontFamily: fontFamily.sans,
  display: { ...typeScale.display, '@media (min-width:900px)': { fontSize: '3rem' } },
  h1: { ...typeScale.h1, '@media (min-width:900px)': { fontSize: '2.25rem' } },
  h2: { ...typeScale.h2, '@media (min-width:900px)': { fontSize: '1.625rem' } },
  h3: typeScale.h3,
  h4: typeScale.h4,
  h5: typeScale.h4,
  h6: typeScale.label,
  subtitle1: { fontSize: '1rem', lineHeight: 1.4, fontWeight: 600 },
  subtitle2: typeScale.label,
  body1: typeScale.body1,
  body2: typeScale.body2,
  caption: typeScale.caption,
  overline: { ...typeScale.caption, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 },
  button: { ...typeScale.button, textTransform: 'none' },
  label: typeScale.label,
  code: { ...typeScale.code, fontVariantNumeric: 'tabular-nums slashed-zero' },
  price: { ...typeScale.price, fontVariantNumeric: 'tabular-nums' },
};

const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      ':root': { colorScheme: 'light dark' },
      html: { WebkitTextSizeAdjust: '100%', textRendering: 'optimizeLegibility' },
      body: {
        backgroundColor: bs.surface.canvas,
        color: bs.text.primary,
        fontFamily: fontFamily.sans,
        fontSynthesis: 'none',
        WebkitTapHighlightColor: 'transparent',
        caretColor: bs.brand.primary,
        scrollbarColor: `${bs.border.strong} transparent`,
      },
      '::selection': { backgroundColor: bs.selection.bg, color: bs.text.primary },
      ':focus-visible': ring,
      'a, button, input, select, textarea, [tabindex]': { outlineColor: bs.focus.ring },
      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
          scrollBehavior: 'auto !important',
        },
      },
    },
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: { display: 'h1', label: 'span', code: 'span', price: 'span' },
    },
  },
  MuiSvgIcon: {
    styleOverrides: { root: { flexShrink: 0 } },
  },
  MuiButtonBase: {
    defaultProps: { disableRipple: true, disableTouchRipple: true },
  },
  // ── Actions ──
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        ...typeScale.button,
        borderRadius: radius.pill,
        textTransform: 'none',
        gap: 8,
        minWidth: 0,
        boxShadow: 'none',
        textAlign: 'center',
        transition: transition('background-color', 'color', 'border-color', 'transform'),
        '&:active': { transform: 'scale(0.98)' },
        '&.Mui-focusVisible': ring,
        '& .MuiButton-startIcon, & .MuiButton-endIcon': { margin: 0 },
        '& .MuiButton-startIcon > *:nth-of-type(1), & .MuiButton-endIcon > *:nth-of-type(1)': { fontSize: 20 },
      },
    },
    variants: [
      { props: { size: 'small' }, style: { minHeight: layout.controlHeight.sm, padding: '6px 14px', fontSize: '0.875rem' } },
      { props: { size: 'medium' }, style: { minHeight: layout.controlHeight.md, padding: '10px 20px' } },
      { props: { size: 'large' }, style: { minHeight: layout.controlHeight.lg, padding: '14px 24px' } },
      {
        props: { variant: 'primary' },
        style: fillButton(bs.action.primary.bg, bs.action.primary.fg, bs.action.primary.hover, bs.action.primary.pressed),
      },
      {
        props: { variant: 'contained' },
        style: fillButton(bs.action.primary.bg, bs.action.primary.fg, bs.action.primary.hover, bs.action.primary.pressed),
      },
      {
        props: { variant: 'secondary' },
        style: fillButton(bs.action.secondary.bg, bs.action.secondary.fg, bs.action.secondary.hover, bs.action.secondary.pressed),
      },
      {
        props: { variant: 'destructive' },
        style: fillButton(bs.action.destructive.bg, bs.text.onDestructive, bs.action.destructive.hover, bs.action.destructive.pressed),
      },
      { props: { variant: 'quiet' }, style: quietButton },
      { props: { variant: 'text' }, style: quietButton },
      { props: { variant: 'outlined' }, style: outlinedButton },
    ],
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        color: bs.text.primary,
        borderRadius: radius.pill,
        transition: transition('background-color', 'color', 'transform'),
        ...onHover({ backgroundColor: bs.action.hover }),
        '&:active': { backgroundColor: bs.action.pressed, transform: 'scale(0.96)' },
        '&.Mui-focusVisible': ring,
        '&.Mui-disabled': { color: bs.disabled.fg },
      },
      sizeSmall: { width: layout.controlHeight.sm, height: layout.controlHeight.sm, '& .MuiSvgIcon-root': { fontSize: 20 } },
      sizeMedium: { width: layout.controlHeight.md, height: layout.controlHeight.md, '& .MuiSvgIcon-root': { fontSize: 22 } },
      sizeLarge: { width: layout.controlHeight.lg, height: layout.controlHeight.lg, '& .MuiSvgIcon-root': { fontSize: 24 } },
    },
  },
  MuiLink: {
    defaultProps: { underline: 'always' },
    styleOverrides: {
      root: {
        color: bs.text.link,
        fontWeight: 600,
        textDecorationColor: 'currentColor',
        textDecorationThickness: '1px',
        textUnderlineOffset: '0.2em',
        borderRadius: 4,
        transition: transition('text-decoration-thickness', 'color'),
        ...onHover({ textDecorationThickness: '2px' }),
        '&.Mui-focusVisible, &:focus-visible': ring,
      },
    },
  },
  // ── Fields ──
  MuiTextField: {
    defaultProps: { variant: 'outlined', fullWidth: true, slotProps: { inputLabel: { shrink: true } } },
  },
  MuiFormControl: {
    styleOverrides: { root: { minWidth: 0 } },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        ...typeScale.label,
        color: bs.text.primary,
        '&.Mui-focused': { color: bs.text.primary },
        '&.Mui-error': { color: bs.text.primary },
        '&.Mui-disabled': { color: bs.text.disabled },
      },
      asterisk: { color: bs.status.danger.fg, '&.Mui-error': { color: bs.status.danger.fg } },
    },
  },
  MuiInputLabel: {
    defaultProps: { shrink: true, disableAnimation: true },
    styleOverrides: {
      root: {
        position: 'relative',
        transform: 'none',
        maxWidth: '100%',
        whiteSpace: 'normal',
        overflow: 'visible',
        marginBottom: 8,
        pointerEvents: 'auto',
        '&.MuiInputLabel-shrink': { transform: 'none' },
        '&.MuiInputLabel-sizeSmall': { transform: 'none' },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        ...typeScale.body1,
        fontFamily: fontFamily.sans,
        '&.Mui-disabled': { color: bs.text.disabled },
      },
      input: {
        '&::placeholder': { color: bs.text.secondary, opacity: 1 },
        '&.Mui-disabled': { WebkitTextFillColor: bs.text.disabled },
        '&:-webkit-autofill': { WebkitBoxShadow: `0 0 0 100px ${bs.surface.subtle} inset`, WebkitTextFillColor: bs.text.primary },
      },
    },
  },
  MuiOutlinedInput: {
    defaultProps: { notched: false },
    styleOverrides: {
      root: {
        ...fieldRoot,
        minHeight: layout.fieldHeight,
        '& .MuiOutlinedInput-notchedOutline': {
          top: 0,
          borderColor: bs.border.field,
          borderWidth: 1,
          transition: transition('border-color', 'border-width'),
          '& legend': { display: 'none' },
        },
        ...onHover({ '& .MuiOutlinedInput-notchedOutline': { borderColor: bs.border.strong } }),
        '&.Mui-focused': { backgroundColor: bs.surface.raised },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: bs.selection.border, borderWidth: 2 },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: bs.status.danger.solid, borderWidth: 2 },
        '&.Mui-disabled': { backgroundColor: bs.disabled.bg },
        '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: bs.disabled.border },
        '&.MuiInputBase-readOnly': { backgroundColor: 'transparent' },
        '&.MuiInputBase-readOnly .MuiOutlinedInput-notchedOutline': { borderColor: bs.border.subtle, borderWidth: 1, borderStyle: 'dashed' },
        '&.MuiInputBase-multiline': { padding: 0, alignItems: 'flex-start' },
      },
      input: { padding: '14px 16px', height: 'auto' },
      sizeSmall: { minHeight: layout.controlHeight.md, '& .MuiInputBase-inputSizeSmall': { padding: '10px 14px' } },
      adornedStart: { paddingLeft: 14, '& .MuiInputBase-input': { paddingLeft: 10 } },
      adornedEnd: { paddingRight: 6, '& .MuiInputBase-input': { paddingRight: 4 } },
      multiline: { '& .MuiInputBase-inputMultiline': { padding: '14px 16px' } },
    },
  },
  MuiFilledInput: {
    defaultProps: { disableUnderline: true },
    styleOverrides: {
      root: {
        ...fieldRoot,
        minHeight: layout.fieldHeight,
        border: `1px solid ${bs.border.field}`,
        ...onHover({ backgroundColor: bs.surface.subtle, borderColor: bs.border.strong }),
        '&.Mui-focused': { backgroundColor: bs.surface.raised, boxShadow: `inset 0 0 0 1px ${bs.selection.border}`, borderColor: bs.selection.border },
        '&.Mui-error': { borderColor: bs.status.danger.solid, boxShadow: `inset 0 0 0 1px ${bs.status.danger.solid}` },
        '&.Mui-disabled': { backgroundColor: bs.disabled.bg, borderColor: bs.disabled.border },
      },
      input: { padding: '14px 16px' },
    },
  },
  MuiInput: {
    styleOverrides: {
      underline: {
        '&::before': { borderBottomColor: bs.border.strong },
        '&::after': { borderBottomColor: bs.selection.border },
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: { color: bs.text.secondary, '& .MuiTypography-root': { color: bs.text.secondary, ...typeScale.body1 } },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        ...typeScale.caption,
        fontSize: '0.8125rem',
        margin: '6px 0 0',
        color: bs.text.secondary,
        '&.Mui-error': { color: bs.status.danger.fg },
        '&.Mui-disabled': { color: bs.text.disabled },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      icon: { color: bs.text.secondary, right: 12 },
      select: { '&.MuiInputBase-input': { paddingRight: 44 } },
    },
  },
  MuiNativeSelect: {
    styleOverrides: { icon: { color: bs.text.secondary, right: 12 } },
  },
  MuiAutocomplete: {
    styleOverrides: {
      inputRoot: {
        '&.MuiOutlinedInput-root': { padding: '6px 10px 6px 16px' },
        '&.MuiOutlinedInput-root .MuiAutocomplete-input': { padding: '8px 4px 8px 0' },
      },
      paper: { borderRadius: radius.md, boxShadow: bs.elevation.e2, border: `1px solid ${bs.border.subtle}`, marginTop: 6 },
      listbox: {
        padding: 6,
        '& .MuiAutocomplete-option': {
          ...typeScale.body1,
          borderRadius: radius.sm,
          minHeight: 44,
          padding: '10px 12px',
          '&.Mui-focused': { backgroundColor: bs.action.hover },
          '&[aria-selected="true"]': { backgroundColor: bs.selection.bg, fontWeight: 600 },
          '&[aria-selected="true"].Mui-focused': { backgroundColor: bs.selection.bg },
        },
      },
      noOptions: { color: bs.text.secondary, ...typeScale.body2 },
      loading: { color: bs.text.secondary, ...typeScale.body2 },
      groupLabel: { ...typeScale.label, color: bs.text.secondary, backgroundColor: bs.surface.raised },
      endAdornment: { right: 8 },
      clearIndicator: { color: bs.text.secondary },
      popupIndicator: { color: bs.text.secondary },
      tag: { margin: 2 },
    },
  },
  // ── Selection controls ──
  MuiCheckbox: {
    defaultProps: {
      icon: createElement(CheckboxIcon),
      checkedIcon: createElement(CheckboxCheckedIcon),
      indeterminateIcon: createElement(CheckboxIndeterminateIcon),
    },
    styleOverrides: {
      root: {
        color: bs.border.strong,
        padding: 10,
        '& .bs-control-fill': { fill: bs.brand.primary },
        '& .bs-control-mark': { stroke: bs.action.primary.fg },
        '&.Mui-focusVisible': { ...ring, outlineOffset: '-4px', borderRadius: radius.sm },
        '&.Mui-disabled': { color: bs.disabled.border },
        '&.Mui-disabled .bs-control-fill': { fill: bs.disabled.bg },
        '&.Mui-disabled .bs-control-mark': { stroke: bs.disabled.fg },
        ...onHover({ backgroundColor: bs.action.hover }),
      },
    },
  },
  MuiRadio: {
    defaultProps: { icon: createElement(RadioIcon), checkedIcon: createElement(RadioCheckedIcon) },
    styleOverrides: {
      root: {
        color: bs.border.strong,
        padding: 10,
        '&.Mui-checked': { color: bs.selection.border },
        '&.Mui-focusVisible': { ...ring, outlineOffset: '-4px', borderRadius: radius.pill },
        '&.Mui-disabled': { color: bs.disabled.border },
        ...onHover({ backgroundColor: bs.action.hover }),
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: { width: 52 + 12, height: 32 + 12, padding: 6, overflow: 'visible' },
      switchBase: {
        padding: 10,
        color: '#FFFFFF',
        '&.Mui-checked': { transform: 'translateX(20px)', color: '#FFFFFF' },
        '&.Mui-checked + .MuiSwitch-track': { backgroundColor: bs.brand.primary, opacity: 1 },
        '&.Mui-focusVisible + .MuiSwitch-track': ring,
        '&.Mui-disabled + .MuiSwitch-track': { backgroundColor: bs.disabled.border, opacity: 1 },
        '&.Mui-disabled .MuiSwitch-thumb': { backgroundColor: bs.disabled.bg, boxShadow: 'none' },
        ...onHover({ backgroundColor: 'transparent' }),
      },
      thumb: { width: 24, height: 24, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' },
      track: {
        borderRadius: radius.pill,
        backgroundColor: bs.border.strong,
        opacity: 1,
        transition: transition('background-color'),
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      root: { marginLeft: -10, marginRight: 0, gap: 2, alignItems: 'center' },
      label: { ...typeScale.body1, '&.Mui-disabled': { color: bs.text.disabled } },
    },
  },
  MuiFormGroup: { styleOverrides: { root: { gap: 0 } } },
  MuiSlider: {
    styleOverrides: {
      root: { color: bs.brand.primary, height: 6, padding: '16px 0' },
      rail: { backgroundColor: bs.surface.muted, opacity: 1 },
      track: { border: 'none' },
      thumb: {
        width: 22,
        height: 22,
        backgroundColor: bs.brand.primary,
        border: `3px solid ${bs.surface.raised}`,
        boxShadow: bs.elevation.e1,
        '&:hover, &.Mui-focusVisible': { boxShadow: bs.elevation.e2 },
        '&.Mui-focusVisible': ring,
      },
      valueLabel: { ...typeScale.caption, backgroundColor: bs.text.primary, color: bs.surface.canvas, borderRadius: radius.sm },
      markLabel: { ...typeScale.caption, color: bs.text.secondary },
      mark: { backgroundColor: bs.border.strong },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        ...typeScale.label,
        height: 36,
        borderRadius: radius.pill,
        backgroundColor: bs.surface.subtle,
        color: bs.text.primary,
        border: `1px solid ${bs.border.subtle}`,
        transition: transition('background-color', 'box-shadow', 'color'),
        '& .MuiChip-icon': { color: 'inherit', marginLeft: 10, marginRight: -4, fontSize: 18 },
        '& .MuiChip-deleteIcon': { color: bs.text.secondary, fontSize: 18, marginRight: 8 },
        '&.Mui-focusVisible': { ...ring, backgroundColor: bs.surface.subtle },
        '&[aria-pressed="true"], &[aria-checked="true"], &[aria-selected="true"]': {
          backgroundColor: bs.selection.bg,
          borderColor: bs.selection.border,
          boxShadow: `inset 0 0 0 1px ${bs.selection.border}`,
          color: bs.text.primary,
        },
        '&.Mui-disabled': { opacity: 1, color: bs.disabled.fg, backgroundColor: bs.disabled.bg, borderColor: bs.disabled.border },
      },
      label: { paddingLeft: 14, paddingRight: 14 },
      sizeSmall: { height: 28, fontSize: '0.8125rem', '& .MuiChip-label': { paddingLeft: 10, paddingRight: 10 } },
      clickable: {
        ...onHover({ backgroundColor: bs.surface.muted }),
        '&:active': { boxShadow: 'none', backgroundColor: bs.surface.muted },
      },
      outlined: { backgroundColor: 'transparent' },
      colorPrimary: { '&.MuiChip-filled': { backgroundColor: bs.brand.primary, color: bs.action.primary.fg, borderColor: 'transparent' } },
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: { backgroundColor: bs.surface.muted, borderRadius: radius.pill, padding: 4, gap: 4 },
      grouped: { border: 0, borderRadius: `${radius.pill}px !important`, margin: 0 },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...typeScale.label,
        textTransform: 'none',
        border: 0,
        borderRadius: radius.pill,
        color: bs.text.secondary,
        minHeight: 36,
        padding: '6px 16px',
        transition: transition('background-color', 'color', 'box-shadow'),
        ...onHover({ color: bs.text.primary, backgroundColor: 'transparent' }),
        '&.Mui-focusVisible': ring,
        '&.Mui-selected': {
          backgroundColor: bs.surface.raised,
          color: bs.text.primary,
          boxShadow: bs.elevation.e1,
          fontWeight: 700,
          ...theme.applyStyles('dark', { backgroundColor: bs.action.secondary.pressed }),
        },
        '&.Mui-selected:hover': { backgroundColor: bs.surface.raised, ...theme.applyStyles('dark', { backgroundColor: bs.action.secondary.pressed }) },
        '&.Mui-disabled': { color: bs.disabled.fg, border: 0 },
      }),
      sizeLarge: { minHeight: 44, fontSize: '1rem' },
      sizeSmall: { minHeight: 30, padding: '4px 12px', fontSize: '0.8125rem' },
    },
  },
  // ── Navigation ──
  MuiTabs: {
    styleOverrides: {
      root: { minHeight: 48, borderBottom: `1px solid ${bs.border.subtle}` },
      indicator: { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: bs.brand.primary },
      scrollButtons: { color: bs.text.secondary, '&.Mui-disabled': { opacity: 0.3 } },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        ...typeScale.label,
        fontSize: '0.9375rem',
        textTransform: 'none',
        minHeight: 48,
        minWidth: 0,
        padding: '12px 16px',
        color: bs.text.secondary,
        gap: 6,
        ...onHover({ color: bs.text.primary }),
        '&.Mui-selected': { color: bs.text.primary, fontWeight: 700 },
        '&.Mui-focusVisible': insetRing,
        '&.Mui-disabled': { color: bs.text.disabled },
      },
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: { height: 'auto', minHeight: layout.bottomNavHeight, backgroundColor: bs.surface.raised, alignItems: 'stretch' },
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        minWidth: 0,
        maxWidth: 'none',
        padding: '8px 4px',
        gap: 4,
        color: bs.text.secondary,
        '&.Mui-selected': { color: bs.text.primary },
        '&.Mui-focusVisible': insetRing,
      },
      label: {
        ...typeScale.caption,
        fontWeight: 600,
        opacity: 1,
        '&.Mui-selected': { fontSize: typeScale.caption.fontSize, fontWeight: 700 },
      },
    },
  },
  MuiAppBar: {
    defaultProps: { elevation: 0, color: 'default' },
    styleOverrides: {
      root: { backgroundImage: 'none', boxShadow: 'none' },
      colorDefault: { backgroundColor: bs.surface.canvas, color: bs.text.primary },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: { minHeight: layout.topBarHeight, '@media (min-width:600px)': { minHeight: layout.topBarHeight + 8 } },
      gutters: { paddingLeft: layout.gutter.mobile, paddingRight: layout.gutter.mobile, '@media (min-width:600px)': { paddingLeft: layout.gutter.tablet, paddingRight: layout.gutter.tablet } },
    },
  },
  MuiBreadcrumbs: {
    styleOverrides: {
      root: { ...typeScale.body2, color: bs.text.secondary },
      separator: { color: bs.text.secondary, marginLeft: 6, marginRight: 6 },
      li: {
        '& .MuiLink-root': { color: bs.text.secondary, fontWeight: 500 },
        '&:last-of-type': { color: bs.text.primary, fontWeight: 600 },
      },
    },
  },
  // ── Layers ──
  MuiBackdrop: {
    styleOverrides: { root: { '&:not(.MuiBackdrop-invisible)': { backgroundColor: bs.scrim } } },
  },
  MuiPaper: {
    styleOverrides: {
      root: { backgroundImage: 'none', backgroundColor: bs.surface.raised, color: bs.text.primary },
      rounded: { borderRadius: radius.lg },
      outlined: { borderColor: bs.border.subtle },
      elevation1: { boxShadow: bs.elevation.e1 },
      elevation2: { boxShadow: bs.elevation.e1 },
      elevation3: { boxShadow: bs.elevation.e2 },
      elevation4: { boxShadow: bs.elevation.e2 },
      elevation6: { boxShadow: bs.elevation.e2 },
      elevation8: { boxShadow: bs.elevation.e3 },
      elevation16: { boxShadow: bs.elevation.e3 },
      elevation24: { boxShadow: bs.elevation.e3 },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: { backgroundColor: bs.surface.raised, backgroundImage: 'none', borderColor: bs.border.subtle },
      anchorBottom: {
        '& .MuiDrawer-paper': {
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          paddingBottom: layout.safeAreaBottom,
          maxHeight: 'calc(100% - 48px)',
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: radius.xl, boxShadow: bs.elevation.e3, margin: layout.gutter.mobile, width: `calc(100% - ${layout.gutter.mobile * 2}px)` },
      paperFullScreen: { borderRadius: 0, margin: 0, width: '100%' },
    },
  },
  MuiDialogTitle: {
    styleOverrides: { root: { ...typeScale.h3, padding: '24px 24px 8px' } },
  },
  MuiDialogContent: {
    styleOverrides: { root: { padding: '8px 24px' } },
  },
  MuiDialogContentText: {
    styleOverrides: { root: { ...typeScale.body1, color: bs.text.secondary } },
  },
  MuiDialogActions: {
    styleOverrides: { root: { padding: '16px 24px 24px', gap: 12, '& > :not(style) ~ :not(style)': { marginLeft: 0 } } },
  },
  MuiPopover: {
    styleOverrides: {
      paper: { borderRadius: radius.md, boxShadow: bs.elevation.e2, border: `1px solid ${bs.border.subtle}` },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: { minWidth: 200, marginTop: 4 },
      list: { padding: 6 },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        ...typeScale.body1,
        minHeight: 44,
        borderRadius: radius.sm,
        gap: 12,
        padding: '10px 12px',
        ...onHover({ backgroundColor: bs.action.hover }),
        '&.Mui-focusVisible': { backgroundColor: bs.action.hover, ...insetRing },
        '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: bs.selection.bg, fontWeight: 600 },
        '& .MuiListItemIcon-root': { minWidth: 0, color: bs.text.secondary },
        '&.Mui-disabled': { opacity: 1, color: bs.text.disabled },
      },
    },
  },
  MuiTooltip: {
    defaultProps: { arrow: true },
    styleOverrides: {
      tooltip: {
        ...typeScale.caption,
        fontSize: '0.8125rem',
        backgroundColor: bs.text.primary,
        color: bs.surface.canvas,
        borderRadius: radius.sm,
        padding: '8px 10px',
        maxWidth: 280,
      },
      arrow: { color: bs.text.primary },
    },
  },
  MuiSnackbarContent: {
    styleOverrides: {
      root: {
        ...typeScale.body2,
        backgroundColor: bs.text.primary,
        color: bs.surface.canvas,
        borderRadius: radius.md,
        boxShadow: bs.elevation.e3,
        padding: '8px 16px',
        '& .MuiButton-root': { color: 'inherit' },
      },
    },
  },
  MuiSnackbar: {
    styleOverrides: { root: { '@media (max-width:599.95px)': { left: 16, right: 16, bottom: `calc(16px + ${layout.safeAreaBottom})` } } },
  },
  // ── Feedback ──
  MuiAlert: {
    defaultProps: { variant: 'standard' },
    styleOverrides: {
      root: { ...typeScale.body2, borderRadius: radius.md, padding: '10px 14px', alignItems: 'flex-start' },
      icon: { padding: '2px 0', marginRight: 10, fontSize: 20 },
      message: { padding: '2px 0' },
      action: { paddingTop: 0, marginRight: -6 },
    },
    variants: [
      { props: { severity: 'success' }, style: statusAlert('success') },
      { props: { severity: 'warning' }, style: statusAlert('warning') },
      { props: { severity: 'error' }, style: statusAlert('danger') },
      { props: { severity: 'info' }, style: statusAlert('info') },
      { props: { variant: 'outlined' }, style: { backgroundColor: 'transparent' } },
      { props: { variant: 'filled', severity: 'success' }, style: { borderColor: bs.status.success.solid } },
      { props: { variant: 'filled', severity: 'warning' }, style: { borderColor: bs.status.warning.solid } },
      { props: { variant: 'filled', severity: 'error' }, style: { borderColor: bs.status.danger.solid } },
      { props: { variant: 'filled', severity: 'info' }, style: { borderColor: bs.status.info.solid } },
    ],
  },
  MuiAlertTitle: {
    styleOverrides: { root: { ...typeScale.label, marginTop: 0, marginBottom: 2, color: 'inherit' } },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: { backgroundColor: bs.surface.muted },
      rounded: { borderRadius: radius.md },
      text: { borderRadius: radius.xs },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: { height: 6, borderRadius: radius.pill, backgroundColor: bs.surface.muted },
      bar: { borderRadius: radius.pill, backgroundColor: bs.brand.primary },
    },
  },
  MuiCircularProgress: {
    styleOverrides: { circle: { strokeLinecap: 'round' } },
  },
  MuiStepper: { styleOverrides: { root: { gap: 0 } } },
  MuiStepLabel: {
    styleOverrides: {
      label: {
        ...typeScale.label,
        color: bs.text.secondary,
        '&.Mui-active': { color: bs.text.primary, fontWeight: 700 },
        '&.Mui-completed': { color: bs.text.primary, fontWeight: 600 },
        '&.Mui-error': { color: bs.status.danger.fg },
      },
    },
  },
  MuiStepIcon: {
    styleOverrides: {
      root: {
        color: bs.border.strong,
        '&.Mui-active': { color: bs.brand.primary },
        '&.Mui-completed': { color: bs.brand.primary },
        '&.Mui-error': { color: bs.status.danger.solid },
        '&.Mui-active .MuiStepIcon-text, &.Mui-completed .MuiStepIcon-text': { fill: bs.action.primary.fg },
      },
      text: { ...typeScale.caption, fontWeight: 700, fill: bs.surface.canvas },
    },
  },
  MuiStepConnector: {
    styleOverrides: {
      line: { borderColor: bs.border.subtle, borderTopWidth: 2, borderLeftWidth: 2 },
      root: {
        '&.Mui-active .MuiStepConnector-line, &.Mui-completed .MuiStepConnector-line': { borderColor: bs.brand.primary },
      },
    },
  },
  MuiAccordion: {
    defaultProps: { disableGutters: true, elevation: 0 },
    styleOverrides: {
      root: {
        backgroundColor: bs.surface.raised,
        border: `1px solid ${bs.border.subtle}`,
        borderRadius: radius.lg,
        '&::before': { display: 'none' },
        '&:first-of-type, &:last-of-type': { borderRadius: radius.lg },
        '& + &': { marginTop: 12 },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: { minHeight: 56, padding: '0 16px', borderRadius: radius.lg, '&.Mui-focusVisible': { backgroundColor: 'transparent', ...insetRing } },
      content: { ...typeScale.h4, margin: '14px 0' },
      expandIconWrapper: { color: bs.text.secondary },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: { root: { ...typeScale.body2, color: bs.text.secondary, padding: '0 16px 16px' } },
  },
  // ── Structure ──
  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        borderRadius: radius.lg,
        backgroundColor: bs.surface.raised,
        backgroundImage: 'none',
        border: `1px solid ${bs.border.subtle}`,
        boxShadow: 'none',
      },
    },
  },
  MuiCardContent: {
    styleOverrides: { root: { padding: 16, '&:last-child': { paddingBottom: 16 } } },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: { padding: 16 },
      title: typeScale.h4,
      subheader: { ...typeScale.body2, color: bs.text.secondary },
    },
  },
  MuiCardActionArea: {
    styleOverrides: {
      root: { borderRadius: 'inherit', '&.Mui-focusVisible': insetRing },
      focusHighlight: { backgroundColor: bs.text.primary },
    },
  },
  MuiCardActions: { styleOverrides: { root: { padding: '0 16px 16px', gap: 12 } } },
  MuiList: { styleOverrides: { root: { paddingTop: 0, paddingBottom: 0 } } },
  MuiListSubheader: {
    styleOverrides: {
      root: { ...typeScale.label, color: bs.text.secondary, backgroundColor: 'transparent', lineHeight: 1.4, padding: '16px 0 8px' },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        minHeight: 56,
        ...onHover({ backgroundColor: bs.action.hover }),
        '&:active': { backgroundColor: bs.action.pressed },
        '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: bs.selection.bg },
        '&.Mui-focusVisible': { backgroundColor: bs.action.hover, ...insetRing },
        '&.Mui-disabled': { opacity: 1, color: bs.text.disabled },
      },
    },
  },
  MuiListItemIcon: { styleOverrides: { root: { minWidth: 40, color: bs.text.primary } } },
  MuiListItemAvatar: { styleOverrides: { root: { minWidth: 56 } } },
  MuiListItemText: {
    styleOverrides: {
      root: { marginTop: 0, marginBottom: 0 },
      primary: { ...typeScale.body1, fontWeight: 500, color: bs.text.primary },
      secondary: { ...typeScale.body2, color: bs.text.secondary },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: { borderColor: bs.border.subtle, '&::before, &::after': { borderColor: bs.border.subtle } },
      withChildren: { ...typeScale.body2, color: bs.text.secondary },
    },
  },
  // ── Data display ──
  MuiAvatar: {
    styleOverrides: {
      root: { ...typeScale.label, fontWeight: 700, letterSpacing: '0.02em' },
      colorDefault: { backgroundColor: bs.surface.muted, color: bs.text.primary },
    },
  },
  MuiBadge: {
    styleOverrides: {
      badge: {
        ...typeScale.caption,
        fontSize: '0.6875rem',
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        minWidth: 18,
        height: 18,
        padding: '0 5px',
        borderRadius: radius.pill,
        boxShadow: `0 0 0 2px ${bs.surface.canvas}`,
      },
      colorPrimary: { backgroundColor: bs.brand.primary, color: bs.action.primary.fg },
      colorError: { backgroundColor: bs.action.destructive.bg, color: bs.text.onDestructive },
      dot: { minWidth: 10, width: 10, height: 10, padding: 0 },
    },
  },
  MuiTableContainer: {
    styleOverrides: { root: { borderRadius: radius.lg, border: `1px solid ${bs.border.subtle}`, backgroundColor: bs.surface.raised } },
  },
  MuiTableCell: {
    styleOverrides: {
      root: { ...typeScale.body2, borderBottom: `1px solid ${bs.border.subtle}`, padding: '12px 16px', color: bs.text.primary, fontVariantNumeric: 'tabular-nums' },
      head: { ...typeScale.label, fontSize: '0.8125rem', color: bs.text.secondary, backgroundColor: bs.surface.subtle, whiteSpace: 'nowrap' },
      sizeSmall: { padding: '8px 12px' },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&.MuiTableRow-hover:hover': { backgroundColor: bs.action.hover },
        '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: bs.selection.bg },
        '&:last-child > .MuiTableCell-body': { borderBottom: 0 },
      },
    },
  },
  MuiTableSortLabel: {
    styleOverrides: {
      root: { '&:hover': { color: bs.text.primary }, '&.Mui-active': { color: bs.text.primary }, '&.Mui-focusVisible': ring },
      icon: { color: `${bs.text.secondary} !important` },
    },
  },
  MuiTablePagination: {
    styleOverrides: {
      root: { ...typeScale.body2, color: bs.text.secondary, borderBottom: 0 },
      selectLabel: { ...typeScale.body2, margin: 0 },
      displayedRows: { ...typeScale.body2, margin: 0, fontVariantNumeric: 'tabular-nums' },
      select: { borderRadius: radius.sm },
    },
  },
  MuiPagination: { styleOverrides: { ul: { gap: 4 } } },
  MuiPaginationItem: {
    styleOverrides: {
      root: {
        ...typeScale.label,
        fontVariantNumeric: 'tabular-nums',
        minWidth: 40,
        height: 40,
        borderRadius: radius.pill,
        color: bs.text.primary,
        ...onHover({ backgroundColor: bs.action.hover }),
        '&.Mui-selected, &.Mui-selected:hover': selectedSoft,
        '&.Mui-focusVisible': ring,
        '&.Mui-disabled': { opacity: 1, color: bs.text.disabled },
      },
      ellipsis: { color: bs.text.secondary },
    },
  },
  // ── Date & time (x-date-pickers) ──
  MuiPickersTextField: { defaultProps: { fullWidth: true } },
  MuiPickersOutlinedInput: {
    styleOverrides: {
      root: {
        ...fieldRoot,
        minHeight: layout.fieldHeight,
        '& .MuiPickersOutlinedInput-notchedOutline': { top: 0, borderColor: bs.border.field, borderWidth: 1, '& legend': { display: 'none' } },
        ...onHover({ '& .MuiPickersOutlinedInput-notchedOutline': { borderColor: bs.border.strong } }),
        '&.Mui-focused': { backgroundColor: bs.surface.raised },
        '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': { borderColor: bs.selection.border, borderWidth: 2 },
        '&.Mui-error .MuiPickersOutlinedInput-notchedOutline': { borderColor: bs.status.danger.solid, borderWidth: 2 },
        '&.Mui-disabled': { backgroundColor: bs.disabled.bg },
      },
      sectionsContainer: { padding: '14px 0 14px 16px' },
    },
  },
  MuiPickersInputBase: {
    styleOverrides: { root: { ...typeScale.body1, color: bs.text.primary } },
  },
  MuiPickerPopper: {
    styleOverrides: {
      paper: { borderRadius: radius.lg, boxShadow: bs.elevation.e3, border: `1px solid ${bs.border.subtle}` },
    },
  },
  MuiPickersLayout: {
    styleOverrides: {
      root: { backgroundColor: bs.surface.raised, color: bs.text.primary },
      actionBar: { padding: '8px 16px 16px', gap: 8 },
    },
  },
  MuiDateCalendar: {
    styleOverrides: {
      root: {
        width: '100%',
        maxWidth: 360,
        height: 'auto',
        '& .MuiDayCalendar-weekDayLabel': { ...typeScale.caption, fontWeight: 600, color: bs.text.secondary, width: 40, height: 32 },
        '& .MuiDayCalendar-slideTransition': { minHeight: 264 },
      },
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: {
      root: { paddingLeft: 16, paddingRight: 8, marginTop: 8 },
      label: { ...typeScale.h4, textTransform: 'capitalize' },
      switchViewButton: { color: bs.text.secondary },
    },
  },
  MuiPickersArrowSwitcher: {
    styleOverrides: { button: { color: bs.text.primary, '&.Mui-disabled': { color: bs.text.disabled } } },
  },
  MuiPickerDay: {
    styleOverrides: {
      root: {
        ...typeScale.body2,
        fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        width: 40,
        height: 40,
        margin: '2px',
        borderRadius: radius.pill,
        color: bs.text.primary,
        backgroundColor: 'transparent',
        ...onHover({ backgroundColor: bs.action.hover }),
        '&.Mui-focusVisible': ring,
        '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus': selectedSoft,
        '&.Mui-disabled:not(.Mui-selected)': { color: bs.text.disabled },
      },
      today: { '&:not(.Mui-selected)': { border: `1px solid ${bs.border.strong}` } },
      dayOutsideMonth: { color: bs.text.secondary },
    },
  },
  MuiYearCalendar: {
    styleOverrides: {
      button: { ...typeScale.body2, fontWeight: 600, borderRadius: radius.pill, '&.Mui-selected, &.Mui-selected:hover': selectedSoft },
    },
  },
  MuiMonthCalendar: {
    styleOverrides: {
      button: { ...typeScale.body2, fontWeight: 600, borderRadius: radius.pill, textTransform: 'capitalize', '&.Mui-selected, &.Mui-selected:hover': selectedSoft },
    },
  },
  MuiDigitalClock: {
    styleOverrides: {
      list: { padding: 6 },
      item: {
        ...typeScale.body2,
        fontVariantNumeric: 'tabular-nums',
        borderRadius: radius.sm,
        margin: '2px 0',
        minHeight: 40,
        ...onHover({ backgroundColor: bs.action.hover }),
        '&.Mui-selected, &.Mui-selected:hover': selectedSoft,
      },
    },
  },
  MuiMultiSectionDigitalClockSection: {
    styleOverrides: {
      item: {
        ...typeScale.body2,
        fontVariantNumeric: 'tabular-nums',
        borderRadius: radius.sm,
        ...onHover({ backgroundColor: bs.action.hover }),
        '&.Mui-selected, &.Mui-selected:hover': selectedSoft,
      },
    },
  },
  MuiTimeClock: {
    styleOverrides: {
      root: {
        '& .MuiClock-clock': { backgroundColor: bs.surface.subtle },
        '& .MuiClock-pin, & .MuiClockPointer-root': { backgroundColor: bs.brand.primary },
        '& .MuiClockPointer-thumb': { borderColor: bs.brand.primary, backgroundColor: bs.brand.primary },
        '& .MuiClockNumber-root': { ...typeScale.body2, color: bs.text.primary },
        '& .MuiClockNumber-root.Mui-selected': { color: bs.action.primary.fg, fontWeight: 700 },
      },
    },
  },
};

const baseOptions: ThemeOptions = {
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: { light: scheme(color.light), dark: scheme(color.dark) },
  spacing: spacingUnit,
  shape: { borderRadius: radius.md },
  breakpoints: { values: breakpoints },
  typography,
  shadows: shadowScale,
  motion: { reducedMotion: 'system' },
  focusVisible: { ...ring, insetOverrides: { outlineOffset: '-2px' } },
  transitions: {
    duration: {
      shortest: duration.instant,
      shorter: duration.fast,
      short: duration.base,
      standard: duration.base,
      complex: duration.slow,
      enteringScreen: duration.base,
      leavingScreen: duration.fast,
    },
    easing: { easeInOut: easing.standard, easeOut: easing.enter, easeIn: easing.exit, sharp: easing.exit },
  },
  components,
};

/** One theme per locale: MUI and date-picker built-in strings follow the active language. */
export const themes: Record<Locale, ReturnType<typeof createTheme>> = {
  es: createTheme(baseOptions, coreEsES, pickersEsES),
  en: createTheme(baseOptions, coreEnUS, pickersEnUS),
};

/** Default (Spanish) theme. */
export const theme = themes.es;
