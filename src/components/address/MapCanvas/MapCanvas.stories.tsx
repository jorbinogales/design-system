import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import MyLocationRounded from '@mui/icons-material/MyLocationRounded';
import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { IconButton } from '../../actions/IconButton/IconButton';
import { MapCanvas, type MapPin, type MapPoint } from './MapCanvas';

const m = {
  es: {
    map: 'Mapa de ejemplo',
    grid: 'Solo calles',
    kinds: 'Tipos de pin con etiqueta',
    routeEta: 'Ruta con tiempo estimado',
    area: 'Zona de servicio y ubicación actual',
    seeds: 'Misma semilla = mismo mapa · semillas distintas',
    tracking: 'Mapa de seguimiento: la grúa viaja de IAA Miami North a la entrega en Doral',
    eta: 'Llega en 18 min',
    auction: 'IAA Miami North',
    dest: 'Entrega en Doral',
    unit: 'Grúa Black Seat · Luis H.',
    home: 'Casa',
    center: 'Centro de lavado Brickell',
    here: 'Tu ubicación',
    back: 'Volver',
    recenter: 'Centrar en mi ubicación',
    picked: 'Pin elegido',
    areaLabel: 'Mapa con zona de servicio de Personal Washing en Doral',
  },
  en: {
    map: 'Sample map',
    grid: 'Streets only',
    kinds: 'Pin kinds with label',
    routeEta: 'Route with ETA',
    area: 'Service area and current location',
    seeds: 'Same seed = same map · different seeds',
    tracking: 'Tracking map: the tow truck travels from IAA Miami North to the Doral delivery',
    eta: 'Arrives in 18 min',
    auction: 'IAA Miami North',
    dest: 'Delivery in Doral',
    unit: 'Black Seat tow truck · Luis H.',
    home: 'Home',
    center: 'Brickell wash center',
    here: 'Your location',
    back: 'Back',
    recenter: 'Center on my location',
    picked: 'Selected pin',
    areaLabel: 'Map with the Personal Washing service area in Doral',
  },
};

const route: MapPoint[] = [
  [16, 28],
  [32, 30],
  [44, 50],
  [62, 56],
  [82, 74],
];

function usePins() {
  const t = useT(m);
  const pins: MapPin[] = [
    { id: 'auction', kind: 'auction', x: 16, y: 28, label: t.auction },
    { id: 'unit', kind: 'unit', x: 44, y: 50, label: t.unit },
    { id: 'dest', kind: 'destination', x: 82, y: 74, label: t.dest },
  ];
  return pins;
}

