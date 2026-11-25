import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Divider } from './Divider';

const m = {
  es: { or: 'o continúa con', a: 'Hoy', b: '6 trabajos' },
  en: { or: 'or continue with', a: 'Today', b: '6 jobs' },
};

function AllDemo() {
  const t = useT(m);
  return (
    <Box sx={{ width: 358 }}>
      <Showcase>
        <Specimen label="solid" direction="column" align="stretch">
          <Divider />
        </Specimen>
        <Specimen label="dashed (total)" direction="column" align="stretch">
          <Divider variant="dashed" />
        </Specimen>
        <Specimen label="label" direction="column" align="stretch">
          <Divider label={t.or} />
        </Specimen>
        <Specimen label="vertical">
          <Box sx={{ display: 'flex', alignItems: 'center', height: 24 }}>
            <Typography variant="label">{t.a}</Typography>
            <Divider orientation="vertical" spacing="sm" />
            <Typography variant="body2">{t.b}</Typography>
          </Box>
        </Specimen>
      </Showcase>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Estructura/Divisor',
  component: Divider,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Separa grupos de contenido con una línea fina.',
          anatomy: ['**Línea** de 1 px', '**Texto** centrado (opcional)'],
          props: ['`variant` `dashed` antes de totales (recibos); `inset` para listas con icono; `spacing` añade margen.', 'Decorativo por defecto; `semantic` lo anuncia como separador.'],
          states: ['Sin estados.'],
          tokens: [
            ['Línea', 'border.subtle'],
            ['Texto', 'text.secondary · typeScale.body2'],
          ],
          responsive: ['Ocupa el ancho del contenedor.'],
          a11y: ['`role="presentation"` por defecto para no añadir ruido; usa `semantic` cuando separe secciones con significado.'],
          content: [['o continúa con', 'or continue with']],
          example: 'La línea discontinua separa el total en el Desglose de importes (ver Presentación de datos).',
        }),
      },
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
