import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { bs } from '../../../theme/theme';
import { Container, type ContainerProps } from './Container';

const m = {
  es: { title: 'Agenda de hoy', body: 'Martes 17 de diciembre · 6 trabajos · 2 sin asignar' },
  en: { title: "Today's schedule", body: 'Tuesday, December 17 · 6 jobs · 2 unassigned' },
};

function Demo(args: ContainerProps) {
  const t = useT(m);
  return (
    <Box sx={{ backgroundColor: bs.surface.subtle, py: 6, width: '100%' }}>
      <Container {...args}>
        <Box sx={{ backgroundColor: bs.surface.raised, border: `1px dashed ${bs.border.strong}`, borderRadius: 4, p: 4 }}>
          <Typography variant="h2">{t.title}</Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.body}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Estructura/Contenedor',
  component: Container,
  args: { size: 'content', gutters: true },
  argTypes: { size: { control: 'inline-radio', options: ['mobile', 'content', 'wide', 'full'] } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Centra el contenido de una página con un ancho máximo y los márgenes laterales del sistema.',
          anatomy: ['**Caja** centrada con `max-width`', '**Márgenes laterales** responsivos (opcionales)'],
          props: ['`size`: `mobile` 480 · `content` 840 (formularios, detalle) · `wide` 1280 (bandeja del operador) · `full`.'],
          states: ['Sin estados.'],
          tokens: [
            ['Ancho máximo', 'layout.maxWidth.mobile · content · wide'],
            ['Márgenes', 'layout.gutter.mobile 20 · tablet 32 (≥600) · desktop 40 (≥1200)'],
          ],
          responsive: ['Móvil: 20 px a cada lado; tableta 32 px; escritorio 40 px.', 'Nunca produce scroll horizontal: el ancho es 100 % hasta el máximo.'],
          a11y: ['Sin semántica propia; envuelve landmarks (`main`, `section`) dentro.'],
          content: [['Agenda de hoy', "Today's schedule"]],
          example: 'La historia muestra el encabezado de la agenda de hoy del operador de Towing en `wide`.',
        }),
      },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo', render: (args) => <Demo {...args} /> };
export const Wide: Story = { name: 'Ejemplo de negocio (wide)', args: { size: 'wide' }, render: (args) => <Demo {...args} /> };
