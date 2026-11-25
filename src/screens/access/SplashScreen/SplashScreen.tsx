import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Wordmark } from '../../../brand/Wordmark';
import { useT } from '../../../i18n/locale';
import { InverseSurface } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';

const messages = {
  es: { units: ['Detailing', 'Towing', 'Personal Washing'], tagline: 'Cuidamos tu auto, donde estés.' },
  en: { units: ['Detailing', 'Towing', 'Personal Washing'], tagline: 'We take care of your car, wherever you are.' },
};

/** Splash: wordmark centered on the black surface, the three units named at the foot. */
export function SplashScreen() {
  const t = useT(messages);
  return (
    <InverseSurface sx={{ flex: 1, minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: `${layout.gutter.mobile}px`, position: 'relative' }}>
      <Wordmark size="xl" orientation="stacked" withMark />
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: `calc(48px + ${layout.safeAreaBottom})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, px: `${layout.gutter.mobile}px`, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: bs.text.secondary }}>
          {t.tagline}
        </Typography>
        <Box component="ul" aria-label="Black Six" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, columnGap: 4 }}>
          {t.units.map((u) => (
            <Typography key={u} component="li" variant="caption" sx={{ color: bs.text.primary, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box aria-hidden sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: bs.brand.primary }} />
              {u}
            </Typography>
          ))}
        </Box>
      </Box>
    </InverseSurface>
  );
}
