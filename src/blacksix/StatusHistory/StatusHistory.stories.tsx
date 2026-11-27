import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { getBooking } from '../../mocks/bookings';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { StatusHistory } from './StatusHistory';

const done = getBooking('BS-24108')!;
const upcoming = getBooking('BS-24117')!;

const meta = {
  title: 'Black Seat/Historial de estados',
  component: StatusHistory,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Línea de tiempo de una reserva: qué estado tuvo, cuándo (fecha y hora) y quién hizo el cambio. Permite saber cuándo se confirmó, inició, completó o canceló un trabajo. El seguimiento del cliente (Track Order) lo reutiliza.',
          anatomy: ['**Punto** con icono y tono del estado', '**Estado** (y dimensión cuando no es la reserva)', '**Fecha y hora** (`<time>`) y **responsable**', '**Nota interna** (solo operador)', '**Pasos pendientes** (opcional, punteados)'],
          props: ['`audience="customer"` usa los textos largos, oculta cambios internos y notas; `"operator"` muestra todo, con rol de quien cambió.', '`order="asc"` (defecto) o `"desc"` (registro del operador).', '`showUpcoming` agrega lo que falta después del estado actual: En curso, Completada.'],
          states: ['Hecho', 'Actual (borde grueso, `aria-current="step"`)', 'Pendiente (punto punteado)', 'Cancelado (neutro) y pago fallido (peligro)', 'Vacío'],
          tokens: [['Punto', 'status.<tono>.bg · fg · border'], ['Línea', 'border.subtle'], ['Pendiente', 'surface.canvas · border.strong (punteado)'], ['Texto secundario', 'text.secondary']],
          responsive: ['Una columna en cualquier ancho; las líneas largas (fecha + responsable) se envuelven.', 'En escritorio se coloca en el panel de detalle de la orden.'],
          a11y: ['Lista ordenada con nombre; el paso actual lleva `aria-current="step"`.', 'Cada estado va con icono y texto; el punto es decorativo.', 'La fecha usa `<time dateTime>`.'],
          content: [['Confirmada · por Black Seat', 'Confirmed · by Black Seat'], ['Pendiente de asignación', 'Awaiting assignment'], ['Cancelada por el cliente con más de 24 h.', 'Cancelled by the customer more than 24 h ahead.']],
          example: '**Ejemplo de negocio**: reserva BS-24108 (Detailing completado hoy) vista por el operador, y BS-24117 con los pasos pendientes para el cliente.',
        }),
      },
    },
  },
} satisfies Meta<typeof StatusHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { changes: upcoming.history, audience: 'customer', showUpcoming: true },
  render: (args) => (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <StatusHistory {...args} />
    </Box>
  ),
};

export const States: Story = {
  name: 'Estados',
  args: { changes: done.history },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label={`${l.client} · Track Order`} direction="column" align="stretch">
          <StatusHistory changes={upcoming.history} audience="customer" showUpcoming />
        </Specimen>
        <Specimen label={`${l.operator} · completa`} direction="column" align="stretch">
          <StatusHistory changes={done.history} audience="operator" />
        </Specimen>
        <Specimen label="Cancelada con reembolso / Cancelled and refunded" direction="column" align="stretch">
          <StatusHistory changes={getBooking('BS-24071')!.history} audience="customer" />
        </Specimen>
        <Specimen label="Pago fallido / Payment failed" direction="column" align="stretch">
          <StatusHistory changes={getBooking('BS-24113')!.history} audience="operator" order="desc" />
        </Specimen>
        <Specimen label="Vacío / Empty" direction="column" align="stretch">
          <StatusHistory changes={[]} />
        </Specimen>
      </Showcase>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: { changes: done.history },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label={`${l.businessExample} · Towing en curso (BS-24104)`} direction="column" align="stretch">
          <StatusHistory changes={getBooking('BS-24104')!.history} audience="operator" />
        </Specimen>
        <Specimen label={`${l.businessExample} · Personal Washing (BS-24118)`} direction="column" align="stretch">
          <StatusHistory changes={getBooking('BS-24118')!.history} audience="customer" showUpcoming />
        </Specimen>
      </Showcase>
    );
  },
};
