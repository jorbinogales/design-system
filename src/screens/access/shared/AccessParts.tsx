import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { Button } from '../../../components/actions/Button/Button';
import { Divider } from '../../../components/layout/Divider/Divider';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Screen root: a flex column that fills the device frame's scroll area. */
export function ScreenRoot({ children, sx, ...rest }: BoxProps) {
  return (
    <Box sx={[{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]} {...rest}>
      {children}
    </Box>
  );
}

/** Padded content column between TopBar and the bottom action. `noTopBar` adds the status-bar offset. */
export function ScreenBody({ children, noTopBar = false, sx, ...rest }: BoxProps & { noTopBar?: boolean }) {
  return (
    <Box
      sx={[
        {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          px: `${layout.gutter.mobile}px`,
          pt: noTopBar ? `calc(${layout.safeAreaTop} + 24px)` : 4,
          pb: `calc(24px + ${layout.safeAreaBottom})`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </Box>
  );
}

export function AuthHeading({ title, subtitle, align = 'start' }: { title: ReactNode; subtitle?: ReactNode; align?: 'start' | 'center' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: align === 'center' ? 'center' : 'left' }}>
      <Typography variant="h1" component="h1">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ color: bs.text.secondary }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

/** Concentric circle hero used by the permission screens: the icon sits on a raised disc. */
export function HeroIcon({ children }: { children: ReactNode }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: 144,
        height: 144,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: bs.surface.subtle,
        boxShadow: `0 0 0 14px ${bs.surface.subtle}, 0 0 0 15px ${bs.border.subtle}`,
        m: '15px',
      }}
    >
      <Box sx={{ width: 88, height: 88, borderRadius: '50%', display: 'grid', placeItems: 'center', backgroundColor: bs.surface.raised, boxShadow: bs.elevation.e2, '& svg': { fontSize: 40 } }}>{children}</Box>
    </Box>
  );
}

const socialMessages = {
  es: { or: (verb: string) => `o ${verb} con`, signin: 'Continuar con', apple: 'Apple', google: 'Google' },
  en: { or: (verb: string) => `or ${verb} with`, signin: 'Continue with', apple: 'Apple', google: 'Google' },
};

/** Apple and Google buttons under a labelled divider. */
export function SocialSignIn({ verb, onSelect }: { verb: string; onSelect?: (provider: 'apple' | 'google') => void }) {
  const t = useT(socialMessages);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Divider label={<Typography variant="body2" sx={{ color: bs.text.secondary, px: 1 }}>{t.or(verb)}</Typography>} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        <Button variant="secondary" fullWidth startIcon={<AppleIcon />} aria-label={`${t.signin} ${t.apple}`} onClick={() => onSelect?.('apple')}>
          {t.apple}
        </Button>
        <Button variant="secondary" fullWidth startIcon={<GoogleIcon />} aria-label={`${t.signin} ${t.google}`} onClick={() => onSelect?.('google')}>
          {t.google}
        </Button>
      </Box>
    </Box>
  );
}
