import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Card } from '../../layout/Card/Card';
import { MapCanvas } from '../MapCanvas/MapCanvas';
import { RouteSummary, type RouteStop } from './RouteSummary';

const m = {
  es: {
    yard: 'IAA Miami North',
    yardRef: 'Entrar por la puerta 3 y pedir el lote en la oficina de salidas.',
    delivery: 'Casa de Valeria',
    deliveryRef: 'Portón negro, junto a la farmacia.',
    detailing: 'Taller de Detailing Doral',
    trip: '18.4 mi · 32 min',
    longName: 'Bodega de importación y exportación de vehículos usados Miami Sur',
    longRef: 'Muelle trasero, portón azul. Llamar a Marcos al llegar; si no contesta, preguntar en la caseta de seguridad.',
    mapLabel: 'Recorrido de IAA Miami North a Doral',
    withEdit: 'Con Cambiar (resumen de reserva)',
    long: 'Nombres y referencias largas',
    plain: 'Sin subasta: dirección a dirección',
    shop: 'Taller',
    deliver: 'Entrega',
  },
  en: {
    yard: 'IAA Miami North',
    yardRef: 'Enter through gate 3 and ask for the lot at the release office.',
    delivery: "Valeria's home",
    deliveryRef: 'Black gate next to the pharmacy.',
    detailing: 'Doral Detailing shop',
    trip: '18.4 mi · 32 min',
    longName: 'Used-vehicle import and export warehouse, South Miami',
    longRef: 'Rear dock, blue gate. Call Marcos on arrival; if no answer, ask security at the booth.',
    mapLabel: 'Route from IAA Miami North to Doral',
    withEdit: 'With Change (booking summary)',
    long: 'Long names and landmarks',
    plain: 'No auction: address to address',
    shop: 'Shop',
    deliver: 'Delivery',
  },
};

function useStops() {
  const t = useT(m);
  const origin: RouteStop = {
    kind: 'auction',
    name: t.yard,
    address: { line1: '4500 NW 135th St', city: 'Opa-locka', state: 'FL', zip: '33054', reference: t.yardRef },
    auction: { lot: '04217753', code: '0093' },
  };
  const destination: RouteStop = {
    kind: 'address',
    name: t.delivery,
    address: { line1: '2150 NW 87th Ave', line2: 'Apt 4B', city: 'Doral', state: 'FL', zip: '33172', reference: t.deliveryRef },
  };
  return { t, origin, destination };
}

function InteractiveDemo({ trip }: { trip?: string }) {
  const { origin, destination } = useStops();
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <RouteSummary origin={origin} destination={destination} trip={trip} />
    </Box>
  );
}

