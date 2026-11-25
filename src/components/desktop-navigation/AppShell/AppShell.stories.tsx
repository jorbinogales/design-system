import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useLocale, useT, type Locale } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { bs } from '../../../theme/theme';
import { Button } from '../../actions/Button/Button';
import { AmountBreakdown } from '../../data-display/AmountBreakdown/AmountBreakdown';
import { IdentifierBlock } from '../../data-display/IdentifierBlock/IdentifierBlock';
import { InitialsAvatar } from '../../data-display/InitialsAvatar/InitialsAvatar';
import { StatusBadge } from '../../data-display/StatusBadge/StatusBadge';
import { Card } from '../../layout/Card/Card';
import { ListGroup, ListRow } from '../../layout/ListRow/ListRow';
import { SegmentedControl } from '../../navigation/SegmentedControl/SegmentedControl';
import { SidePanel } from '../../overlays/SidePanel/SidePanel';
import type { AppearanceMode } from '../../preferences/AppearanceSelect/AppearanceSelect';
import { PageHeader } from '../PageHeader/PageHeader';
import { Sidebar, useSidebarItems, type StaffRole } from '../Sidebar/Sidebar';
import { UserMenu } from '../UserMenu/UserMenu';
import { AppShell } from './AppShell';

const m = {
  es: {
    today: 'Hoy',
    jobs: 'Trabajos',
    date: 'Sábado 14 de diciembre · 4 trabajos, 1 sin asignar',
    newBooking: 'Nueva reserva',
    export: 'Exportar agenda',
    list: 'Trabajos de hoy',
    j1: 'Lavado exterior · Mazda CX-5',
    j1d: '9:00 a. m. · Brickell · Luis Herrera',
    j2: 'Detailing Completo · Toyota Camry',
    j2d: '11:30 a. m. · Coral Gables · Carla Méndez',
    j3: 'Recogida Copart Miami Norte',
    j3d: '1:00 p. m. · Lote 04217753 · Código 0093',
    j4: 'Lavado en domicilio · Kia Sportage',
    j4d: '4:30 p. m. · Doral · Luis Herrera',
    role: 'Rol',
    operator: 'Operador',
    admin: 'Administrador',
    luis: 'Luis Herrera',
    carla: 'Carla Méndez',
    detail: 'Recogida Copart Miami Norte',
    detailSub: 'BK-20418 · 1:00 p. m.',
    lot: 'Número de lote',
    code: 'Código de recogida',
    towing: 'Recogida y traslado',
    miles: 'Millas adicionales (6)',
    total: 'Total',
    reassign: 'Reasignar',
    start: 'Iniciar recogida',
    close: 'Cerrar',
  },
  en: {
    today: 'Today',
    jobs: 'Jobs',
    date: 'Saturday, December 14 · 4 jobs, 1 unassigned',
    newBooking: 'New booking',
    export: 'Export schedule',
    list: "Today's jobs",
    j1: 'Exterior wash · Mazda CX-5',
    j1d: '9:00 AM · Brickell · Luis Herrera',
    j2: 'Full Detailing · Toyota Camry',
    j2d: '11:30 AM · Coral Gables · Carla Méndez',
    j3: 'Copart Miami North pickup',
    j3d: '1:00 PM · Lot 04217753 · Code 0093',
    j4: 'Home wash · Kia Sportage',
    j4d: '4:30 PM · Doral · Luis Herrera',
    role: 'Role',
    operator: 'Operator',
    admin: 'Admin',
    luis: 'Luis Herrera',
    carla: 'Carla Méndez',
    detail: 'Copart Miami North pickup',
    detailSub: 'BK-20418 · 1:00 PM',
    lot: 'Lot number',
    code: 'Pickup code',
    towing: 'Pickup and transport',
    miles: 'Extra miles (6)',
    total: 'Total',
    reassign: 'Reassign',
    start: 'Start pickup',
    close: 'Close',
  },
};

