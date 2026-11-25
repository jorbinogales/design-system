import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { Button } from '../../actions/Button/Button';
import { AmountBreakdown } from '../../data-display/AmountBreakdown/AmountBreakdown';
import { IdentifierBlock } from '../../data-display/IdentifierBlock/IdentifierBlock';
import { StatusBadge } from '../../data-display/StatusBadge/StatusBadge';
import { KeyValue, KeyValueList } from '../../layout/KeyValue/KeyValue';
import { SidePanel } from './SidePanel';

const m = {
  es: {
    open: 'Abrir detalle',
    reopen: 'Reabrir panel',
    title: 'Recogida Copart Miami Norte',
    subtitle: 'BK-20418 · Sábado 14 de diciembre, 1:00 p. m.',
    plainTitle: 'Detalle de la orden',
    plainBody: 'El contenido se desplaza dentro del panel; el encabezado y las acciones se quedan fijos.',
    auction: 'Subasta',
    auctionValue: 'Copart · Miami Norte',
    lot: 'Número de lote',
    code: 'Código de recogida',
    vehicle: 'Vehículo',
    vehicleValue: 'Honda Accord 2019 · gris',
    destination: 'Destino',
    destinationValue: '2150 NW 87th Ave, Doral, FL 33172',
    towing: 'Recogida y traslado',
    mileage: 'Millas adicionales (6)',
    mileageDetail: '$2.50 por milla',
    deposit: 'Anticipo pagado',
    total: 'Total',
    reassign: 'Reasignar',
    start: 'Iniciar recogida',
    close: 'Cerrar',
    save: 'Guardar',
  },
  en: {
    open: 'Open details',
    reopen: 'Reopen panel',
    title: 'Copart Miami North pickup',
    subtitle: 'BK-20418 · Saturday, December 14, 1:00 PM',
    plainTitle: 'Order details',
    plainBody: 'Content scrolls inside the panel; the header and actions stay fixed.',
    auction: 'Auction',
    auctionValue: 'Copart · Miami North',
    lot: 'Lot number',
    code: 'Pickup code',
    vehicle: 'Vehicle',
    vehicleValue: '2019 Honda Accord · gray',
    destination: 'Destination',
    destinationValue: '2150 NW 87th Ave, Doral, FL 33172',
    towing: 'Pickup and transport',
    mileage: 'Extra miles (6)',
    mileageDetail: '$2.50 per mile',
    deposit: 'Deposit paid',
    total: 'Total',
    reassign: 'Reassign',
    start: 'Start pickup',
    close: 'Close',
    save: 'Save',
  },
};

function OrderBody() {
  const t = useT(m);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <StatusBadge dimension="booking" status="confirmed" />
        <StatusBadge dimension="assignment" status="unassigned" long />
        <StatusBadge dimension="payment" status="pending" />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 4 }}>
        <IdentifierBlock label={t.lot} value="04217753" copyable variant="block" groupSize={4} />
        <IdentifierBlock label={t.code} value="0093" copyable variant="block" />
      </Box>
      <KeyValueList>
        <KeyValue label={t.auction} value={t.auctionValue} layout="stacked" />
        <KeyValue label={t.vehicle} value={t.vehicleValue} layout="stacked" />
        <KeyValue label={t.destination} value={t.destinationValue} layout="stacked" />
      </KeyValueList>
      <AmountBreakdown
        density="compact"
        lines={[
          { label: t.towing, amount: 85 },
          { label: t.mileage, amount: 15, detail: t.mileageDetail },
          { label: t.deposit, amount: -30, kind: 'discount' },
        ]}
        total={70}
        totalLabel={t.total}
      />
    </Box>
  );
}

/** Stage that contains the panel so the docs page shows it inline instead of covering Storybook. */
function Stage({ children }: { children: ReactNode }) {
  return <Box sx={{ position: 'relative', height: 640, width: '100%', overflow: 'hidden', border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, backgroundColor: bs.surface.subtle }}>{children}</Box>;
}

