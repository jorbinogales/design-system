import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Button } from '../../actions/Button/Button';
import { ToastProvider, useToast, type ToastSeverity } from './Toast';

const m = {
  es: {
    neutral: 'Código de recogida copiado',
    success: 'Dirección guardada',
    warning: 'Quedan 2 horarios para el sábado',
    error: 'No pudimos enviar la reserva',
    info: 'Tu conductor llega en 10 minutos',
    undo: 'Deshacer',
    retry: 'Reintentar',
    show: 'Mostrar aviso',
    queue: 'Poner 3 avisos en cola',
    removed: 'Servicio quitado de la reserva',
    restored: 'Servicio restablecido',
    sent: 'Reserva enviada',
    sendFail: 'No pudimos enviar la reserva. Revisa tu conexión.',
    send: 'Enviar reserva',
    names: { neutral: 'Neutro', success: 'Éxito', warning: 'Advertencia', error: 'Error', info: 'Información' },
    remove: 'Quitar cera de protección',
    line: 'Cera de protección · $25.00',
    sequence: 'Aviso',
  },
  en: {
    neutral: 'Pickup code copied',
    success: 'Address saved',
    warning: 'Only 2 slots left for Saturday',
    error: 'We could not send the booking',
    info: 'Your driver arrives in 10 minutes',
    undo: 'Undo',
    retry: 'Try again',
    show: 'Show toast',
    queue: 'Queue 3 toasts',
    removed: 'Service removed from the booking',
    restored: 'Service restored',
    sent: 'Booking sent',
    sendFail: 'We could not send the booking. Check your connection.',
    send: 'Send booking',
    names: { neutral: 'Neutral', success: 'Success', warning: 'Warning', error: 'Error', info: 'Info' },
    remove: 'Remove protective wax',
    line: 'Protective wax · $25.00',
    sequence: 'Toast',
  },
};

const severities: ToastSeverity[] = ['neutral', 'success', 'warning', 'error', 'info'];

function InteractiveDemo({ severity, withAction }: { severity?: ToastSeverity; withAction?: boolean }) {
  const t = useT(m);
  const toast = useToast();
  const sev = severity ?? 'success';
  return (
    <Button
      variant="secondary"
      size="md"
      onClick={() => toast.show({ message: t[sev], severity: sev, actionLabel: withAction ? t.undo : undefined })}
    >
      {t.show}
    </Button>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const toast = useToast();
  return (
    <Showcase maxWidth={480}>
      <Specimen label={l.variants}>
        {severities.map((s) => (
          <Button key={s} variant="secondary" size="md" onClick={() => toast.show({ message: t[s], severity: s })}>
            {t.names[s]}
          </Button>
        ))}
      </Specimen>
      <Specimen label={`${l.withIcon} · acción · cola`}>
        <Button variant="secondary" size="md" onClick={() => toast.show({ message: t.error, severity: 'error', actionLabel: t.retry })}>
          {t.names.error} + {t.retry}
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={() => [1, 2, 3].forEach((n) => toast.show({ message: `${t.sequence} ${n}`, severity: 'info', duration: 2500 }))}
        >
          {t.queue}
        </Button>
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  const toast = useToast();
  return (
    <Box sx={{ width: 340, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ typography: 'body1' }}>{t.line}</Box>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Button variant="secondary" size="md" onClick={() => toast.show({ message: t.removed, actionLabel: t.undo, onAction: () => toast.show({ message: t.restored, severity: 'success' }) })}>
          {t.remove}
        </Button>
        <Button size="md" onClick={() => toast.show({ message: t.sendFail, severity: 'error', actionLabel: t.retry, onAction: () => toast.show({ message: t.sent, severity: 'success' }) })}>
          {t.send}
        </Button>
      </Box>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Feedback/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Confirmación **breve y pasajera** de algo que ya ocurrió (guardado, copiado, quitado) con una acción opcional como **Deshacer**. Se usa con `ToastProvider` + `useToast()`; cada pantalla monta su propio proveedor.',
          anatomy: ['**Icono** de severidad (omitido en neutro)', '**Mensaje** de una línea o dos', '**Acción** única (opcional)', '**Cerrar** (solo cuando permanece hasta cerrarse)'],
          props: [
            '`<ToastProvider offsetBottom>` envuelve la pantalla; `offsetBottom` sube el aviso sobre una barra inferior (por ejemplo 64 sobre BottomNav).',
            '`const toast = useToast(); toast.show({ message, severity?, actionLabel?, onAction?, duration? })` devuelve un id; `toast.dismiss(id?)` lo cierra.',
            'Se muestran de uno en uno, en cola. Duración 5 s (6 s en errores). Con acción, o con `duration: null`, permanece hasta cerrarse.',
            'Nunca para errores que bloquean: usa **Aviso en línea** o **Banner**.',
          ],
          states: ['Entrando (fade/slide 150–220 ms) · visible · pausado (hover o foco) · saliendo', 'Persistente con acción y botón cerrar'],
          tokens: [['Fondo', 'text.primary (inverso)'], ['Texto', 'surface.canvas'], ['Radio', 'radius.md'], ['Sombra', 'elevation.e3'], ['Margen móvil', '16 px + layout.safeAreaBottom']],
          responsive: ['Móvil: ocupa el ancho menos 16 px por lado, sobre el área segura inferior.', 'Escritorio: abajo al centro, ancho según contenido.', 'Mensajes largos hacen salto de línea.'],
          a11y: ['Región con `role="status"` y `aria-live="polite"`; errores con `role="alert"`.', 'No roba el foco; la acción y el botón cerrar son alcanzables por teclado mientras estén visibles.', 'El hover y el foco pausan el cierre automático; los avisos con acción no desaparecen solos.', 'Icono + texto: la severidad no depende del color.'],
          content: [['Servicio quitado de la reserva · Deshacer', 'Service removed from the booking · Undo'], ['No pudimos enviar la reserva. Revisa tu conexión. · Reintentar', 'We could not send the booking. Check your connection. · Try again']],
          example: '**Ejemplo de negocio**: quitar “Cera de protección” de un Detailing con Deshacer, y reintentar el envío de una reserva con fallo recuperable.',
        }),
      },
    },
  },
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { children: null, offsetBottom: 0 },
  argTypes: { children: { control: false } },
  render: () => <InteractiveDemo severity="success" withAction />,
};
export const Variants: Story = { name: 'Variantes', args: { children: null }, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: { children: null }, render: () => <BusinessDemo /> };
