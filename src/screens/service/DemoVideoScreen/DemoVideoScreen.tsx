import Forward10Rounded from '@mui/icons-material/Forward10Rounded';
import FullscreenRounded from '@mui/icons-material/FullscreenRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import Replay10Rounded from '@mui/icons-material/Replay10Rounded';
import ShareOutlined from '@mui/icons-material/ShareOutlined';
import VolumeOffRounded from '@mui/icons-material/VolumeOffRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { Media } from '../../../components/layout/Media/Media';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { useLocale, useT } from '../../../i18n/locale';
import { getCenter } from '../../../mocks/catalog';
import { InverseSurface } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { layout, radius, transition } from '../../../theme/tokens';
import { Carousel } from '../../home/shared/Carousel';
import { demoVideos, formatClock, serviceCenterId, serviceUnit } from '../data';

const messages = {
  es: {
    title: 'Video demo',
    share: 'Compartir video',
    play: 'Reproducir',
    pause: 'Pausar',
    back10: 'Retroceder 10 segundos',
    fwd10: 'Adelantar 10 segundos',
    mute: 'Silenciar',
    unmute: 'Activar sonido',
    fullscreen: 'Pantalla completa',
    seek: 'Posición del video',
    more: 'Más videos del centro',
    now: 'Reproduciendo',
    selectVideo: (n: string, d: string) => `Reproducir ${n}, ${d}`,
    thumb: (n: string) => `Miniatura de ${n}`,
    player: (n: string) => `Reproductor de video: ${n}`,
  },
  en: {
    title: 'Demo video',
    share: 'Share video',
    play: 'Play',
    pause: 'Pause',
    back10: 'Rewind 10 seconds',
    fwd10: 'Forward 10 seconds',
    mute: 'Mute',
    unmute: 'Unmute',
    fullscreen: 'Full screen',
    seek: 'Video position',
    more: 'More videos from the center',
    now: 'Now playing',
    selectVideo: (n: string, d: string) => `Play ${n}, ${d}`,
    thumb: (n: string) => `Thumbnail of ${n}`,
    player: (n: string) => `Video player: ${n}`,
  },
};

export interface DemoVideoScreenProps {
  defaultPlaying?: boolean;
  /** Start position in seconds. */
  defaultPosition?: number;
}

/** Video demo: dark player mock with play/pause, seek bar, skip and sound controls, and a rail of more videos. Position advances while playing. */
export function DemoVideoScreen({ defaultPlaying = true, defaultPosition = 42 }: DemoVideoScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const center = getCenter(serviceCenterId)!;
  const [videoId, setVideoId] = useState(demoVideos[0].id);
  const [playing, setPlaying] = useState(defaultPlaying);
  const [muted, setMuted] = useState(false);
  const [pos, setPos] = useState(defaultPosition);
  const video = demoVideos.find((v) => v.id === videoId)!;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setPos((p) => Math.min(p + 1, video.seconds)), 1000);
    return () => window.clearInterval(id);
  }, [playing, video.seconds]);

  const ended = pos >= video.seconds;
  const toggle = () => {
    if (ended) setPos(0);
    setPlaying(ended ? true : !playing);
  };
  const seek = (delta: number) => setPos((p) => Math.max(0, Math.min(video.seconds, p + delta)));
  const pick = (id: string) => {
    setVideoId(id);
    setPos(0);
    setPlaying(true);
  };

  return (
    <InverseSurface sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar tone="inverse" title={t.title} subtitle={`${center.name}`} onBack={() => undefined} actions={<IconButton label={t.share} icon={<ShareOutlined />} variant="filled" />} />

      <Box role="group" aria-label={t.player(video.title[locale])} sx={{ position: 'relative' }}>
        <Media alt={t.thumb(video.title[locale])} ratio="16:9" radius="none" unit={serviceUnit} scrim>
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
            <IconButton variant="raised" size="lg" label={playing && !ended ? t.pause : t.play} icon={playing && !ended ? <PauseRounded fontSize="large" /> : <PlayArrowRounded fontSize="large" />} onClick={toggle} sx={{ width: 64, height: 64 }} />
          </Box>
        </Media>
      </Box>

      <Box sx={{ px: `${layout.gutter.mobile}px`, pt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h3" component="h2">
          {video.title[locale]}
        </Typography>
        <Slider
          size="small"
          min={0}
          max={video.seconds}
          value={pos}
          onChange={(_, v) => setPos(v as number)}
          getAriaLabel={() => t.seek}
          getAriaValueText={(v) => `${formatClock(v)} / ${formatClock(video.seconds)}`}
          sx={{ mt: 1 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -2 }}>
          <Typography variant="caption" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
            {formatClock(pos)}
          </Typography>
          <Typography variant="caption" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
            {formatClock(video.seconds)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton variant="plain" label={muted ? t.unmute : t.mute} pressed={muted} icon={muted ? <VolumeOffRounded /> : <VolumeUpRounded />} onClick={() => setMuted((m) => !m)} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconButton variant="plain" label={t.back10} icon={<Replay10Rounded />} onClick={() => seek(-10)} />
            <IconButton variant="filled" size="lg" label={playing && !ended ? t.pause : t.play} icon={playing && !ended ? <PauseRounded /> : <PlayArrowRounded />} onClick={toggle} />
            <IconButton variant="plain" label={t.fwd10} icon={<Forward10Rounded />} onClick={() => seek(10)} />
          </Box>
          <IconButton variant="plain" label={t.fullscreen} icon={<FullscreenRounded />} />
        </Box>
      </Box>

      <Box component="section" sx={{ mt: 6, pb: `calc(${layout.safeAreaBottom} + 16px)`, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4" component="h2" sx={{ px: `${layout.gutter.mobile}px` }}>
          {t.more}
        </Typography>
        <Carousel label={t.more}>
          {demoVideos.map((v) => {
            const current = v.id === videoId;
            return (
              <ButtonBase
                key={v.id}
                onClick={() => pick(v.id)}
                aria-label={t.selectVideo(v.title[locale], formatClock(v.seconds))}
                aria-current={current || undefined}
                sx={{
                  width: 168,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 2,
                  textAlign: 'left',
                  p: 1.5,
                  borderRadius: `${radius.lg}px`,
                  border: `1px solid ${current ? bs.selection.border : 'transparent'}`,
                  backgroundColor: current ? bs.selection.bg : 'transparent',
                  transition: transition('background-color', 'border-color'),
                  '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 },
                }}
              >
                <Media
                  alt=""
                  ratio="16:9"
                  radius="md"
                  unit={serviceUnit}
                  bottomEnd={
                    <Typography variant="caption" component="span" sx={{ px: 1.5, borderRadius: `${radius.xs}px`, backgroundColor: bs.scrim, color: 'common.white', fontVariantNumeric: 'tabular-nums' }}>
                      {formatClock(v.seconds)}
                    </Typography>
                  }
                />
                <Typography variant="label" component="span" sx={{ px: 0.5, overflowWrap: 'anywhere' }}>
                  {v.title[locale]}
                </Typography>
                {current && (
                  <Typography variant="caption" component="span" sx={{ px: 0.5, color: bs.text.secondary }}>
                    {t.now}
                  </Typography>
                )}
              </ButtonBase>
            );
          })}
        </Carousel>
      </Box>
    </InverseSurface>
  );
}
