import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { unitMeta, type BusinessUnit } from '../../domain/units';
import { useLocale, useT } from '../../i18n/locale';
import { unitIcon } from '../../icons/unitIcon';
import { Price } from '../../components/data-display/Price/Price';
import { Tag } from '../../components/data-display/Tag/Tag';
import { Card } from '../../components/layout/Card/Card';
import { Media } from '../../components/layout/Media/Media';
import { bs } from '../../theme/theme';

export interface BusinessUnitCardProps {
  unit: BusinessUnit;
  /** `hero` for Home (photo on top) · `compact` for lists and the service chooser (thumbnail beside the text). */
  variant?: 'hero' | 'compact';
  /** Local photo (`public/`). Without it, Media draws the unit fallback. */
  photoSrc?: string;
  /** Lowest price of the unit; shows "Desde $X". */
  fromPrice?: number;
  selected?: boolean;
  onSelect?: (unit: BusinessUnit) => void;
  href?: string;
}

const messages = {
  es: {
    explore: 'Explorar',
    place: { detailing: 'En nuestros centros', towing: 'Recogida en subasta', 'personal-washing': 'A domicilio' },
    alt: (name: string) => `Fotografía de ${name}`,
  },
  en: {
    explore: 'Explore',
    place: { detailing: 'At our centers', towing: 'Auction pickup', 'personal-washing': 'At your place' },
    alt: (name: string) => `Photo of ${name}`,
  },
};

/**
 * One of the three Black Six units. The name is always real text (not only the photo or the icon),
 * so Detailing, Towing and Personal Washing are told apart without color or imagery.
 */
export function BusinessUnitCard({ unit, variant = 'hero', photoSrc, fromPrice, selected = false, onSelect, href }: BusinessUnitCardProps) {
  const t = useT(messages);
  const locale = useLocale();
  const meta = unitMeta[unit];
  const Icon = unitIcon[unit];
  const interactive = Boolean(onSelect || href);
  const handle = onSelect ? () => onSelect(unit) : undefined;

  if (variant === 'compact') {
    return (
      <Card href={href} onClick={handle} label={interactive ? meta.name : undefined} selected={selected} density="comfortable" component="article">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box sx={{ width: 76, flexShrink: 0 }}>
            <Media src={photoSrc} alt={t.alt(meta.name)} ratio="1:1" radius="md" unit={unit} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h4" component="h3">
              {meta.name}
            </Typography>
            <Typography variant="body2" sx={{ color: bs.text.secondary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {meta.summary[locale]}
            </Typography>
            {fromPrice !== undefined && (
              <Box sx={{ mt: 1 }}>
                <Price amount={fromPrice} size="sm" from />
              </Box>
            )}
          </Box>
          {interactive && <ArrowForwardRounded aria-hidden sx={{ color: bs.text.secondary, flexShrink: 0 }} />}
        </Box>
      </Card>
    );
  }

  return (
    <Card href={href} onClick={handle} label={interactive ? meta.name : undefined} selected={selected} flush component="article">
      <Media src={photoSrc} alt={t.alt(meta.name)} ratio="3:2" radius="none" unit={unit} topStart={<Tag tone="inverse" size="sm" label={t.place[unit]} />} />
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon aria-hidden sx={{ fontSize: 24 }} />
          <Typography variant="h3" component="h3">
            {meta.name}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: bs.text.secondary }}>
          {meta.summary[locale]}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, mt: 1 }}>
          {fromPrice !== undefined ? <Price amount={fromPrice} size="md" from /> : <span />}
          {interactive && (
            <Typography variant="label" component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: bs.text.link }}>
              {t.explore}
              <ArrowForwardRounded aria-hidden sx={{ fontSize: 18 }} />
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
}
