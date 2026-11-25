import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { SectionHeader } from './SectionHeader';

const m = {
  es: { popular: 'Talleres populares', special: 'Especial para ti', specialDesc: 'Ofertas válidas esta semana', pickups: 'Recogidas pendientes en Copart', history: 'Historial de estados', open: 'Abrir bandeja' },
  en: { popular: 'Popular shops', special: 'Special for you', specialDesc: 'Deals valid this week', pickups: 'Pending pickups at Copart', history: 'Status history', open: 'Open inbox' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Box sx={{ width: 358 }}>
      <Showcase>
        <Specimen label="Ver todo" direction="column" align="stretch">
          <SectionHeader title={t.popular} actionHref="#talleres" />
        </Specimen>
        <Specimen label="description" direction="column" align="stretch">
          <SectionHeader title={t.special} description={t.specialDesc} onAction={() => undefined} />
        </Specimen>
        <Specimen label={`${l.longText} · ${l.operator}`} direction="column" align="stretch">
          <SectionHeader title={t.pickups} onAction={() => undefined} actionLabel={t.open} />
        </Specimen>
        <Specimen label="sin acción" direction="column" align="stretch">
          <SectionHeader title={t.history} headingLevel="h3" />
        </Specimen>
      </Showcase>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Estructura/Encabezado de sección',
  component: SectionHeader,
  args: { title: 'Talleres populares', actionHref: '#todo' },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Titula una sección y, si hay más contenido, ofrece “Ver todo”.',
          anatomy: ['**Título**', '**Descripción** (opcional)', '**Enlace “Ver todo”** (opcional)'],
          props: ['`actionHref` / `onAction` muestran el enlace; `actionLabel` cambia su texto.'],
          states: ['El enlace tiene hover, foco y presionado (Enlace `standalone`).'],
          tokens: [
            ['Título', 'text.primary · typeScale.h3'],
            ['Descripción', 'text.secondary · typeScale.body2'],
            ['Enlace', 'text.link · typeScale.body2 600'],
          ],
          responsive: ['Títulos largos hacen salto de línea; el enlace queda alineado abajo a la derecha y nunca se parte.'],
          a11y: ['El enlace se anuncia con contexto: “Ver todo: Talleres populares”.'],
          content: [
            ['Talleres populares · Ver todo', 'Popular shops · See all'],
            ['Recogidas pendientes en Copart · Abrir bandeja', 'Pending pickups at Copart · Open inbox'],
          ],
          example: 'En **Todas las variantes**, el operador abre la bandeja de recogidas pendientes de Towing.',
        }),
      },
    },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo', decorators: [(S) => <Box sx={{ width: 358 }}><S /></Box>] };
export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
