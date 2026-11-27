/**
 * MUI module augmentation for Black Seat. Imported for its side effect by `theme.ts`.
 * - `palette.bs` carries the full token tree (`ColorScheme`) for each color scheme.
 * - CSS variables are always on, so `theme.vars` is typed as present.
 * - Custom Typography variants and Button variants.
 */
import type { CSSProperties } from 'react';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type { ColorScheme } from './tokens';

/** A type style that may carry min-width media queries. */
type ResponsiveTypeStyle = CSSProperties & { [media: `@media ${string}`]: CSSProperties };

declare module '@mui/material/styles' {
  interface CssThemeVariables {
    enabled: true;
  }
  interface Palette {
    bs: ColorScheme;
  }
  interface PaletteOptions {
    bs?: ColorScheme;
  }
  interface TypographyVariants {
    display: CSSProperties;
    label: CSSProperties;
    code: CSSProperties;
    price: CSSProperties;
  }
  interface TypographyVariantsOptions {
    display?: ResponsiveTypeStyle;
    label?: ResponsiveTypeStyle;
    code?: ResponsiveTypeStyle;
    price?: ResponsiveTypeStyle;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
    label: true;
    code: true;
    price: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
    quiet: true;
    destructive: true;
  }
}

export {};
