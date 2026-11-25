import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import LocationOnRounded from '@mui/icons-material/LocationOnRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { IconButton } from '../../actions/IconButton/IconButton';
import { SearchField } from '../../fields/SearchField/SearchField';
import { TopBar } from './TopBar';

const m = {
  es: {
    myBookings: 'Mis reservas',
    review: 'Resumen de la reserva',
    reference: 'Reserva BS-240117',
    search: 'Buscar',
    more: 'Más opciones',
    location: 'Ubicación',
    city: 'Miami, FL',
    changeLocation: 'Cambiar ubicación: Miami, FL',
    notifications: 'Notificaciones, 2 sin leer',
    searchPlaceholder: 'Buscar servicios o talleres',
    filters: 'Filtros',
    home: 'Hola, Mariana',
    longTitle: 'Recogida en Insurance Auto Auctions Fort Lauderdale',
  },
  en: {
    myBookings: 'My bookings',
    review: 'Booking summary',
    reference: 'Booking BS-240117',
    search: 'Search',
    more: 'More options',
    location: 'Location',
    city: 'Miami, FL',
    changeLocation: 'Change location: Miami, FL',
    notifications: 'Notifications, 2 unread',
    searchPlaceholder: 'Search services or shops',
    filters: 'Filters',
    home: 'Hi, Mariana',
    longTitle: 'Pickup at Insurance Auto Auctions Fort Lauderdale',
  },
};

const Phone = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ width: 390, maxWidth: '100%', border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, overflow: 'hidden' }}>{children}</Box>
);

function LocationLeading() {
  const t = useT(m);
  return (
    <ButtonBase aria-label={t.changeLocation} sx={{ flexDirection: 'column', alignItems: 'flex-start', borderRadius: `${radius.sm}px`, textAlign: 'left', '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}` } }}>
      <Typography variant="caption" sx={{ color: bs.text.secondary }}>
        {t.location}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationOnRounded sx={{ color: bs.brand.primary, fontSize: 20 }} />
        <Typography variant="h4">{t.city}</Typography>
        <ExpandMoreRounded sx={{ fontSize: 20, color: bs.text.secondary }} />
      </Box>
    </ButtonBase>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={392}>
      <Specimen label="center · back · action" direction="column" align="stretch">
        <Phone>
          <TopBar safeArea={false} title={t.myBookings} onBack={() => undefined} actions={<IconButton variant="outlined" label={t.search} icon={<SearchRounded />} />} />
        </Phone>
      </Specimen>
      <Specimen label="subtitle" direction="column" align="stretch">
        <Phone>
          <TopBar safeArea={false} title={t.review} subtitle={t.reference} onBack={() => undefined} actions={<IconButton variant="outlined" label={t.more} icon={<MoreHorizRounded />} />} />
        </Phone>
      </Specimen>
      <Specimen label="start" direction="column" align="stretch">
        <Phone>
          <TopBar safeArea={false} title={t.myBookings} actions={<IconButton variant="outlined" label={t.search} icon={<SearchRounded />} />} />
        </Phone>
      </Specimen>
      <Specimen label={l.longText} direction="column" align="stretch">
        <Phone>
          <TopBar safeArea={false} title={t.longTitle} onBack={() => undefined} />
        </Phone>
      </Specimen>
      <Specimen label={l.onInverse} direction="column" align="stretch">
        <Phone>
          <TopBar safeArea={false} tone="inverse" title={t.home} actions={<IconButton variant="filled" badge label={t.notifications} icon={<NotificationsNoneRounded />} />} />
        </Phone>
      </Specimen>
    </Showcase>
  );
}

function HomeHeaderDemo() {
  const t = useT(m);
  const [query, setQuery] = useState('');
  return (
    <TopBar
      tone="inverse"
      leading={<LocationLeading />}
      actions={<IconButton variant="filled" badge={2} label={t.notifications} icon={<NotificationsNoneRounded />} />}
    >
      <SearchField label={t.search} hideLabel placeholder={t.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} onFilterClick={() => undefined} filterLabel={t.filters} />
    </TopBar>
  );
}

const meta = {
  title: 'Componentes/Navegación móvil/Barra superior',
  component: TopBar,
  args: { title: 'Mis reservas', tone: 'default', safeArea: false },
  argTypes: { tone: { control: 'inline-radio', options: ['default', 'inverse'] }, align: { control: 'inline-radio', options: ['center', 'start'] } },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Identifica la pantalla y ofrece volver y acciones de contexto. La variante inversa es el encabezado negro del Inicio del cliente.',
          anatomy: ['**Botón volver** (opcional)', '**Título** y **subtítulo** (opcional), o un bloque `leading` propio', '**Acciones**: 1–3 Botones de icono (opcional)', '**Contenido inferior**, p. ej. la búsqueda (opcional)', '**Relleno superior** del área segura'],
          props: [
            '`tone="inverse"` aplica `surface.inverse` (#111111 en claro, #000000 en oscuro) con tokens oscuros para su contenido; esquinas inferiores de 24 px cuando hay contenido inferior.',
            'El contenido inferior en la variante inversa usa el esquema de la página: en modo claro la búsqueda queda clara sobre el negro.',
            '`align` por defecto: `center` si hay botón volver, `start` si no. `headingLevel` controla el elemento del título.',
          ],
          states: ['Sin estados propios. `sticky` lo fija arriba al hacer scroll.'],
          tokens: [
            ['Fondo', 'surface.canvas · surface.inverse'],
            ['Título', 'text.primary · typeScale.h3 (center) · h2 (start)'],
            ['Subtítulo', 'text.secondary · typeScale.body2'],
            ['Altura de fila', 'layout.topBarHeight (56 px)'],
            ['Relleno lateral', 'layout.gutter.mobile (20 px) · tablet (32 px)'],
            ['Área segura', 'layout.safeAreaTop'],
            ['Radio inferior (inversa)', 'radius.xl'],
          ],
          responsive: ['Títulos largos se recortan con puntos suspensivos en una línea; el texto completo sigue disponible para lectores de pantalla.', 'Desde 600 px el relleno lateral pasa a 32 px. En escritorio el operador usa el encabezado de página (Fase 2).'],
          a11y: ['Elemento `<header>`; el título es el `h1` de la pantalla (cámbialo con `headingLevel` si ya hay otro).', 'Orden de foco: volver → bloque izquierdo → acciones → contenido inferior.', 'En la variante inversa todos los textos usan tokens oscuros (blanco 18,9:1, secundario 10,4:1 sobre #111111).'],
          content: [
            ['Mis reservas', 'My bookings'],
            ['Resumen de la reserva · Reserva BS-240117', 'Booking summary · Booking BS-240117'],
            ['Recogida en Insurance Auto Auctions Fort Lauderdale', 'Pickup at Insurance Auto Auctions Fort Lauderdale'],
          ],
          example: '**Encabezado del Inicio** recrea el encabezado negro del cliente: ubicación, campana con 2 avisos y búsqueda con filtros, dentro del marco del teléfono.',
        }),
      },
    },
  },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo', render: (args) => <Phone><TopBar {...args} onBack={() => undefined} /></Phone> };
export const Variants: Story = { name: 'Variantes', render: () => <VariantsDemo /> };
export const HomeHeader: Story = {
  name: 'Encabezado del Inicio (inverso)',
  render: () => <HomeHeaderDemo />,
  parameters: { layout: 'fullscreen', device: { statusBar: 'light' } },
};
