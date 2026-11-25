import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { Button } from '../../actions/Button/Button';
import { AmountBreakdown } from '../../data-display/AmountBreakdown/AmountBreakdown';
import { StatusBadge } from '../../data-display/StatusBadge/StatusBadge';
import { KeyValue, KeyValueList } from '../../layout/KeyValue/KeyValue';
import { ListGroup, ListRow } from '../../layout/ListRow/ListRow';
import { TopBar } from '../../navigation/TopBar/TopBar';
import { ResponsiveDetail } from './ResponsiveDetail';

const m = {
  es: {
    list: 'Trabajos de hoy',
    row1: 'Lavado exterior · Mazda CX-5',
    row1d: '9:00 a. m. · Brickell',
    row2: 'Detailing Completo · Toyota Camry',
    row2d: '11:30 a. m. · Coral Gables',
    row3: 'Recogida IAA Fort Lauderdale',
    row3d: '2:00 p. m. · Lote 04217753',
    title: 'Detailing Completo',
    subtitle: 'BK-20391 · 11:30 a. m.',
    back: 'Volver a Trabajos de hoy',
    client: 'Cliente',
    clientValue: 'Sofía Ramírez',
    vehicle: 'Vehículo',
    vehicleValue: 'Toyota Camry 2022 · blanco',
    place: 'Lugar',
    placeValue: '1450 Ponce de León Blvd, Coral Gables, FL 33134',
    package: 'Detailing Completo',
    wax: 'Cera de protección',
    total: 'Total',
    reassign: 'Reasignar',
    start: 'Iniciar trabajo',
    open: 'Abrir detalle',
  },
  en: {
    list: "Today's jobs",
    row1: 'Exterior wash · Mazda CX-5',
    row1d: '9:00 AM · Brickell',
    row2: 'Full Detailing · Toyota Camry',
    row2d: '11:30 AM · Coral Gables',
    row3: 'IAA Fort Lauderdale pickup',
    row3d: '2:00 PM · Lot 04217753',
    title: 'Full Detailing',
    subtitle: 'BK-20391 · 11:30 AM',
    back: "Back to today's jobs",
    client: 'Customer',
    clientValue: 'Sofía Ramírez',
    vehicle: 'Vehicle',
    vehicleValue: '2022 Toyota Camry · white',
    place: 'Location',
    placeValue: '1450 Ponce de León Blvd, Coral Gables, FL 33134',
    package: 'Full Detailing',
    wax: 'Protective wax',
    total: 'Total',
    reassign: 'Reassign',
    start: 'Start job',
    open: 'Open details',
  },
};

function Body() {
  const t = useT(m);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <StatusBadge dimension="booking" status="confirmed" />
        <StatusBadge dimension="assignment" status="assigned" />
        <StatusBadge dimension="payment" status="paid" />
      </Box>
      <KeyValueList>
        <KeyValue label={t.client} value={t.clientValue} layout="stacked" />
        <KeyValue label={t.vehicle} value={t.vehicleValue} layout="stacked" />
        <KeyValue label={t.place} value={t.placeValue} layout="stacked" />
      </KeyValueList>
      <AmountBreakdown density="compact" lines={[{ label: t.package, amount: 149 }, { label: t.wax, amount: 25 }]} total={174} totalLabel={t.total} />
    </Box>
  );
}

function Demo({ startOpen }: { startOpen: boolean }) {
  const t = useT(m);
  const [open, setOpen] = useState(startOpen);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <TopBar title={t.list} />
      <ListGroup label={t.list}>
        <ListRow title={t.row1} description={t.row1d} onClick={() => setOpen(true)} />
        <ListRow title={t.row2} description={t.row2d} onClick={() => setOpen(true)} />
        <ListRow title={t.row3} description={t.row3d} onClick={() => setOpen(true)} divider={false} />
      </ListGroup>
      <Box sx={{ p: `${layout.gutter.mobile}px`, color: bs.text.secondary }}>
        <Button variant="secondary" size="md" onClick={() => setOpen(true)}>
          {t.open}
        </Button>
      </Box>
      <ResponsiveDetail
        open={open}
        disablePortal
        onClose={() => setOpen(false)}
        title={t.title}
        subtitle={t.subtitle}
        backLabel={t.back}
        actions={
          <>
            <Button variant="secondary" size="md" onClick={() => setOpen(false)}>
              {t.reassign}
            </Button>
            <Button size="md" onClick={() => setOpen(false)}>
              {t.start}
            </Button>
          </>
        }
      >
        <Body />
      </ResponsiveDetail>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Capas y menús/Detalle adaptable',
  component: ResponsiveDetail,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'El **mismo detalle** se abre como **panel lateral** desde 900 px y como **página completa** con barra superior y botón volver en pantallas menores. El contenido se escribe una sola vez.',
          anatomy: ['**Panel lateral** (≥ 900 px): encabezado, cuerpo, pie fijo', '**Página completa** (< 900 px): barra superior con volver y título, cuerpo, barra de acción inferior', '**Cuerpo** y **acciones** compartidos'],
          props: ['`title` es texto plano: nombra el diálogo en ambos formatos.', '`backLabel` con destino ("Volver a Trabajos de hoy") en la página móvil.', 'El cambio de formato es solo por ancho (`min-width: 900px`); si el contenido cambia de tamaño con la ventana abierta, se vuelve a montar con el formato nuevo.'],
          states: ['Cerrado · abierto como panel · abierto como página', 'Acciones deshabilitadas o cargando según el contenido'],
          tokens: [['Panel', 'surface.raised · border.subtle'], ['Página', 'surface.canvas'], ['Margen de página', 'layout.gutter.mobile'], ['Breakpoint', 'breakpoints.md (900)']],
          responsive: ['Móvil: la página cubre la pantalla, respeta las áreas seguras superior e inferior y el pie queda fijo.', 'Escritorio: velo sobre la bandeja, la fila de origen sigue visible.'],
          a11y: ['Ambos formatos son diálogos modales con nombre = título, foco atrapado y retorno del foco a la fila.', 'Esc cierra el panel y la página; el botón volver tiene nombre con destino.', 'Orden de foco: encabezado → contenido → acciones.'],
          content: [['Volver a Trabajos de hoy', "Back to today's jobs"], ['Iniciar trabajo · Reasignar', 'Start job · Reassign']],
          example: '**Ejemplo de negocio**: detalle de un Detailing Completo en Coral Gables abierto desde la lista de trabajos de hoy. Cambia el viewport a móvil o escritorio para ver los dos formatos.',
        }),
      },
    },
  },
} satisfies Meta<typeof ResponsiveDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { open: false, onClose: () => undefined, title: '', children: null };

export const Mobile: Story = {
  name: 'Página en móvil',
  args: base,
  parameters: { device: { statusBar: 'auto' } },
  globals: { viewport: { value: 'mobile' } },
  render: () => <Demo startOpen />,
};
export const Desktop: Story = {
  name: 'Panel en escritorio',
  args: base,
  globals: { viewport: { value: 'desktop' } },
  render: () => <Demo startOpen />,
};
