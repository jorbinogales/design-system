import BookmarkBorderRounded from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRounded from '@mui/icons-material/BookmarkRounded';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { Price } from '../../../components/data-display/Price/Price';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { Card } from '../../../components/layout/Card/Card';
import { Media } from '../../../components/layout/Media/Media';
import { formatDuration } from '../../../blacksix/shared/format';
import type { ServicePackage } from '../../../domain/booking';
import { unitMeta } from '../../../domain/units';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';

const messages = {
  es: { alt: (n: string) => `Fotografía del paquete ${n}`, open: (n: string) => `Ver paquete ${n}`, popular: 'Más elegido', save: (n: string) => `Guardar ${n}`, saved: (n: string) => `Quitar ${n} de guardados` },
  en: { alt: (n: string) => `Photo of the ${n} package`, open: (n: string) => `View ${n} package`, popular: 'Most chosen', save: (n: string) => `Save ${n}`, saved: (n: string) => `Remove ${n} from saved` },
};

export interface PackageListItemProps {
  pkg: ServicePackage;
  /** Discount in %, shows the struck-through original price and a "-40 %" tag. */
  discountPercent?: number;
  discountedAmount?: number;
  onOpen?: (id: string) => void;
  /** Adds a bookmark toggle on the right. */
  saved?: boolean;
  onToggleSaved?: (id: string) => void;
}

/**
 * Package as one row: thumbnail, "Unit · Package", tagline, duration and price (charcoal, never orange).
 * The name is the one link (stretched over the card) so the optional bookmark is not nested in a button.
 */
export function PackageListItem({ pkg, discountPercent, discountedAmount, onOpen, saved = false, onToggleSaved }: PackageListItemProps) {
  const t = useT(messages);
  const locale = useLocale();
  const name = `${unitMeta[pkg.unit].name} · ${pkg.name[locale]}`;
  return (
    <Card component="article">
      <Box sx={{ display: 'grid', gridTemplateColumns: onToggleSaved ? '84px minmax(0, 1fr) auto' : '84px minmax(0, 1fr)', columnGap: 4, alignItems: 'start' }}>
        <Media alt={t.alt(name)} ratio="1:1" radius="md" unit={pkg.unit} />
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <ButtonBase
              onClick={onOpen ? () => onOpen(pkg.id) : undefined}
              aria-label={t.open(name)}
              sx={{
                textAlign: 'left',
                display: 'block',
                position: 'static',
                borderRadius: `${radius.sm}px`,
                '&::after': { content: '""', position: 'absolute', inset: 0, zIndex: 1, borderRadius: `${radius.lg}px` },
                '&.Mui-focusVisible::after': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: -2 },
              }}
            >
              <Typography variant="h4" component="h3">
                {name}
              </Typography>
            </ButtonBase>
            {discountPercent ? <Tag tone="brand" size="sm" label={`-${discountPercent} %`} /> : pkg.popular && !onToggleSaved ? <Tag size="sm" label={t.popular} /> : null}
          </Box>
          <Typography variant="body2" sx={{ color: bs.text.secondary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {pkg.tagline[locale]}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 3, pt: 0.5 }}>
            <Typography variant="caption" component="span" sx={{ color: bs.text.secondary, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
              <ScheduleOutlined aria-hidden sx={{ fontSize: 16 }} />
              {formatDuration(pkg.durationMin)}
            </Typography>
            <Price amount={discountedAmount ?? pkg.price} originalAmount={discountedAmount !== undefined ? pkg.price : undefined} size="md" from={pkg.priceFrom} />
          </Box>
        </Box>
        {onToggleSaved && (
          <Box sx={{ position: 'relative', zIndex: 2, mt: -2, mr: -2 }}>
            <IconButton
              variant="plain"
              pressed={saved}
              label={saved ? t.saved(name) : t.save(name)}
              icon={saved ? <BookmarkRounded sx={{ color: bs.brand.primary }} /> : <BookmarkBorderRounded />}
              onClick={() => onToggleSaved(pkg.id)}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
}
