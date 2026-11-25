import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { density as densities, radius, transition, type Density } from '../../../theme/tokens';

export type CardVariant = 'outlined' | 'elevated' | 'filled';

export interface CardProps {
  children: ReactNode;
  /** `outlined` (default, lists), `elevated` (floating over canvas/photos), `filled` (grouping inside a page). */
  variant?: CardVariant;
  /** Padding: comfortable 16px (cliente) · compact 12px (operator desktop). */
  density?: Density;
  /** Remove padding (cards that start with Media edge to edge). */
  flush?: boolean;
  /** Makes the whole card one link or button. Put only one interactive target inside. */
  href?: string;
  onClick?: () => void;
  /** Accessible name when interactive and the content alone is ambiguous. */
  label?: string;
  /** Selection state (package, slot, payment method): soft orange fill + orange border. */
  selected?: boolean;
  disabled?: boolean;
  component?: 'div' | 'article' | 'li' | 'section';
}

const variantSx = {
  outlined: { backgroundColor: bs.surface.raised, border: `1px solid ${bs.border.subtle}` },
  elevated: { backgroundColor: bs.surface.raised, border: `1px solid ${bs.border.subtle}`, boxShadow: bs.elevation.e2 },
  filled: { backgroundColor: bs.surface.subtle, border: '1px solid transparent' },
} as const;

/** Base surface for grouped content. Brief §5 cards are built on this. */
export function Card({ children, variant = 'outlined', density = 'comfortable', flush = false, href, onClick, label, selected = false, disabled = false, component = 'div' }: CardProps) {
  const interactive = Boolean(href || onClick);
  const base = {
    position: 'relative' as const,
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    borderRadius: `${radius.lg}px`,
    overflow: 'hidden',
    color: bs.text.primary,
    p: flush ? 0 : `${densities[density].cardPadding}px`,
    transition: transition('background-color', 'border-color', 'box-shadow', 'transform'),
    ...variantSx[variant],
    ...(selected && { backgroundColor: bs.selection.bg, borderColor: bs.selection.border, boxShadow: `inset 0 0 0 1px ${bs.selection.border}` }),
    ...(disabled && { opacity: 0.55 }),
  };
  if (!interactive) {
    return (
      <Box component={component} sx={base}>
        {children}
      </Box>
    );
  }
  return (
    <ButtonBase
      component={href ? 'a' : 'button'}
      href={href}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={!href && selected ? true : undefined}
      sx={{
        ...base,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        font: 'inherit',
        '@media (hover: hover)': { '&:hover': { borderColor: selected ? bs.selection.border : bs.border.strong } },
        '&:active': { transform: 'scale(0.99)' },
        '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: '2px' },
      }}
    >
      <Box sx={{ width: '100%' }}>{children}</Box>
    </ButtonBase>
  );
}
