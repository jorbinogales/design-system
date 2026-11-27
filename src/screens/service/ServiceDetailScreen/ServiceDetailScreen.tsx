import BookmarkBorderRounded from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRounded from '@mui/icons-material/BookmarkRounded';
import CallOutlined from '@mui/icons-material/CallOutlined';
import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import EditOutlined from '@mui/icons-material/EditOutlined';
import NearMeOutlined from '@mui/icons-material/NearMeOutlined';
import PhotoLibraryOutlined from '@mui/icons-material/PhotoLibraryOutlined';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import ShareOutlined from '@mui/icons-material/ShareOutlined';
import StarRounded from '@mui/icons-material/StarRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';
import { PackageCard } from '../../../blacksix/PackageCard/PackageCard';
import { ProfessionalCard } from '../../../blacksix/ProfessionalCard/ProfessionalCard';
import { ServiceSheet } from '../../../blacksix/ServiceSheet/ServiceSheet';
import { formatDateMedium } from '../../../blacksix/shared/format';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { InitialsAvatar } from '../../../components/data-display/InitialsAvatar/InitialsAvatar';
import { Price } from '../../../components/data-display/Price/Price';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { SearchField } from '../../../components/fields/SearchField/SearchField';
import { Media } from '../../../components/layout/Media/Media';
import { SectionHeader } from '../../../components/layout/SectionHeader/SectionHeader';
import { BackButton } from '../../../components/navigation/BackButton/BackButton';
import { TabPanel, Tabs } from '../../../components/navigation/Tabs/Tabs';
import { NoResultsState } from '../../../components/screen-states/StatePresets/StatePresets';
import { FilterChipGroup } from '../../../components/selection/FilterChip/FilterChip';
import { Select } from '../../../components/selection/Select/Select';
import type { Center } from '../../../domain/booking';
import { unitMeta, type BusinessUnit } from '../../../domain/units';
import { intlLocale } from '../../../i18n/format';
import { useNav } from '../../../app/nav';
import { useLocale, useT } from '../../../i18n/locale';
import { unitIcon } from '../../../icons/unitIcon';
import { reviews } from '../../../mocks/bookings';
import { centers, getPackage, getServiceOffering, getUnit } from '../../../mocks/catalog';
import { professionalsForUnit } from '../../../mocks/people';
import { InverseSurface } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { layout, radius, transition } from '../../../theme/tokens';
import { unitPhoto } from '../../../mocks/photos';
import { recentSince, reviewMeta, servicePhotos, serviceRating, serviceUnit, stripCount } from '../data';
import { Stars } from '../shared/Stars';

export type ServiceTab = 'about' | 'services' | 'reviews';

