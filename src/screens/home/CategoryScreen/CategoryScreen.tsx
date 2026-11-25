import Box from '@mui/material/Box';
import { useState } from 'react';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { SectionHeader } from '../../../components/layout/SectionHeader/SectionHeader';
import { FilterChipGroup } from '../../../components/selection/FilterChip/FilterChip';
import { NoResultsState } from '../../../components/screen-states/StatePresets/StatePresets';
import type { ServiceCategoryId } from '../../../domain/booking';
import { unitMeta, type BusinessUnit } from '../../../domain/units';
import { useLocale, useT } from '../../../i18n/locale';
import { getCategoryName, servicePackages } from '../../../mocks/catalog';
import { layout } from '../../../theme/tokens';
import { centerListings, listingCenter } from '../data';
import { CenterCard } from '../shared/CenterCard';
import { PackageListItem } from '../shared/PackageListItem';
import { useIdSet } from '../shared/useIdSet';

const messages = {
  es: { all: 'Todos', units: 'Unidad', packages: 'Paquetes', centers: 'Centros que lo ofrecen', packagesList: 'Paquetes de la categoría', centersList: 'Centros', emptyTitle: 'No hay paquetes en esta unidad' },
  en: { all: 'All', units: 'Unit', packages: 'Packages', centers: 'Centers that offer it', packagesList: 'Category packages', centersList: 'Centers', emptyTitle: 'No packages in this unit' },
};

export interface CategoryScreenProps {
  /** Category to show. Defaults to the exterior wash. */
  categoryId?: ServiceCategoryId;
}

/** Categoría (ej. Lavado exterior): packages of the category with a unit filter, then the centers that offer it. */
export function CategoryScreen({ categoryId = 'exterior' }: CategoryScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const [unit, setUnit] = useState<BusinessUnit | 'all'>('all');
  const saved = useIdSet();
  const gutter = `${layout.gutter.mobile}px`;

  const inCategory = servicePackages.filter((p) => p.categories.includes(categoryId));
  const units = [...new Set(inCategory.map((p) => p.unit))];
  const packages = inCategory.filter((p) => unit === 'all' || p.unit === unit);
  const centers = centerListings.filter((l) => listingCenter(l).units.some((u) => (unit === 'all' ? units.includes(u) : u === unit)));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={getCategoryName(categoryId, locale)} onBack={() => undefined} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, pt: 4, pb: 8 }}>
        <Box sx={{ px: gutter }}>
          <FilterChipGroup
            selectionMode="single"
            label={t.units}
            value={unit}
            onChange={setUnit}
            options={[{ value: 'all', label: t.all }, ...units.map((u) => ({ value: u, label: unitMeta[u].name }))]}
          />
        </Box>

        <Box component="section" sx={{ px: gutter, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <SectionHeader title={t.packages} />
          {packages.length === 0 ? (
            <NoResultsState title={t.emptyTitle} onClear={() => setUnit('all')} />
          ) : (
            <Box component="ul" aria-label={t.packagesList} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {packages.map((p) => (
                <Box component="li" key={p.id}>
                  <PackageListItem pkg={p} onOpen={() => undefined} />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box component="section" sx={{ px: gutter, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <SectionHeader title={t.centers} />
          <Box component="ul" aria-label={t.centersList} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {centers.map((l) => (
              <Box component="li" key={l.centerId}>
                <CenterCard variant="row" listing={l} saved={saved.has(l.centerId)} onToggleSaved={() => saved.toggle(l.centerId)} onOpen={() => undefined} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
