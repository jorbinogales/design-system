import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { Tag } from '../../../components/data-display/Tag/Tag';
import type { Offer } from '../../../domain/booking';
import { unitMeta } from '../../../domain/units';
import { useLocale, useT } from '../../../i18n/locale';
import { unitIcon } from '../../../icons/unitIcon';
import { blackSeatDate } from './dates';
import { bs } from '../../../theme/theme';
import { radius, transition } from '../../../theme/tokens';
import { InverseSurface } from '../../../theme/SchemeScope';

const messages = {
  es: { until: (d: string) => `Válida hasta ${d}`, view: 'Ver oferta', open: (n: string) => `Ver oferta: ${n}` },
  en: { until: (d: string) => `Valid until ${d}`, view: 'View offer', open: (n: string) => `View offer: ${n}` },
};

/** #ParaTi offer: black card with the badge, the title and the validity. The unit name is real text next to the icon. */
export function OfferCard({ offer, onOpen, width = 300 }: { offer: Offer; onOpen?: (id: string) => void; width?: number | string }) {
  const t = useT(messages);
  const locale = useLocale();
  const Icon = unitIcon[offer.unit];
  const title = offer.title[locale];
  return (
    <InverseSurface sx={{ width, borderRadius: `${radius.lg}px`, overflow: 'hidden', position: 'relative', border: `1px solid ${bs.border.subtle}` }}>
      <Box aria-hidden sx={{ position: 'absolute', right: -18, bottom: -22, color: bs.border.strong, opacity: 0.5 }}>
        <Icon sx={{ width: 132, height: 132 }} />
      </Box>
      <ButtonBase
        onClick={() => onOpen?.(offer.id)}
        aria-label={t.open(title)}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 3,
          width: '100%',
          minHeight: 188,
          p: 5,
          textAlign: 'left',
          color: bs.text.primary,
          transition: transition('background-color'),
          '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover } },
          '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: -4 },
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tag tone="brand" size="sm" label={offer.badge[locale]} />
          <Tag tone="outline" size="sm" icon={<Icon />} label={unitMeta[offer.unit].name} />
        </Box>
        <Typography variant="h3" component="p" sx={{ maxWidth: 220 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: bs.text.secondary }}>
          {t.until(blackSeatDate(offer.validUntil, locale))}
        </Typography>
        <Box sx={{ mt: 'auto', display: 'inline-flex', alignItems: 'center', gap: 1.5, color: bs.text.primary }}>
          <Typography variant="label" component="span">
            {t.view}
          </Typography>
          <ArrowForwardRounded aria-hidden sx={{ fontSize: 18 }} />
        </Box>
      </ButtonBase>
    </InverseSurface>
  );
}
