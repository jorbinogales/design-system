import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { density as densities, layout, transition, type Density } from '../../../theme/tokens';

export interface ListRowProps {
  title: ReactNode;
  description?: ReactNode;
  /** Icon, avatar or thumbnail on the left. */
  leading?: ReactNode;
  /** Value, badge, switch or price on the right. A chevron is added automatically when navigable. */
  trailing?: ReactNode;
  /** Navigable row: link (`href`) or button (`onClick`). Without both the row is static information. */
  href?: string;
  onClick?: () => void;
  density?: Density;
  /** Bottom hairline. */
  divider?: boolean;
  /** Danger-toned title (Cerrar sesión, Eliminar dirección). */
  destructive?: boolean;
  disabled?: boolean;
  /** Horizontal padding: page gutter (default, full-bleed lists) or none (inside a Card). */
  inset?: 'gutter' | 'none';
  /** `li` inside `<ListGroup>` (default) or `div` when standalone. */
  as?: 'li' | 'div';
  /** Chevron on navigable rows (default true). Turn off when `trailing` already carries the cue, e.g. time + unread count in a chat list. */
  chevron?: boolean;
  /** Bold title for unread items (notification, conversation). Pair it with a text cue; weight alone is not enough. */
  emphasis?: boolean;
}

/** List container (`<ul>`) for ListRow. */
export function ListGroup({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <Box component="ul" aria-label={label} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Box>
  );
}

/** One row: navigable (opens a detail) or static (shows information). */
export function ListRow({ title, description, leading, trailing, href, onClick, density = 'comfortable', divider = true, destructive = false, disabled = false, inset = 'gutter', as = 'li', chevron = true, emphasis = false }: ListRowProps) {
  const d = densities[density];
  const navigable = Boolean(href || onClick);
  const content = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: density === 'compact' ? 3 : 4,
        width: '100%',
        minHeight: d.rowMinHeight,
        py: `${d.rowPaddingY}px`,
        px: inset === 'gutter' ? `${layout.gutter.mobile}px` : 0,
        textAlign: 'left',
        borderBottom: divider ? `1px solid ${bs.border.subtle}` : 'none',
        color: disabled ? bs.text.disabled : bs.text.primary,
      }}
    >
      {leading && <Box sx={{ display: 'flex', flexShrink: 0, color: destructive ? bs.status.danger.fg : bs.text.primary }}>{leading}</Box>}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant={density === 'compact' ? 'body2' : 'body1'} sx={{ fontWeight: emphasis ? 700 : 500, color: destructive ? bs.status.danger.fg : 'inherit', overflowWrap: 'anywhere' }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ color: disabled ? bs.text.disabled : bs.text.secondary, mt: 0.5, overflowWrap: 'anywhere' }}>
            {description}
          </Typography>
        )}
      </Box>
      {trailing && <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 2, color: bs.text.secondary }}>{trailing}</Box>}
      {navigable && chevron && <ChevronRightRounded aria-hidden sx={{ color: bs.text.secondary, flexShrink: 0, ml: -1 }} />}
    </Box>
  );
  return (
    <Box component={as} sx={{ listStyle: 'none' }}>
      {navigable ? (
        <ButtonBase
          component={href ? 'a' : 'button'}
          href={href}
          onClick={onClick}
          disabled={disabled}
          sx={{
            display: 'block',
            width: '100%',
            font: 'inherit',
            transition: transition('background-color'),
            '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover } },
            '&:active': { backgroundColor: bs.action.pressed },
            '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: '-2px' },
          }}
        >
          {content}
        </ButtonBase>
      ) : (
        content
      )}
    </Box>
  );
}
