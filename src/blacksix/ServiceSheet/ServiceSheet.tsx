import CheckRounded from '@mui/icons-material/CheckRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ServiceOffering } from '../../domain/booking';
import { unitMeta } from '../../domain/units';
import { useLocale, useT } from '../../i18n/locale';
import { Button } from '../../components/actions/Button/Button';
import { Price } from '../../components/data-display/Price/Price';
import { Tag } from '../../components/data-display/Tag/Tag';
import { KeyValue, KeyValueList } from '../../components/layout/KeyValue/KeyValue';
import { Media } from '../../components/layout/Media/Media';
import { unitPhoto } from '../../mocks/photos';
import { bs } from '../../theme/theme';
import { formatHoursRange } from '../shared/format';

export interface ServiceSheetProps {
  /** Name, category tags and description. Off where the screen already titles the service. */
  intro?: boolean;
  service: ServiceOffering;
  /** Local photo. Without it Media draws the unit fallback. */
  photoSrc?: string;
  /** Draw the photo at the top. Set `false` when the screen already shows the service image (a hero above). Default `true`. */
  showPhoto?: boolean;
  /** Lowest package price. */
  fromPrice: number;
  /** Category labels already localized ("Lavado exterior", "Pulido"). */
  categoryLabels?: string[];
  /** Where it takes place, already localized ("En Black Seat Doral, 8890 NW 26th St"). */
  placeLabel?: string;
  onChooseTime?: () => void;
  /** `inline` (default) renders price + action at the end; `none` when the screen supplies a BottomActionBar. */
  action?: 'inline' | 'none';
}

const messages = {
  es: { includes: 'Qué incluye', notIncluded: 'Qué no incluye', hours: 'Horario de atención', closed: 'Cerrado', choose: 'Elegir horario', where: 'Dónde', alt: (n: string) => `Fotografía del servicio ${n}` },
  en: { includes: 'What is included', notIncluded: 'What is not included', hours: 'Opening hours', closed: 'Closed', choose: 'Choose a time', where: 'Where', alt: (n: string) => `Photo of the ${n} service` },
};

const List = ({ items, icon: Icon, muted = false, label }: { items: string[]; icon: typeof CheckRounded; muted?: boolean; label: string }) => (
  <Box component="ul" aria-label={label} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
    {items.map((item) => (
      <Box component="li" key={item} sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        <Icon aria-hidden sx={{ fontSize: 20, mt: '1px', flexShrink: 0, color: muted ? bs.text.secondary : bs.text.primary }} />
        <Typography variant="body2" sx={{ color: muted ? bs.text.secondary : bs.text.primary }}>
          {item}
        </Typography>
      </Box>
    ))}
  </Box>
);

/** Service detail: image, description, scope (included / not included), opening hours, price and "Elegir horario". */
export function ServiceSheet({ service, photoSrc, showPhoto = true, fromPrice, categoryLabels, placeLabel, onChooseTime, action = 'inline', intro = true }: ServiceSheetProps) {
  const t = useT(messages);
  const locale = useLocale();
  const name = service.name[locale];
  return (
    <Box component="article" sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {showPhoto && <Media src={photoSrc ?? unitPhoto[service.unit]} alt={t.alt(name)} ratio="4:3" radius="lg" unit={service.unit} topStart={<Tag tone="inverse" size="sm" label={unitMeta[service.unit].name} />} />}
      {intro && <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h2" component="h2">
          {name}
        </Typography>
        {categoryLabels && categoryLabels.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {categoryLabels.map((c) => (
              <Tag key={c} label={c} size="sm" />
            ))}
          </Box>
        )}
        <Typography variant="body1" sx={{ color: bs.text.secondary }}>
          {service.description[locale]}
        </Typography>
        {placeLabel && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <PlaceOutlined aria-hidden sx={{ fontSize: 20, mt: '1px', color: bs.text.secondary }} />
            <Typography variant="body2">
              <Box component="span" sx={{ color: bs.text.secondary }}>
                {t.where}:{' '}
              </Box>
              {placeLabel}
            </Typography>
          </Box>
        )}
      </Box>}

      <Box component="section" aria-labelledby={`${service.id}-inc`} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4" component="h3" id={`${service.id}-inc`}>
          {t.includes}
        </Typography>
        <List items={service.includes[locale]} icon={CheckRounded} label={t.includes} />
      </Box>

      <Box component="section" aria-labelledby={`${service.id}-exc`} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4" component="h3" id={`${service.id}-exc`}>
          {t.notIncluded}
        </Typography>
        <List items={service.notIncluded[locale]} icon={CloseRounded} muted label={t.notIncluded} />
      </Box>

      <Box component="section" aria-labelledby={`${service.id}-hrs`} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4" component="h3" id={`${service.id}-hrs`}>
          {t.hours}
        </Typography>
        <KeyValueList>
          {service.hours.map((h) => (
            <KeyValue key={h.days.es} label={h.days[locale]} value={formatHoursRange(h.hours, locale, t.closed)} tabular />
          ))}
        </KeyValueList>
      </Box>

      {action === 'inline' && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap', pt: 2, borderTop: `1px solid ${bs.border.subtle}` }}>
          <Price amount={fromPrice} size="xl" from />
          <Button size="lg" onClick={onChooseTime}>
            {t.choose}
          </Button>
        </Box>
      )}
    </Box>
  );
}
