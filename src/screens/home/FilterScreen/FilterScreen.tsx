import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useState, type ReactNode } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { RadioGroup } from '../../../components/selection/Radio/Radio';
import { FilterChipGroup } from '../../../components/selection/FilterChip/FilterChip';
import { unitMeta } from '../../../domain/units';
import { formatMoney } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { serviceCategories } from '../../../mocks/catalog';
import { layout } from '../../../theme/tokens';
import { bs } from '../../../theme/theme';
import { defaultFilters, priceBounds, searchCenters, type SearchFilters, type SortKey } from '../data';

const messages = {
  es: {
    title: 'Filtrar',
    unit: 'Unidad',
    all: 'Todas',
    service: 'Servicio',
    price: 'Rango de precio',
    priceRange: (a: string, b: string) => `${a} a ${b}`,
    priceMin: 'Precio mínimo',
    priceMax: 'Precio máximo',
    rating: 'Calificación mínima',
    ratingAll: 'Todas',
    sort: 'Ordenar por',
    sortOptions: { relevance: 'Más relevantes', distance: 'Más cerca', rating: 'Mejor calificados', price: 'Menor precio' },
    reset: 'Restablecer',
    apply: (n: number) => (n === 1 ? 'Aplicar · 1 centro' : `Aplicar · ${n} centros`),
    applyNone: 'Sin centros con estos filtros',
  },
  en: {
    title: 'Filter',
    unit: 'Unit',
    all: 'All',
    service: 'Service',
    price: 'Price range',
    priceRange: (a: string, b: string) => `${a} to ${b}`,
    priceMin: 'Minimum price',
    priceMax: 'Maximum price',
    rating: 'Minimum rating',
    ratingAll: 'Any',
    sort: 'Sort by',
    sortOptions: { relevance: 'Most relevant', distance: 'Nearest', rating: 'Top rated', price: 'Lowest price' },
    reset: 'Reset',
    apply: (n: number) => (n === 1 ? 'Apply · 1 center' : `Apply · ${n} centers`),
    applyNone: 'No centers with these filters',
  },
};

const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Typography variant="h4" component="h2">
      {title}
    </Typography>
    {children}
  </Box>
);

export interface FilterScreenProps {
  defaultValue?: SearchFilters;
}

/** Filtro: unit, service chips, price range (MUI Slider), minimum rating and sort. Restablecer / Aplicar in the bottom bar. */
export function FilterScreen({ defaultValue = defaultFilters }: FilterScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const [f, setF] = useState<SearchFilters>(defaultValue);
  const matches = searchCenters('', f, locale).length;
  const [lo, hi] = f.price;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={t.title} onBack={() => undefined} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, px: `${layout.gutter.mobile}px`, pt: 4, pb: 8 }}>
        <Group title={t.unit}>
          <FilterChipGroup
            selectionMode="single"
            label={t.unit}
            overflow="wrap"
            value={f.unit}
            onChange={(unit) => setF((s) => ({ ...s, unit }))}
            options={[{ value: 'all', label: t.all }, ...(['detailing', 'towing', 'personal-washing'] as const).map((u) => ({ value: u, label: unitMeta[u].name }))]}
          />
        </Group>

        <Group title={t.service}>
          <FilterChipGroup
            selectionMode="multiple"
            label={t.service}
            overflow="wrap"
            value={f.services}
            onChange={(services) => setF((s) => ({ ...s, services }))}
            options={serviceCategories.map((c) => ({ value: c.id, label: c.name[locale] }))}
          />
        </Group>

        <Group title={t.price}>
          <Typography variant="price" component="p" aria-live="polite" sx={{ color: bs.text.primary, fontVariantNumeric: 'tabular-nums' }}>
            {t.priceRange(formatMoney(lo, locale), `${formatMoney(hi, locale)}${hi >= priceBounds[1] ? '+' : ''}`)}
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={f.price}
              min={priceBounds[0]}
              max={priceBounds[1]}
              step={10}
              disableSwap
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => formatMoney(v, locale)}
              getAriaLabel={(i) => (i === 0 ? t.priceMin : t.priceMax)}
              getAriaValueText={(v) => formatMoney(v, locale)}
              onChange={(_, v) => setF((s) => ({ ...s, price: v as [number, number] }))}
            />
          </Box>
        </Group>

        <Group title={t.rating}>
          <FilterChipGroup
            selectionMode="single"
            label={t.rating}
            overflow="wrap"
            value={String(f.minRating)}
            onChange={(v) => setF((s) => ({ ...s, minRating: Number(v) }))}
            options={[
              { value: '0', label: t.ratingAll },
              { value: '4', label: '4.0+' },
              { value: '4.5', label: '4.5+' },
              { value: '4.8', label: '4.8+' },
            ]}
          />
        </Group>

        <RadioGroup<SortKey>
          label={t.sort}
          value={f.sort}
          onChange={(sort) => setF((s) => ({ ...s, sort }))}
          options={(Object.keys(t.sortOptions) as SortKey[]).map((k) => ({ value: k, label: t.sortOptions[k] }))}
        />
      </Box>

      <BottomActionBar>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 3 }}>
          <Button variant="secondary" size="lg" fullWidth onClick={() => setF(defaultFilters)}>
            {t.reset}
          </Button>
          <Button variant="primary" size="lg" fullWidth disabled={matches === 0} aria-label={matches === 0 ? t.applyNone : undefined}>
            {t.apply(matches)}
          </Button>
        </Box>
      </BottomActionBar>
    </Box>
  );
}
