import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ShareOutlined from '@mui/icons-material/ShareOutlined';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { Media } from '../../../components/layout/Media/Media';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { formatNumber } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { InverseSurface } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { layout, radius, transition } from '../../../theme/tokens';
import { servicePhotos } from '../data';

const messages = {
  es: {
    close: 'Cerrar visor',
    share: 'Compartir foto',
    prev: 'Foto anterior',
    next: 'Foto siguiente',
    counter: (i: number, n: number) => `Foto ${i} de ${n}`,
    viewer: 'Visor de fotos',
    thumbs: 'Miniaturas',
    openThumb: (i: number) => `Ver foto ${i}`,
  },
  en: {
    close: 'Close viewer',
    share: 'Share photo',
    prev: 'Previous photo',
    next: 'Next photo',
    counter: (i: number, n: number) => `Photo ${i} of ${n}`,
    viewer: 'Photo viewer',
    thumbs: 'Thumbnails',
    openThumb: (i: number) => `View photo ${i}`,
  },
};

/** Galería (visor): full-screen photo with counter, previous/next, caption, thumbnail rail and close. Arrow keys also navigate. */
export function PhotoViewerScreen({ defaultIndex = 0 }: { defaultIndex?: number }) {
  const t = useT(messages);
  const locale = useLocale();
  const [index, setIndex] = useState(defaultIndex);
  const railRef = useRef<HTMLDivElement>(null);
  const total = servicePhotos.length;
  const photo = servicePhotos[index];
  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);

  useEffect(() => {
    // Keep the selected thumbnail in view inside the rail only (no page scroll).
    const rail = railRef.current;
    const el = rail?.children[index] as HTMLElement | undefined;
    if (rail && el) rail.scrollTo({ left: el.offsetLeft - rail.clientWidth / 2 + el.clientWidth / 2 });
  }, [index]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  };

  return (
    <InverseSurface sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar
        tone="inverse"
        leading={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconButton label={t.close} icon={<CloseRounded />} variant="filled" onClick={() => undefined} />
            <Typography variant="h4" component="h1" aria-live="polite" aria-label={t.counter(index + 1, total)} sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatNumber(index + 1, locale)} / {formatNumber(total, locale)}
            </Typography>
          </Box>
        }
        actions={<IconButton label={t.share} icon={<ShareOutlined />} variant="filled" />}
      />

      <Box role="group" aria-roledescription="carousel" aria-label={t.viewer} tabIndex={0} onKeyDown={onKey} sx={{ position: 'relative', flex: 1, minHeight: 300, mx: `${layout.gutter.mobile}px`, my: 3, borderRadius: `${radius.lg}px`, overflow: 'hidden', outlineOffset: 2 }}>
        <Media alt={photo.caption[locale]} ratio="fill" radius="lg" unit={photo.unit} />
        <Box sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', zIndex: 3 }}>
          <IconButton variant="raised" label={t.prev} icon={<ChevronLeftRounded />} onClick={() => go(-1)} />
        </Box>
        <Box sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', zIndex: 3 }}>
          <IconButton variant="raised" label={t.next} icon={<ChevronRightRounded />} onClick={() => go(1)} />
        </Box>
      </Box>

      <Typography variant="body2" aria-live="polite" sx={{ px: `${layout.gutter.mobile}px`, minHeight: 40, textAlign: 'center', color: bs.text.secondary }}>
        {photo.caption[locale]}
      </Typography>

      <Box
        ref={railRef}
        role="group"
        aria-label={t.thumbs}
        sx={{ display: 'flex', gap: 2, overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }, px: `${layout.gutter.mobile}px`, pt: 2, pb: `calc(${layout.safeAreaBottom} + 16px)` }}
      >
        {servicePhotos.map((p, i) => {
          const current = i === index;
          return (
            <ButtonBase
              key={p.id}
              onClick={() => setIndex(i)}
              aria-label={t.openThumb(i + 1)}
              aria-current={current || undefined}
              sx={{
                flex: '0 0 auto',
                width: 56,
                borderRadius: `${radius.md}px`,
                p: '3px',
                border: `2px solid ${current ? bs.selection.border : 'transparent'}`,
                transition: transition('border-color'),
                '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 },
              }}
            >
              <Media alt="" ratio="1:1" radius="sm" unit={p.unit} />
            </ButtonBase>
          );
        })}
      </Box>
    </InverseSurface>
  );
}