function VariantsDemo() {
  const { t, origin, destination } = useStops();
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={420}>
      <Specimen label={t.withEdit} direction="column" align="stretch">
        <RouteSummary origin={origin} destination={destination} trip={t.trip} onEditOrigin={() => undefined} onEditDestination={() => undefined} />
      </Specimen>
      <Specimen label={t.plain} direction="column" align="stretch">
        <RouteSummary
          origin={{ kind: 'address', name: t.detailing, address: { line1: '8250 NW 25th St', city: 'Doral', state: 'FL', zip: '33122' } }}
          destination={destination}
          originLabel={t.shop}
          destinationLabel={t.deliver}
        />
      </Specimen>
      <Specimen label={`${t.long} · ${l.longText}`} direction="column" align="stretch">
        <RouteSummary
          origin={{ ...origin, address: { ...origin.address, line2: 'Gate 3, Row 14', reference: t.yardRef } }}
          destination={{ kind: 'address', name: t.longName, address: { line1: '10400 NW 25th Street', line2: 'Building C, Suite 300-B', city: 'Doral', state: 'FL', zip: '33172', reference: t.longRef } }}
          trip={t.trip}
        />
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const { t, origin, destination } = useStops();
  return (
    <Box sx={{ width: 390, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <MapCanvas
        label={t.mapLabel}
        ratio={2}
        seed={5}
        pins={[
          { id: 'o', kind: 'auction', x: 18, y: 38, label: t.yard },
          { id: 'd', kind: 'destination', x: 82, y: 78, label: t.delivery },
        ]}
        route={[
          [18, 38],
          [40, 36],
          [58, 60],
          [82, 78],
        ]}
        eta={{ label: t.trip }}
      />
      <Card>
        <RouteSummary origin={origin} destination={destination} trip={t.trip} onEditDestination={() => undefined} />
      </Card>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Direcciones/Resumen de recogida y destino',
  component: RouteSummary,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Resume el recorrido **origen → destino** con un conector de ruta. En Towing, el origen es el patio de una subasta (nombre, **lote** y **código de recogida**) y el destino la dirección de entrega.',
          anatomy: ['**Lista ordenada** de dos paradas', '**Nodo** y **conector discontinuo** (origen con aro, destino relleno con bandera)', '**Rol** de la parada (Recogida / Entrega) y acción **Cambiar** (opcional)', '**Nombre** y **dirección completa** con referencia (opcional)', '**Bloque de subasta**: Número de lote y Código de recogida, cada uno con su etiqueta y acción de copiar (solo si hay subasta)', '**Trayecto**: distancia y tiempo (opcional)'],
          props: [
            '`origin` y `destination`: `{ kind: "auction" | "address", name, address, auction?: { lot, code } }`. Lote y código son **texto** y conservan sus ceros iniciales (04217753, 0093).',
            '`onEditOrigin` / `onEditDestination` muestran “Cambiar” (resumen de reserva antes de confirmar).',
            '`originLabel` / `destinationLabel` cambian los rótulos para otros servicios (Taller, Entrega).',
          ],
          states: ['Con subasta · sin subasta · con trayecto · con acciones de cambio · foco visible en enlaces y botones de copiar · copiado (lo gestiona el bloque de identificador).'],
          tokens: [
            ['Nodo origen', 'border.strong · surface.canvas'],
            ['Nodo destino', 'surface.inverse (esquema oscuro)'],
            ['Conector', 'border.strong (discontinuo)'],
            ['Bloque de subasta', 'surface.subtle · radius.md'],
            ['Dirección', 'text.secondary · typeScale.body2'],
          ],
          responsive: ['Una sola columna en cualquier ancho; nodos de 28 px y conector que crece con el contenido.', 'Nombres, direcciones y referencias largas hacen salto de línea (`overflow-wrap: anywhere`): el personal lee todo.', 'Lote y código se colocan lado a lado si caben (≥ 200 px cada uno) y se apilan en 390 px.'],
          a11y: [
            '`<ol>` con nombre (“Recorrido del servicio”): el lector anuncia “lista de 2 elementos”.',
            'Los nodos y el conector son decorativos (`aria-hidden`); el rol de cada parada está en texto (Recogida, Entrega).',
            '“Cambiar” incluye la parada en su nombre accesible (“Cambiar entrega”).',
            'El trayecto se anuncia con prefijo oculto “Trayecto:”.',
          ],
          content: [
            ['Recogida · Entrega · Cambiar · Número de lote · Código de recogida', 'Pickup · Delivery · Change · Lot number · Pickup code'],
            ['18.4 mi · 32 min', '18.4 mi · 32 min'],
          ],
          example: '**Ejemplo de negocio**: recogida de Towing en IAA Miami North (lote 04217753, código 0093) hacia una casa en Doral, junto al mapa con la ruta y el tiempo estimado.',
        }),
      },
    },
  },
} satisfies Meta<typeof RouteSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

const stop: RouteStop = { kind: 'address', name: '', address: { line1: '', city: '', state: '', zip: '' } };
const base = { origin: stop, destination: stop };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, trip: '18.4 mi · 32 min' },
  render: (args) => <InteractiveDemo trip={args.trip} />,
};

export const Variants: Story = { name: 'Variantes y texto largo', args: base, render: () => <VariantsDemo /> };

export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: base, render: () => <BusinessDemo /> };
