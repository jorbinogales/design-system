import type { Meta, StoryObj } from '@storybook/react-vite';
import { getBookingDetail } from '../../mocks/bookings';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { NextAppointmentCard } from './NextAppointmentCard';

const next = getBookingDetail('BS-24117');

const meta = {
  title: 'Black Seat/Tarjeta de próxima cita',
  component: NextAppointmentCard,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Resume la próxima cita del cliente (servicio, fecha, hora y estado) y lleva a la reserva con “Ver reserva”. El identificador es el mismo que muestran la confirmación y el historial.',
          anatomy: ['**Bloque de fecha** (mes y día)', '**Servicio** (unidad · paquete), fecha larga, **hora** y lugar', '**Estado de la reserva** y, solo si requieren atención, **asignación pendiente** y **pago pendiente o fallido**', '**Identificador** de la reserva (BS-24117)', '**Acción “Ver reserva”**'],
          props: ['`booking` es un `BookingDetail`. Las tres dimensiones de estado se leen por separado: confirmada + sin asignar + pago pendiente es un caso normal.', '`onView(id)` o `href` navegan a la reserva.'],
          states: ['Pendiente de confirmación', 'Confirmada', 'Confirmada, sin asignar y con pago pendiente', 'Pago fallido', 'Foco visible en la acción'],
          tokens: [['Superficie', 'surface.raised · border.subtle'], ['Bloque de fecha', 'surface.subtle'], ['Insignias', 'status.*.*'], ['Acción', 'action.secondary.* (el naranja se reserva para confirmar)']],
          responsive: ['Una columna en 390 px; la acción baja de línea si el identificador y el botón no caben.', 'En escritorio se usa en una lista de dos columnas.'],
          a11y: ['La acción lleva el id y el servicio en su nombre accesible.', 'El bloque de fecha es decorativo (`aria-hidden`); la fecha completa está en texto.', 'Los estados son texto + icono.'],
          content: [['Ver reserva', 'View booking'], ['Pendiente de asignación', 'Awaiting assignment'], ['Confirmada · Pago pendiente', 'Confirmed · Payment pending']],
          example: '**Ejemplo de negocio**: BS-24117 (Detailing Premium, viernes 27 de noviembre a las 10:00 en Black Seat Doral) y el resto de reservas de Andrea en Towing y Personal Washing.',
        }),
      },
    },
  },
} satisfies Meta<typeof NextAppointmentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { booking: next, onView: () => undefined },
  render: (args) => (
    <Showcase maxWidth={390}>
      <NextAppointmentCard {...args} />
    </Showcase>
  ),
};

export const States: Story = {
  name: 'Estados',
  args: { booking: next },
  render: function Render() {
    return (
      <Showcase maxWidth={390}>
        <Specimen label="Confirmada · sin asignar · pago pendiente" direction="column" align="stretch">
          <NextAppointmentCard booking={getBookingDetail('BS-24117')} onView={() => undefined} />
        </Specimen>
        <Specimen label="Pendiente de confirmación / Awaiting confirmation" direction="column" align="stretch">
          <NextAppointmentCard booking={getBookingDetail('BS-24120')} onView={() => undefined} />
        </Specimen>
        <Specimen label="Confirmada · asignada · pagada" direction="column" align="stretch">
          <NextAppointmentCard booking={getBookingDetail('BS-24118')} onView={() => undefined} />
        </Specimen>
        <Specimen label="Pago fallido / Payment failed" direction="column" align="stretch">
          <NextAppointmentCard booking={getBookingDetail('BS-24119')} onView={() => undefined} />
        </Specimen>
      </Showcase>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: { booking: next },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label={`${l.businessExample} · Towing`} direction="column" align="stretch">
          <NextAppointmentCard booking={getBookingDetail('BS-24120')} onView={() => undefined} />
        </Specimen>
        <Specimen label={`${l.businessExample} · Personal Washing`} direction="column" align="stretch">
          <NextAppointmentCard booking={getBookingDetail('BS-24118')} onView={() => undefined} />
        </Specimen>
      </Showcase>
    );
  },
};
