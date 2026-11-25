import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { getJob, todayJobs } from '../../mocks/bookings';
import { getProfessional } from '../../mocks/people';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { OperatorJobCard } from './OperatorJobCard';

const name = (id?: string) => (id ? getProfessional(id)?.name : undefined);
const towing = getJob('BS-24102')!;

const meta = {
  title: 'Black Seat/Tarjeta de trabajo del operador',
  component: OperatorJobCard,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Resume un trabajo para el operador en móvil: hora, unidad, cliente, ubicación, estado y la siguiente acción. En Towing muestra subasta, patio, **número de lote** y código de recogida. También sirve como `renderMobileCard` de `DataTable`.',
          anatomy: ['**Hora** (cifras tabulares) e identificador', '**Unidad y servicio**', '**Cliente**', '**Ubicación completa** (sin recortar)', '**Bloque de subasta** (solo Towing): patio, lote y código con copiar', '**Responsable** o “Pendiente de asignación”', '**Estado** de la reserva y pago si no está pagado', '**Siguiente acción**'],
          props: ['`job` es un `Job` (`bookingToJob` en `src/mocks/bookings.ts`); `assigneeName` ya resuelto.', '`variant="embedded"` quita la superficie para usarlo dentro de `DataTable.renderMobileCard`.', '`onAction(action, job)`: assign, start, complete o view. Solo “Asignar operador” es naranja.'],
          states: ['Confirmado sin asignar (acción naranja)', 'Confirmado asignado (Iniciar servicio)', 'En curso (Completar)', 'Completado o cancelado (Ver detalle, discreto)', 'Pago pendiente o fallido (insignia extra)'],
          tokens: [['Superficie', 'surface.raised · border.subtle'], ['Bloque de subasta', 'surface.subtle'], ['Hora, responsable y lote', 'text.primary (carbón)'], ['Acción de asignar', 'action.primary.*'], ['Estados', 'status.*.*']],
          responsive: ['Diseñada para 390 px: una columna y acción de ancho completo.', 'En escritorio la bandeja usa la tabla; esta tarjeta aparece cuando el contenedor mide menos de 640 px.'],
          a11y: ['La tarjeta es un grupo con nombre “Trabajo BS-24102: cliente, hora”; la acción incluye cliente e identificador.', 'Lote y código tienen su propia etiqueta y botón de copiar con confirmación.', 'Estados con texto e icono.'],
          content: [['Asignar operador · Iniciar servicio · Completar · Ver detalle', 'Assign operator · Start service · Complete · View detail'], ['Pendiente de asignación', 'Awaiting assignment'], ['Lote · Código de recogida', 'Lot · Pickup code']],
          example: '**Ejemplo de negocio**: la agenda de hoy (2026-11-25) con Detailing, Towing (lote 04217753, código 0093) y Personal Washing.',
        }),
      },
    },
  },
} satisfies Meta<typeof OperatorJobCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { job: towing },
  render: (args) => (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <OperatorJobCard {...args} onAction={() => undefined} />
    </Box>
  ),
};

export const States: Story = {
  name: 'Estados',
  args: { job: towing },
  render: function Render() {
    const l = useStoryLabels();
    const ids = ['BS-24107', 'BS-24101', 'BS-24103', 'BS-24108', 'BS-24109', 'BS-24113'];
    return (
      <Showcase maxWidth={390}>
        {ids.map((id) => {
          const job = getJob(id)!;
          return (
            <Specimen key={id} label={`${id} · ${job.status} · ${job.assignment} · ${job.payment}`} direction="column" align="stretch">
              <OperatorJobCard job={job} assigneeName={name(job.assigneeId)} onAction={() => undefined} />
            </Specimen>
          );
        })}
        <Specimen label={`${l.states}: embedded`} direction="column" align="stretch">
          <Box sx={{ border: '1px dashed', borderColor: 'divider', p: 3 }}>
            <OperatorJobCard job={towing} variant="embedded" />
          </Box>
        </Specimen>
      </Showcase>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: { job: towing },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label={`${l.businessExample} · Towing`} direction="column" align="stretch">
          <OperatorJobCard job={getJob('BS-24104')!} assigneeName={name('pro-mateo')} onAction={() => undefined} />
        </Specimen>
        <Specimen label={`${l.businessExample} · Detailing`} direction="column" align="stretch">
          <OperatorJobCard job={todayJobs[0]} assigneeName={name(todayJobs[0].assigneeId)} onAction={() => undefined} />
        </Specimen>
        <Specimen label={`${l.businessExample} · Personal Washing`} direction="column" align="stretch">
          <OperatorJobCard job={getJob('BS-24106')!} assigneeName={name('pro-andres')} onAction={() => undefined} />
        </Specimen>
      </Showcase>
    );
  },
};
