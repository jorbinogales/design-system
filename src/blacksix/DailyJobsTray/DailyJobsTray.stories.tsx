import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import type { Job, JobAction } from '../../domain/booking';
import { useT } from '../../i18n/locale';
import { AppShell } from '../../components/desktop-navigation/AppShell/AppShell';
import { PageHeader } from '../../components/desktop-navigation/PageHeader/PageHeader';
import { Sidebar } from '../../components/desktop-navigation/Sidebar/Sidebar';
import { ResponsiveDetail } from '../../components/overlays/ResponsiveDetail/ResponsiveDetail';
import { getBookingDetail, todayJobs } from '../../mocks/bookings';
import { mockToday } from '../../mocks/catalog';
import { professionals } from '../../mocks/people';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { AssignmentPanel } from '../AssignmentPanel/AssignmentPanel';
import { OrderActionButtons, OrderDetail } from '../OrderDetail/OrderDetail';
import { DailyJobsTray } from './DailyJobsTray';

const staff = professionals.filter((p) => p.roleKind !== 'supervisor').map((p) => ({ id: p.id, name: p.name }));

const m = {
  es: { title: 'Hoy', description: (n: number) => `Miércoles 25 de noviembre · ${n} trabajos` },
  en: { title: 'Today', description: (n: number) => `Wednesday, November 25 · ${n} jobs` },
};

/** Desktop composition: AppShell + Sidebar + PageHeader + tray, with the order detail and the assignment panel. */
function Workspace({ height = 820 }: { height?: number }) {
  const t = useT(m);
  const [nav, setNav] = useState('today');
  const [jobs, setJobs] = useState<Job[]>(todayJobs);
  const [day, setDay] = useState<Dayjs>(mockToday);
  const [openId, setOpenId] = useState<string | null>(null);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [pick, setPick] = useState<string | null>(null);
  const opened = jobs.find((j) => j.id === openId) ?? null;
  const assigning = jobs.find((j) => j.id === assignId) ?? null;
  const onAction = (action: JobAction, job: Job) => {
    if (action === 'assign') {
      setAssignId(job.id);
      setPick(null);
    } else setOpenId(job.id);
  };
  return (
    <AppShell height={height} width="full" sidebar={<Sidebar value={nav} onChange={setNav} role="operator" />}>
      <PageHeader title={t.title} description={t.description(jobs.filter((j) => j.date === day.format('YYYY-MM-DD')).length)} />
      <DailyJobsTray jobs={jobs} day={day} onDayChange={setDay} today={mockToday} staff={staff} onOpenJob={(j) => setOpenId(j.id)} onAction={onAction} activeJobId={openId} />
      {opened && (
        <ResponsiveDetail open title={getBookingDetail(opened.id).customer.name} subtitle={opened.id} onClose={() => setOpenId(null)} actions={<OrderActionButtons order={getBookingDetail(opened.id)} role="operator" onAction={(a) => (a === 'assign' ? (setOpenId(null), setAssignId(opened.id)) : undefined)} />}>
          <OrderDetail order={getBookingDetail(opened.id)} role="operator" actions="none" />
        </ResponsiveDetail>
      )}
      <AssignmentPanel
        open={Boolean(assigning)}
        onClose={() => setAssignId(null)}
        job={assigning}
        professionals={professionals}
        jobs={jobs}
        value={pick}
        onChange={setPick}
        onConfirm={(id) => {
          setJobs((all) => all.map((j) => (j.id === assignId ? { ...j, assigneeId: id, assignment: 'assigned', nextAction: j.status === 'in_progress' ? 'complete' : 'start' } : j)));
          setAssignId(null);
        }}
      />
    </AppShell>
  );
}

function MobileTray({ jobs = todayJobs, day = mockToday }: { jobs?: Job[]; day?: Dayjs }) {
  const [d, setD] = useState(day);
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <DailyJobsTray jobs={jobs} day={d} onDayChange={setD} today={mockToday} staff={staff} onOpenJob={() => undefined} onAction={() => undefined} pageSize={4} />
    </Box>
  );
}

