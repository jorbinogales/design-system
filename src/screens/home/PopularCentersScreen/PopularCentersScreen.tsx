import Box from '@mui/material/Box';
import { useState } from 'react';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { FilterChipGroup } from '../../../components/selection/FilterChip/FilterChip';
import { NoResultsState } from '../../../components/screen-states/StatePresets/StatePresets';
import { businessUnits, unitMeta, type BusinessUnit } from '../../../domain/units';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { layout } from '../../../theme/tokens';
import { centerListings, listingCenter, listingUnit } from '../data';
import { CenterCard } from '../shared/CenterCard';
import { useIdSet } from '../shared/useIdSet';

const messages = {
  es: { title: 'Centros populares', all: 'Todos', units: 'Unidad', list: 'Centros populares', emptyTitle: 'No hay centros para esta unidad' },
  en: { title: 'Popular centers', all: 'All', units: 'Unit', list: 'Popular centers', emptyTitle: 'No centers for this unit' },
};

/** Centros populares (Inicio, "Ver todo" de Centros cerca de ti): most reviewed first, with a unit filter. */
export function PopularCentersScreen() {
  const t = useT(messages);
  const nav = useNav();
  const [unit, setUnit] = useState<BusinessUnit | 'all'>('all');
  const saved = useIdSet(['c-doral']);
  const gutter = `${layout.gutter.mobile}px`;
  const list = [...centerListings].filter((l) => unit === 'all' || listingCenter(l).units.includes(unit)).sort((a, b) => b.reviews - a.reviews);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={t.title} onBack={nav.back} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, pt: 4, pb: 8 }}>
        <Box sx={{ px: gutter }}>
          <FilterChipGroup
            selectionMode="single"
            label={t.units}
            value={unit}
            onChange={setUnit}
            options={[{ value: 'all', label: t.all }, ...businessUnits.map((u) => ({ value: u, label: unitMeta[u].name }))]}
          />
        </Box>
        {list.length === 0 ? (
          <NoResultsState title={t.emptyTitle} onClear={() => setUnit('all')} />
        ) : (
          <Box component="ul" aria-label={t.list} sx={{ listStyle: 'none', m: 0, p: 0, px: gutter, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {list.map((l) => (
              <Box component="li" key={l.centerId}>
                <CenterCard variant="row" listing={l} saved={saved.has(l.centerId)} onToggleSaved={() => saved.toggle(l.centerId)} onOpen={() => nav.go('service-detail', { unit: listingUnit(l) })} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
