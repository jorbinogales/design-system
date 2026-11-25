import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Wordmark } from '../../../brand/Wordmark';
import { Button } from '../../../components/actions/Button/Button';
import { Link } from '../../../components/actions/Link/Link';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { Media } from '../../../components/layout/Media/Media';
import { unitMeta, type BusinessUnit } from '../../../domain/units';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { ScreenRoot } from '../shared/AccessParts';

const messages = {
  es: {
    title: 'Detailing, grúa y lavado en un solo lugar.',
    body: 'Reserva, sigue y paga cada servicio de tu auto desde el teléfono.',
    start: 'Comenzar',
    haveAccount: '¿Ya tienes cuenta?',
    signIn: 'Inicia sesión',
    alt: (u: string) => `Foto de ${u}`,
  },
  en: {
    title: 'Detailing, towing and washing in one place.',
    body: 'Book, track and pay for every service for your car from your phone.',
    start: 'Get started',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    alt: (u: string) => `Photo of ${u}`,
  },
};

/** A collage tile that fills its grid cell (Media normally sizes itself by aspect ratio). */
function Tile({ unit }: { unit: BusinessUnit }) {
  const t = useT(messages);
  return (
    <Box sx={{ height: '100%', minHeight: 0, '& > *': { aspectRatio: 'auto !important', height: '100%' } }}>
      <Media alt={t.alt(unitMeta[unit].name)} unit={unit} radius="xl" bottomStart={<Tag label={unitMeta[unit].name} tone="inverse" size="sm" />} />
    </Box>
  );
}

export interface WelcomeScreenProps {
  onStart?: () => void;
  onSignIn?: () => void;
}

/** Welcome: photo collage of the three units, one headline, one primary action. */
export function WelcomeScreen({ onStart, onSignIn }: WelcomeScreenProps) {
  const t = useT(messages);
  return (
    <ScreenRoot sx={{ pt: `calc(${layout.safeAreaTop} + 16px)` }}>
      <Box sx={{ px: `${layout.gutter.mobile}px` }}>
        <Wordmark size="sm" withMark />
      </Box>
      <Box
        sx={{
          mx: `${layout.gutter.mobile}px`,
          mt: 5,
          height: 340,
          display: 'grid',
          gridTemplateColumns: '1.15fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 3,
        }}
      >
        <Box sx={{ gridRow: 'span 2', minHeight: 0 }}>
          <Tile unit="detailing" />
        </Box>
        <Tile unit="towing" />
        <Tile unit="personal-washing" />
      </Box>
      <Box sx={{ px: `${layout.gutter.mobile}px`, pt: 8, pb: `calc(24px + ${layout.safeAreaBottom})`, mt: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="display" component="h1">
            {t.title}
          </Typography>
          <Typography variant="body1" sx={{ color: bs.text.secondary }}>
            {t.body}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Button fullWidth onClick={onStart}>
            {t.start}
          </Button>
          <Typography variant="body2" sx={{ textAlign: 'center', color: bs.text.secondary }}>
            {t.haveAccount}{' '}
            <Link size="sm" onClick={onSignIn}>
              {t.signIn}
            </Link>
          </Typography>
        </Box>
      </Box>
    </ScreenRoot>
  );
}
