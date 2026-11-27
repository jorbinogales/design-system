import MyLocationRounded from '@mui/icons-material/MyLocationRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { MapCanvas, type MapPin } from '../../../components/address/MapCanvas/MapCanvas';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { TextField } from '../../../components/fields/TextField/TextField';
import { BottomNav } from '../../../components/navigation/BottomNav/BottomNav';
import { PersonalWashingIcon } from '../../../icons/PersonalWashingIcon';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout, radius, zLayer } from '../../../theme/tokens';
import { centerListings, listingCenter, listingUnit } from '../data';
import { Carousel } from '../shared/Carousel';
import { CenterCard } from '../shared/CenterCard';
import { useIdSet } from '../shared/useIdSet';

const messages = {
  es: {
    map: 'Mapa de centros Black Seat cerca de Doral, FL, con la zona de cobertura de Personal Washing',
    search: 'Buscar',
    placeholder: 'Buscar servicios o centros',
    filters: 'Filtros',
    recenter: 'Centrar en mi ubicación',
    coverage: 'Zona de lavado a domicilio',
    cards: 'Centros en el mapa',
  },
  en: {
    map: 'Map of Black Seat centers near Doral, FL, with the Personal Washing coverage area',
    search: 'Search',
    placeholder: 'Search services or centers',
    filters: 'Filters',
    recenter: 'Center on my location',
    coverage: 'At-home washing area',
    cards: 'Centers on the map',
  },
};

/** Explorar: full-bleed map with center pins, the Personal Washing coverage area, search + filter and a card rail. */
export function ExploreScreen({ defaultSelectedId = 'c-doral' }: { defaultSelectedId?: string }) {
  const t = useT(messages);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(defaultSelectedId);
  const nav = useNav();
  const [tab, setTab] = useState('explore');
  const saved = useIdSet();

  const pins: MapPin[] = centerListings.map((l) => ({ id: l.centerId, kind: 'service', x: l.pin.x, y: l.pin.y, label: listingCenter(l).name }));

  const select = (id: string | null) => {
    setSelectedId(id);
    if (id) document.getElementById(`explore-card-${id}`)?.scrollIntoView({ block: 'nearest', inline: 'start' });
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, height: '100%', minHeight: '100%', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', inset: 0 }}>
        <MapCanvas
          label={t.map}
          ratio={390 / 844}
          rounded={false}
          seed={11}
          pins={pins}
          selectedPinId={selectedId}
          onPinSelect={select}
          serviceArea={{ x: 46, y: 40, radius: 27 }}
          userLocation={{ x: 47, y: 41 }}
        />
      </Box>

      <Box sx={{ position: 'relative', zIndex: zLayer.bottomBar, pt: `calc(${layout.safeAreaTop} + 8px)`, px: `${layout.gutter.mobile}px`, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, width: '100%' }}>
          <Box sx={{ flex: 1, minWidth: 0, borderRadius: `${radius.md}px`, backgroundColor: bs.surface.raised, boxShadow: bs.elevation.e2 }}>
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
        <Tag tone="inverse" icon={<PersonalWashingIcon />} label={t.coverage} />
      </Box>

      <Box sx={{ flex: 1 }} />

      <Box sx={{ position: 'relative', zIndex: zLayer.bottomBar, display: 'flex', flexDirection: 'column', gap: 3, pb: 3 }}>
        <Box sx={{ alignSelf: 'flex-end', mr: `${layout.gutter.mobile}px` }}>
          <IconButton variant="raised" size="lg" label={t.recenter} icon={<MyLocationRounded />} />
        </Box>
        <Carousel label={t.cards} gap={3}>
          {centerListings.map((l) => (
            <Box key={l.centerId} id={`explore-card-${l.centerId}`} sx={{ width: 272 }}>
              <CenterCard listing={l} photoRatio="16:9" selected={selectedId === l.centerId} saved={saved.has(l.centerId)} onToggleSaved={() => saved.toggle(l.centerId)} onOpen={() => nav.go('service-detail', { unit: listingUnit(l), centerId: l.centerId })} />
            </Box>
          ))}
        </Carousel>
      </Box>

      <BottomNav side="client" value={tab} onChange={setTab} />
    </Box>
  );
}
