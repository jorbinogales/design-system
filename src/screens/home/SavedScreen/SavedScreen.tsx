import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { Media } from '../../../components/layout/Media/Media';
import { SectionHeader } from '../../../components/layout/SectionHeader/SectionHeader';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { BottomSheet } from '../../../components/overlays/BottomSheet/BottomSheet';
import { NoItemsState, NoResultsState } from '../../../components/screen-states/StatePresets/StatePresets';
import { FilterChipGroup } from '../../../components/selection/FilterChip/FilterChip';
import { SkeletonGroup, SkeletonListRow } from '../../../components/feedback/Skeleton/Skeleton';
import { businessUnits, unitMeta, type BusinessUnit } from '../../../domain/units';
import { useLocale, useT } from '../../../i18n/locale';
import { servicePackages } from '../../../mocks/catalog';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { centerListings, listingCenter, listingUnit } from '../data';
import { CenterCard } from '../shared/CenterCard';
import { PackageListItem } from '../shared/PackageListItem';

const messages = {
  es: {
    title: 'Guardados',
    all: 'Todos',
    units: 'Unidad',
    centers: 'Centros',
    packages: 'Paquetes',
    centersList: 'Centros guardados',
    packagesList: 'Paquetes guardados',
    emptyTitle: 'Aún no guardas nada',
    emptyBody: 'Toca el marcador en un centro o un paquete para tenerlo a mano aquí.',
    emptyAction: 'Explorar centros',
    noUnit: (u: string) => `No tienes guardados en ${u}`,
    sheetTitle: '¿Quitar de guardados?',
    sheetBody: 'Dejarás de verlo en esta lista. Puedes volver a guardarlo cuando quieras.',
    cancel: 'Cancelar',
    confirm: 'Sí, quitar',
    removed: 'Quitado de guardados',
    undo: 'Deshacer',
    loading: 'Cargando guardados',
    alt: (n: string) => `Fotografía de ${n}`,
  },
  en: {
    title: 'Saved',
    all: 'All',
    units: 'Unit',
    centers: 'Centers',
    packages: 'Packages',
    centersList: 'Saved centers',
    packagesList: 'Saved packages',
    emptyTitle: "You haven't saved anything yet",
    emptyBody: 'Tap the bookmark on a center or a package to keep it handy here.',
    emptyAction: 'Explore centers',
    noUnit: (u: string) => `Nothing saved in ${u}`,
    sheetTitle: 'Remove from saved?',
    sheetBody: "You'll stop seeing it in this list. You can save it again anytime.",
    cancel: 'Cancel',
    confirm: 'Yes, remove',
    removed: 'Removed from saved',
    undo: 'Undo',
    loading: 'Loading saved items',
    alt: (n: string) => `Photo of ${n}`,
  },
};

type Removing = { kind: 'center' | 'package'; id: string } | null;

export interface SavedScreenProps {
  /** Saved center ids. Pass `[]` and no packages for the empty state. */
  defaultCenters?: string[];
  defaultPackages?: string[];
  /** Opens the removal sheet over the screen (story 12). */
  defaultRemoving?: Removing;
  loading?: boolean;
}

