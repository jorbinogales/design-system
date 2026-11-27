import PlaceRounded from '@mui/icons-material/PlaceRounded';
import RadioButtonCheckedRounded from '@mui/icons-material/RadioButtonCheckedRounded';
import StraightRounded from '@mui/icons-material/StraightRounded';
import TurnRightRounded from '@mui/icons-material/TurnRightRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { MapCanvas } from '../../../components/address/MapCanvas/MapCanvas';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { intlLocale } from '../../../i18n/format';
import { useNav } from '../../../app/nav';
import { useLocale, useT } from '../../../i18n/locale';
import { getCenter } from '../../../mocks/catalog';
import { InverseSurface } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { layout, radius } from '../../../theme/tokens';
import { getListing } from '../../home/data';
import { serviceCenterId } from '../data';

const messages = {
  es: {
    title: 'Cómo llegar',
    map: (n: string) => `Mapa con la ruta desde tu ubicación hasta ${n}`,
    eta: (m: number) => `${m} min`,
    arrive: (t: string) => `Llegas a las ${t}`,
    from: 'Tu ubicación',
    start: 'Iniciar',
    stop: 'Finalizar',
    navigating: 'Navegación en curso',
    next: 'Sigue por NW 87th Ave',
    nextThen: 'Luego gira a la derecha en NW 26th St',
    inMiles: (d: string) => `en ${d} mi`,
    arrivalTime: '9:45 a. m.',
  },
  en: {
    title: 'Get directions',
    map: (n: string) => `Map with the route from your location to ${n}`,
    eta: (m: number) => `${m} min`,
    arrive: (t: string) => `You arrive at ${t}`,
    from: 'Your location',
    start: 'Start',
    stop: 'End',
    navigating: 'Navigation in progress',
    next: 'Continue on NW 87th Ave',
    nextThen: 'Then turn right onto NW 26th St',
    inMiles: (d: string) => `in ${d} mi`,
    arrivalTime: '9:45 AM',
  },
};

/** Cómo llegar: route and ETA on the map, next maneuver and "Iniciar". */
export function DirectionsScreen({ defaultStarted = false }: { defaultStarted?: boolean }) {
  const t = useT(messages);
  const nav = useNav();
  const locale = useLocale();
  const [started, setStarted] = useState(defaultStarted);
  const center = getCenter(serviceCenterId)!;
  const listing = getListing(serviceCenterId);
  const nf = new Intl.NumberFormat(intlLocale[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={t.title} subtitle={center.name} onBack={nav.back} />
      <MapCanvas
        label={t.map(center.name)}
        ratio={390 / 500}
        rounded={false}
        seed={5}
        pins={[{ id: 'dest', kind: 'destination', x: 62, y: 34, label: center.name }]}
        selectedPinId="dest"
        route={[
          [30, 78],
          [30, 62],
          [48, 62],
          [48, 34],
          [62, 34],
        ]}
        userLocation={{ x: 30, y: 78 }}
        eta={{ label: t.eta(listing.driveMin), x: 39, y: 56 }}
      />
      <Box sx={{ flex: 1, mt: -6, position: 'relative', backgroundColor: bs.surface.canvas, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, boxShadow: bs.elevation.e2, px: `${layout.gutter.mobile}px`, pt: 5, pb: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Box>
          <Typography variant="h1" component="p" aria-live="polite" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {t.eta(listing.driveMin)}{' '}
            <Typography component="span" variant="body1" sx={{ color: bs.text.secondary }}>
              · {nf.format(listing.distanceMi)} mi
            </Typography>
          </Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.arrive(t.arrivalTime)}
          </Typography>
        </Box>

        <InverseSurface sx={{ display: 'flex', alignItems: 'center', gap: 4, p: 4, borderRadius: `${radius.lg}px` }}>
            <Box aria-hidden sx={{ display: 'grid', placeItems: 'center', width: 48, height: 48, borderRadius: `${radius.md}px`, backgroundColor: bs.surface.raised, color: bs.text.primary }}>
              {started ? <TurnRightRounded /> : <StraightRounded />}
            </Box>
            <Box sx={{ minWidth: 0, color: bs.text.primary }}>
              <Typography variant="h4" component="p">
                {t.next}{' '}
                <Typography component="span" variant="body2" sx={{ color: bs.text.secondary }}>
                  {t.inMiles(nf.format(0.4))}
                </Typography>
              </Typography>
              <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                {t.nextThen}
              </Typography>
            </Box>
        </InverseSurface>

        <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <RadioButtonCheckedRounded aria-hidden sx={{ color: bs.text.secondary }} />
            <Typography variant="body1">{t.from}</Typography>
          </Box>
          <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <PlaceRounded aria-hidden sx={{ color: bs.text.primary }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {center.name}
            </Typography>
          </Box>
        </Box>
        {started && (
          <Typography variant="caption" role="status" sx={{ color: bs.text.secondary }}>
            {t.navigating}
          </Typography>
        )}
      </Box>
      <BottomActionBar>
        <Button variant={started ? 'secondary' : 'primary'} size="lg" fullWidth onClick={() => (started ? nav.go('arrived') : setStarted(true))}>
          {started ? t.stop : t.start}
        </Button>
      </BottomActionBar>
    </Box>
  );
}
