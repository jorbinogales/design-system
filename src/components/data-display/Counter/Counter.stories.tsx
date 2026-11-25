import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Counter } from './Counter';

const m = {
  es: { unassigned: 'Sin asignar', unassignedLabel: '3 trabajos sin asignar', pickups: 'Recogidas de hoy', pickupsLabel: '12 recogidas hoy' },
  en: { unassigned: 'Unassigned', unassignedLabel: '3 unassigned jobs', pickups: "Today's pickups", pickupsLabel: '12 pickups today' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase>
      <Specimen label={l.variants}>
        <Counter value={3} tone="brand" />
        <Counter value={3} tone="neutral" />
        <Counter value={3} tone="inverse" />
        <Counter value={128} tone="brand" />
        <Counter value={7} size="sm" tone="neutral" />
      </Specimen>
      <Specimen label="Badge">
        <Counter value={12} tone="brand" label={t.pickupsLabel}>
          <LocalShippingOutlined />
        </Counter>
      </Specimen>
      <Specimen label={l.businessExample}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="label">{t.unassigned}</Typography>
          <Counter value={3} tone="brand" label={t.unassignedLabel} />
        </Box>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Presentación de datos/Contador',
  component: Counter,
  args: { value: 3, tone: 'brand', size: 'md', max: 99 },
  argTypes: { tone: { control: 'inline-radio', options: ['brand', 'neutral', 'inverse'] }, size: { control: 'inline-radio', options: ['sm', 'md'] } },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Indica cuántos elementos hay: trabajos sin asignar, reservas activas, filtros aplicados o mensajes sin leer.',
          anatomy: ['**Píldora** con cifra tabular', '**Elemento ancla** (opcional, modo insignia)'],
          props: ['`max` recorta a “99+”. `tone`: `brand` (requiere atención), `neutral` (informativo), `inverse`.', 'Con `children` se ancla a la esquina superior derecha; con `hideZero` desaparece en 0.'],
          states: ['Solo presentación.'],
          tokens: [
            ['Brand', 'brand.primary · action.primary.fg'],
            ['Neutral', 'surface.muted · text.primary'],
            ['Inverso', 'text.primary (fondo) · surface.canvas (texto)'],
            ['Tipografía', 'typeScale.caption 700, cifras tabulares'],
          ],
          responsive: ['Igual en todos los tamaños. Las cifras grandes crecen en ancho, no en alto.'],
          a11y: ['Pasa `label` con contexto (“3 trabajos sin asignar”); sin él se lee solo el número.', 'No comuniques urgencia solo con el tono naranja: acompaña con texto cercano.'],
          content: [
            ['3 trabajos sin asignar', '3 unassigned jobs'],
            ['12 recogidas hoy', '12 pickups today'],
          ],
          example: 'En **Todas las variantes**, la bandeja del operador muestra 3 trabajos sin asignar y 12 recogidas de Towing hoy.',
        }),
      },
    },
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo' };
export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
