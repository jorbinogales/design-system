import CalendarViewDayRounded from '@mui/icons-material/CalendarViewDayRounded';
import CalendarViewWeekRounded from '@mui/icons-material/CalendarViewWeekRounded';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { SegmentedControl } from './SegmentedControl';

const m = {
  es: {
    serviceType: 'Tipo de servicio',
    pickup: 'Recogida',
    atShop: 'En el taller',
    view: 'Vista de la agenda',
    day: 'Día',
    week: 'Semana',
    vehicle: 'Tamaño del vehículo',
    sedan: 'Sedán',
    suv: 'SUV',
    pickupTruck: 'Pickup',
  },
  en: {
    serviceType: 'Service type',
    pickup: 'Pickup',
    atShop: 'At the shop',
    view: 'Schedule view',
    day: 'Day',
    week: 'Week',
    vehicle: 'Vehicle size',
    sedan: 'Sedan',
    suv: 'SUV',
    pickupTruck: 'Pickup truck',
  },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [type, setType] = useState<'pickup' | 'shop'>('pickup');
  const [view, setView] = useState<'day' | 'week'>('day');
  const [size, setSize] = useState<'sedan' | 'suv' | 'truck'>('suv');
  return (
    <Showcase maxWidth={390}>
      <Specimen label={`${l.fullWidth} · ${l.businessExample}`} direction="column" align="stretch">
        <SegmentedControl fullWidth size="lg" label={t.serviceType} value={type} onChange={setType} options={[{ value: 'pickup', label: t.pickup }, { value: 'shop', label: t.atShop }]} />
      </Specimen>
      <Specimen label={`${l.withIcon} · ${l.operator}`}>
        <SegmentedControl
          size="sm"
          label={t.view}
          value={view}
          onChange={setView}
          options={[
            { value: 'day', label: t.day, icon: <CalendarViewDayRounded /> },
            { value: 'week', label: t.week, icon: <CalendarViewWeekRounded /> },
          ]}
        />
      </Specimen>
      <Specimen label={`3 · ${l.disabled}`} direction="column" align="stretch">
        <SegmentedControl
          fullWidth
          label={t.vehicle}
          value={size}
          onChange={setSize}
          options={[
            { value: 'sedan', label: t.sedan },
            { value: 'suv', label: t.suv },
            { value: 'truck', label: t.pickupTruck, disabled: true },
          ]}
        />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Navegación móvil/Selector segmentado',
  component: SegmentedControl,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Cambia entre 2–4 modos excluyentes de la misma vista: tipo de servicio, vista Día/Semana de la agenda.',
          anatomy: ['**Riel** gris en píldora', '**Segmentos**: etiqueta y icono (opcional)', '**Segmento activo** elevado'],
          props: ['Siempre hay un valor; pulsar el activo no lo deselecciona.', '`fullWidth` reparte el ancho; `size` `sm` · `md` · `lg`.', 'Para elegir un servicio o paquete usa Radio o Chip de filtro; esto es para modos de vista.'],
          states: ['Reposo: `text.secondary`.', 'Hover (puntero): `text.primary`.', 'Seleccionado: superficie elevada + sombra (claro) / gris claro (oscuro), texto 700.', 'Foco visible: anillo `focus.ring`.', 'Deshabilitado: `disabled.fg`.'],
          tokens: [
            ['Riel', 'surface.muted'],
            ['Segmento activo', 'surface.raised + elevation.e1 · oscuro: action.secondary.pressed'],
            ['Texto', 'text.secondary → text.primary'],
            ['Radio', 'radius.pill'],
          ],
          responsive: ['Móvil: `fullWidth`. Escritorio: ancho natural en barras de filtros.', 'Más de 3 segmentos con textos largos no caben a 320 px: usa Pestañas.'],
          a11y: ['Grupo con nombre (`label`); cada segmento es un botón con `aria-pressed`.', 'Tab entra al grupo y recorre los segmentos; Enter/Espacio selecciona.', 'El activo se distingue por superficie y peso, no solo por color.'],
          content: [
            ['Recogida · En el taller', 'Pickup · At the shop'],
            ['Día · Semana', 'Day · Week'],
            ['Sedán · SUV · Pickup', 'Sedan · SUV · Pickup truck'],
          ],
          example: 'En **Todas las variantes**, el cliente elige recogida a domicilio para un servicio de Detailing y el operador alterna la vista de su agenda.',
        }),
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  name: 'Todas las variantes',
  args: { options: [], value: '', onChange: () => undefined, label: '' },
  render: () => <AllDemo />,
};
