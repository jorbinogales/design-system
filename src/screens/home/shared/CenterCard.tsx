import BookmarkBorderRounded from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRounded from '@mui/icons-material/BookmarkRounded';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import StarRounded from '@mui/icons-material/StarRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { formatSlotTime } from '../../../components/date-time/TimeSlot/TimeSlot';
import { Price } from '../../../components/data-display/Price/Price';
import { Card } from '../../../components/layout/Card/Card';
import { Media, MediaBookmark, MediaRating, type MediaRatio } from '../../../components/layout/Media/Media';
import { unitMeta } from '../../../domain/units';
import { intlLocale } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { centerClosing, centerFromPrice, listingCenter, listingUnit, type CenterListing } from '../data';

const messages = {
  es: {
    miles: 'mi',
    drive: (n: number) => `${n} min en auto`,
    open: (t: string) => `Abierto hasta ${t}`,
    alt: (n: string) => `Fotografía de ${n}`,
    open_: (n: string) => `Abrir ${n}`,
    rated: (v: string, n: number) => `Calificación ${v} de 5, ${n} reseñas`,
    save: (n: string) => `Guardar ${n}`,
    saved: (n: string) => `Quitar ${n} de guardados`,
  },
  en: {
    miles: 'mi',
    drive: (n: number) => `${n} min drive`,
    open: (t: string) => `Open until ${t}`,
    alt: (n: string) => `Photo of ${n}`,
    open_: (n: string) => `Open ${n}`,
    rated: (v: string, n: number) => `Rated ${v} out of 5, ${n} reviews`,
    save: (n: string) => `Save ${n}`,
    saved: (n: string) => `Remove ${n} from saved`,
  },
};

export interface CenterCardProps {
  listing: CenterListing;
  saved: boolean;
  onToggleSaved: () => void;
  /** `card`: photo on top (carousels, map). `row`: thumbnail beside the text (lists). */
  variant?: 'card' | 'row';
  selected?: boolean;
  onOpen?: () => void;
  photoRatio?: MediaRatio;
  /** Price shown as "Desde"; defaults to the lowest of the center. */
  fromPrice?: number;
}

const meta = { display: 'inline-flex', alignItems: 'center', gap: 1, color: bs.text.secondary, minWidth: 0 } as const;

/**
 * A Black Six center as a photo card with rating, distance, drive time and a bookmark. The name is the one
 * link (stretched over the card), so the bookmark button is not nested inside another button.
 */
export function CenterCard({ listing, saved, onToggleSaved, variant = 'card', selected = false, onOpen, photoRatio = '3:2', fromPrice }: CenterCardProps) {
  const t = useT(messages);
  const locale = useLocale();
  const center = listingCenter(listing);
  const unit = listingUnit(listing);
  const nf = new Intl.NumberFormat(intlLocale[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const rating = nf.format(listing.rating);
  const units = center.units.map((u) => unitMeta[u].name).join(' · ');
  const price = fromPrice ?? centerFromPrice(center.id);

  const stretched = {
    textAlign: 'left',
    display: 'block',
    position: 'static',
    maxWidth: '100%',
    borderRadius: `${radius.sm}px`,
    '&::after': { content: '""', position: 'absolute', inset: 0, zIndex: 1, borderRadius: `${radius.lg}px` },
    '&.Mui-focusVisible::after': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: -2 },
  } as const;

  const title = (
    <ButtonBase onClick={onOpen} aria-label={t.open_(center.name)} sx={stretched}>
      <Typography variant="h4" component="h3" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {center.name}
      </Typography>
    </ButtonBase>
  );

  const distance = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', rowGap: 0.5 }}>
      <Typography variant="body2" component="span" sx={meta}>
        <PlaceOutlined aria-hidden sx={{ fontSize: 16 }} />
        {nf.format(listing.distanceMi)} {t.miles}
      </Typography>
      <Typography variant="body2" component="span" sx={meta}>
        <ScheduleOutlined aria-hidden sx={{ fontSize: 16 }} />
        {t.drive(listing.driveMin)}
      </Typography>
    </Box>
  );

  if (variant === 'row') {
    return (
      <Card component="article" selected={selected}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '88px minmax(0, 1fr) auto', columnGap: 3, alignItems: 'start' }}>
          <Media alt={t.alt(center.name)} ratio="1:1" radius="md" unit={unit} />
          <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {title}
            <Box role="img" aria-label={t.rated(rating, listing.reviews)} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarRounded aria-hidden sx={{ fontSize: 16, color: bs.brand.primary }} />
              <Typography variant="body2" component="span" aria-hidden sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {rating}
              </Typography>
              <Typography variant="body2" component="span" aria-hidden sx={{ color: bs.text.secondary }}>
                ({listing.reviews})
              </Typography>
            </Box>
            {distance}
            <Box sx={{ pt: 0.5 }}>
              <Price amount={price} size="sm" from />
            </Box>
          </Box>
          <Box sx={{ position: 'relative', zIndex: 2, mt: -2, mr: -2 }}>
            <IconButton
              variant="plain"
              label={saved ? t.saved(center.name) : t.save(center.name)}
              pressed={saved}
              icon={saved ? <BookmarkRounded sx={{ color: bs.brand.primary }} /> : <BookmarkBorderRounded />}
              onClick={onToggleSaved}
            />
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Card component="article" flush selected={selected}>
      <Box sx={{ position: 'relative', zIndex: 2, pointerEvents: 'none', '& button': { pointerEvents: 'auto' } }}>
        <Media
          alt={t.alt(center.name)}
          ratio={photoRatio}
          radius="none"
          unit={unit}
          topStart={<MediaRating value={listing.rating} count={listing.reviews} />}
          topEnd={<MediaBookmark saved={saved} onToggle={onToggleSaved} itemName={center.name} />}
        />
      </Box>
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {title}
        {distance}
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 3, pt: 0.5 }}>
          <Typography variant="caption" sx={{ color: bs.text.secondary, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {t.open(formatSlotTime(centerClosing(center), locale))}
          </Typography>
          <Price amount={price} size="sm" from />
        </Box>
        <Typography variant="caption" sx={{ color: bs.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {units}
        </Typography>
      </Box>
    </Card>
  );
}
