import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { assignmentStatuses, bookingStatuses, paymentStatuses } from '../../../domain/status';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { StatusBadge } from './StatusBadge';

const m = {
  es: { booking: 'booking.status', assignment: 'assignment.status', payment: 'payment.status', combo: 'Una reserva, tres dimensiones', job: 'Detailing Completo · Sáb 14 dic · 10:00 a. m.' },
  en: { booking: 'booking.status', assignment: 'assignment.status', payment: 'payment.status', combo: 'One booking, three dimensions', job: 'Full Detailing · Sat, Dec 14 · 10:00 AM' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={560}>
      <Specimen label={t.booking}>
        {bookingStatuses.map((s) => (
          <StatusBadge key={s} dimension="booking" status={s} />
        ))}
      </Specimen>
      <Specimen label={`${t.assignment} · long`}>
        {assignmentStatuses.map((s) => (
          <StatusBadge key={s} dimension="assignment" status={s} long />
        ))}
      </Specimen>
      <Specimen label={t.payment}>
        {paymentStatuses.map((s) => (
          <StatusBadge key={s} dimension="payment" status={s} />
        ))}
      </Specimen>
      <Specimen label={`${l.sizes} · outline`}>
        <StatusBadge dimension="booking" status="completed" size="sm" />
        <StatusBadge dimension="booking" status="completed" variant="outline" />
        <StatusBadge dimension="payment" status="failed" size="sm" variant="outline" />
      </Specimen>
      <Specimen label={`${l.businessExample}: ${t.combo}`} direction="column" align="stretch">
        <Box sx={{ border: `1px solid ${bs.border.subtle}`, borderRadius: 4, p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="label">{t.job}</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <StatusBadge dimension="booking" status="confirmed" />
            <StatusBadge dimension="assignment" status="unassigned" long />
            <StatusBadge dimension="payment" status="pending" />
          </Box>
        </Box>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Presentación de datos/Insignia de estado',
  component: StatusBadge,
  args: { dimension: 'booking', status: 'confirmed', size: 'md', variant: 'soft', long: false },
  argTypes: {
    dimension: { control: 'inline-radio', options: ['booking', 'assignment', 'payment'] },
    status: { control: 'select', options: [...bookingStatuses, ...assignmentStatuses, ...paymentStatuses] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    variant: { control: 'inline-radio', options: ['soft', 'outline'] },
  },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Muestra el estado de una de las tres dimensiones independientes de una reserva: `booking.status`, `assignment.status` y `payment.status` (fuente: `src/domain/status.ts`).',
          anatomy: ['**Píldora** con tono', '**Icono** propio de cada estado', '**Texto** del estado', '**Prefijo oculto** con la dimensión (“Pago:”)'],
          props: [
            '`dimension` + `status` tipados: el compilador impide mezclar estados de distintas dimensiones.',
            '`long` usa la versión para el cliente cuando existe (Sin asignar → “Pendiente de asignación”).',
            'Mapa de tonos — reserva: pendiente → warning, confirmada → info, en curso → brand, completada → success, cancelada → neutral. Asignación: sin asignar → warning, asignada → success. Pago: pendiente → warning, pagado → success, fallido → danger, reembolsado → info.',
            'Los estados exactos deben validarse con el negocio (ver brief §5).',
          ],
          states: ['Solo presentación. `title` muestra la descripción del estado al pasar el cursor.'],
          tokens: [
            ['Fondo / texto / borde', 'status.<tono>.bg · fg · border'],
            ['Icono', 'status.<tono>.fg'],
            ['Radio', 'radius.pill'],
            ['Tipografía', 'typeScale.caption 650'],
          ],
          responsive: ['Una línea; con poco espacio el texto se recorta con puntos suspensivos y el icono permanece.', '`sm` en tarjetas de trabajo y tablas; `outline` en tablas densas.'],
          a11y: ['Texto + icono + tono: nunca solo color (WCAG 1.4.1).', 'El lector anuncia la dimensión: “Pago: Pago pendiente”, “Asignación: Pendiente de asignación”.', 'Todos los pares texto/fondo superan 4,5:1 en claro y oscuro.'],
          content: [
            ['Pendiente de confirmación', 'Awaiting confirmation'],
            ['Pendiente de asignación', 'Awaiting assignment'],
            ['Pago fallido', 'Payment failed'],
            ['Reembolsado', 'Refunded'],
          ],
          example: 'En **Todos los estados**, una reserva de Detailing confirmada, pendiente de asignación y con pago pendiente a la vez.',
        }),
      },
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo' };
export const AllStatuses: Story = { name: 'Todos los estados', render: () => <AllDemo /> };
