import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Breadcrumbs } from './Breadcrumbs';

const m = {
  es: {
    jobs: 'Trabajos',
    today: 'Hoy',
    order: 'Orden BK-20418',
    history: 'Historial de estados',
    staff: 'Personal',
    luis: 'Luis Herrera',
    reports: 'Reportes',
    towing: 'Towing',
    month: 'Diciembre 2025',
    detail: 'Recogidas por subasta',
    settings: 'Configuración',
    units: 'Unidades de negocio',
    washing: 'Personal Washing',
    hours: 'Horarios de atención',
  },
  en: {
    jobs: 'Jobs',
    today: 'Today',
    order: 'Order BK-20418',
    history: 'Status history',
    staff: 'Staff',
    luis: 'Luis Herrera',
    reports: 'Reports',
    towing: 'Towing',
    month: 'December 2025',
    detail: 'Auction pickups',
    settings: 'Settings',
    units: 'Business units',
    washing: 'Personal Washing',
    hours: 'Business hours',
  },
};

function InteractiveDemo({ maxItems }: { maxItems?: number }) {
  const t = useT(m);
  return (
    <Breadcrumbs
      maxItems={maxItems}
      items={[{ label: t.jobs, href: '#trabajos' }, { label: t.order, href: '#orden' }, { label: t.history }]}
    />
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={620}>
      <Specimen label={l.rest} direction="column" align="flex-start">
        <Breadcrumbs items={[{ label: t.jobs, href: '#trabajos' }, { label: t.order }]} />
      </Specimen>
      <Specimen label={`${l.longText}: contraídas con “…”`} direction="column" align="flex-start">
        <Breadcrumbs
          items={[{ label: t.reports, href: '#' }, { label: t.towing, href: '#' }, { label: t.month, href: '#' }, { label: t.detail, href: '#' }, { label: t.order }]}
        />
      </Specimen>
      <Specimen label="onClick (sin href)" direction="column" align="flex-start">
        <Breadcrumbs items={[{ label: t.settings, onClick: () => undefined }, { label: t.units, onClick: () => undefined }, { label: t.washing, onClick: () => undefined }, { label: t.hours }]} />
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  return (
    <Box sx={{ maxWidth: 520 }}>
      <Breadcrumbs items={[{ label: t.staff, href: '#personal' }, { label: t.luis, href: '#luis' }, { label: t.today }]} />
    </Box>
  );
}

const meta = {
  title: 'Componentes/Navegación de escritorio/Migas de pan',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Muestra **la ruta hasta la página actual** y permite volver a un nivel anterior: Trabajos › Orden BK-20418 › Historial de estados.',
          anatomy: ['**Niveles anteriores**: enlaces o botones', '**Separador** (chevron decorativo)', '**Página actual**: texto en negrita, sin enlace', '**“…”** para contraer niveles intermedios'],
          props: ['`items`: del primer nivel a la página actual; el último nunca es enlace.', '`maxItems` (por defecto 4): por encima se contrae la parte media, dejando el primero y los dos últimos; “…” despliega la ruta.', 'Cada nivel usa `href` (enlace) o `onClick` (botón).'],
          states: ['Nivel: reposo · hover (subrayado, puntero) · foco visible · presionado', 'Página actual: estática'],
          tokens: [['Texto de niveles', 'text.secondary'], ['Página actual', 'text.primary'], ['Foco', 'focus.ring'], ['Tipografía', 'typeScale.body2']],
          responsive: ['Solo escritorio; en móvil se usa el botón volver de la **Barra superior**.', 'Las migas largas hacen salto de línea o se contraen con “…”.'],
          a11y: ['`nav` con nombre “Migas de pan” y lista ordenada.', 'La página actual lleva `aria-current="page"`.', 'El botón “…” tiene nombre (“Mostrar ruta completa”).', 'Los separadores son decorativos (`aria-hidden`).'],
          content: [['Trabajos › Orden BK-20418', 'Jobs › Order BK-20418'], ['Personal › Luis Herrera › Hoy', 'Staff › Luis Herrera › Today']],
          example: '**Ejemplo de negocio**: ruta del personal: Personal › Luis Herrera › Hoy, y la ruta profunda de reportes de recogidas por subasta.',
        }),
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { items: [], maxItems: 4 },
  argTypes: { items: { control: false } },
  render: (args) => <InteractiveDemo maxItems={args.maxItems} />,
};
export const Variants: Story = { name: 'Variantes', args: { items: [] }, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: { items: [] }, render: () => <BusinessDemo /> };
