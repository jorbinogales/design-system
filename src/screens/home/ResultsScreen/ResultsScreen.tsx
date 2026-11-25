import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { SearchField } from '../../../components/fields/SearchField/SearchField';
import { SkeletonGroup, SkeletonListRow } from '../../../components/feedback/Skeleton/Skeleton';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { Dropdown } from '../../../components/overlays/Dropdown/Dropdown';
import { ErrorState, NoResultsState } from '../../../components/screen-states/StatePresets/StatePresets';
import { FilterChipGroup } from '../../../components/selection/FilterChip/FilterChip';
import { unitMeta } from '../../../domain/units';
import { useLocale, useT } from '../../../i18n/locale';
import { layout } from '../../../theme/tokens';
import { countActiveFilters, defaultFilters, filteredFromPrice, searchCenters, type SearchFilters, type SortKey } from '../data';
import { CenterCard } from '../shared/CenterCard';
import { useIdSet } from '../shared/useIdSet';

const messages = {
  es: {
    title: 'Resultados',
    field: 'Buscar servicios o centros',
    defaultQuery: 'Lavado',
    units: 'Unidad',
    all: 'Todos',
    count: (n: number) => (n === 1 ? '1 resultado' : `${n} resultados`),
    sort: 'Ordenar por',
    sortOptions: { relevance: 'Más relevantes', distance: 'Más cerca', rating: 'Mejor calificados', price: 'Menor precio' },
    list: 'Resultados de la búsqueda',
    loading: 'Cargando resultados',
    errorTitle: 'No pudimos cargar los resultados',
  },
  en: {
    title: 'Results',
    field: 'Search services or centers',
    defaultQuery: 'Wash',
    units: 'Unit',
    all: 'All',
    count: (n: number) => (n === 1 ? '1 result' : `${n} results`),
    sort: 'Sort by',
    sortOptions: { relevance: 'Most relevant', distance: 'Nearest', rating: 'Top rated', price: 'Lowest price' },
    list: 'Search results',
    loading: 'Loading results',
    errorTitle: "We couldn't load the results",
  },
};

export interface ResultsScreenProps {
  /** Initial text. Defaults to a localized "Lavado" / "Wash". */
  defaultQuery?: string;
  defaultFilters?: SearchFilters;
  loading?: boolean;
  error?: boolean;
  onOpenFilters?: () => void;
}

/** Resultados: search with filter button, unit chips, "N resultados" with sort and the center list. */
export function ResultsScreen({ defaultQuery, defaultFilters: initialFilters = defaultFilters, loading = false, error = false, onOpenFilters }: ResultsScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const [query, setQuery] = useState(defaultQuery ?? t.defaultQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const saved = useIdSet();
  const gutter = `${layout.gutter.mobile}px`;
  const results = searchCenters(query, filters, locale);

  const clear = () => {
    setQuery('');
    setFilters(defaultFilters);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={t.title} onBack={() => undefined}>
        <SearchField label={t.field} hideLabel value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} onFilterClick={onOpenFilters ?? (() => undefined)} activeFilters={countActiveFilters(filters)} />
      </TopBar>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, pt: 4, pb: 8 }}>
        <Box sx={{ px: gutter }}>
          <FilterChipGroup
            selectionMode="single"
            label={t.units}
            value={filters.unit}
            onChange={(unit) => setFilters((f) => ({ ...f, unit }))}
            options={[{ value: 'all', label: t.all }, ...(['detailing', 'towing', 'personal-washing'] as const).map((u) => ({ value: u, label: unitMeta[u].name }))]}
          />
        </Box>

        {loading ? (
          <SkeletonGroup label={t.loading}>
            {[0, 1, 2, 3].map((i) => (
              <SkeletonListRow key={i} />
            ))}
          </SkeletonGroup>
        ) : error ? (
          <ErrorState title={t.errorTitle} onRetry={() => undefined} />
        ) : results.length === 0 ? (
          <NoResultsState query={query || undefined} onClear={clear} />
        ) : (
          <>
            <Box sx={{ px: gutter, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
              <Typography variant="h4" component="h2" aria-live="polite">
                {t.count(results.length)}
              </Typography>
              <Dropdown<SortKey>
                label={t.sort}
                size="sm"
                value={filters.sort}
                onChange={(sort) => setFilters((f) => ({ ...f, sort }))}
                options={(Object.keys(t.sortOptions) as SortKey[]).map((k) => ({ value: k, label: t.sortOptions[k] }))}
              />
            </Box>
            <Box component="ul" aria-label={t.list} sx={{ m: 0, p: 0, px: gutter, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {results.map((l) => (
                <Box component="li" key={l.centerId}>
                  <CenterCard variant="row" listing={l} fromPrice={filteredFromPrice(l.centerId, filters)} saved={saved.has(l.centerId)} onToggleSaved={() => saved.toggle(l.centerId)} onOpen={() => undefined} />
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
