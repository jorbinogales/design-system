import Box from '@mui/material/Box';
import { Wordmark } from '../../../brand/Wordmark';
import { useT } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { InverseSurface } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';

const messages = { es: { loading: 'Cargando Black Seat' }, en: { loading: 'Loading Black Seat' } };

/**
 * Loading screen: black surface, the BLACKSEAT wordmark is the loader. A dim copy sits underneath and a
 * white copy fills it left to right, on a loop, until the app is ready.
 */
export function SplashScreen() {
  const t = useT(messages);
  return (
    <InverseSurface sx={{ flex: 1, minHeight: '100dvh', display: 'grid', placeItems: 'center' }}>
      <Box role="status" aria-live="polite" sx={{ position: 'relative' }}>
        <Box component="span" sx={visuallyHidden}>
          {t.loading}
        </Box>
        <Box aria-hidden>
          <Wordmark size="xl" color={bs.text.disabled} />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              '@keyframes bsFill': {
                '0%': { clipPath: 'inset(0 100% 0 0)' },
                '70%, 100%': { clipPath: 'inset(0 0% 0 0)' },
              },
              animation: 'bsFill 1.4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
            }}
          >
            <Wordmark size="xl" color={bs.text.primary} />
          </Box>
        </Box>
      </Box>
    </InverseSurface>
  );
}
