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
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { getBookingDetail } from '../../../mocks/bookings';
import { getUnit, serviceCategories } from '../../../mocks/catalog';
import { bs } from '../../../theme/theme';
import { layout, radius } from '../../../theme/tokens';
import { centerListings, forYouOffers, listingUnit } from '../data';
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
    centersList: 'Centros Black Seat cercanos',
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
    centersList: 'Nearby Black Seat centers',
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
  const nav = useNav();
  const [tab, setTab] = useState('home');
  const saved = useIdSet(['c-brickell']);
  const gutter = `${layout.gutter.mobile}px`;
  // ponytail: mock "next appointment"; becomes the user's soonest upcoming booking (or none) with the backend.
  const next = getBookingDetail('BS-24117');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar
        tone="inverse"
        leading={
          <ButtonBase
            aria-label={t.changeLocation}
            onClick={() => nav.go('enter-location', { from: 'home' })}
            sx={{ alignSelf: 'start', justifySelf: 'start', justifyContent: 'flex-start', ml: -3, display: 'flex', alignItems: 'center', gap: 2, textAlign: 'left', borderRadius: `${radius.md}px`, py: 1, pr: 2, '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 } }}
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
        actions={<IconButton label={t.notifications} icon={<NotificationsNoneRounded />} variant="filled" badge onClick={() => nav.go('notifications')} />}
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
              onFocus={() => nav.go('search')}
              clearable
              onClear={() => setQuery('')}
              startIcon={<SearchRounded />}
            />
          </Box>
          <IconButton variant="accent" size="lg" label={t.filters} icon={<TuneRounded />} onClick={() => nav.go('filter')} sx={{ borderRadius: `${radius.md}px`, flexShrink: 0 }} />
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
            {next && (
              <Box component="section" sx={{ px: gutter, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <SectionHeader title={t.next} />
                <NextAppointmentCard booking={next} onView={(bookingId) => nav.go('track-order', { bookingId })} />
              </Box>
            )}

            <Box component="section" aria-label={t.unitsList} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ px: gutter }}>
                <SectionHeader title={t.units} />
              </Box>
              <Carousel label={t.unitsList} gap={4}>
                {businessUnits.map((u) => (
                  <Box key={u} sx={{ width: 286 }}>
                    <BusinessUnitCard unit={u} fromPrice={getUnit(u).fromPrice} onSelect={(unit) => nav.go('service-detail', { unit })} />
                  </Box>
                ))}
              </Carousel>
            </Box>

            <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ px: gutter }}>
                <SectionHeader title={t.forYou} onAction={() => nav.go('for-you')} />
              </Box>
              <Carousel label={t.forYouList}>
                {forYouOffers.map((o) => (
                  <OfferCard key={o.id} offer={o} onOpen={(offerId) => nav.go('offer', { offerId })} />
                ))}
              </Carousel>
            </Box>

            <Box component="section" sx={{ px: gutter, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <SectionHeader title={t.services} onAction={() => nav.go('categories')} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', columnGap: 2, rowGap: 3 }}>
                {serviceCategories.map((c) => (
                  <CategoryTile key={c.id} category={c} onOpen={(categoryId) => nav.go('category', { categoryId })} />
                ))}
              </Box>
            </Box>

            <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ px: gutter }}>
                <SectionHeader title={t.centers} onAction={() => nav.go('popular-centers')} />
              </Box>
              <Carousel label={t.centersList} gap={4}>
                {centerListings.map((l) => (
                  <Box key={l.centerId} sx={{ width: 286 }}>
                    <CenterCard listing={l} saved={saved.has(l.centerId)} onToggleSaved={() => saved.toggle(l.centerId)} onOpen={() => nav.go('service-detail', { unit: listingUnit(l), centerId: l.centerId })} />
                  </Box>
                ))}
              </Carousel>
            </Box>
          </>
        )}
      </Box>

      <BottomNav side="client" value={tab} onChange={setTab} />
    </Box>
  );
}
