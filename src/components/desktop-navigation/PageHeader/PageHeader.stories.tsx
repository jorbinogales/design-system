import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { Button } from '../../actions/Button/Button';
import { StatusBadge } from '../../data-display/StatusBadge/StatusBadge';
import { ActionMenu } from '../../overlays/ActionMenu/ActionMenu';
import { PageHeader } from './PageHeader';

const m = {
  es: {
    today: 'Hoy',
    todayDesc: 'Sábado 14 de diciembre · 9 trabajos, 3 sin asignar',
    newBooking: 'Nueva reserva',
    export: 'Exportar',
    jobs: 'Trabajos',
    order: 'Orden BK-20418',
    orderDesc: 'Recogida Copart Miami Norte · Lote 04217753 · Código 0093',
    reassign: 'Reasignar',
    start: 'Iniciar recogida',
    more: 'Más acciones',
    cancel: 'Cancelar reserva',
    deep: 'Orden BK-20418 · Historial de estados',
    staff: 'Personal',
    luis: 'Luis Herrera',
    long: 'Detailing Completo con corrección de pintura y tratamiento cerámico · Toyota Camry 2022',
    hold: 'En espera',
  },
  en: {
    today: 'Today',
    todayDesc: 'Saturday, December 14 · 9 jobs, 3 unassigned',
    newBooking: 'New booking',
    export: 'Export',
    jobs: 'Jobs',
    order: 'Order BK-20418',
    orderDesc: 'Copart Miami North pickup · Lot 04217753 · Code 0093',
    reassign: 'Reassign',
    start: 'Start pickup',
    more: 'More actions',
    cancel: 'Cancel booking',
    deep: 'Order BK-20418 · Status history',
    staff: 'Staff',
    luis: 'Luis Herrera',
    long: 'Full Detailing with paint correction and ceramic coating · 2022 Toyota Camry',
    hold: 'On hold',
  },
};

function Frame({ children }: { children: React.ReactNode }) {
  return <Box sx={{ width: '100%', maxWidth: 1000, p: 6, border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, backgroundColor: bs.surface.canvas }}>{children}</Box>;
}

function InteractiveDemo({ withBreadcrumbs, withActions }: { withBreadcrumbs?: boolean; withActions?: boolean }) {
  const t = useT(m);
  return (
    <Frame>
      <PageHeader
        title={t.today}
        description={t.todayDesc}
        breadcrumbs={withBreadcrumbs ? [{ label: t.jobs, href: '#trabajos' }, { label: t.today }] : undefined}
        actions={withActions ? <><Button variant="secondary" size="md">{t.export}</Button><Button size="md">{t.newBooking}</Button></> : undefined}
      />
    </Frame>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={1000}>
      <Specimen label={`${l.rest}: título + descripción`} direction="column" align="stretch">
        <Frame>
          <PageHeader title={t.today} description={t.todayDesc} />
        </Frame>
      </Specimen>
      <Specimen label={`${l.longText}`} direction="column" align="stretch">
        <Frame>
          <PageHeader title={t.long} breadcrumbs={[{ label: t.jobs, href: '#trabajos' }, { label: t.staff, href: '#personal' }, { label: t.luis, href: '#luis' }, { label: t.order, href: '#orden' }, { label: t.deep }]} actions={<Button size="md">{t.newBooking}</Button>} />
        </Frame>
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  return (
    <Frame>
      <PageHeader
        breadcrumbs={[{ label: t.jobs, href: '#trabajos' }, { label: t.order }]}
        title={t.order}
        description={t.orderDesc}
        meta={
          <>
            <StatusBadge dimension="booking" status="confirmed" />
            <StatusBadge dimension="assignment" status="unassigned" long />
          </>
        }
        actions={
          <>
            <ActionMenu label={t.more} items={[{ value: 'hold', label: t.hold }, { value: 'cancel', label: t.cancel, destructive: true }]} />
            <Button variant="secondary" size="md">
              {t.reassign}
            </Button>
            <Button size="md">{t.start}</Button>
          </>
        }
      />
    </Frame>
  );
}

const meta = {
  title: 'Componentes/Navegación de escritorio/Encabezado de página',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Encabezado de cada página de escritorio: **dónde estoy** (migas), **qué es** (título, insignias, descripción) y **qué puedo hacer** (acciones).',
          anatomy: ['**Migas de pan** (opcional, desde el segundo nivel)', '**Título** `h1` con insignias de estado (opcional)', '**Descripción** de una línea (opcional)', '**Acciones**: una principal naranja y secundarias o un menú de acciones'],
          props: ['`headingLevel` es `h1` por defecto: solo uno por página.', 'Máximo **una** acción primaria; el resto secundarias o dentro de un **Menú de acciones**.', '`meta` recibe StatusBadge o Tag; los estados de reserva, asignación y pago se muestran con texto e icono.'],
          states: ['Estático; las migas y acciones tienen sus propios estados'],
          tokens: [['Título', 'typeScale.h1'], ['Descripción', 'text.secondary'], ['Separación', 'space 12 px entre filas · 20 px abajo'], ['Márgenes', 'los define el contenedor de página (AppShell)']],
          responsive: ['Las acciones pasan debajo del título cuando no caben (salto de línea, no desborde).', 'Títulos largos hacen salto completo; las migas largas se contraen con “…”.'],
          a11y: ['`header` con el `h1` de la página y migas dentro de `nav` con nombre.', 'El orden de foco es migas → acciones (según el DOM del contenido).', 'Los estados de la orden no dependen del color: icono + texto.'],
          content: [['Hoy · Sábado 14 de diciembre · 9 trabajos, 3 sin asignar', 'Today · Saturday, December 14 · 9 jobs, 3 unassigned'], ['Orden BK-20418 · Reasignar · Iniciar recogida', 'Order BK-20418 · Reassign · Start pickup']],
          example: '**Ejemplo de negocio**: orden de Towing BK-20418 (Copart Miami Norte, lote 04217753, código 0093) con estados de reserva y asignación, y acciones del operador.',
        }),
      },
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { title: '' },
  render: () => <InteractiveDemo withBreadcrumbs withActions />,
};
export const Variants: Story = { name: 'Variantes y texto largo', args: { title: '' }, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio · Orden de Towing', args: { title: '' }, render: () => <BusinessDemo /> };
