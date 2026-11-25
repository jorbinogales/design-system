import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { Button } from '../../actions/Button/Button';
import { InlineAlert } from '../InlineAlert/InlineAlert';
import { LoadingIndicator } from './LoadingIndicator';

const m = {
  es: {
    spinner: 'Solo círculo',
    inline: 'En línea',
    block: 'Bloque',
    jobs: 'Cargando trabajos de hoy…',
    send: 'Enviar reserva',
    sending: 'Enviando reserva…',
    sent: 'Reserva enviada',
    failed: 'No pudimos enviar la reserva',
    failedBody: 'Tus datos siguen aquí. Revisa tu conexión e inténtalo de nuevo.',
    retry: 'Reintentar',
    summary: 'Detailing Completo · sábado 14 de diciembre, 10:00 a. m.',
    fail: 'Simular fallo',
  },
  en: {
    spinner: 'Circle only',
    inline: 'Inline',
    block: 'Block',
    jobs: "Loading today's jobs…",
    send: 'Send booking',
    sending: 'Sending booking…',
    sent: 'Booking sent',
    failed: 'We could not send the booking',
    failedBody: 'Your details are still here. Check your connection and try again.',
    retry: 'Try again',
    summary: 'Full Detailing · Saturday, December 14, 10:00 AM',
    fail: 'Simulate failure',
  },
};

function VariantsDemo({ size }: { size?: 'sm' | 'md' | 'lg' }) {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={360}>
      <Specimen label={t.spinner}>
        <LoadingIndicator variant="spinner" size={size} />
      </Specimen>
      <Specimen label={t.inline}>
        <LoadingIndicator variant="inline" size={size} />
      </Specimen>
      <Specimen label={`${t.block} · ${l.businessExample}`} direction="column" align="stretch">
        <LoadingIndicator variant="block" label={t.jobs} size={size} />
      </Specimen>
    </Showcase>
  );
}

type Phase = 'idle' | 'sending' | 'sent' | 'failed';

/** Send flow: idle → sending → sent, or a recoverable failure that keeps the data. */
function SendDemo() {
  const t = useT(m);
  const [phase, setPhase] = useState<Phase>('idle');
  const willFail = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const send = () => {
    setPhase('sending');
    timer.current = window.setTimeout(() => setPhase(willFail.current ? 'failed' : 'sent'), 1800);
  };
  return (
    <Box sx={{ width: 340, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="body1">{t.summary}</Typography>
      {phase === 'failed' && (
        <InlineAlert severity="error" title={t.failed}>
          {t.failedBody}
        </InlineAlert>
      )}
      {phase === 'sent' && (
        <InlineAlert severity="success">{t.sent}</InlineAlert>
      )}
      <Button fullWidth disabled={phase === 'sending' || phase === 'sent'} onClick={send} startIcon={phase === 'sending' ? <LoadingIndicator variant="spinner" size="sm" /> : undefined}>
        {phase === 'sending' ? t.sending : phase === 'failed' ? t.retry : t.send}
      </Button>
      <Box sx={{ minHeight: 24 }}>{phase === 'sending' && <LoadingIndicator variant="inline" label={t.sending} />}</Box>
      <Button
        variant="quiet"
        size="sm"
        onClick={() => {
          willFail.current = !willFail.current;
          setPhase('idle');
        }}
        sx={{ alignSelf: 'flex-start', color: bs.text.secondary }}
      >
        {t.fail}
      </Button>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Feedback/Indicador de carga',
  component: LoadingIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Indica que algo **está en curso** y dura pocos segundos: enviar una reserva, cargar una lista. Para contenido con forma conocida, usa **Skeleton**.',
          anatomy: ['**Círculo** de progreso (`brand.primary`)', '**Texto** (“Enviando…”, “Cargando…”) en `inline` y `block`'],
          props: ['`variant`: `spinner` (solo círculo, dentro de botones), `inline` (círculo + “Enviando…”) y `block` (centrado, para pantallas o listas).', '`label` reemplaza el texto por defecto; úsalo para nombrar lo que carga (“Cargando trabajos de hoy…”).', 'Para envíos, el botón se deshabilita mientras dura y muestra el estado; si falla, se conserva lo escrito y se ofrece **Reintentar**.'],
          states: ['Girando · oculto al terminar', 'Fallo recuperable: pasa a un **Aviso en línea** de error con Reintentar'],
          tokens: [['Círculo', 'brand.primary'], ['Texto', 'text.secondary'], ['Tamaños', '16 · 24 · 40 px'], ['Movimiento', 'duration global + reducción de movimiento']],
          responsive: ['`block` centra y ocupa el ancho del contenedor; el texto hace salto de línea.', 'En botones el círculo reemplaza el icono inicial sin cambiar el ancho útil.'],
          a11y: ['`inline` y `block` son `role="status"`: el texto se anuncia de forma amable.', '`spinner` expone `role="progressbar"` con nombre.', 'Con `prefers-reduced-motion` el giro se reduce (interruptor global del tema).', 'No se comunica solo con movimiento: siempre hay texto o nombre accesible.'],
          content: [['Enviando… · Cargando…', 'Sending… · Loading…'], ['No pudimos enviar la reserva · Reintentar', 'We could not send the booking · Try again']],
          example: '**Ejemplo de negocio**: envío de una reserva de Detailing con tres desenlaces: en curso (“Enviando reserva…”), enviada y fallo recuperable con Reintentar (usa “Simular fallo” para ver el segundo).',
        }),
      },
    },
  },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { variant: 'inline', label: undefined, size: undefined },
  argTypes: { variant: { control: 'inline-radio', options: ['spinner', 'inline', 'block'] }, size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
};
export const Variants: Story = { name: 'Variantes', render: (args) => <VariantsDemo size={args.size} /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio · Envío de reserva', render: () => <SendDemo /> };
