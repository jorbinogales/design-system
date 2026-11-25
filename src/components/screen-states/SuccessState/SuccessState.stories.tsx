import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { Button } from '../../actions/Button/Button';
import { IdentifierBlock } from '../../data-display/IdentifierBlock/IdentifierBlock';
import { KeyValue, KeyValueList } from '../../layout/KeyValue/KeyValue';
import { BackButton } from '../../navigation/BackButton/BackButton';
import { SuccessState } from './SuccessState';

const m = {
  es: {
    title: '¡Reserva confirmada!',
    body: 'Tu Detailing Completo quedó agendado. Puedes ver los detalles en Reservas.',
    receipt: 'Ver recibo',
    bookings: 'Ver mis reservas',
    ref: 'Referencia',
    when: 'Cuándo',
    whenValue: 'Sábado 14 de diciembre, 10:00 a. m.',
    where: 'Dónde',
    whereValue: 'Black Six Coral Gables',
    arrivedTitle: 'Tu conductor llegó',
    arrivedBody: 'Ya está en Copart Miami Norte. Muéstrale el código de recogida en la entrada.',
    code: 'Código de recogida',
    lot: 'Número de lote',
    track: 'Ver recogida',
    paidTitle: 'Pago recibido',
    paidBody: 'Cobramos $174.00 a tu Visa •••• 4821. Te enviamos el comprobante por correo.',
    done: 'Listo',
    inline: 'En línea (dentro de un panel)',
    page: 'Pantalla completa',
    sentTitle: 'Solicitud enviada',
    sentBody: 'Un asesor confirmará tu recogida en menos de 30 minutos.',
    back: 'Volver a Reservas',
  },
  en: {
    title: 'Booking confirmed!',
    body: 'Your Full Detailing is scheduled. You can see the details in Bookings.',
    receipt: 'View receipt',
    bookings: 'View my bookings',
    ref: 'Reference',
    when: 'When',
    whenValue: 'Saturday, December 14, 10:00 AM',
    where: 'Where',
    whereValue: 'Black Six Coral Gables',
    arrivedTitle: 'Your driver has arrived',
    arrivedBody: 'They are at Copart Miami North. Show them the pickup code at the gate.',
    code: 'Pickup code',
    lot: 'Lot number',
    track: 'View pickup',
    paidTitle: 'Payment received',
    paidBody: 'We charged $174.00 to your Visa •••• 4821. We emailed you the receipt.',
    done: 'Done',
    inline: 'Inline (inside a panel)',
    page: 'Full screen',
    sentTitle: 'Request sent',
    sentBody: 'An advisor will confirm your pickup within 30 minutes.',
    back: 'Back to Bookings',
  },
};

function Frame({ children }: { children: React.ReactNode }) {
  return <Box sx={{ display: 'flex', flexDirection: 'column', height: 560, width: 390, maxWidth: '100%', border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, overflow: 'hidden' }}>{children}</Box>;
}

function InteractiveDemo({ layout }: { layout?: 'page' | 'inline' }) {
  const t = useT(m);
  return (
    <Frame>
      <SuccessState layout={layout} title={t.title} description={t.body} primaryAction={<Button>{t.receipt}</Button>} secondaryAction={<Button variant="quiet">{t.bookings}</Button>} />
    </Frame>
  );
}

function VariantsDemo() {
  const t = useT(m);
  return (
    <Showcase>
      <Specimen label={t.inline}>
        <Frame>
          <SuccessState layout="inline" headingLevel="h2" title={t.sentTitle} description={t.sentBody} primaryAction={<Button size="md">{t.back}</Button>} />
        </Frame>
      </Specimen>
    </Showcase>
  );
}

function BookingConfirmed() {
  const t = useT(m);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <Box sx={{ pt: 'calc(var(--bs-safe-area-top, 0px) + 8px)', px: 5 }}>
        <BackButton />
      </Box>
      <SuccessState
        title={t.title}
        description={t.body}
        primaryAction={<Button>{t.receipt}</Button>}
        secondaryAction={<Button variant="quiet">{t.bookings}</Button>}
      >
        <KeyValueList>
          <KeyValue label={t.ref} value="BK-20391" />
          <KeyValue label={t.when} value={t.whenValue} layout="stacked" />
          <KeyValue label={t.where} value={t.whereValue} layout="stacked" />
        </KeyValueList>
      </SuccessState>
    </Box>
  );
}

