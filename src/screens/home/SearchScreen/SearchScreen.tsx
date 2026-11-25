import CloseRounded from '@mui/icons-material/CloseRounded';
import HistoryRounded from '@mui/icons-material/HistoryRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { SearchField } from '../../../components/fields/SearchField/SearchField';
import { ListGroup, ListRow } from '../../../components/layout/ListRow/ListRow';
import { Media } from '../../../components/layout/Media/Media';
import { SectionHeader } from '../../../components/layout/SectionHeader/SectionHeader';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { unitMeta } from '../../../domain/units';
import { intlLocale } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout, radius, transition } from '../../../theme/tokens';
import { getListing, listingCenter, listingUnit, recentlyViewedCenterIds, recentSearches } from '../data';

const messages = {
  es: {
    title: 'Buscar',
    field: 'Buscar servicios o centros',
    placeholder: 'Buscar servicios o centros',
    recents: 'Búsquedas recientes',
    clearAll: 'Borrar todo',
    clearAllLabel: 'Borrar todas las búsquedas recientes',
    remove: (q: string) => `Quitar “${q}” de las búsquedas recientes`,
    noRecents: 'Todavía no tienes búsquedas recientes. Lo que busques aparecerá aquí.',
    viewed: 'Vistos recientemente',
    alt: (n: string) => `Fotografía de ${n}`,
    rated: (v: string) => `${v} de 5`,
  },
  en: {
    title: 'Search',
    field: 'Search services or centers',
    placeholder: 'Search services or centers',
    recents: 'Recent searches',
    clearAll: 'Clear all',
    clearAllLabel: 'Clear all recent searches',
    remove: (q: string) => `Remove “${q}” from recent searches`,
    noRecents: "You don't have any recent searches yet. What you look for will show up here.",
    viewed: 'Recently viewed',
    alt: (n: string) => `Photo of ${n}`,
    rated: (v: string) => `${v} out of 5`,
  },
};

export interface SearchScreenProps {
  /** Start with no recent searches (empty state). */
  noRecents?: boolean;
}

/** Búsqueda: search field, recent searches (removable, clear all) and recently viewed centers. */
export function SearchScreen({ noRecents = false }: SearchScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [recents, setRecents] = useState(() => (noRecents ? [] : recentSearches.map((r, i) => ({ id: String(i), text: r }))));
  const gutter = `${layout.gutter.mobile}px`;
  const q = query.trim().toLocaleLowerCase();
  const visible = recents.filter((r) => !q || r.text[locale].toLocaleLowerCase().includes(q));
  const nf = new Intl.NumberFormat(intlLocale[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={t.title} onBack={() => undefined}>
        <SearchField label={t.field} hideLabel placeholder={t.placeholder} value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />
      </TopBar>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, pt: 6, pb: 8 }}>
        <Box component="section">
          <Box sx={{ px: gutter, pb: 2 }}>
            <SectionHeader title={t.recents} actionLabel={recents.length ? t.clearAll : undefined} onAction={recents.length ? () => setRecents([]) : undefined} />
          </Box>
          {visible.length === 0 ? (
            <Typography variant="body2" sx={{ px: gutter, py: 3, color: bs.text.secondary }}>
              {t.noRecents}
            </Typography>
          ) : (
            <ListGroup label={t.recents}>
              {visible.map((r) => (
                <Box component="li" key={r.id} sx={{ listStyle: 'none', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${bs.border.subtle}`, pr: 2 }}>
                  <ButtonBase
                    onClick={() => setQuery(r.text[locale])}
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      minHeight: 52,
                      px: gutter,
                      textAlign: 'left',
                      transition: transition('background-color'),
                      '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover } },
                      '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: -2 },
                    }}
                  >
                    <HistoryRounded aria-hidden sx={{ color: bs.text.secondary }} />
                    <Typography variant="body1" sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>
                      {r.text[locale]}
                    </Typography>
                  </ButtonBase>
                  <IconButton
                    variant="plain"
                    label={t.remove(r.text[locale])}
                    icon={<CloseRounded />}
                    onClick={() => setRecents((prev) => prev.filter((x) => x.id !== r.id))}
                    sx={{ flexShrink: 0, borderRadius: `${radius.md}px` }}
                  />
                </Box>
              ))}
            </ListGroup>
          )}
        </Box>

        <Box component="section">
          <Box sx={{ px: gutter, pb: 2 }}>
            <SectionHeader title={t.viewed} />
          </Box>
          <ListGroup label={t.viewed}>
            {recentlyViewedCenterIds.map((id) => {
              const l = getListing(id);
              const c = listingCenter(l);
              return (
                <ListRow
                  key={id}
                  onClick={() => undefined}
                  leading={
                    <Box sx={{ width: 56 }}>
                      <Media alt={t.alt(c.name)} ratio="1:1" radius="md" unit={listingUnit(l)} />
                    </Box>
                  }
                  title={c.name}
                  description={`${c.units.map((u) => unitMeta[u].name).join(' · ')} · ${t.rated(nf.format(l.rating))}`}
                />
              );
            })}
          </ListGroup>
        </Box>
      </Box>
    </Box>
  );
}
