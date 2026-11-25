import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { StatusBadge } from '../../data-display/StatusBadge/StatusBadge';
import { KeyValue, KeyValueList } from './KeyValue';

const m = {
  es: {
    date: 'Fecha y hora',
    dateV: 'Sáb 14 dic · 10:00 a. m.',
    vehicle: 'Vehículo',
    vehicleV: 'SUV · Toyota RAV4 · FLX-4821',
    type: 'Tipo de servicio',
    typeV: 'Recogida a domicilio',
    auction: 'Subasta',
    auctionV: 'Copart Miami Norte',
    lot: 'Número de lote',
    pickup: 'Código de recogida',
    address: 'Dirección de entrega',
    addressV: '2150 NW 87th Ave, Bodega 4, Doral, FL 33172',
    payment: 'Pago',
  },
  en: {
    date: 'Date and time',
    dateV: 'Sat, Dec 14 · 10:00 AM',
    vehicle: 'Vehicle',
    vehicleV: 'SUV · Toyota RAV4 · FLX-4821',
    type: 'Service type',
    typeV: 'Home pickup',
    auction: 'Auction',
    auctionV: 'Copart Miami North',
    lot: 'Lot number',
    pickup: 'Pickup code',
    address: 'Delivery address',
    addressV: '2150 NW 87th Ave, Warehouse 4, Doral, FL 33172',
    payment: 'Payment',
  },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Box sx={{ width: 358 }}>
      <Showcase>
        <Specimen label={`inline · ${l.comfortable}`} direction="column" align="stretch">
          <KeyValueList>
            <KeyValue label={t.date} value={t.dateV} />
            <KeyValue label={t.vehicle} value={t.vehicleV} />
            <KeyValue label={t.type} value={t.typeV} />
          </KeyValueList>
        </Specimen>
        <Specimen label={`stacked · ${l.compact} · ${l.businessExample}`} direction="column" align="stretch">
          <KeyValueList gap={4}>
            <KeyValue layout="stacked" density="compact" label={t.auction} value={t.auctionV} />
            <KeyValue layout="stacked" density="compact" label={t.lot} value="04217753" tabular />
            <KeyValue layout="stacked" density="compact" label={t.pickup} value="0093" tabular />
            <KeyValue layout="stacked" density="compact" label={t.address} value={t.addressV} />
            <KeyValue layout="stacked" density="compact" label={t.payment} value={<StatusBadge dimension="payment" status="pending" size="sm" />} />
          </KeyValueList>
        </Specimen>
      </Showcase>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Estructura/Par etiqueta–valor',
  component: KeyValue,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Muestra un dato con su etiqueta: resúmenes de reserva, detalle de orden, recibos.',
          anatomy: ['**Etiqueta** (`<dt>`)', '**Valor** (`<dd>`): texto, número o un componente (insignia, precio)'],
          props: ['`layout`: `inline` (etiqueta izquierda, valor derecha) · `stacked` (etiqueta arriba; valores largos como direcciones).', '`emphasis` para totales; `tabular` para lotes, códigos, placas y horas.', 'Agrupa siempre en `<KeyValueList>` (`<dl>`).'],
          states: ['Solo presentación.'],
          tokens: [
            ['Etiqueta', 'text.secondary · typeScale.body1/body2 (inline) · caption (stacked)'],
            ['Valor', 'text.primary 500 · 750 con emphasis'],
          ],
          responsive: ['`inline` hace salto de línea en el valor (alineado a la derecha) cuando no cabe; para direcciones usa `stacked`.', '`compact` en paneles de escritorio.'],
          a11y: ['`<dl>/<dt>/<dd>` reales: los lectores asocian cada valor con su etiqueta.', 'Cada identificador tiene su propia etiqueta (lote ≠ código de recogida).'],
          content: [
            ['Fecha y hora · Sáb 14 dic · 10:00 a. m.', 'Date and time · Sat, Dec 14 · 10:00 AM'],
            ['Número de lote · Código de recogida', 'Lot number · Pickup code'],
          ],
          example: 'En **Todas las variantes**, el detalle de una recogida de Towing: subasta, lote 04217753, código 0093, dirección completa y pago pendiente.',
        }),
      },
    },
  },
} satisfies Meta<typeof KeyValue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', args: { label: '', value: '' }, render: () => <AllDemo /> };
