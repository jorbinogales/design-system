import Badge from '@mui/material/Badge';
import MuiIconButton, { type IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';

export type IconButtonVariant = 'plain' | 'outlined' | 'filled' | 'raised' | 'accent';

export interface IconButtonProps extends Omit<MuiIconButtonProps, 'size' | 'children' | 'aria-label' | 'color'> {
  /** Accessible name, required (there is no visible text). Include the count if `badge` is a number. */
  label: string;
  icon: ReactNode;
  /**
   * `plain`: no container. `outlined`: hairline circle (top bar actions, as in the reference).
   * `filled`: soft gray circle. `raised`: elevated canvas circle for use over photos.
   * `accent`: orange circle with a charcoal icon (send, next, search filters). Counts as the
   * view's orange primary, so use one per view.
   */
  variant?: IconButtonVariant;
  /** 36 / 44 / 52 px. `sm` only in dense desktop toolbars; touch targets need `md`+. */
  size?: 'sm' | 'md' | 'lg';
  /** `true` shows a dot, a number shows a count (99+ cap). */
  badge?: boolean | number;
  /** Show `label` as a tooltip on pointer hover / keyboard focus (desktop). */
  tooltip?: boolean;
  /** Pressed state for toggles (bookmark, favorite). Sets `aria-pressed`. */
  pressed?: boolean;
}

const muiSize = { sm: 'small', md: 'medium', lg: 'large' } as const;

const variantSx = {
  plain: {},
  outlined: { border: `1px solid ${bs.border.subtle}`, backgroundColor: 'transparent' },
  filled: { backgroundColor: bs.surface.subtle, '@media (hover: hover)': { '&:hover': { backgroundColor: bs.surface.muted } } },
  raised: {
    backgroundColor: bs.surface.raised,
    boxShadow: bs.elevation.e2,
    '@media (hover: hover)': { '&:hover': { backgroundColor: bs.surface.raised } },
  },
  accent: {
    backgroundColor: bs.action.primary.bg,
    color: bs.action.primary.fg,
    '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.primary.hover } },
    '&:active': { backgroundColor: bs.action.primary.pressed },
    '&.Mui-disabled': { backgroundColor: bs.disabled.bg, color: bs.disabled.fg },
  },
} as const;

/** Icon-only action with a required accessible name. */
export function IconButton({ label, icon, variant = 'plain', size = 'md', badge, tooltip = false, pressed, sx, ...rest }: IconButtonProps) {
  const glyph =
    badge === undefined || badge === false ? (
      icon
    ) : (
      <Badge
        color="primary"
        variant={badge === true ? 'dot' : 'standard'}
        badgeContent={badge === true ? undefined : badge}
        max={99}
        overlap="circular"
      >
        {icon}
      </Badge>
    );
  const button = (
    <MuiIconButton
      aria-label={label}
      aria-pressed={pressed}
      size={muiSize[size]}
      sx={[variantSx[variant], ...(Array.isArray(sx) ? sx : [sx])]}
      {...rest}
    >
      {glyph}
    </MuiIconButton>
  );
  return tooltip ? (
    <Tooltip title={label} describeChild>
      {button}
    </Tooltip>
  ) : (
    button
  );
}
