import { create } from 'storybook/theming/create';
import { color, fontFamily, radius } from '../theme/tokens';

const base = {
  brandTitle: 'Black Six · Design System',
  brandUrl: './',
  fontBase: fontFamily.sans,
  appBorderRadius: radius.md,
  inputBorderRadius: radius.sm,
};

/** Storybook UI and docs theme, light. */
export const sbLight = create({
  ...base,
  base: 'light',
  colorPrimary: color.light.brand.primary,
  colorSecondary: color.light.text.link,
  appBg: color.light.surface.subtle,
  appContentBg: color.light.surface.canvas,
  appPreviewBg: color.light.surface.canvas,
  appBorderColor: color.light.border.subtle,
  textColor: color.light.text.primary,
  textMutedColor: color.light.text.secondary,
  barBg: color.light.surface.canvas,
  barTextColor: color.light.text.secondary,
  barSelectedColor: color.light.text.link,
  inputBg: color.light.surface.subtle,
  inputBorder: color.light.border.subtle,
  inputTextColor: color.light.text.primary,
});

/** Storybook docs theme, dark (#111111 canvas). */
export const sbDark = create({
  ...base,
  base: 'dark',
  colorPrimary: color.dark.brand.primary,
  colorSecondary: color.dark.text.link,
  appBg: color.dark.surface.subtle,
  appContentBg: color.dark.surface.canvas,
  appPreviewBg: color.dark.surface.canvas,
  appBorderColor: color.dark.border.subtle,
  textColor: color.dark.text.primary,
  textMutedColor: color.dark.text.secondary,
  barBg: color.dark.surface.subtle,
  barTextColor: color.dark.text.secondary,
  barSelectedColor: color.dark.text.link,
  inputBg: color.dark.surface.subtle,
  inputBorder: color.dark.border.subtle,
  inputTextColor: color.dark.text.primary,
});
