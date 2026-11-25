import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { radius, typeScale, type StatusTone } from '../../../theme/tokens';

export type TagTone = StatusTone | 'inverse' | 'outline';

export interface TagProps {
  label: ReactNode;
  /**
   * `neutral` (default): category labels (Lavado exterior, SUV).
   * `brand`: promotional (-40 %, Nuevo). Status tones for meaning tied to a state.
   * `inverse`: on photos. `outline`: lowest emphasis.
   */
  tone?: TagTone;
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

const toneSx = (tone: TagTone) => {
  if (tone === 'inverse') return { backgroundColor: bs.surface.raised, color: bs.text.primary, borderColor: 'transparent', boxShadow: bs.elevation.e1 };
  if (tone === 'outline') return { backgroundColor: 'transparent', color: bs.text.secondary, borderColor: bs.border.subtle };
  return { backgroundColor: bs.status[tone].bg, color: bs.status[tone].fg, borderColor: bs.status[tone].border };
};

/** Non-interactive label: category, unit, promotion. For booking/payment states use StatusBadge. */
export function Tag({ label, tone = 'neutral', icon, size = 'md' }: TagProps) {
  return (
    <Box
      component="span"
      sx={{
        ...typeScale.caption,
        fontWeight: 600,
        fontSize: size === 'sm' ? '0.6875rem' : '0.75rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        height: size === 'sm' ? 22 : 26,
        px: size === 'sm' ? 2 : 2.5,
        borderRadius: `${radius.xs}px`,
        border: '1px solid',
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '& .MuiSvgIcon-root': { fontSize: size === 'sm' ? 13 : 15 },
        ...toneSx(tone),
      }}
    >
      {icon}
      {label}
    </Box>
  );
}