const messages = {
  es: {
    back: 'Volver',
    share: 'Compartir',
    save: 'Guardar este centro',
    saved: 'Quitar este centro de guardados',
    demo: 'Video demo',
    photos: (n: number) => `Ver las ${n} fotos`,
    plusMore: (n: number) => `Ver ${n} fotos más`,
    reviewsCount: (v: string, n: number) => `${v} (${n} reseñas)`,
    directions: 'Cómo llegar',
    tabs: 'Secciones del servicio',
    tabAbout: 'Acerca de',
    tabServices: 'Servicios',
    tabGallery: 'Galería',
    tabReviews: 'Reseñas',
    center: 'Centro',
    centerChoose: 'Elige el centro donde recibir el servicio',
    seeReviews: 'Ver reseñas',
    team: 'Equipo del centro',
    contact: 'Contacto',
    chat: 'Chat',
    call: 'Llamar',
    chooseTime: 'Elegir horario',
    from: 'Desde',
    packagesIntro: 'Elige un paquete. Puedes cambiarlo antes de confirmar.',
    packagesList: (u: string) => `Paquetes de ${u}`,
    gallery: 'Galería',
    seeAll: 'Ver todo',
    galleryList: 'Fotos del centro',
    openPhoto: (c: string) => `Abrir foto: ${c}`,
    reviewsBase: (n: number) => `${n} reseñas`,
    summary: 'Resumen de calificaciones',
    star: (n: number) => `${n} estrellas`,
    searchReviews: 'Buscar en las reseñas',
    searchPlaceholder: 'Buscar en las reseñas',
    filterLabel: 'Filtrar reseñas',
    fVerified: 'Verificadas',
    fRecent: 'Recientes',
    fPhotos: 'Con fotos',
    verified: 'Reserva verificada',
    photosN: (n: number) => (n === 1 ? '1 foto' : `${n} fotos`),
    write: 'Escribir reseña',
    reviewList: 'Reseñas',
    noReviews: 'Ninguna reseña coincide',
  },
  en: {
    back: 'Back',
    share: 'Share',
    save: 'Save this center',
    saved: 'Remove this center from saved',
    demo: 'Demo video',
    photos: (n: number) => `View all ${n} photos`,
    plusMore: (n: number) => `View ${n} more photos`,
    reviewsCount: (v: string, n: number) => `${v} (${n} reviews)`,
    directions: 'Get directions',
    tabs: 'Service sections',
    tabAbout: 'About',
    tabServices: 'Services',
    tabGallery: 'Gallery',
    tabReviews: 'Reviews',
    center: 'Center',
    centerChoose: 'Pick the center where you get the service',
    seeReviews: 'See reviews',
    team: 'Center team',
    contact: 'Contact',
    chat: 'Chat',
    call: 'Call',
    chooseTime: 'Choose a time',
    from: 'From',
    packagesIntro: 'Pick a package. You can change it before confirming.',
    packagesList: (u: string) => `${u} packages`,
    gallery: 'Gallery',
    seeAll: 'See all',
    galleryList: 'Center photos',
    openPhoto: (c: string) => `Open photo: ${c}`,
    reviewsBase: (n: number) => `${n} reviews`,
    summary: 'Rating summary',
    star: (n: number) => `${n} stars`,
    searchReviews: 'Search reviews',
    searchPlaceholder: 'Search reviews',
    filterLabel: 'Filter reviews',
    fVerified: 'Verified',
    fRecent: 'Recent',
    fPhotos: 'With photos',
    verified: 'Verified booking',
    photosN: (n: number) => (n === 1 ? '1 photo' : `${n} photos`),
    write: 'Write a review',
    reviewList: 'Reviews',
    noReviews: 'No reviews match',
  },
};

const gutter = `${layout.gutter.mobile}px`;

// ─── Hero ──────────────────────────────────────────────────────────────

