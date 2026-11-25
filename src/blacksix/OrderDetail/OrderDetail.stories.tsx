import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../components/actions/Button/Button';
import { ResponsiveDetail } from '../../components/overlays/ResponsiveDetail/ResponsiveDetail';
import { useT } from '../../i18n/locale';
import { getBookingDetail } from '../../mocks/bookings';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { OrderActionButtons, OrderDetail, type OrderAction } from './OrderDetail';

const towing = getBookingDetail('BS-24102');

const m = {
  es: { open: 'Abrir detalle en panel', last: (a: string) => `Acción solicitada: ${a}` },
  en: { open: 'Open detail in a panel', last: (a: string) => `Requested action: ${a}` },
};

function PanelDemo({ id }: { id: string }) {
  const t = useT(m);
  const order = getBookingDetail(id);
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<OrderAction | null>(null);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {t.open}
      </Button>
      {last && <span role="status">{t.last(last)}</span>}
      <ResponsiveDetail open={open} onClose={() => setOpen(false)} title={order.customer.name} subtitle={order.id} actions={<OrderActionButtons order={order} role="admin" onAction={setLast} />}>
        <OrderDetail order={order} role="admin" actions="none" />
      </ResponsiveDetail>
    </Box>
  );
}

const meta = {
  title: 'Black Six/Detalle de orden',
  component: OrderDetail,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'La misma reserva vista desde operación: servicio, horario, cliente, ubicación, **datos de recogida cuando aplican** (Towing), responsable, pago, historial y **solo las acciones que el rol permite**.',
          anatomy: ['**Estados** de reserva, asignación y pago (tres insignias)', '**Servicio** y **fecha y hora**', '**Cliente** con llamada y vehículo', '**Ubicación** completa', '**Datos de recogida** (solo Towing): subasta, patio, lote y código con copiar', '**Responsable**', '**Pago**: método, referencia y desglose', '**Nota** (opcional)', '**Historial de estados**', '**Acciones del rol**'],
          props: ['`order` es un `BookingDetail`; `role` filtra las acciones con `getOrderActions(order, role)` (exportada).', 'Operador: asignar, iniciar, completar. Administración: además reasignar, reprogramar, registrar pago, reembolsar y cancelar.', '`actions="none"` cuando el contenedor pone `OrderActionButtons` en su pie fijo.'],
          states: ['Sin asignar (acción naranja “Asignar operador”)', 'Asignada (Iniciar servicio)', 'En curso (Completar)', 'Completada o cancelada (solo lectura para operador)', 'Pago pendiente o fallido', 'Rol restringido (aviso)'],
          tokens: [['Encabezados', 'typeScale.h4 · text.primary'], ['Etiquetas', 'text.secondary'], ['Separador de acciones', 'border.subtle'], ['Acción destructiva', 'action.destructive.*'], ['Un solo naranja', 'action.primary.* (solo asignar)']],
          responsive: ['Dentro de `ResponsiveDetail`: panel lateral desde 900 px y página completa en móvil.', 'Las direcciones y referencias se envuelven sin recortar.'],
          a11y: ['Cada bloque es una sección con encabezado; la acción de llamar indica a quién.', 'Lote y código con etiqueta propia y copia anunciada.', 'Las acciones forman un grupo con nombre; las no permitidas no se muestran.'],
          content: [['Asignar operador · Reasignar · Reprogramar · Cancelar reserva', 'Assign operator · Reassign · Reschedule · Cancel booking'], ['Datos de recogida', 'Pickup details'], ['Tu rol no permite reprogramar, cobrar ni cancelar.', 'Your role cannot reschedule, collect or cancel.']],
          example: '**Ejemplo de negocio**: BS-24102 (Towing: IAA Miami North, lote 04217753, código 0093, sin asignar, pago pendiente) para operador y para administración.',
        }),
      },
    },
  },
} satisfies Meta<typeof OrderDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { order: towing, role: 'operator' },
  render: (args) => (
    <Box sx={{ width: 440, maxWidth: '100%' }}>
      <OrderDetail {...args} onAction={() => undefined} />
    </Box>
  ),
};

export const States: Story = {
  name: 'Estados',
  args: { order: towing, role: 'operator' },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={440}>
        <Specimen label={`${l.operator} · en curso (BS-24103)`} direction="column" align="stretch">
          <OrderDetail order={getBookingDetail('BS-24103')} role="operator" />
        </Specimen>
        <Specimen label={`${l.operator} · completada, solo lectura (BS-24108)`} direction="column" align="stretch">
          <OrderDetail order={getBookingDetail('BS-24108')} role="operator" />
        </Specimen>
        <Specimen label="Admin · cancelada y reembolsada / cancelled and refunded" direction="column" align="stretch">
          <OrderDetail order={getBookingDetail('BS-24109')} role="admin" />
        </Specimen>
      </Showcase>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: { order: towing, role: 'operator' },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={440}>
        <Specimen label={`${l.businessExample} · Towing · ${l.operator}`} direction="column" align="stretch">
          <OrderDetail order={towing} role="operator" />
        </Specimen>
        <Specimen label={`${l.businessExample} · Towing · Admin`} direction="column" align="stretch">
          <OrderDetail order={getBookingDetail('BS-24110')} role="admin" />
        </Specimen>
        <Specimen label="En panel (ResponsiveDetail) / In a panel" direction="column" align="stretch">
          <PanelDemo id="BS-24111" />
        </Specimen>
      </Showcase>
    );
  },
};
