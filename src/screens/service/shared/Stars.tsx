import StarBorderRounded from '@mui/icons-material/StarBorderRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import Rating, { type RatingProps } from '@mui/material/Rating';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';

const messages = {
  es: { label: (v: number) => `Calificación ${v} de 5` },
  en: { label: (v: number) => `Rated ${v} out of 5` },
};

/**
 * MUI Rating with Black Six tokens: orange filled stars, strong-border empty stars. The value is also
 * announced (`getLabelText`) and callers show it as text, so the color is never the only cue.
 */
export function Stars({ starSize = 20, sx, ...rest }: Omit<RatingProps, 'size'> & { starSize?: number }) {
  const t = useT(messages);
  return (
    <Rating
      precision={rest.readOnly ? 0.5 : 1}
      getLabelText={(v) => t.label(v)}
      icon={<StarRounded fontSize="inherit" />}
      emptyIcon={<StarBorderRounded fontSize="inherit" />}
      {...rest}
      sx={[
        {
          fontSize: starSize,
          gap: starSize > 28 ? 1 : 0,
          '& .MuiRating-iconFilled': { color: bs.brand.primary },
          '& .MuiRating-iconEmpty': { color: bs.border.strong },
          '& .MuiRating-iconHover': { color: bs.brand.primary },
          '&.Mui-focusVisible .MuiRating-iconActive': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2, borderRadius: `${radius.sm}px` },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
