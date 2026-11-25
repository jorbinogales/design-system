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
          purpose: 'Resume la próxima cita del cliente en dos columnas: la fecha grande con el identificador debajo, y el servicio, la fecha, la hora, el lugar y “Ver reserva”. Los estados se ven en el detalle de la reserva, no en la tarjeta.',
          anatomy: ['Columna izquierda: **bloque de fecha** (mes, día grande y día de la semana) y debajo el **identificador** (BS-24117)', 'Columna derecha: **servicio** (unidad · paquete), fecha larga, **hora**, lugar y la **acción “Ver reserva”** a todo el ancho de la columna'],
          props: ['`booking` es un `BookingDetail`.', '`onView(id)` o `href` navegan a la reserva, donde están los tres estados (reserva, asignación y pago).'],
          states: ['Reposo', 'Hover y presionado en la acción', 'Foco visible en la acción'],
          tokens: [['Superficie', 'surface.raised · border.subtle'], ['Bloque de fecha', 'surface.subtle'], ['Acción', 'action.secondary.* (el naranja se reserva para confirmar)']],
          responsive: ['Dos columnas también en 320 px: la de la fecha ocupa el 30 % (mínimo 96 px).', 'El bloque de fecha se estira hasta la altura del contenido de la derecha.'],
          a11y: ['La acción lleva el id y el servicio en su nombre accesible.', 'El bloque de fecha es decorativo (`aria-hidden`); la fecha completa está en texto.', 'Los estados se anuncian en el detalle de la reserva.'],
          content: [['Ver reserva', 'View booking'], ['Reserva BS-24117', 'Booking BS-24117']],
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
  name: 'Variantes de servicio',
  args: { booking: next },
  render: function Render() {
    return (
      <Showcase maxWidth={390}>
        <Specimen label="Detailing" direction="column" align="stretch">
          <NextAppointmentCard booking={getBookingDetail('BS-24117')} onView={() => undefined} />
        </Specimen>
        <Specimen label="Towing" direction="column" align="stretch">
          <NextAppointmentCard booking={getBookingDetail('BS-24120')} onView={() => undefined} />
        </Specimen>
        <Specimen label="Personal Washing" direction="column" align="stretch">
          <NextAppointmentCard booking={getBookingDetail('BS-24118')} onView={() => undefined} />
        </Specimen>
        <Specimen label="Pago fallido (mismo aspecto: el estado está en el detalle)" direction="column" align="stretch">
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