function InteractiveDemo({ width, dismissible }: { width?: 'md' | 'lg'; dismissible?: boolean }) {
  const t = useT(m);
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ p: 4 }}>
      <Button size="md" variant="secondary" onClick={() => setOpen(true)}>
        {t.open}
      </Button>
      <SidePanel
        open={open}
        onClose={() => setOpen(false)}
        title={t.plainTitle}
        width={width}
        dismissible={dismissible}
        actions={
          <>
            <Button size="md" variant="secondary" onClick={() => setOpen(false)}>
              {t.close}
            </Button>
            <Button size="md" onClick={() => setOpen(false)}>
              {t.save}
            </Button>
          </>
        }
      >
        <Typography variant="body1">{t.plainBody}</Typography>
      </SidePanel>
    </Box>
  );
}

function BusinessDemo() {
  const t = useT(m);
  const [open, setOpen] = useState(true);
  return (
    <Stage>
      <Box sx={{ p: 6 }}>
        <Button size="md" variant="secondary" onClick={() => setOpen(true)}>
          {t.reopen}
        </Button>
      </Box>
      <SidePanel
        open={open}
        disablePortal
        onClose={() => setOpen(false)}
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <>
            <Button size="md" variant="secondary">
              {t.reassign}
            </Button>
            <Button size="md">{t.start}</Button>
          </>
        }
      >
        <OrderBody />
      </SidePanel>
    </Stage>
  );
}

const meta = {
  title: 'Componentes/Capas y menús/Panel lateral',
  component: SidePanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Cajón a la derecha para ver o editar el **detalle de una fila** (orden, asignación) sin perder la bandeja de fondo. Pensado para escritorio; en móvil el mismo detalle se abre como página con **Detalle adaptable**.',
          anatomy: ['**Encabezado**: título, subtítulo (referencia y fecha) y botón cerrar', '**Cuerpo** desplazable', '**Pie fijo** con acciones (secundaria a la izquierda, primaria a la derecha)', '**Velo** sobre la bandeja'],
          props: ['`width`: `md` 440 px (por defecto) · `lg` 560 px.', '`dismissible={false}`: Esc y velo no cierran (ediciones sin guardar); el botón cerrar sí llama a `onClose` y es donde se pregunta si descartar.', '`disablePortal`: monta el panel dentro de un contenedor posicionado.'],
          states: ['Cerrado · entrando (220 ms) · abierto · saliendo', 'El cuerpo desplazado conserva el encabezado y el pie visibles'],
          tokens: [['Fondo', 'surface.raised'], ['Borde izquierdo y divisores', 'border.subtle'], ['Velo', 'scrim'], ['Márgenes internos', 'space 24 / 16'], ['Título', 'typeScale.h3']],
          responsive: ['Ancho = mínimo entre el ancho elegido y la pantalla.', 'Por debajo de 900 px usa **Detalle adaptable**, que lo convierte en página completa.', 'Textos largos (direcciones) hacen salto de línea completo.'],
          a11y: ['`role="dialog"`, `aria-modal` y nombre = título.', 'Foco atrapado; al abrir va al panel y al cerrar vuelve a la fila que lo abrió.', 'Esc cierra (salvo `dismissible={false}`). El botón cerrar tiene nombre “Cerrar panel”.', 'Los estados de la orden se muestran con texto e icono.'],
          content: [['Detalle de la orden · Reasignar · Iniciar recogida', 'Order details · Reassign · Start pickup'], ['BK-20418 · Sábado 14 de diciembre, 1:00 p. m.', 'BK-20418 · Saturday, December 14, 1:00 PM']],
          example: '**Ejemplo de negocio**: orden de Towing BK-20418, recogida en Copart Miami Norte, lote 04217753 y código 0093, con estados de reserva, asignación y pago, y el desglose de importes.',
        }),
      },
    },
  },
} satisfies Meta<typeof SidePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { open: false, onClose: () => undefined, title: '', children: null };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, width: 'md', dismissible: true },
  argTypes: { open: { control: false }, onClose: { control: false }, title: { control: false }, children: { control: false }, actions: { control: false } },
  render: (args) => <InteractiveDemo width={args.width} dismissible={args.dismissible} />,
};
export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: base, parameters: { layout: 'padded' }, render: () => <BusinessDemo /> };