const meta = {
  title: 'Black Six/Bandeja de pedidos del día',
  component: DailyJobsTray,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'La bandeja de trabajo del operador para un día: fecha activa, filtros, tabla en escritorio (tarjetas de trabajo en móvil), responsable y estado. En Towing da acceso rápido a subasta, patio, lote y código.',
          anatomy: ['**Navegación de fecha** (`DateNavigator`) y **filtros** (`FilterBar`: búsqueda, unidad, responsable, estado)', '**Tabla** (`DataTable`): hora, unidad, cliente, ubicación, responsable, estado y siguiente acción', '**Bloque de subasta** en la ubicación de Towing, con copiar lote y código', '**Menú por fila** (ver detalle, asignar o reasignar)', '**Tarjetas de trabajo** (`OperatorJobCard`) cuando el contenedor mide menos de 640 px', '**Paginación**', '**Estados vacíos**: sin trabajos ese día / sin resultados con los filtros'],
          props: ['Componente apoyado en datos: `jobs` de cualquier día, `day` controlado y `staff` para el filtro de responsable.', '`onOpenJob` abre el detalle (`OrderDetail` en `ResponsiveDetail`); `onAction` lleva asignar, iniciar, completar y ver.', 'La historia de escritorio lo compone con `AppShell` + `Sidebar` + `PageHeader` y el `AssignmentPanel`.'],
          states: ['Con datos', 'Cargando (filas esqueleto)', 'Sin trabajos ese día', 'Sin resultados con filtros (limpiar)', 'Fila activa (detalle abierto)', 'Orden por columna'],
          tokens: [['Superficies', 'surface.canvas · surface.raised · border.subtle'], ['Fila activa', 'selection.bg'], ['Un solo naranja por fila', 'action.primary.* solo en “Asignar operador”'], ['Estados', 'status.*.*'], ['Bloque de subasta', 'surface.subtle']],
          responsive: ['Escritorio: tabla compacta con desplazamiento propio y barra lateral fija.', 'Móvil (390 px): una tarjeta por trabajo con acción de ancho completo.', 'Las direcciones nunca se recortan.'],
          a11y: ['Tabla con nombre, encabezados ordenables con `aria-sort` y fila navegable con teclado.', 'Los resultados filtrados se anuncian de forma cortés.', 'Estado e identificadores con texto, no solo color.'],
          content: [['Pedidos del día · Siguiente acción · Responsable', 'Orders of the day · Next action · Assignee'], ['Este día no tienes trabajos', 'No jobs on this day'], ['Asignar operador', 'Assign operator']],
          example: '**Ejemplo de negocio**: miércoles 25 de noviembre con 13 trabajos de Detailing, Towing (IAA y Copart, lotes con ceros iniciales) y Personal Washing, incluyendo confirmado + sin asignar + pago pendiente.',
        }),
      },
    },
  },
} satisfies Meta<typeof DailyJobsTray>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { jobs: todayJobs, day: mockToday, onDayChange: () => undefined, staff };

export const Interactive: Story = {
  name: 'Interactivo (escritorio)',
  args: base,
  parameters: { globals: { viewport: { value: 'desktop' } } },
  render: () => <Workspace />,
};

export const Mobile: Story = {
  name: 'Móvil (tarjetas de trabajo)',
  args: base,
  render: () => (
    <Box sx={{ p: 5 }}>
      <MobileTray />
    </Box>
  ),
};

export const States: Story = {
  name: 'Estados',
  args: base,
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Box sx={{ p: 5 }}>
        <Showcase maxWidth={390}>
          <Specimen label="Sin trabajos ese día / No jobs that day" direction="column" align="stretch">
            <MobileTray day={dayjs('2026-11-28')} />
          </Specimen>
          <Specimen label={l.loading} direction="column" align="stretch">
            <Box sx={{ width: 390, maxWidth: '100%' }}>
              <DailyJobsTray {...base} loading staff={staff} />
            </Box>
          </Specimen>
        </Showcase>
      </Box>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: base,
  parameters: { globals: { viewport: { value: 'desktop' } } },
  render: () => <Workspace height={880} />,
};
