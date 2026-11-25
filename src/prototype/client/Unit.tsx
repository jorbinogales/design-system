import CheckRounded from '@mui/icons-material/CheckRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { PackageCard } from '../../blackseat/PackageCard/PackageCard';
import { ProfessionalCard } from '../../blackseat/ProfessionalCard/ProfessionalCard';
import { formatHoursRange } from '../../blackseat/shared/format';
import { BottomActionBar } from '../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../components/actions/Button/Button';
import { Tag } from '../../components/data-display/Tag/Tag';
import { InlineAlert } from '../../components/feedback/InlineAlert/InlineAlert';
import { Card } from '../../components/layout/Card/Card';
import { KeyValue, KeyValueList } from '../../components/layout/KeyValue/KeyValue';
import { Media } from '../../components/layout/Media/Media';
import { unitMeta, type BusinessUnit } from '../../domain/units';
import { useLocale, useT } from '../../i18n/locale';
import { bs } from '../../theme/theme';
import { center, getPackage, packagesFor, professionals, unitCopy, unitHours } from '../data';
import { useProto } from '../store';
import { BlockTitle, FlowTopBar, ScreenBody, ScreenRoot, TotalSummary } from './shared';

const messages = {
  es: {
    packages: 'Elige tu paquete',
    towingPackages: 'Elige el tipo de traslado',
    hours: 'Horario de atención',
    closed: 'Cerrado',
    who: 'Quién te atiende',
    whoNote: 'Te confirmamos el profesional un día antes de tu cita.',
    where: 'Dónde',
    covers: 'Qué cubre y qué no',
    price: 'Precio',
    next: 'Elegir horario',
    nextTowing: 'Datos de la subasta',
    place: { center: 'En nuestro centro de Charlotte', 'customer-address': 'En tu casa', 'auction-yard': 'Copart e IAA en Carolina del Norte' },
  },
  en: {
    packages: 'Choose your package',
    towingPackages: 'Choose the transport type',
    hours: 'Opening hours',
    closed: 'Closed',
    who: "Who'll take care of you",
    whoNote: 'We confirm your professional one day before your appointment.',
    where: 'Where',
    covers: "What's covered and what's not",
    price: 'Price',
    next: 'Choose a time',
    nextTowing: 'Auction details',
    place: { center: 'At our Charlotte center', 'customer-address': 'At your home', 'auction-yard': 'Copart and IAA in North Carolina' },
  },
};

/** Portal de unidad: photo, what it is, where, packages (single choice), hours and who attends. */
export function UnitScreen({ unit }: { unit: BusinessUnit }) {
  const t = useT(messages);
  const locale = useLocale();
  const { draft, setDraft, go, startBooking } = useProto();
  useEffect(() => {
    if (draft.unit !== unit) startBooking(unit);
  }, [unit, draft.unit, startBooking]);
  const copy = unitCopy[unit];
  const pkgs = packagesFor(unit);
  const selected = draft.unit === unit ? getPackage(draft.packageId) : pkgs[0];
  const lead = professionals.find((p) => p.units.includes(unit) && p.role.es.startsWith('Líder'));

  return (
    <ScreenRoot>
      <FlowTopBar title={unitMeta[unit].name} step={0} />
      <ScreenBody gap={7}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Media alt={unitMeta[unit].name} unit={unit} ratio="16:9" radius="lg" topStart={<Tag tone="inverse" size="sm" label={t.place[copy.place]} />} />
          <Typography variant="body1" sx={{ color: bs.text.secondary }}>
            {copy.description[locale]}
          </Typography>
          {copy.note && <InlineAlert severity="info">{copy.note[locale]}</InlineAlert>}
        </Box>

        <Box component="section" aria-labelledby="h-pkg" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <BlockTitle id="h-pkg">{unit === 'towing' ? t.towingPackages : t.packages}</BlockTitle>
          <Box role="radiogroup" aria-labelledby="h-pkg" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {pkgs.map((p) => (
              <PackageCard key={p.id} pkg={p} selected={p.id === selected.id} onSelect={(id) => setDraft({ unit, packageId: id })} />
            ))}
          </Box>
        </Box>

        {unit === 'towing' && (
          <Box component="section" aria-labelledby="h-covers" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <BlockTitle id="h-covers">{t.covers}</BlockTitle>
            <Card variant="outlined">
              <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {selected.includes[locale].map((x) => (
                  <Box component="li" key={x} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <CheckRounded aria-hidden sx={{ fontSize: 20, color: bs.status.success.fg }} />
                    <Typography variant="body2">{x}</Typography>
                  </Box>
                ))}
                {(selected.notIncluded?.[locale] ?? []).map((x) => (
                  <Box component="li" key={x} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', color: bs.text.secondary }}>
                    <CloseRounded aria-hidden sx={{ fontSize: 20 }} />
                    <Typography variant="body2">
                      <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                        {locale === 'es' ? 'No incluye: ' : 'Not included: '}
                      </Box>
                      {x}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        )}

        <Box component="section" aria-labelledby="h-hours" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <BlockTitle id="h-hours">{t.hours}</BlockTitle>
          <Card variant="filled">
            <KeyValueList>
              {unitHours[unit].map((h) => (
                <KeyValue key={h.days.es} label={h.days[locale]} value={formatHoursRange(h.hours, locale, t.closed)} tabular />
              ))}
              {unit === 'detailing' && <KeyValue label={t.where} value={`${center.address.line1}, ${center.address.city}`} />}
            </KeyValueList>
          </Card>
        </Box>

        <Box component="section" aria-labelledby="h-who" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <BlockTitle id="h-who">{t.who}</BlockTitle>
          <ProfessionalCard professional={lead} unit={unit} />
          <Typography variant="caption" sx={{ color: bs.text.secondary }}>
            {t.whoNote}
          </Typography>
        </Box>
      </ScreenBody>

      <BottomActionBar summary={<TotalSummary label={selected.name[locale]} amount={selected.price} from={selected.priceFrom} />}>
        <Button
          onClick={() => {
            setDraft({ unit, packageId: selected.id });
            go({ name: unit === 'towing' ? 'towing' : 'schedule' });
          }}
        >
          {unit === 'towing' ? t.nextTowing : t.next}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
