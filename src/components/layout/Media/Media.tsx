import BookmarkBorderRounded from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRounded from '@mui/icons-material/BookmarkRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import Box from '@mui/material/Box';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { useState, type ComponentType, type ReactNode } from 'react';
import type { BusinessUnit } from '../../../domain/units';
import { useLocale, useT } from '../../../i18n/locale';
import { intlLocale } from '../../../i18n/format';
import { unitIcon } from '../../../icons/unitIcon';
import { bs } from '../../../theme/theme';
import { radius as radii, typeScale } from '../../../theme/tokens';
import { IconButton } from '../../actions/IconButton/IconButton';

export type MediaRatio = '1:1' | '4:3' | '3:2' | '16:9' | '21:9' | '3:4' | '4:5' | number | 'fill';
export type MediaRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface MediaProps {
  /** Photo URL. Local assets only (`public/`); never hotlink unverified URLs. Omit for the fallback. */
  src?: string;
  /** Required. Describe the photo; pass `""` only when it is purely decorative. */
  alt: string;
  /** Aspect ratio, or `fill` to take the parent's full height (call backdrops, collage cells). */
  ratio?: MediaRatio;
  /** `full` makes a circle (profile photo). */
  radius?: MediaRadius;
  /** Picks the fallback icon (Detailing, Towing, Personal Washing). */
  unit?: BusinessUnit;
  /** Custom fallback icon; wins over `unit`. */
  fallbackIcon?: ComponentType<SvgIconProps>;
  /** Overlay slots, inset 12px from each corner. */
  topStart?: ReactNode;
  topEnd?: ReactNode;
  bottomStart?: ReactNode;
  bottomEnd?: ReactNode;
  /** Free overlay content (e.g. a title on a promo card). Use with `scrim`. */
  children?: ReactNode;
  /**
   * Bottom gradient that keeps overlay text legible over any photo: two stacked `scrim`
   * layers reach ~77% opacity at the bottom edge, so white text clears 4.5:1 even on white.
   * Put overlay text inside `<SchemeScope scheme="dark">`.
   */
  scrim?: boolean;
  loading?: 'lazy' | 'eager';
  objectPosition?: string;
}

const ratioCss = (r: MediaRatio) => (typeof r === 'number' ? String(r) : r.replace(':', ' / '));

const slot = (pos: object) => ({ position: 'absolute', zIndex: 2, display: 'flex', gap: 2, ...pos }) as const;

/**
 * Photo box: fixed aspect ratio, rounded corners, overlay slots for rating/bookmark badges,
 * and a designed fallback (tonal hatch + unit icon) when there is no photo or it fails to load.
 */
export function Media({
  src,
  alt,
  ratio = '16:9',
  radius = 'lg',
  unit,
  fallbackIcon,
  topStart,
  topEnd,
  bottomStart,
  bottomEnd,
  children,
  scrim = false,
  loading = 'lazy',
  objectPosition = 'center',
}: MediaProps) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;
  const FallbackIcon = fallbackIcon ?? (unit ? unitIcon[unit] : undefined);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        ...(ratio === 'fill' ? { height: '100%' } : { aspectRatio: ratioCss(ratio) }),
        borderRadius: radius === 'full' ? '50%' : `${radii[radius]}px`,
        overflow: 'hidden',
        isolation: 'isolate',
        backgroundColor: bs.surface.muted,
      }}
    >
      {showPhoto ? (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => setFailed(true)}
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition }}
        />
      ) : (
        <Box
          role={alt ? 'img' : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            backgroundImage: `repeating-linear-gradient(135deg, transparent 0 11px, ${bs.border.subtle} 11px 12px), radial-gradient(circle at 30% 20%, ${bs.surface.subtle}, transparent 70%)`,
          }}
        >
          {FallbackIcon && (
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: '30%',
                maxWidth: 112,
                minWidth: 48,
                aspectRatio: '1',
                borderRadius: '50%',
                backgroundColor: bs.surface.raised,
                color: bs.text.secondary,
                boxShadow: bs.elevation.e1,
              }}
            >
              <FallbackIcon sx={{ width: '50%', height: '50%' }} />
            </Box>
          )}
        </Box>
      )}
      {scrim && (
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: 1, backgroundImage: `linear-gradient(to top, ${bs.scrim} 0%, transparent 70%), linear-gradient(to top, ${bs.scrim} 0%, transparent 45%)` }} />
      )}
      {children && <Box sx={{ position: 'absolute', inset: 0, zIndex: 2 }}>{children}</Box>}
      {topStart && <Box sx={slot({ top: 12, left: 12 })}>{topStart}</Box>}
      {topEnd && <Box sx={slot({ top: 12, right: 12 })}>{topEnd}</Box>}
      {bottomStart && <Box sx={slot({ bottom: 12, left: 12 })}>{bottomStart}</Box>}
      {bottomEnd && <Box sx={slot({ bottom: 12, right: 12 })}>{bottomEnd}</Box>}
    </Box>
  );
}

const badgeMessages = {
  es: {
    rating: (v: string, c?: string) => `Calificación ${v} de 5${c ? `, ${c} reseñas` : ''}`,
    save: (n: string) => `Guardar ${n}`,
    saved: (n: string) => `Quitar ${n} de guardados`,
  },
  en: {
    rating: (v: string, c?: string) => `Rated ${v} out of 5${c ? `, ${c} reviews` : ''}`,
    save: (n: string) => `Save ${n}`,
    saved: (n: string) => `Remove ${n} from saved`,
  },
};

export interface MediaRatingProps {
  /** 0–5, one decimal shown. */
  value: number;
  /** Number of reviews (announced, shown only if `showCount`). */
  count?: number;
  showCount?: boolean;
}

/** Rating badge for the `topStart` slot. The star is orange; the number carries the meaning. */
export function MediaRating({ value, count, showCount = false }: MediaRatingProps) {
  const locale = useLocale();
  const t = useT(badgeMessages);
  const fmt = new Intl.NumberFormat(intlLocale[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const v = fmt.format(value);
  const c = count === undefined ? undefined : new Intl.NumberFormat(intlLocale[locale]).format(count);
  return (
    <Box
      role="img"
      aria-label={t.rating(v, c)}
      sx={{
        ...typeScale.label,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        height: 30,
        pl: 1.5,
        pr: 2.5,
        borderRadius: `${radii.pill}px`,
        backgroundColor: bs.surface.raised,
        color: bs.text.primary,
        boxShadow: bs.elevation.e1,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <StarRounded aria-hidden sx={{ fontSize: 18, color: bs.brand.primary }} />
      <span aria-hidden>{v}</span>
      {showCount && c && (
        <Box component="span" aria-hidden sx={{ color: bs.text.secondary, fontWeight: 500 }}>
          ({c})
        </Box>
      )}
    </Box>
  );
}

export interface MediaBookmarkProps {
  saved: boolean;
  onToggle: () => void;
  /** Name of the saved item, used in the accessible label ("Guardar Pulido Cerámico"). */
  itemName: string;
}

/** Bookmark toggle for the `topEnd` slot. Outline → filled glyph, plus `aria-pressed`. */
export function MediaBookmark({ saved, onToggle, itemName }: MediaBookmarkProps) {
  const t = useT(badgeMessages);
  return (
    <IconButton
      variant="raised"
      size="sm"
      pressed={saved}
      label={saved ? t.saved(itemName) : t.save(itemName)}
      icon={saved ? <BookmarkRounded sx={{ color: bs.brand.primary }} /> : <BookmarkBorderRounded />}
      onClick={onToggle}
      sx={{ width: 40, height: 40 }}
    />
  );
}
