import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { forYouOffers } from '../data';
import { OfferCard } from '../shared/OfferCard';

const messages = {
  es: { title: '#ParaTi', intro: 'Ofertas de Black Seat elegidas según los servicios que más usas.', list: 'Ofertas para ti' },
  en: { title: '#ForYou', intro: 'Black Seat offers picked from the services you use most.', list: 'Offers for you' },
};

/** Para ti (Inicio, "Ver todo" de #ParaTi): every offer as a full-width card. */
export function ForYouScreen({ onOpen }: { onOpen?: (offerId: string) => void }) {
  const t = useT(messages);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={t.title} onBack={() => undefined} />
      <Box sx={{ flex: 1, px: `${layout.gutter.mobile}px`, pt: 4, pb: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Typography variant="body1" sx={{ color: bs.text.secondary }}>
          {t.intro}
        </Typography>
        <Box component="ul" aria-label={t.list} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {forYouOffers.map((o) => (
            <Box component="li" key={o.id}>
              <OfferCard offer={o} width="100%" onOpen={onOpen} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