function Arrived() {
  const t = useT(m);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <SuccessState title={t.arrivedTitle} description={t.arrivedBody} primaryAction={<Button>{t.track}</Button>}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, textAlign: 'left' }}>
          <IdentifierBlock label={t.code} value="0093" variant="block" copyable />
          <IdentifierBlock label={t.lot} value="04217753" variant="block" copyable groupSize={4} />
        </Box>
      </SuccessState>
    </Box>
  );
}

function Paid() {
  const t = useT(m);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <SuccessState title={t.paidTitle} description={t.paidBody} primaryAction={<Button>{t.done}</Button>} secondaryAction={<Button variant="quiet">{t.receipt}</Button>} />
    </Box>
  );
}

const meta = {
  title: 'Componentes/Estados de pantalla/Confirmación',
  component: SuccessState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Pantalla de **confirmación o éxito** (referencias s22 “Llegaste”, s35 “Felicidades”, s76 “Recarga exitosa”): un check grande, el resultado, los datos que lo respaldan y los siguientes pasos.',
          anatomy: ['**Check grande** sobre `brand.primary` con trazo `#111111`', '**Título** y **texto**', '**Detalles** (referencia, identificadores) — opcional', '**Acción principal** y **enlace secundario** en barra inferior con área segura'],
          props: ['`layout="page"` (por defecto): pantalla completa con las acciones en `BottomActionBar`. `inline`: compacto, con las acciones bajo el texto (paneles, diálogos).', '`children`: lo confirmado (referencia, código de recogida, lote, resumen).', 'Una sola acción principal (naranja con texto #111111); la secundaria es discreta.', 'Para el aviso persistente en una pantalla existente usa **Banner**.'],
          states: ['Entrada: el check escala de 0.8 a 1 en 320 ms (sin animación con `prefers-reduced-motion`)', 'Acciones con hover, foco y presionado'],
          tokens: [['Círculo', 'brand.primary'], ['Check', 'action.primary.fg (#111111)'], ['Texto', 'text.primary · text.secondary'], ['Barra inferior', 'surface.raised · radius.xl · layout.safeAreaBottom']],
          responsive: ['Móvil: check de 104 px centrado y barra de acciones fija abajo.', 'Escritorio o `inline`: check de 72 px y acciones bajo el texto, máx. 320 px.', 'Textos y datos largos hacen salto de línea.'],
          a11y: ['Región `role="status"`: el resultado se anuncia al aparecer.', 'El check es decorativo; el resultado está en el título.', 'El foco no se mueve solo; el orden es título → detalles → acciones.', 'Los identificadores (código, lote) mantienen sus ceros iniciales y se pueden copiar.'],
          content: [['¡Reserva confirmada! · Ver recibo · Ver mis reservas', 'Booking confirmed! · View receipt · View my bookings'], ['Tu conductor llegó', 'Your driver has arrived'], ['Pago recibido', 'Payment received']],
          example: '**Ejemplo de negocio**: reserva de Detailing confirmada (BK-20391), conductor llegando a Copart Miami Norte con código 0093 y lote 04217753, y pago de $174.00 recibido.',
        }),
      },
    },
  },
} satisfies Meta<typeof SuccessState>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { title: '' };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, layout: 'page' },
  argTypes: { layout: { control: 'inline-radio', options: ['page', 'inline'] }, title: { control: false }, description: { control: false }, primaryAction: { control: false }, secondaryAction: { control: false }, children: { control: false } },
  render: (args) => <InteractiveDemo layout={args.layout} />,
};
export const Inline: Story = { name: 'En línea', args: base, render: () => <VariantsDemo /> };
export const BookingConfirmedStory: Story = { name: 'Ejemplo de negocio · Reserva confirmada (s35)', args: base, parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } }, render: () => <BookingConfirmed /> };
export const ArrivedStory: Story = { name: 'Ejemplo de negocio · Conductor llegó (s22)', args: base, parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } }, render: () => <Arrived /> };
export const PaidStory: Story = { name: 'Ejemplo de negocio · Pago recibido (s76)', args: base, parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } }, render: () => <Paid /> };
