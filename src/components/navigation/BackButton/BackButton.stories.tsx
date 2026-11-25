import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Media } from '../../layout/Media/Media';
import { BackButton } from './BackButton';

const m = {
  es: { toBookings: 'Volver a Mis reservas', photo: 'Lavado exterior de una camioneta blanca' },
  en: { toBookings: 'Back to My bookings', photo: 'Exterior wash of a white pickup truck' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={420}>
      <Specimen label={l.variants}>
        <BackButton />
        <BackButton variant="plain" />
        <BackButton label={t.toBookings} />
        <BackButton disabled />
      </Specimen>
      <Specimen label={l.withPhoto} direction="column" align="stretch">
        <Box sx={{ position: 'relative' }}>
          <Media ratio="16:9" unit="personal-washing" alt={t.photo} radius="lg" />
          <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
            <BackButton variant="raised" />
          </Box>
        </Box>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Navegación móvil/Botón volver',
  component: BackButton,
  args: { variant: 'outlined', size: 'md' },
  argTypes: { variant: { control: 'inline-radio', options: ['outlined', 'raised', 'plain'] }, size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Regresa a la pantalla anterior del flujo. Es el control circular del kit de referencia, ya traducido.',
          anatomy: ['**Contenedor** circular de 44 px', '**Flecha** hacia la izquierda', '**Nombre accesible** “Volver” o con destino'],
          props: ['`label` opcional; por defecto “Volver” / “Back”. `href` para navegación por ruta.', '`variant`: `outlined` sobre lienzo, `raised` sobre fotografías, `plain` en encabezados densos.'],
          states: ['Reposo, hover (puntero), presionado, foco visible y deshabilitado (heredados de Botón de icono).'],
          tokens: [
            ['Borde', 'border.subtle'],
            ['Fondo sobre foto', 'surface.raised + elevation.e2'],
            ['Icono', 'text.primary'],
            ['Foco', 'focus.ring'],
          ],
          responsive: ['Móvil: siempre a la izquierda de la Barra superior. Escritorio: lo sustituyen las migas de pan (Fase 2).'],
          a11y: ['Nombre accesible obligatorio; usa el destino cuando no es obvio (“Volver a Mis reservas”).', 'Primer elemento enfocable de la pantalla.'],
          content: [
            ['Volver', 'Back'],
            ['Volver a Mis reservas', 'Back to My bookings'],
          ],
          example: 'En **Todas las variantes**, el botón `raised` flota sobre la imagen de un servicio de Personal Washing (respaldo sin foto).',
        }),
      },
    },
  },
} satisfies Meta<typeof BackButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo' };
export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
