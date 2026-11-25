import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import BookmarkBorderRounded from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRounded from '@mui/icons-material/BookmarkRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { InverseSurface } from '../../../theme/SchemeScope';
import { IconButton, type IconButtonProps } from './IconButton';

const m = {
  es: {
    back: 'Volver',
    search: 'Buscar',
    filters: 'Filtros',
    more: 'Más opciones',
    notifications: 'Notificaciones',
    notifications3: 'Notificaciones, 3 sin leer',
    save: 'Guardar Pulido Cerámico Premium',
    saved: 'Guardado: Pulido Cerámico Premium',
  },
  en: {
    back: 'Back',
    search: 'Search',
    filters: 'Filters',
    more: 'More options',
    notifications: 'Notifications',
    notifications3: 'Notifications, 3 unread',
    save: 'Save Premium Ceramic Polish',
    saved: 'Saved: Premium Ceramic Polish',
  },
};

function PlaygroundDemo(args: IconButtonProps) {
  const t = useT(m);
  return <IconButton {...args} label={args.label || t.search} icon={<SearchRounded />} />;
}

function BookmarkToggle() {
  const t = useT(m);
  const [saved, setSaved] = useState(false);
  return (
    <IconButton
      variant="raised"
      pressed={saved}
      label={saved ? t.saved : t.save}
      icon={saved ? <BookmarkRounded sx={{ color: 'primary.main' }} /> : <BookmarkBorderRounded />}
      onClick={() => setSaved((s) => !s)}
    />
  );
}

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase>
      <Specimen label={l.variants}>
        <IconButton variant="plain" label={t.more} icon={<MoreHorizRounded />} />
        <IconButton variant="outlined" label={t.back} icon={<ArrowBackRounded />} />
        <IconButton variant="filled" label={t.filters} icon={<TuneRounded />} />
        <IconButton variant="raised" label={t.search} icon={<SearchRounded />} />
        <IconButton variant="accent" label={t.filters} icon={<TuneRounded />} />
      </Specimen>
      <Specimen label={l.sizes}>
        <IconButton variant="outlined" size="sm" label={t.search} icon={<SearchRounded />} />
        <IconButton variant="outlined" size="md" label={t.search} icon={<SearchRounded />} />
        <IconButton variant="outlined" size="lg" label={t.search} icon={<SearchRounded />} />
      </Specimen>
      <Specimen label={`${l.states} · badge · ${l.selected} · ${l.disabled}`}>
        <IconButton variant="outlined" badge label={t.notifications} icon={<NotificationsNoneRounded />} />
        <IconButton variant="outlined" badge={3} label={t.notifications3} icon={<NotificationsNoneRounded />} />
        <BookmarkToggle />
        <IconButton variant="outlined" disabled label={t.filters} icon={<TuneRounded />} />
        <IconButton variant="outlined" tooltip label={t.more} icon={<MoreHorizRounded />} />
      </Specimen>
      <Specimen label={l.onInverse}>
        <InverseSurface sx={{ display: 'flex', gap: 3, p: 4, borderRadius: 4 }}>
          <IconButton variant="filled" badge label={t.notifications} icon={<NotificationsNoneRounded />} />
          <IconButton variant="outlined" label={t.filters} icon={<TuneRounded />} />
        </InverseSurface>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Acciones/Botón de icono',
  component: IconButton,
  args: { label: '', icon: null, variant: 'outlined', size: 'md', disabled: false, tooltip: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['plain', 'outlined', 'filled', 'raised', 'accent'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    icon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Acción compacta representada solo por un icono: notificaciones, filtros, guardar, más opciones.',
          anatomy: ['**Contenedor** circular (según variante)', '**Icono** de 20–24 px', '**Insignia** de punto o número (opcional)', '**Tooltip** con el nombre (opcional, escritorio)'],
          props: ['`label` es obligatorio: es el nombre accesible.', '`pressed` convierte el botón en un conmutador (`aria-pressed`), como Guardar.', '`badge`: `true` muestra un punto; un número muestra el contador (máximo 99+).'],
          states: ['Reposo; hover con `action.hover` solo con puntero', 'Presionado: `action.pressed` y escala 0,96', 'Foco visible: anillo `focus.ring`', 'Seleccionado (`pressed`)', 'Deshabilitado: icono `disabled.fg`'],
          tokens: [
            ['Icono', 'text.primary'],
            ['Borde (outlined)', 'border.subtle'],
            ['Fondo (filled / raised)', 'surface.subtle · surface.raised + elevation.e2'],
            ['Accent (enviar, siguiente, filtros)', 'action.primary.bg · action.primary.fg · hover / pressed'],
            ['Insignia', 'brand.primary · action.primary.fg'],
            ['Tamaño', 'layout.controlHeight.sm · md · lg'],
            ['Foco', 'focus.ring'],
          ],
          responsive: ['Móvil: `md` (44 px) como mínimo para el área táctil.', 'Escritorio: `sm` permitido en barras densas, con `tooltip`.', 'Sobre fotos usa `raised` para separarlo de la imagen.'],
          a11y: [
            'Nombre accesible vía `aria-label` (prop `label`); si hay contador, inclúyelo en el texto: “Notificaciones, 3 sin leer”.',
            'Conmutadores anuncian su estado con `aria-pressed` y cambian también el icono (contorno → relleno), no solo el color.',
            'Tooltip con `describeChild`: no sustituye al nombre accesible.',
          ],
          content: [
            ['Notificaciones, 3 sin leer', 'Notifications, 3 unread'],
            ['Filtros', 'Filters'],
            ['Más opciones', 'More options'],
            ['Guardar Pulido Cerámico Premium', 'Save Premium Ceramic Polish'],
          ],
          example: 'La historia **Todas las variantes** incluye el conmutador Guardar de un paquete de Detailing y la campana con contador sobre el encabezado negro.',
        }),
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo', render: (args) => <PlaygroundDemo {...args} /> };
export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