function Hero({ unit, center, onOpenGallery }: { unit: BusinessUnit; center: Center; onOpenGallery: () => void }) {
  const t = useT(messages);
  const nav = useNav();
  const [saved, setSaved] = useState(false);
  const strip = servicePhotos.slice(0, stripCount);
  const more = servicePhotos.length - stripCount;
  return (
    <Box sx={{ position: 'relative' }}>
      <Media src={unitPhoto[unit]} alt={`${unitMeta[unit].name} · ${center.name}`} ratio="4:3" radius="none" unit={unit} />
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, pt: `calc(${layout.safeAreaTop} + 8px)`, px: gutter, display: 'flex', alignItems: 'center', gap: 3 }}>
        <BackButton variant="raised" label={t.back} sx={{ mr: 'auto' }} />
        <IconButton variant="raised" label={t.share} icon={<ShareOutlined />} />
        <IconButton
          variant="raised"
          label={saved ? t.saved : t.save}
          pressed={saved}
          icon={saved ? <BookmarkRounded sx={{ color: bs.brand.primary }} /> : <BookmarkBorderRounded />}
          onClick={() => setSaved((s) => !s)}
        />
      </Box>
      <InverseSurface sx={{ position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%, -50%)', borderRadius: `${radius.pill}px`, boxShadow: bs.elevation.e2 }}>
        <ButtonBase
          onClick={() => nav.go('demo-video')}
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, height: 44, pl: 2, pr: 4, borderRadius: `${radius.pill}px`, color: bs.text.primary, '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 } }}
        >
          <Box aria-hidden sx={{ display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: '50%', backgroundColor: bs.text.primary, color: bs.surface.inverse }}>
            <PlayArrowRounded fontSize="small" />
          </Box>
          <Typography variant="label" component="span">
            {t.demo}
          </Typography>
        </ButtonBase>
      </InverseSurface>
      <Box
        role="group"
        aria-label={t.galleryList}
        sx={{ position: 'absolute', left: gutter, right: gutter, bottom: 12, display: 'grid', gridTemplateColumns: `repeat(${stripCount}, minmax(0, 1fr))`, gap: 1.5, p: 1.5, borderRadius: `${radius.lg}px`, backgroundColor: bs.surface.raised, boxShadow: bs.elevation.e2 }}
      >
        {strip.map((p, i) => {
          const last = i === strip.length - 1;
          return (
            <ButtonBase key={p.id} onClick={onOpenGallery} aria-label={last ? t.plusMore(more) : t.openPhoto(p.caption.es)} sx={{ display: 'block', borderRadius: `${radius.sm}px`, '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 1 } }}>
              <Media src={p.src} alt="" ratio="1:1" radius="sm" unit={p.unit}>
                {last && (
                  <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', backgroundColor: bs.scrim, color: 'common.white' }}>
                    <Typography variant="label" component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      +{more}
                    </Typography>
                  </Box>
                )}
              </Media>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}

// ─── Tab panels ────────────────────────────────────────────────────────

function AboutPanel({ unit, center }: { unit: BusinessUnit; center: Center }) {
  const t = useT(messages);
  const nav = useNav();
  const offering = getServiceOffering(unit);
  const team = professionalsForUnit(unit).filter((p) => p.centerId === center.id);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 7, px: gutter, pt: 5 }}>
      {/* The hero above already shows the service image, so the sheet skips its own photo. */}
      <ServiceSheet
        service={offering}
        showPhoto={false}
        fromPrice={getUnit(unit).fromPrice}
        action="none"
        intro={false}
      />
      {team.length > 0 && (
        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <SectionHeader title={t.team} headingLevel="h3" />
          {team.map((p) => (
            <ProfessionalCard key={p.id} professional={p} unit={unit} baseLabel={center.name} />
          ))}
        </Box>
      )}
      <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <SectionHeader title={t.contact} headingLevel="h3" />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <Button variant="secondary" size="md" startIcon={<ChatBubbleOutlineRounded />} fullWidth onClick={() => nav.go('chat')}>
            {t.chat}
          </Button>
          <Button variant="secondary" size="md" startIcon={<CallOutlined />} fullWidth href={`tel:${center.phone.replace(/\D/g, '')}`}>
            {t.call}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function ServicesPanel({ unit, selected, onSelect }: { unit: BusinessUnit; selected: string | null; onSelect: (id: string) => void }) {
  const t = useT(messages);
  const offering = getServiceOffering(unit);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, px: gutter, pt: 5 }}>
      <Typography variant="body2" sx={{ color: bs.text.secondary }}>
        {t.packagesIntro}
      </Typography>
      <Box component="ul" role="radiogroup" aria-label={t.packagesList(unitMeta[unit].name)} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {offering.packageIds.map((id) => (
          <Box component="li" key={id}>
            <PackageCard pkg={getPackage(id)!} selected={selected === id} onSelect={onSelect} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function ReviewsPanel() {
  const t = useT(messages);
  const nav = useNav();
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const nf = new Intl.NumberFormat(intlLocale[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const q = query.trim().toLocaleLowerCase();
  const visible = reviews.filter((r) => {
    const meta = reviewMeta[r.id];
    if (filters.includes('verified') && !meta.verified) return false;
    if (filters.includes('recent') && r.date < recentSince) return false;
    if (filters.includes('photos') && meta.photos === 0) return false;
    return !q || `${r.author} ${r.text[locale]}`.toLocaleLowerCase().includes(q);
  });
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, px: gutter, pt: 5 }}>
      <Box component="section" aria-label={t.summary} sx={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', columnGap: 6, alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="display" component="p" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {nf.format(serviceRating.value)}
          </Typography>
          <Stars readOnly value={serviceRating.value} starSize={18} />
          <Typography variant="caption" component="p" sx={{ color: bs.text.secondary, mt: 0.5 }}>
            {t.reviewsBase(serviceRating.count)}
          </Typography>
        </Box>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {serviceRating.distribution.map((pct, i) => (
            <Box component="li" key={i} aria-label={`${t.star(5 - i)}: ${pct} %`} sx={{ display: 'grid', gridTemplateColumns: '14px minmax(0, 1fr) 34px', alignItems: 'center', gap: 2 }}>
              <Typography aria-hidden variant="caption" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                {5 - i}
              </Typography>
              <Box aria-hidden sx={{ height: 6, borderRadius: `${radius.pill}px`, backgroundColor: bs.surface.muted, overflow: 'hidden' }}>
                <Box sx={{ width: `${pct}%`, height: '100%', backgroundColor: bs.text.primary }} />
              </Box>
              <Typography aria-hidden variant="caption" sx={{ color: bs.text.secondary, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {pct} %
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Button variant="secondary" size="md" startIcon={<EditOutlined />} fullWidth onClick={() => nav.go('write-review')}>
        {t.write}
      </Button>

      <SearchField label={t.searchReviews} hideLabel placeholder={t.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />
      <FilterChipGroup
        selectionMode="multiple"
        label={t.filterLabel}
        value={filters}
        onChange={setFilters}
        options={[
          { value: 'verified', label: t.fVerified },
          { value: 'recent', label: t.fRecent },
          { value: 'photos', label: t.fPhotos },
        ]}
      />

      {visible.length === 0 ? (
        <NoResultsState title={t.noReviews} onClear={() => (setQuery(''), setFilters([]))} />
      ) : (
        <Box component="ul" aria-label={t.reviewList} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column' }}>
          {visible.map((r) => {
            const meta = reviewMeta[r.id];
            const Icon = unitIcon[r.unit];
            return (
              <Box component="li" key={r.id} sx={{ py: 4, borderBottom: `1px solid ${bs.border.subtle}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <InitialsAvatar name={r.author} size="md" decorative />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h4" component="h3">
                      {r.author}
                    </Typography>
                    <Typography variant="caption" sx={{ color: bs.text.secondary }}>
                      {formatDateMedium(r.date, locale)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Stars readOnly value={r.rating} starSize={16} />
                    <Typography variant="label" component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {nf.format(r.rating)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">{r.text[locale]}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  <Tag size="sm" tone="outline" icon={<Icon />} label={unitMeta[r.unit].name} />
                  {meta.verified && <Tag size="sm" tone="success" icon={<CheckCircleRounded />} label={t.verified} />}
                  {meta.photos > 0 && <Tag size="sm" tone="outline" icon={<PhotoLibraryOutlined />} label={t.photosN(meta.photos)} />}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

// ─── Screen ────────────────────────────────────────────────────────────

export interface ServiceDetailScreenProps {
  initialTab?: ServiceTab;
  /** Business unit whose portal is shown (info, packages, prices, hours). Defaults to Detailing. */
  unit?: BusinessUnit;
  /** Center preselected in the selector. Defaults to the first center that offers the unit. */
  centerId?: string;
}

/**
 * Detalle del servicio: service name, tappable rating, center selector (sedes) with its address, then four tabs. Photo hero (back,
 * share, bookmark, Video demo, thumbnail strip with "+10"). "Elegir horario" is the only orange element.
 */
export function ServiceDetailScreen({ initialTab = 'about', unit = serviceUnit, centerId }: ServiceDetailScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const locale = useLocale();
  const [tab, setTab] = useState<ServiceTab>(initialTab);
  const [pkgId, setPkgId] = useState<string | null>(initialTab === 'services' ? 'det-premium' : null);
  const unitCenters = centers.filter((c) => c.units.includes(unit));
  const [selectedCenter, setSelectedCenter] = useState((unitCenters.find((c) => c.id === centerId) ?? unitCenters[0]).id);
  const center = unitCenters.find((c) => c.id === selectedCenter)!;
  const tabsRef = useRef<HTMLDivElement>(null);
  const nf = new Intl.NumberFormat(intlLocale[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const chosen = pkgId ? getPackage(pkgId) : undefined;
  const idPrefix = 'service-detail';
  // Towing starts with the auction data (yard, pickup code, lot); the other units start by choosing a package.
  const showReviews = () => {
    setTab('reviews');
    tabsRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  const book = () => (unit === 'towing' ? nav.go('auction-pickup', { unit }) : nav.go('select-vehicle', chosen ? { unit, centerId: center.id, packageId: chosen.id } : { unit, centerId: center.id }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <Hero unit={unit} center={center} onOpenGallery={() => nav.go('photo-viewer')} />

      <Box sx={{ px: gutter, pt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ButtonBase
          onClick={showReviews}
          aria-label={`${t.seeReviews}: ${t.reviewsCount(nf.format(serviceRating.value), serviceRating.count)}`}
          sx={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 1, minHeight: 44, color: bs.text.secondary, borderRadius: `${radius.sm}px`, '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 } }}
        >
          <StarRounded aria-hidden sx={{ fontSize: 18, color: bs.brand.primary }} />
          <Typography variant="body2" component="span" sx={{ textDecoration: 'underline' }}>
            {t.reviewsCount(nf.format(serviceRating.value), serviceRating.count)}
          </Typography>
        </ButtonBase>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h1" component="h1">
              {unitMeta[unit].name}
            </Typography>
            <Typography variant="body2" sx={{ color: bs.text.secondary, mt: 1, overflowWrap: 'anywhere' }}>
              {center.address.line1}, {center.address.city}, {center.address.state} {center.address.zip}
            </Typography>
          </Box>
          <IconButton variant="outlined" size="lg" label={t.directions} icon={<NearMeOutlined />} onClick={() => nav.go('center-location')} sx={{ flexShrink: 0, transition: transition('background-color') }} />
        </Box>
      </Box>

      <Box sx={{ px: gutter, pt: 4 }}>
        <Select label={t.center} placeholder={t.centerChoose} value={center.id} onChange={setSelectedCenter} options={unitCenters.map((c) => ({ value: c.id, label: c.name }))} />
      </Box>

      <Box ref={tabsRef} sx={{ mt: 4, scrollMarginTop: 8 }}>
        <Tabs
          idPrefix={idPrefix}
          label={t.tabs}
          variant="scrollable"
          value={tab}
          onChange={setTab}
          items={[
            { value: 'about', label: t.tabAbout },
            { value: 'services', label: t.tabServices },
            { value: 'reviews', label: t.tabReviews },
          ]}
        />
      </Box>

      <Box sx={{ flex: 1, pb: 8 }}>
        <TabPanel idPrefix={idPrefix} value="about" current={tab}>
          <AboutPanel unit={unit} center={center} />
        </TabPanel>
        <TabPanel idPrefix={idPrefix} value="services" current={tab}>
          <ServicesPanel unit={unit} selected={pkgId} onSelect={setPkgId} />
        </TabPanel>
        <TabPanel idPrefix={idPrefix} value="reviews" current={tab}>
          <ReviewsPanel />
        </TabPanel>
      </Box>

      <BottomActionBar summary={<Price amount={chosen ? chosen.price : getUnit(unit).fromPrice} from={!chosen || Boolean(chosen.priceFrom)} size="lg" />}>
        <Button variant="primary" size="lg" onClick={book}>
          {t.chooseTime}
        </Button>
      </BottomActionBar>
    </Box>
  );
}
