import SearchRounded from '@mui/icons-material/SearchRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MapCanvas } from '../../../components/address/MapCanvas/MapCanvas';
import { Button } from '../../../components/actions/Button/Button';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { Media, MediaRating } from '../../../components/layout/Media/Media';
import { unitMeta, businessUnits } from '../../../domain/units';
import { formatMoney } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { Wordmark } from '../../../brand/Wordmark';
import { InverseSurface } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { centerPins } from '../data';

const messages = {
  es: {
    mapLabel: 'Mapa con los centros Black Six del área de Miami y la zona de cobertura',
    search: 'Buscar centros y servicios',
    center: 'Black Six Doral',
    centerMeta: '2,1 mi · Abierto hasta 7 p. m.',
    hello: 'Hola, Andrea',
    pick: 'Elige un servicio',
    unitAlt: (u: string) => `Foto de ${u}`,
    bookings: 'Reservas',
    tabs: ['Activas', 'Completadas', 'Canceladas'],
    confirmed: 'Confirmada',
    pending: 'Pendiente',
    towTitle: 'Recogida en Copart Miami South',
    towMeta: 'Lote 05503318 · Código 0071',
    towWhen: 'Lun 30 nov · 2:00 p. m.',
    detTitle: 'Detailing Premium · Toyota RAV4',
    detMeta: 'Black Six Doral',
    detWhen: 'Vie 27 nov · 10:00 a. m.',
    track: 'Ver reserva',
    cancel: 'Cancelar',
  },
  en: {
    mapLabel: 'Map with the Black Six centers in the Miami area and the coverage zone',
    search: 'Search centers and services',
    center: 'Black Six Doral',
    centerMeta: '2.1 mi · Open until 7 PM',
    hello: 'Hi, Andrea',
    pick: 'Choose a service',
    unitAlt: (u: string) => `Photo of ${u}`,
    bookings: 'Bookings',
    tabs: ['Active', 'Completed', 'Cancelled'],
    confirmed: 'Confirmed',
    pending: 'Pending',
    towTitle: 'Pickup at Copart Miami South',
    towMeta: 'Lot 05503318 · Code 0071',
    towWhen: 'Mon Nov 30 · 2:00 PM',
    detTitle: 'Premium Detailing · Toyota RAV4',
    detMeta: 'Black Six Doral',
    detWhen: 'Fri Nov 27 · 10:00 AM',
    track: 'View booking',
    cancel: 'Cancel',
  },
};

/** Onboarding 1: map with centers and the service area. */
export function MapPreview() {
  const t = useT(messages);
  return (
    <Box sx={{ position: 'relative', width: 390, height: 844 }}>
      <MapCanvas label={t.mapLabel} ratio={390 / 844} rounded={false} pins={centerPins} pinLabels="none" serviceArea={{ x: 48, y: 38, radius: 34 }} userLocation={{ x: 50, y: 40 }} seed={11} />
      <Box
        sx={{
          position: 'absolute',
          top: 62,
          left: 16,
          right: 16,
          height: 52,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          borderRadius: `${radius.lg}px`,
          backgroundColor: bs.surface.raised,
          boxShadow: bs.elevation.e2,
          color: bs.text.secondary,
        }}
      >
        <SearchRounded />
        <Typography variant="body1">{t.search}</Typography>
      </Box>
      <Box sx={{ position: 'absolute', left: 16, right: 16, top: 470, p: 3, display: 'flex', gap: 4, borderRadius: `${radius.lg}px`, backgroundColor: bs.surface.raised, boxShadow: bs.elevation.e2 }}>
        <Box sx={{ width: 96, flexShrink: 0 }}>
          <Media alt="" ratio="1:1" radius="md" unit="detailing" topStart={<MediaRating value={4.9} />} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
          <Typography variant="h3">{t.center}</Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.centerMeta}
          </Typography>
          <Box>
            <Tag label="Detailing" size="sm" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/** Onboarding 2: the three units on the client home. */
export function UnitsPreview() {
  const t = useT(messages);
  const locale = useLocale();
  return (
    <Box sx={{ width: 390, height: 844, backgroundColor: bs.surface.canvas }}>
      <InverseSurface sx={{ pt: '58px', pb: 6, px: 5, display: 'flex', flexDirection: 'column', gap: 4, borderBottomLeftRadius: `${radius.xl}px`, borderBottomRightRadius: `${radius.xl}px` }}>
        <Wordmark size="sm" />
        <Typography variant="h2">{t.hello}</Typography>
      </InverseSurface>
      <Box sx={{ px: 5, pt: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="h3">{t.pick}</Typography>
        {businessUnits.map((u) => (
          <Box key={u} sx={{ display: 'flex', gap: 4, p: 3, borderRadius: `${radius.lg}px`, border: `1px solid ${bs.border.subtle}`, backgroundColor: bs.surface.raised }}>
            <Box sx={{ width: 104, flexShrink: 0 }}>
              <Media alt={t.unitAlt(unitMeta[u].name)} ratio="1:1" radius="md" unit={u} />
            </Box>
            <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
              <Typography variant="h3">{unitMeta[u].name}</Typography>
              <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                {unitMeta[u].summary[locale]}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function BookingMini({ unit, tag, tone, title, meta, code, when, total }: { unit: 'towing' | 'detailing'; tag: string; tone: 'info' | 'warning'; title: string; meta: string; code: string; when: string; total: string }) {
  const t = useT(messages);
  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4, borderRadius: `${radius.lg}px`, border: `1px solid ${bs.border.subtle}`, backgroundColor: bs.surface.raised }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag label={tag} tone={tone} />
        <Typography variant="code" sx={{ color: bs.text.secondary }}>
          {code}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ width: 88, flexShrink: 0 }}>
          <Media alt="" ratio="1:1" radius="md" unit={unit} />
        </Box>
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center' }}>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {meta}
          </Typography>
          <Typography variant="body2">{when}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
        <Typography variant="price">{total}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="secondary" size="sm">
            {t.cancel}
          </Button>
          <Button size="sm">{t.track}</Button>
        </Box>
      </Box>
    </Box>
  );
}

/** Onboarding 3: the bookings list with tabs and two cards. */
export function BookingsPreview() {
  const t = useT(messages);
  const locale = useLocale();
  return (
    <Box sx={{ width: 390, height: 844, backgroundColor: bs.surface.canvas }}>
      <Box sx={{ pt: '64px', px: 5 }}>
        <Typography variant="h2">{t.bookings}</Typography>
        <Box sx={{ display: 'flex', mt: 4, borderBottom: `1px solid ${bs.border.subtle}` }}>
          {t.tabs.map((label, i) => (
            <Box key={label} sx={{ flex: 1, py: 3, textAlign: 'center', fontWeight: i === 0 ? 700 : 500, color: i === 0 ? bs.text.primary : bs.text.secondary, borderBottom: `3px solid ${i === 0 ? bs.brand.primary : 'transparent'}`, mb: '-1px', fontSize: 14 }}>
              {label}
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <BookingMini unit="detailing" tag={t.confirmed} tone="info" title={t.detTitle} meta={t.detMeta} code="BS-24117" when={t.detWhen} total={formatMoney(169, locale)} />
        <BookingMini unit="towing" tag={t.pending} tone="warning" title={t.towTitle} meta={t.towMeta} code="BS-24120" when={t.towWhen} total={formatMoney(140, locale)} />
      </Box>
    </Box>
  );
}
