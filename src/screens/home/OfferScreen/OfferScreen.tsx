import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { unitMeta } from '../../../domain/units';
import { useLocale, useT } from '../../../i18n/locale';
import { unitIcon } from '../../../icons/unitIcon';
import { InverseSurface } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { layout, radius } from '../../../theme/tokens';
import { discountedPrice, forYouOffers, getOfferPackages, offerDeals } from '../data';
import { blackSeatDate } from '../shared/dates';
import { PackageListItem } from '../shared/PackageListItem';

const messages = {
  es: {
    title: 'Oferta',
    off: 'de descuento',
    until: (d: string) => `Válida hasta el ${d}`,
    packages: 'Paquetes con descuento',
    list: 'Paquetes de la oferta',
    note: 'El descuento se aplica al elegir horario. No se acumula con otras ofertas.',
  },
  en: {
    title: 'Offer',
    off: 'off',
    until: (d: string) => `Valid until ${d}`,
    packages: 'Discounted packages',
    list: 'Offer packages',
    note: 'The discount is applied when you choose a time. It cannot be combined with other offers.',
  },
};

export interface OfferScreenProps {
  /** `off-40` (default, 40 % off at-home washing) or any offer with a deal, e.g. `off-1`. */
  offerId?: string;
}

/** Oferta (ej. 40 %): the offer summary and its packages with discounted prices next to the original. */
export function OfferScreen({ offerId = 'off-40' }: OfferScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const offer = forYouOffers.find((o) => o.id === offerId) ?? forYouOffers[0];
  const percent = offerDeals[offer.id]?.percent ?? 0;
  const Icon = unitIcon[offer.unit];
  const gutter = `${layout.gutter.mobile}px`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={t.title} onBack={() => undefined} />
      <Box sx={{ flex: 1, px: gutter, pt: 4, pb: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <InverseSurface sx={{ position: 'relative', overflow: 'hidden', borderRadius: `${radius.lg}px`, border: `1px solid ${bs.border.subtle}` }}>
          <Box aria-hidden sx={{ position: 'absolute', right: -22, bottom: -26, color: bs.border.strong, opacity: 0.5 }}>
            <Icon sx={{ width: 150, height: 150 }} />
          </Box>
          <Box sx={{ position: 'relative', p: 5, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
            <Tag tone="outline" size="sm" icon={<Icon />} label={unitMeta[offer.unit].name} />
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="display" component="p" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {percent} %
              </Typography>
              <Typography variant="h3" component="p">
                {t.off}
              </Typography>
            </Box>
            <Typography variant="h3" component="h2" sx={{ maxWidth: 260 }}>
              {offer.title[locale]}
            </Typography>
            <Typography variant="body2" sx={{ color: bs.text.secondary, maxWidth: 280 }}>
              {offer.description[locale]}
            </Typography>
            <Typography variant="caption" sx={{ color: bs.text.secondary }}>
              {t.until(blackSeatDate(offer.validUntil, locale))}
            </Typography>
          </Box>
        </InverseSurface>

        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h3" component="h2">
            {t.packages}
          </Typography>
          <Box component="ul" aria-label={t.list} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {getOfferPackages(offer.id).map((p) => (
              <Box component="li" key={p.id}>
                <PackageListItem pkg={p} discountPercent={percent} discountedAmount={discountedPrice(p.price, percent)} onOpen={() => undefined} />
              </Box>
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: bs.text.secondary }}>
            {t.note}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
