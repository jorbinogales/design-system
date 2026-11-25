import AddRounded from '@mui/icons-material/AddRounded';
import Box, { type BoxProps } from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { Locale } from '../../i18n/locale';
import { bs } from '../../theme/theme';
import { layout, radius, transition } from '../../theme/tokens';

/** Bilingual string used by the screen data files. */
export interface L {
  es: string;
  en: string;
}
export const pick = (l: L, locale: Locale): string => l[locale];

/** Screen root: flex column that fills the device scroll area (DESIGN.md §7). */
export function ScreenRoot({ children, sx, ...rest }: BoxProps) {
  return (
    <Box
      {...rest}
      sx={[{ display: 'flex', flexDirection: 'column', flex: '1 0 auto', minHeight: '100%', backgroundColor: bs.surface.canvas, color: bs.text.primary }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {children}
    </Box>
  );
}

/** Padded content column between the top bar and the bottom bar. */
export function ScreenBody({ children, gap = 5, sx, ...rest }: BoxProps & { gap?: number }) {
  return (
    <Box
      component="main"
      {...rest}
      sx={[{ display: 'flex', flexDirection: 'column', gap, px: `${layout.gutter.mobile}px`, pt: 3, pb: 6 }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {children}
    </Box>
  );
}

/** Dashed "add" row (Agregar tarjeta, Agregar nueva dirección). 56px tall, full width. */
export function AddRow({ label, onClick }: { label: ReactNode; onClick?: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        minHeight: 64,
        gap: 3,
        px: 4,
        borderRadius: `${radius.lg}px`,
        border: `1.5px dashed ${bs.border.strong}`,
        color: bs.text.primary,
        justifyContent: 'center',
        font: 'inherit',
        transition: transition('background-color', 'border-color'),
        '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover } },
        '&:active': { backgroundColor: bs.action.pressed },
        '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 },
      }}
    >
      <AddRounded aria-hidden />
      <Typography variant="label" component="span" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
    </ButtonBase>
  );
}

/** Round soft container for a leading icon in list rows. */
export function IconBubble({ children }: { children: ReactNode }) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', backgroundColor: bs.surface.subtle, color: bs.text.primary, flexShrink: 0 }}
    >
      {children}
    </Box>
  );
}