function ShellDemo({ role: startRole = 'admin', startCollapsed = false }: { role?: StaffRole; startCollapsed?: boolean }) {
  const t = useT(m);
  const locale = useLocale();
  const [role, setRole] = useState<StaffRole>(startRole);
  const [value, setValue] = useState('today');
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const [language, setLanguage] = useState<Locale>(locale);
  const [appearance, setAppearance] = useState<AppearanceMode>('system');
  const [detail, setDetail] = useState(false);
  const items = useSidebarItems({ jobs: 1 });
  const name = role === 'admin' ? t.carla : t.luis;

  return (
    <AppShell
      height="100vh"
      sidebar={
        <Sidebar
          items={items}
          role={role}
          value={value}
          onChange={setValue}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          footer={<UserMenu name={name} role={role} compact={collapsed} language={language} onLanguageChange={setLanguage} appearance={appearance} onAppearanceChange={setAppearance} onProfile={() => undefined} onLogout={() => undefined} />}
        />
      }
    >
      <PageHeader
        title={t.today}
        description={t.date}
        actions={
          <>
            <Button variant="secondary" size="md">
              {t.export}
            </Button>
            <Button size="md">{t.newBooking}</Button>
          </>
        }
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pb: 5 }}>
        <Typography variant="label" component="span" sx={{ color: bs.text.secondary }}>
          {t.role}
        </Typography>
        <SegmentedControl<StaffRole>
          label={t.role}
          size="sm"
          value={role}
          onChange={(r) => {
            setRole(r);
            setValue('today');
          }}
          options={[
            { value: 'operator', label: t.operator },
            { value: 'admin', label: t.admin },
          ]}
        />
      </Box>
      <Card density="compact" flush>
        <Box sx={{ px: 4 }}>
          <ListGroup label={t.list}>
            <ListRow density="compact" inset="none" leading={<InitialsAvatar name={t.luis} size="sm" />} title={t.j1} description={t.j1d} trailing={<StatusBadge dimension="booking" status="completed" size="sm" />} onClick={() => setDetail(true)} />
            <ListRow density="compact" inset="none" leading={<InitialsAvatar name={t.carla} size="sm" />} title={t.j2} description={t.j2d} trailing={<StatusBadge dimension="booking" status="in_progress" size="sm" />} onClick={() => setDetail(true)} />
            <ListRow density="compact" inset="none" leading={<InitialsAvatar size="sm" />} title={t.j3} description={t.j3d} trailing={<StatusBadge dimension="assignment" status="unassigned" size="sm" />} onClick={() => setDetail(true)} />
            <ListRow density="compact" inset="none" divider={false} leading={<InitialsAvatar name={t.luis} size="sm" />} title={t.j4} description={t.j4d} trailing={<StatusBadge dimension="booking" status="confirmed" size="sm" />} onClick={() => setDetail(true)} />
          </ListGroup>
        </Box>
      </Card>
      <SidePanel
        open={detail}
        onClose={() => setDetail(false)}
        title={t.detail}
        subtitle={t.detailSub}
        actions={
          <>
            <Button size="md" variant="secondary" onClick={() => setDetail(false)}>
              {t.reassign}
            </Button>
            <Button size="md" onClick={() => setDetail(false)}>
              {t.start}
            </Button>
          </>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <StatusBadge dimension="booking" status="confirmed" />
            <StatusBadge dimension="assignment" status="unassigned" long />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 4 }}>
            <IdentifierBlock label={t.lot} value="04217753" copyable variant="block" groupSize={4} />
            <IdentifierBlock label={t.code} value="0093" copyable variant="block" />
          </Box>
          <AmountBreakdown density="compact" lines={[{ label: t.towing, amount: 85 }, { label: t.miles, amount: 15 }]} total={100} totalLabel={t.total} />
        </Box>
      </SidePanel>
    </AppShell>
  );
}

const meta = {
  title: 'Componentes/Navegación de escritorio/Estructura de la aplicación',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Marco de las pantallas de **operador y administrador** en escritorio: barra lateral a la izquierda y área de contenido con desplazamiento propio. Las pantallas operativas (Hoy, Trabajos, Agenda…) se montan dentro.',
          anatomy: ['**Enlace “Saltar al contenido”** (visible con el foco)', '**Barra lateral** (expandida o compacta)', '**Área principal** `main` con márgenes 20 / 32 / 40 px y ancho máximo 1280 px', '**Encabezado de página** y contenido dentro'],
          props: ['`sidebar`: un `<Sidebar>`; `children`: `<PageHeader>` + contenido.', '`width`: `wide` (1280 px, por defecto) o `full` para tablas anchas.', '`height`: 100vh por defecto; fija un valor para vistas previas.', 'El estado (destino activo, compacta, rol) vive en la pantalla que monta el marco.'],
          states: ['Barra expandida o compacta (150 ms)', 'Contenido con desplazamiento independiente de la barra'],
          tokens: [['Lienzo', 'surface.canvas'], ['Barra lateral', 'surface.subtle · border.subtle'], ['Márgenes', 'layout.gutter.mobile / tablet / desktop'], ['Ancho máximo', 'layout.maxWidth.wide']],
          responsive: ['Diseñado para 900 px en adelante. Debajo, el operador usa la versión móvil (navegación inferior).', 'La barra se contrae para dar espacio a tablas anchas; el contenido no desborda horizontalmente.'],
          a11y: ['Enlace de salto al contenido como primer elemento enfocable.', 'Puntos de referencia: `aside` + `nav` con nombre, `main` único, `header` de página dentro.', 'Orden de foco: salto → barra lateral → contenido.', 'Cada acción protegida por rol también se valida en el servidor.'],
          content: [['Saltar al contenido', 'Skip to content'], ['Hoy · Sábado 14 de diciembre · 4 trabajos, 1 sin asignar', 'Today · Saturday, December 14 · 4 jobs, 1 unassigned']],
          example: '**Ejemplo de negocio**: la bandeja “Hoy” del operador con sus cuatro trabajos (Detailing, lavado, recogida Copart con lote 04217753), cambio de rol Operador / Administrador, barra compacta y el detalle de la recogida en un panel lateral. Úsalo con el viewport de escritorio.',
        }),
      },
    },
  },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { sidebar: null, children: null };

export const Interactive: Story = { name: 'Interactivo', args: base, argTypes: { sidebar: { control: false }, children: { control: false } }, render: () => <ShellDemo /> };
export const Operator: Story = { name: 'Operador (barra compacta)', args: base, render: () => <ShellDemo role="operator" startCollapsed /> };
