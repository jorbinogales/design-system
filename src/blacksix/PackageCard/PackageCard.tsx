import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ServicePackage } from '../../domain/booking';
import { useLocale, useT } from '../../i18n/locale';
import { Button } from '../../components/actions/Button/Button';
import { Price } from '../../components/data-display/Price/Price';
import { Tag } from '../../components/data-display/Tag/Tag';
import { Card } from '../../components/layout/Card/Card';
import { bs } from '../../theme/theme';
import { formatDuration } from '../shared/format';

export interface PackageCardProps {
  pkg: ServicePackage;
  selected?: boolean;
  /** Called with the package id when the customer picks it. */
  onSelect?: (id: string) => void;
  /** Heading level of the package name (default 3). */
  headingLevel?: 2 | 3 | 4;
}

const messages = {
  es: { choose: 'Elegir paquete', chosen: 'Paquete elegido', popular: 'Más elegido', includes: 'Incluye', duration: 'Duración estimada', notIncluded: 'No incluye', unit: 'por servicio' },
  en: { choose: 'Choose package', chosen: 'Package chosen', popular: 'Most chosen', includes: 'Includes', duration: 'Estimated duration', notIncluded: 'Not included', unit: 'per service' },
};

/**
 * A package of one unit with what it includes, estimated duration and price. The only action is
 * "Elegir paquete" (secondary: orange is reserved for the selection and the final confirmation).
 */
export function PackageCard({ pkg, selected = false, onSelect, headingLevel = 3 }: PackageCardProps) {
  const t = useT(messages);
  const locale = useLocale();
  const name = pkg.name[locale];
  // The whole card picks the package by pointer; the button stays the keyboard/screen-reader target.
  return (
    <Box onClick={() => onSelect?.(pkg.id)} sx={{ cursor: onSelect ? 'pointer' : undefined, WebkitTapHighlightColor: 'transparent' }}>
    <Card selected={selected} component="article" variant="outlined">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h3" component={`h${headingLevel}` as 'h3'}>
              {name}
            </Typography>
            <Typography variant="body2" sx={{ color: bs.text.secondary, mt: 1 }}>
              {pkg.tagline[locale]}
            </Typography>
          </Box>
          {selected ? (
            <CheckCircleRounded aria-hidden sx={{ color: bs.selection.border, flexShrink: 0 }} />
          ) : pkg.popular ? (
            <Tag tone="brand" size="sm" label={t.popular} />
          ) : null}
        </Box>

        <Box component="section" aria-label={`${t.includes}: ${name}`}>
          <Typography variant="caption" sx={{ color: bs.text.secondary, display: 'block', mb: 2 }}>
            {t.includes}
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {pkg.includes[locale].map((item) => (
              <Box component="li" key={item} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <CheckRounded aria-hidden sx={{ fontSize: 18, mt: '2px', color: bs.text.secondary, flexShrink: 0 }} />
                <Typography variant="body2">{item}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: bs.text.secondary }}>
          <ScheduleOutlined aria-hidden sx={{ fontSize: 18 }} />
          <Typography variant="body2">
            {t.duration}: <Box component="span" sx={{ color: bs.text.primary, fontWeight: 600 }}>~{formatDuration(pkg.durationMin)}</Box>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
          <Price amount={pkg.price} size="lg" from={pkg.priceFrom} />
          <Button
            variant="secondary"
            size="md"
            aria-pressed={selected}
            aria-label={`${selected ? t.chosen : t.choose}: ${name}`}
            startIcon={selected ? <CheckRounded /> : undefined}
            sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            {selected ? t.chosen : t.choose}
          </Button>
        </Box>
      </Box>
    </Card>
    </Box>
  );
}
