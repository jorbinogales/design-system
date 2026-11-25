import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../components/actions/Button/Button';
import { useT } from '../i18n/locale';
import { bs } from '../theme/theme';
import { duration, easing, radius } from '../theme/tokens';
import { FoundationPage, FoundationSection, mono, SpecTable } from './foundationKit';

const m = {
  es: {
    title: 'Movimiento',
    intro: 'Rápido, poco e interrumpible. El movimiento confirma una acción o explica de dónde viene algo; nunca decora. Sin ondas (ripple). Con “reducir movimiento” activado en el sistema, todas las animaciones y transiciones se anulan globalmente.',
    durations: 'Duraciones',
    easings: 'Curvas',
    try: 'Pruébalo',
    play: 'Reproducir',
    use: { instant: 'Hover, cambio de color', fast: 'Pulsado, foco, chips, controles', base: 'Menús, cambio de pestaña', slow: 'Paneles inferiores, diálogos', confirm: 'Confirmación “Copiado”' },
    ease: { standard: 'Cambios de estado', enter: 'Lo que entra (ease-out exponencial)', exit: 'Lo que sale' },
  },
  en: {
    title: 'Motion',
    intro: 'Fast, few and interruptible. Motion confirms an action or explains where something came from; it never decorates. No ripple. With the system “reduce motion” setting on, every animation and transition is cancelled globally.',
    durations: 'Durations',
    easings: 'Curves',
    try: 'Try it',
    play: 'Play',
    use: { instant: 'Hover, color change', fast: 'Press, focus, chips, controls', base: 'Menus, tab change', slow: 'Bottom sheets, dialogs', confirm: '“Copied” confirmation' },
    ease: { standard: 'State changes', enter: 'Things arriving (exponential ease-out)', exit: 'Things leaving' },
  },
};

function MotionPage() {
  const t = useT(m);
  const [on, setOn] = useState(false);
  return (
    <FoundationPage title={t.title} intro={t.intro}>
      <FoundationSection title={t.durations}>
        <SpecTable head={['token', 'ms', '']} rows={(Object.keys(duration) as (keyof typeof duration)[]).map((k) => [<Box key="k" component="code" sx={mono}>duration.{k}</Box>, <Box key="v" sx={mono}>{duration[k]}</Box>, t.use[k]])} />
      </FoundationSection>
      <FoundationSection title={t.easings}>
        <SpecTable head={['token', 'cubic-bezier', '']} rows={(Object.keys(easing) as (keyof typeof easing)[]).map((k) => [<Box key="k" component="code" sx={mono}>easing.{k}</Box>, <Box key="v" component="code" sx={{ ...mono, fontSize: '0.8125rem' }}>{easing[k]}</Box>, t.ease[k]])} />
      </FoundationSection>
      <FoundationSection title={t.try}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 480 }}>
          <Button size="md" variant="secondary" onClick={() => setOn((v) => !v)} sx={{ alignSelf: 'flex-start' }}>
            {t.play}
          </Button>
          {(['standard', 'enter', 'exit'] as const).map((k) => (
            <Box key={k} sx={{ position: 'relative', height: 40, borderRadius: `${radius.pill}px`, backgroundColor: bs.surface.subtle }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: bs.brand.primary,
                  transform: on ? 'translateX(calc(min(480px, 100vw - 96px) - 40px))' : 'none',
                  transition: `transform ${duration.slow}ms ${easing[k]}`,
                }}
              />
              <Typography variant="caption" sx={{ position: 'absolute', right: 16, top: 11, color: bs.text.secondary }}>
                {k}
              </Typography>
            </Box>
          ))}
        </Box>
      </FoundationSection>
    </FoundationPage>
  );
}

const meta = { title: 'Fundamentos/Movimiento', tags: ['!autodocs'], parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
export const Movimiento: StoryObj = { name: 'Movimiento', render: () => <MotionPage /> };