function InteractiveDemo(props: { ratio?: number; pinLabels?: 'selected' | 'all' | 'none'; seed?: number; rounded?: boolean }) {
  const t = useT(m);
  const pins = usePins();
  const [selected, setSelected] = useState<string | null>('unit');
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <MapCanvas {...props} label={t.tracking} pins={pins} route={route} eta={{ label: t.eta }} userLocation={{ x: 26, y: 70 }} selectedPinId={selected} onPinSelect={setSelected} />
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const pins = usePins();
  const all: MapPin[] = [
    { id: 'a', kind: 'address', x: 18, y: 42, label: t.home },
    { id: 'b', kind: 'auction', x: 42, y: 62, label: t.auction },
    { id: 'c', kind: 'destination', x: 64, y: 40, label: t.dest },
    { id: 'd', kind: 'service', x: 84, y: 66, label: t.center },
    { id: 'e', kind: 'unit', x: 52, y: 26, label: t.unit },
  ];
  return (
    <Showcase maxWidth={420}>
      <Specimen label={t.grid} direction="column" align="stretch">
        <MapCanvas label={t.map} ratio={16 / 9} />
      </Specimen>
      <Specimen label={t.kinds} direction="column" align="stretch">
        <MapCanvas label={t.map} pins={all} pinLabels="all" ratio={1} seed={21} />
      </Specimen>
      <Specimen label={t.routeEta} direction="column" align="stretch">
        <MapCanvas label={t.tracking} pins={pins} route={route} eta={{ label: t.eta }} />
      </Specimen>
      <Specimen label={t.area} direction="column" align="stretch">
        <MapCanvas label={t.areaLabel} serviceArea={{ x: 48, y: 52, radius: 30 }} userLocation={{ x: 44, y: 56 }} pins={[{ id: 'h', kind: 'address', x: 58, y: 40, label: t.home }]} ratio={1} seed={3} />
      </Specimen>
      <Specimen label={t.seeds} direction="column" align="stretch">
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <MapCanvas label={t.map} seed={1} ratio={1} />
          <MapCanvas label={t.map} seed={1} ratio={1} />
          <MapCanvas label={t.map} seed={9} ratio={1} />
          <MapCanvas label={t.map} seed={42} ratio={1} />
        </Box>
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  const pins = usePins();
  const [selected, setSelected] = useState<string | null>('unit');
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <MapCanvas label={t.tracking} ratio={3 / 4} pins={pins} route={route} eta={{ label: t.eta, x: 62, y: 44 }} userLocation={{ x: 26, y: 72 }} selectedPinId={selected} onPinSelect={setSelected} seed={11}>
        <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
          <IconButton label={t.back} icon={<ArrowBackRounded />} variant="raised" />
        </Box>
        <Box sx={{ position: 'absolute', bottom: 12, right: 12 }}>
          <IconButton label={t.recenter} icon={<MyLocationRounded />} variant="raised" />
        </Box>
      </MapCanvas>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Direcciones/Mapa',
  component: MapCanvas,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Marcador de posición de mapa **dibujado en SVG, sin librería de mapas**: calles deterministas, pins, punto de ubicación actual, ruta, zona de servicio y chip de tiempo estimado. Las pantallas de Explorar, Ubicación del centro, Cómo llegar, Seguimiento en vivo y Agregar dirección lo usan hoy; después se cambia por un mapa real con las mismas propiedades.',
          anatomy: ['**Fondo** con retícula de calles (principales y secundarias), parques y nombres de calle', '**Zona de servicio** (mancha con borde discontinuo, opcional)', '**Ruta** con borde claro (opcional)', '**Punto de ubicación actual** con pulso (opcional)', '**Pins** por tipo: dirección, subasta, destino, centro de servicio, grúa', '**Chip de tiempo estimado** (opcional)', '**Controles superpuestos** como hijos: volver, centrar (opcional)'],
          props: [
            'Todas las posiciones son porcentajes 0–100 del ancho y el alto del mapa, así que no dependen del tamaño.',
            '`pins` `{ id, kind, x, y, label }`; `selectedPinId` + `onPinSelect` vuelven interactivos los pins. Un pin pulsado otra vez se deselecciona.',
            '`route` lista de puntos; `serviceArea` `{ x, y, radius }`; `eta` `{ label, x?, y? }` (por defecto en el punto medio de la ruta); `userLocation` `{ x, y }`.',
            '`seed` fija la retícula: la misma semilla dibuja siempre el mismo mapa. `ratio` es ancho ÷ alto (4:3 por defecto).',
            '`pinLabels`: `selected` (por defecto), `all` o `none`.',
            '`label` es obligatorio: describe el mapa para lectores de pantalla; en modo no interactivo se le añaden los nombres de los pins y el tiempo estimado.',
          ],
          states: ['Solo calles · con pins · pin seleccionado (naranja, más grande, con etiqueta) · con ruta y tiempo estimado · con zona de servicio · con ubicación actual · foco visible en pins interactivos.'],
          tokens: [
            ['Fondo / calles principales', 'surface.subtle · surface.raised con borde border.subtle'],
            ['Parques', 'status.success.bg · status.success.border'],
            ['Ruta', 'brand.primary con borde surface.canvas'],
            ['Zona de servicio', 'selection.bg · selection.border'],
            ['Ubicación actual', 'status.info.solid'],
            ['Pins', 'surface.inverse (esquema oscuro) · brand.primary seleccionado'],
            ['Chip', 'surface.raised · border.subtle · elevation.e2'],
          ],
          responsive: ['Ocupa el ancho de su contenedor y conserva la proporción (`aspect-ratio`); el dibujo escala sin deformarse.', 'Etiquetas de pins con ancho máximo de 148 px y salto de línea.', 'Modo oscuro: calles, parques y pins usan tokens, no colores fijos.'],
          a11y: [
            'Mapa no interactivo: `role="img"` con descripción (`label` + pins + tiempo estimado). Interactivo o con controles: `role="group"` y cada pin es un botón con su nombre y `aria-pressed`.',
            'El dibujo decorativo (calles, ruta, zona) va oculto a tecnologías de apoyo; la información se da por texto.',
            'El pulso respeta `prefers-reduced-motion` (interruptor global).',
            'La información no depende solo del color: cada tipo de pin tiene su icono y los textos van en etiquetas.',
          ],
          content: [
            ['IAA Miami North · Entrega en Doral · Llega en 18 min', 'IAA Miami North · Delivery in Doral · Arrives in 18 min'],
            ['Grúa Black Seat · Luis H. · Tu ubicación', 'Black Seat tow truck · Luis H. · Your location'],
          ],
          example: '**Ejemplo de negocio**: seguimiento de una recogida de Towing, de IAA Miami North a la entrega en Doral, con la grúa en ruta, tiempo estimado y controles superpuestos.',
        }),
      },
    },
  },
} satisfies Meta<typeof MapCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { label: '', ratio: 4 / 3, seed: 7, pinLabels: 'selected', rounded: true },
  argTypes: { ratio: { control: { type: 'range', min: 0.6, max: 2.2, step: 0.05 } }, seed: { control: { type: 'number' } } },
  render: (args) => <InteractiveDemo ratio={args.ratio} seed={args.seed} pinLabels={args.pinLabels} rounded={args.rounded} />,
};

export const Variants: Story = { name: 'Variantes', args: { label: '' }, render: () => <VariantsDemo /> };

export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: { label: '' }, render: () => <BusinessDemo /> };