function SavedContent({ defaultCenters = ['c-doral', 'c-brickell'], defaultPackages = ['det-premium', 'wash-complete', 'tow-local'], defaultRemoving = null, loading = false }: SavedScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const toast = useToast();
  const [centers, setCenters] = useState(defaultCenters);
  const [packages, setPackages] = useState(defaultPackages);
  const [unit, setUnit] = useState<BusinessUnit | 'all'>('all');
  const [removing, setRemoving] = useState<Removing>(defaultRemoving);
  const gutter = `${layout.gutter.mobile}px`;

  const visibleCenters = centerListings.filter((l) => centers.includes(l.centerId) && (unit === 'all' || listingCenter(l).units.includes(unit)));
  const visiblePackages = servicePackages.filter((p) => packages.includes(p.id) && (unit === 'all' || p.unit === unit));
  const total = centers.length + packages.length;

  const target = removing
    ? removing.kind === 'center'
      ? (() => {
          const l = centerListings.find((x) => x.centerId === removing.id)!;
          return { name: listingCenter(l).name, detail: listingCenter(l).units.map((u) => unitMeta[u].name).join(' · '), unit: listingUnit(l) };
        })()
      : (() => {
          const p = servicePackages.find((x) => x.id === removing.id)!;
          return { name: `${unitMeta[p.unit].name} · ${p.name[locale]}`, detail: p.tagline[locale], unit: p.unit };
        })()
    : null;

  const confirm = () => {
    if (!removing) return;
    const done = removing;
    if (done.kind === 'center') setCenters((c) => c.filter((x) => x !== done.id));
    else setPackages((p) => p.filter((x) => x !== done.id));
    setRemoving(null);
    toast.show({
      message: t.removed,
      actionLabel: t.undo,
      onAction: () => (done.kind === 'center' ? setCenters((c) => [...c, done.id]) : setPackages((p) => [...p, done.id])),
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={t.title} onBack={() => undefined} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, pt: 4, pb: 8 }}>
        {loading ? (
          <SkeletonGroup label={t.loading}>
            {[0, 1, 2, 3].map((i) => (
              <SkeletonListRow key={i} />
            ))}
          </SkeletonGroup>
        ) : total === 0 ? (
          <NoItemsState title={t.emptyTitle} description={t.emptyBody} primaryAction={<Button variant="secondary" size="md" fullWidth>{t.emptyAction}</Button>} />
        ) : (
          <>
            <Box sx={{ px: gutter }}>
              <FilterChipGroup
                selectionMode="single"
                label={t.units}
                value={unit}
                onChange={setUnit}
                options={[{ value: 'all', label: t.all }, ...businessUnits.map((u) => ({ value: u, label: unitMeta[u].name }))]}
              />
            </Box>

            {visibleCenters.length === 0 && visiblePackages.length === 0 ? (
              <NoResultsState title={t.noUnit(unit === 'all' ? t.all : unitMeta[unit].name)} onClear={() => setUnit('all')} />
            ) : (
              <>
                {visibleCenters.length > 0 && (
                  <Box component="section" sx={{ px: gutter, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <SectionHeader title={t.centers} />
                    <Box component="ul" aria-label={t.centersList} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {visibleCenters.map((l) => (
                        <Box component="li" key={l.centerId}>
                          <CenterCard variant="row" listing={l} saved onToggleSaved={() => setRemoving({ kind: 'center', id: l.centerId })} onOpen={() => undefined} />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                {visiblePackages.length > 0 && (
                  <Box component="section" sx={{ px: gutter, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <SectionHeader title={t.packages} />
                    <Box component="ul" aria-label={t.packagesList} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {visiblePackages.map((p) => (
                        <Box component="li" key={p.id}>
                          <PackageListItem pkg={p} saved onToggleSaved={() => setRemoving({ kind: 'package', id: p.id })} onOpen={() => undefined} />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>

      <BottomSheet
        disablePortal
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={t.sheetTitle}
        description={t.sheetBody}
        actions={
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <Button variant="secondary" size="lg" fullWidth onClick={() => setRemoving(null)}>
              {t.cancel}
            </Button>
            <Button variant="primary" size="lg" fullWidth onClick={confirm}>
              {t.confirm}
            </Button>
          </Box>
        }
      >
        {target && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, p: 3, borderRadius: 3, backgroundColor: bs.surface.subtle }}>
            <Box sx={{ width: 64, flexShrink: 0 }}>
              <Media alt={t.alt(target.name)} ratio="1:1" radius="md" unit={target.unit} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" component="p">
                {target.name}
              </Typography>
              <Typography variant="body2" sx={{ color: bs.text.secondary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {target.detail}
              </Typography>
            </Box>
          </Box>
        )}
      </BottomSheet>
    </Box>
  );
}

/** Guardados: saved centers and packages with a unit filter. Bookmarks open a confirmation sheet; removal can be undone from a toast. */
export function SavedScreen(props: SavedScreenProps) {
  return (
    <ToastProvider>
      <SavedContent {...props} />
    </ToastProvider>
  );
}
