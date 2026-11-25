import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout, radius, transition } from '../../../theme/tokens';
import { MiniPhone } from '../shared/MiniPhone';
import { BookingsPreview, MapPreview, UnitsPreview } from '../shared/OnboardingPreviews';
import { ScreenRoot } from '../shared/AccessParts';

const messages = {
  es: {
    skip: 'Omitir',
    back: 'Anterior',
    next: 'Siguiente',
    start: 'Comenzar',
    progress: (n: number, total: number) => `Paso ${n} de ${total}`,
    slides: [
      { title: 'Encuentra tu centro Black Seat en el mapa', body: 'Mira dónde estamos en el área de Miami y si llegamos a tu casa u oficina para el lavado a domicilio.' },
      { title: 'Detailing, Towing y Personal Washing en una sola app', body: 'Pule tu auto, recoge el que compraste en Copart o IAA, o pide un lavado donde estés.' },
      { title: 'Controla tus reservas de principio a fin', body: 'Confirma, reprograma y sigue cada servicio. Todo queda en un solo historial.' },
    ],
  },
  en: {
    skip: 'Skip',
    back: 'Back',
    next: 'Next',
    start: 'Get started',
    progress: (n: number, total: number) => `Step ${n} of ${total}`,
    slides: [
      { title: 'Find your Black Seat center on the map', body: 'See where we are across Miami and whether we reach your home or office for at-home washing.' },
      { title: 'Detailing, Towing and Personal Washing in one app', body: 'Polish your car, pick up the one you bought at Copart or IAA, or book a wash wherever you are.' },
      { title: 'Stay in control of your bookings, start to finish', body: 'Confirm, reschedule and track every service. Everything lives in a single history.' },
    ],
  },
};

const previews = [MapPreview, UnitsPreview, BookingsPreview];

export interface OnboardingScreenProps {
  /** Slide shown first (0-2). */
  initialStep?: 0 | 1 | 2;
  /** Called by "Comenzar" on the last slide and by "Omitir". */
  onFinish?: () => void;
}

const nextButtonSx = {
  backgroundColor: bs.action.primary.bg,
  color: bs.action.primary.fg,
  '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.primary.hover } },
  '&:active': { backgroundColor: bs.action.primary.pressed },
};

/** Onboarding slide: scaled phone preview on top, headline and controls on the white panel. */
export function OnboardingScreen({ initialStep = 0, onFinish }: OnboardingScreenProps) {
  const t = useT(messages);
  const [step, setStep] = useState<number>(initialStep);
  const last = step === t.slides.length - 1;
  const Preview = previews[step];
  const slide = t.slides[step];

  return (
    <ScreenRoot>
      <Box sx={{ pt: `calc(${layout.safeAreaTop} + 8px)`, px: `${layout.gutter.mobile}px`, display: 'flex', justifyContent: 'flex-end', minHeight: 100 }}>
        <Box sx={{ visibility: last ? 'hidden' : 'visible', pt: 1 }}>
          <Button variant="quiet" size="md" onClick={onFinish} tabIndex={last ? -1 : 0}>
            {t.skip}
          </Button>
        </Box>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pt: 2 }}>
        <MiniPhone>
          <Preview />
        </MiniPhone>
      </Box>
      <Box
        component="section"
        aria-label={t.progress(step + 1, t.slides.length)}
        sx={{
          backgroundColor: bs.surface.canvas,
          borderTopLeftRadius: `${radius.xl}px`,
          borderTopRightRadius: `${radius.xl}px`,
          boxShadow: `0 -1px 0 ${bs.border.subtle}`,
          px: `${layout.gutter.mobile}px`,
          pt: 8,
          pb: `calc(24px + ${layout.safeAreaBottom})`,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'center', minHeight: 164 }}>
          <Typography variant="h1" component="h1">
            {slide.title}
          </Typography>
          <Typography variant="body1" sx={{ color: bs.text.secondary }}>
            {slide.body}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 52 }}>
          {step > 0 ? <IconButton label={t.back} icon={<ArrowBackRounded />} variant="outlined" size="lg" onClick={() => setStep(step - 1)} /> : <Box sx={{ width: 52, height: 52 }} />}
          <Box role="img" aria-label={t.progress(step + 1, t.slides.length)} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {t.slides.map((s, i) => (
              <Box key={s.title} sx={{ height: 8, width: i === step ? 24 : 8, borderRadius: `${radius.pill}px`, backgroundColor: i === step ? bs.brand.primary : bs.border.strong, transition: transition('width') }} />
            ))}
          </Box>
          {last ? (
            <Button endIcon={<ArrowForwardRounded />} onClick={onFinish}>
              {t.start}
            </Button>
          ) : (
            <IconButton label={t.next} icon={<ArrowForwardRounded />} size="lg" onClick={() => setStep(step + 1)} sx={nextButtonSx} />
          )}
        </Box>
      </Box>
    </ScreenRoot>
  );
}
