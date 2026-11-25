import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { InitialsAvatar } from './InitialsAvatar';

const m = {
  es: { role: 'Especialista en Detailing', unassigned: 'Pendiente de asignación', unassignedDesc: 'Te avisaremos cuando asignemos a un profesional.' },
  en: { role: 'Detailing specialist', unassigned: 'Awaiting assignment', unassignedDesc: "We'll let you know once a professional is assigned." },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={420}>
      <Specimen label={l.sizes}>
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
          <InitialsAvatar key={s} name="Carlos Méndez" size={s} />
        ))}
      </Specimen>
      <Specimen label="Pendiente de asignación">
        <InitialsAvatar size="md" />
        <InitialsAvatar size="lg" />
      </Specimen>
      <Specimen label={l.businessExample} direction="column" align="stretch">
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <InitialsAvatar name="María José Pérez" size="lg" />
          <Box>
            <Typography variant="h4">María José Pérez</Typography>
            <Typography variant="body2" sx={{ color: bs.text.secondary }}>
              {t.role}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <InitialsAvatar size="lg" />
          <Box>
            <Typography variant="h4">{t.unassigned}</Typography>
            <Typography variant="body2" sx={{ color: bs.text.secondary }}>
              {t.unassignedDesc}
            </Typography>
          </Box>
        </Box>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Presentación de datos/Avatar con iniciales',
  component: InitialsAvatar,
  args: { name: 'Carlos Méndez', size: 'md', decorative: true },
  argTypes: { size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] } },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Representa a una persona (profesional, cliente, operador) con iniciales o foto. Sin nombre muestra el marcador “Pendiente de asignación”.',
          anatomy: ['**Círculo**', '**Iniciales** (primera y última palabra) o **foto**', '**Marcador** discontinuo con icono cuando no hay persona asignada'],
          props: ['`initialsOf()` se exporta: “María José Pérez” → “MP”.', '`decorative` (por defecto) cuando el nombre ya aparece al lado; si va solo, `decorative={false}` lo anuncia.'],
          states: ['Con iniciales · con foto (si falla, vuelve a iniciales) · sin asignar.'],
          tokens: [
            ['Fondo / iniciales', 'surface.muted · text.primary'],
            ['Sin asignar', 'border.strong (discontinuo) · text.secondary'],
            ['Tamaños', '24 · 32 · 40 · 56 · 80 px'],
          ],
          responsive: ['`sm` en filas compactas; `lg` en la tarjeta de profesional; `xl` en perfil.'],
          a11y: ['Decorativo por defecto para no duplicar el nombre.', 'El estado “sin asignar” se comunica con borde discontinuo e icono, y debe ir acompañado de texto.'],
          content: [['Pendiente de asignación', 'Awaiting assignment']],
          example: 'En **Todas las variantes**: una especialista de Detailing asignada y el estado previo, pendiente de asignación.',
        }),
      },
    },
  },
} satisfies Meta<typeof InitialsAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo' };
export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
