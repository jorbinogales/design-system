import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import PlaceRounded from '@mui/icons-material/PlaceRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { BusinessUnitCard } from '../../../blacksix/BusinessUnitCard/BusinessUnitCard';
import { NextAppointmentCard } from '../../../blacksix/NextAppointmentCard/NextAppointmentCard';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { TextField } from '../../../components/fields/TextField/TextField';
import { SkeletonGroup, SkeletonPhotoCard } from '../../../components/feedback/Skeleton/Skeleton';
import { SectionHeader } from '../../../components/layout/SectionHeader/SectionHeader';
import { BottomNav } from '../../../components/navigation/BottomNav/BottomNav';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { businessUnits } from '../../../domain/units';
import { useT } from '../../../i18n/locale';
import { getBookingDetail } from '../../../mocks/bookings';
import { getUnit, serviceCategories } from '../../../mocks/catalog';
import { bs } from '../../../theme/theme';
import { layout, radius } from '../../../theme/tokens';
import { centerListings, forYouOffers } from '../data';
import { Carousel } from '../shared/Carousel';
import { CategoryTile } from '../shared/CategoryTile';
import { CenterCard } from '../shared/CenterCard';
import { OfferCard } from '../shared/OfferCard';
import { useIdSet } from '../shared/useIdSet';

const messages = {
  es: {
    location: 'Ubicación',
    changeLocation: 'Cambiar ubicación, Doral, FL',
    notifications: 'Notificaciones, 3 sin leer',
    search: 'Buscar',
    placeholder: 'Buscar servicios o centros',
    filters: 'Filtros',
    units: 'Elige tu servicio',
    unitsList: 'Unidades de negocio',
    next: 'Tu próxima cita',
    forYou: '#ParaTi',
    forYouList: 'Ofertas para ti',
    services: 'Servicios',
    centers: 'Centros cerca de ti',
    centersList: 'Centros Black Six cercanos',
    loading: 'Cargando inicio',
  },
  en: {
    location: 'Location',
    changeLocation: 'Change location, Doral, FL',
    notifications: 'Notifications, 3 unread',
    search: 'Search',
    placeholder: 'Search services or centers',
    filters: 'Filters',
    units: 'Choose your service',
    unitsList: 'Business units',
    next: 'Your next appointment',
    forYou: '#ForYou',
    forYouList: 'Offers for you',
    services: 'Services',
    centers: 'Centers near you',
    centersList: 'Nearby Black Six centers',
    loading: 'Loading home',
  },
};

export interface HomeScreenProps {
  loading?: boolean;
}

/**
 * Inicio: black header (location, notifications, search + accent filter), the three unit photo cards, the next
 * appointment, #ParaTi offers, service categories and nearby centers. Client bottom nav with Inicio active.
 */
export function HomeScreen({ loading = false }: HomeScreenProps) {
  const t = useT(messages);
  const [query, setQuery] = useState('');
  const [nav, setNav] = useState('home');
  const saved = useIdSet(['c-brickell']);
  const gutter = `${layout.gutter.mobile}px`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar
        tone="inverse"
        leading={
          <ButtonBase
            aria-label={t.changeLocation}
            sx={{ display: 'flex', alignItems: 'center', gap: 2, textAlign: 'left', borderRadius: `${radius.md}px`, py: 1, pr: 2, '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 } }}
          >
            <PlaceRounded aria-hidden sx={{ color: bs.brand.primary }} />
            <Box>
              <Typography variant="caption" component="span" sx={{ display: 'block', color: bs.text.secondary }}>
                {t.location}
              </Typography>
              <Typography variant="h3" component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Doral, FL
                <ExpandMoreRounded aria-hidden sx={{ color: bs.text.secondary }} />
              </Typography>
            </Box>
          </ButtonBase>
        }
        actions={<IconButton label={t.notifications} icon={<NotificationsNoneRounded />} variant="filled" badge />}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              label={t.search}
              hideLabel
              type="search"
              role="search"
              placeholder={t.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              clearable
              onClear={() => setQuery('')}
              startIcon={<SearchRounded />}
            />
          </Box>
          <IconButton variant="accent" size="lg" label={t.filters} icon={<TuneRounded />} sx={{ borderRadius: `${radius.md}px`, flexShrink: 0 }} />
        </Box>
      </TopBar>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, pt: 6, pb: 8 }}>
        {loading ? (
          <Box sx={{ px: gutter }}>
            <SkeletonGroup label={t.loading}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <SkeletonPhotoCard />
                <SkeletonPhotoCard />
              </Box>
            </SkeletonGroup>
          </Box>
        ) : (
          <>
            <Box component="section" aria-label={t.unitsList} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ px: gutter }}>
                <SectionHeader title={t.units} />
              </Box>
              <Carousel label={t.unitsList} gap={4}>
                {businessUnits.map((u) => (
                  <Box key={u} sx={{ width: 286 }}>
                    <BusinessUnitCard unit={u} fromPrice={getUnit(u).fromPrice} onSelect={() => undefined} />
                  </Box>
                ))}
              </Carousel>
            </Box>

            <Box component="section" sx={{ px: gutter, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <SectionHeader title={t.next} />
              <NextAppointmentCard booking={getBookingDetail('BS-24117')} onView={() => undefined} />
            </Box>

            <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ px: gutter }}>
                <SectionHeader title={t.forYou} onAction={() => undefined} />
              </Box>
              <Carousel label={t.forYouList}>
                {forYouOffers.map((o) => (
                  <OfferCard key={o.id} offer={o} />
                ))}
              </Carousel>
            </Box>

            <Box component="section" sx={{ px: gutter, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <SectionHeader title={t.services} onAction={() => undefined} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', columnGap: 2, rowGap: 3 }}>
                {serviceCategories.map((c) => (
                  <CategoryTile key={c.id} category={c} />
                ))}
              </Box>
            </Box>

            <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ px: gutter }}>
                <SectionHeader title={t.centers} onAction={() => undefined} />
              </Box>
              <Carousel label={t.centersList} gap={4}>
                {centerListings.map((l) => (
                  <Box key={l.centerId} sx={{ width: 286 }}>
                    <CenterCard listing={l} saved={saved.has(l.centerId)} onToggleSaved={() => saved.toggle(l.centerId)} />
                  </Box>
                ))}
              </Carousel>
            </Box>
          </>
        )}
      </Box>

      <BottomNav side="client" value={nav} onChange={setNav} />
    </Box>
  );
}
