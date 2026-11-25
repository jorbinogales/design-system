import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { TabPanel, Tabs } from './Tabs';

const m = {
  es: {
    bookingsLabel: 'Estado de mis reservas',
    active: 'Activas',
    completed: 'Completadas',
    cancelled: 'Canceladas',
    activeBody: 'Detailing Completo · sábado 14 de diciembre, 10:00 a. m.',
    completedBody: 'Lavado exterior · 2 de diciembre · $49.00',
    cancelledBody: 'Recogida Copart Miami Norte · cancelada el 28 de noviembre',
    detailLabel: 'Detalle del servicio',
    about: 'Acerca de',
    services: 'Servicios',
    gallery: 'Galería',
    reviews: 'Reseñas',
    pickup: 'Datos de recogida',
    history: 'Historial de estados',
  },
  en: {
    bookingsLabel: 'My bookings by status',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
    activeBody: 'Full Detailing · Saturday, December 14, 10:00 AM',
    completedBody: 'Exterior wash · December 2 · $49.00',
    cancelledBody: 'Copart Miami North pickup · cancelled on November 28',
    detailLabel: 'Service details',
    about: 'About',
    services: 'Services',
    gallery: 'Gallery',
    reviews: 'Reviews',
    pickup: 'Pickup details',
    history: 'Status history',
  },
};

function BookingsDemo() {
  const t = useT(m);
  const [tab, setTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const body = { active: t.activeBody, completed: t.completedBody, cancelled: t.cancelledBody };
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <Tabs
        idPrefix="bookings"
        label={t.bookingsLabel}
        value={tab}
        onChange={setTab}
        items={[
          { value: 'active', label: t.active, count: 2 },
          { value: 'completed', label: t.completed },
          { value: 'cancelled', label: t.cancelled },
        ]}
      />
      {(['active', 'completed', 'cancelled'] as const).map((v) => (
        <TabPanel key={v} idPrefix="bookings" value={v} current={tab}>
          <Typography variant="body1" sx={{ py: 5, color: bs.text.secondary }}>
            {body[v]}
          </Typography>
        </TabPanel>
      ))}
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [a, setA] = useState('about');
  const [b, setB] = useState('pickup');
  return (
    <Showcase maxWidth={420}>
      <Specimen label="scrollable" direction="column" align="stretch">
        <Tabs
          idPrefix="detail"
          label={t.detailLabel}
          variant="scrollable"
          value={a}
          onChange={setA}
          items={[
            { value: 'about', label: t.about },
            { value: 'services', label: t.services, count: 12 },
            { value: 'gallery', label: t.gallery },
            { value: 'reviews', label: t.reviews, count: 365 },
          ]}
        />
      </Specimen>
      <Specimen label={`${l.disabled} · ${l.longText}`} direction="column" align="stretch">
        <Tabs
          idPrefix="order"
          label={t.detailLabel}
          value={b}
          onChange={setB}
          items={[
            { value: 'pickup', label: t.pickup },
            { value: 'history', label: t.history },
            { value: 'gallery', label: t.gallery, disabled: true },
          ]}
        />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Navegación móvil/Pestañas',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Alterna entre vistas hermanas del mismo contenido (Activas / Completadas / Canceladas) sin salir de la pantalla.',
          anatomy: ['**Lista de pestañas** con borde inferior', '**Pestaña**: etiqueta, icono (opcional), **contador** (opcional)', '**Indicador** naranja de 3 px', '**Panel** asociado (`TabPanel`)'],
          props: ['`items`, `value`, `onChange`, `label` (nombre de la lista) e `idPrefix` (compartido con `TabPanel`).', '`variant`: `fullWidth` para 2–4 pestañas en móvil; `scrollable` para 5+ o etiquetas largas.'],
          states: ['Reposo: `text.secondary`.', 'Hover (puntero): `text.primary`.', 'Seleccionada: `text.primary` 700 + indicador naranja.', 'Foco visible: anillo interior.', 'Deshabilitada: `text.disabled`.'],
          tokens: [
            ['Etiqueta', 'text.secondary → text.primary'],
            ['Indicador', 'brand.primary, 3 px, radio superior 3 px'],
            ['Borde de la lista', 'border.subtle'],
            ['Contador', 'Contador (tono brand cuando la pestaña está activa)'],
            ['Altura', '48 px'],
          ],
          responsive: ['Móvil: `fullWidth` reparte el ancho. Con textos largos en inglés o español usa `scrollable`.', 'Escritorio: `standard` alinea las pestañas a la izquierda.'],
          a11y: ['Patrón WAI-ARIA Tabs: `role="tablist"` con nombre, `aria-controls` y `aria-labelledby` entre pestaña y panel.', 'Flechas izquierda/derecha mueven el foco entre pestañas; Tab entra al panel.', 'La selección se marca con peso e indicador, no solo con color.'],
          content: [
            ['Activas · Completadas · Canceladas', 'Active · Completed · Cancelled'],
            ['Acerca de · Servicios · Galería · Reseñas', 'About · Services · Gallery · Reviews'],
            ['Datos de recogida · Historial de estados', 'Pickup details · Status history'],
          ],
          example: '**Mis reservas** muestra las tres pestañas del cliente con 2 reservas activas de Detailing.',
        }),
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MyBookings: Story = {
  name: 'Mis reservas',
  args: { items: [], value: '', onChange: () => undefined, label: '', idPrefix: 'x' },
  render: () => <BookingsDemo />,
};
export const Variants: Story = {
  name: 'Variantes',
  args: { items: [], value: '', onChange: () => undefined, label: '', idPrefix: 'x' },
  render: () => <VariantsDemo />,
};
