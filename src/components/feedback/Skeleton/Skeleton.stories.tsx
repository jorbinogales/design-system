import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Button } from '../../actions/Button/Button';
import { InitialsAvatar } from '../../data-display/InitialsAvatar/InitialsAvatar';
import { StatusBadge } from '../../data-display/StatusBadge/StatusBadge';
import { Card } from '../../layout/Card/Card';
import { ListGroup, ListRow } from '../../layout/ListRow/ListRow';
import { Media } from '../../layout/Media/Media';
import { SkeletonCard, SkeletonGroup, SkeletonListRow, SkeletonPhotoCard, SkeletonText } from './Skeleton';

const m = {
  es: {
    text: 'Texto',
    row: 'Fila de lista',
    card: 'Tarjeta',
    photo: 'Tarjeta con foto',
    jobs: 'Trabajos de hoy',
    loadingJobs: 'Cargando trabajos de hoy',
    reload: 'Volver a cargar',
    j1: 'Luis Herrera',
    j1d: 'Lavado exterior · Mazda CX-5 · 9:00 a. m.',
    j2: 'Carla Méndez',
    j2d: 'Detailing Completo · Toyota Camry · 11:30 a. m.',
    j3: 'Pendiente de asignación',
    j3d: 'Recogida IAA Fort Lauderdale · Lote 04217753',
    pkg: 'Detailing Completo',
    pkgAlt: 'Sedán negro con acabado brillante',
  },
  en: {
    text: 'Text',
    row: 'List row',
    card: 'Card',
    photo: 'Photo card',
    jobs: "Today's jobs",
    loadingJobs: "Loading today's jobs",
    reload: 'Reload',
    j1: 'Luis Herrera',
    j1d: 'Exterior wash · Mazda CX-5 · 9:00 AM',
    j2: 'Carla Méndez',
    j2d: 'Full Detailing · Toyota Camry · 11:30 AM',
    j3: 'Awaiting assignment',
    j3d: 'IAA Fort Lauderdale pickup · Lot 04217753',
    pkg: 'Full Detailing',
    pkgAlt: 'Black sedan with a glossy finish',
  },
};

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={390}>
      <Specimen label={t.text} direction="column" align="stretch">
        <SkeletonGroup label={t.text}>
          <SkeletonText lines={3} />
        </SkeletonGroup>
      </Specimen>
      <Specimen label={`${t.row} · ${l.comfortable}`} direction="column" align="stretch" gap={0}>
        <SkeletonGroup label={t.row}>
          <SkeletonListRow />
          <SkeletonListRow />
        </SkeletonGroup>
      </Specimen>
      <Specimen label={t.card} direction="column" align="stretch">
        <SkeletonGroup label={t.card}>
          <SkeletonCard />
        </SkeletonGroup>
      </Specimen>
      <Specimen label={t.photo} direction="column" align="stretch">
        <SkeletonGroup label={t.photo}>
          <SkeletonPhotoCard />
        </SkeletonGroup>
      </Specimen>
    </Showcase>
  );
}

function InteractiveDemo() {
  const t = useT(m);
  return (
    <Box sx={{ width: 360, maxWidth: '100%' }}>
      <SkeletonGroup label={t.loadingJobs}>
        <SkeletonCard />
      </SkeletonGroup>
    </Box>
  );
}

/** Loads a list: skeleton rows with the same metrics as the real rows, then the content. */
function JobsDemo() {
  const t = useT(m);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) return;
    const id = window.setTimeout(() => setLoading(false), 2200);
    return () => window.clearTimeout(id);
  }, [loading]);
  return (
    <Box sx={{ width: 390, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" component="h2">
          {t.jobs}
        </Typography>
        <Button variant="quiet" size="sm" onClick={() => setLoading(true)} disabled={loading}>
          {t.reload}
        </Button>
      </Box>
      <Card density="compact" flush>
        {loading ? (
          <Box sx={{ px: 4 }}>
            <SkeletonGroup label={t.loadingJobs}>
              <SkeletonListRow density="compact" inset="none" />
              <SkeletonListRow density="compact" inset="none" />
              <SkeletonListRow density="compact" inset="none" />
            </SkeletonGroup>
          </Box>
        ) : (
          <Box sx={{ px: 4 }}>
            <ListGroup label={t.jobs}>
              <ListRow density="compact" inset="none" leading={<InitialsAvatar name={t.j1} size="sm" />} title={t.j1} description={t.j1d} trailing={<StatusBadge dimension="assignment" status="assigned" size="sm" />} />
              <ListRow density="compact" inset="none" leading={<InitialsAvatar name={t.j2} size="sm" />} title={t.j2} description={t.j2d} trailing={<StatusBadge dimension="assignment" status="assigned" size="sm" />} />
              <ListRow density="compact" inset="none" divider={false} leading={<InitialsAvatar size="sm" />} title={t.j3} description={t.j3d} trailing={<StatusBadge dimension="assignment" status="unassigned" size="sm" />} />
            </ListGroup>
          </Box>
        )}
      </Card>
      <Box sx={{ width: 220 }}>
        {loading ? (
          <SkeletonGroup label={t.photo}>
            <SkeletonPhotoCard />
          </SkeletonGroup>
        ) : (
          <Card flush>
            <Media alt={t.pkgAlt} unit="detailing" ratio="4:3" radius="none" />
            <Box sx={{ p: 4 }}>
              <Typography variant="h4">{t.pkg}</Typography>
              <Typography variant="price">$149.00</Typography>
            </Box>
          </Card>
        )}
      </Box>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Feedback/Skeleton',
  component: SkeletonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Reserva el **espacio y la forma** del contenido mientras carga, para que la página no salte al llegar los datos. Cuatro patrones: texto, fila de lista, tarjeta y tarjeta con foto.',
          anatomy: ['**SkeletonGroup**: región con `aria-busy` y texto oculto “Cargando contenido”', '**SkeletonText**, **SkeletonListRow**, **SkeletonCard**, **SkeletonPhotoCard**'],
          props: ['Envuelve siempre los patrones en `SkeletonGroup` y pásale un `label` que diga qué carga.', '`SkeletonListRow` acepta `density` e `inset` para igualar a `ListRow` exactamente.', 'Usa skeleton cuando conoces la forma del contenido; para esperas cortas sin forma, **Indicador de carga**.'],
          states: ['Pulso suave (reducido o detenido con `prefers-reduced-motion`)', 'Se reemplaza por el contenido real sin cambiar la altura'],
          tokens: [['Forma', 'surface.muted'], ['Borde de tarjetas', 'border.subtle'], ['Radios', 'radius.lg · radius.md · radius.pill'], ['Alto de fila', 'density.{cómoda|compacta}.rowMinHeight']],
          responsive: ['Todos ocupan el ancho del contenedor; las fotos mantienen su proporción 4:3.', 'Repite filas según lo que cabe en pantalla, sin más de seis.'],
          a11y: ['Una sola región `role="status"` con `aria-busy` y un texto para lectores de pantalla; las formas son `aria-hidden`.', 'Cuando termina la carga el contenido real sustituye al skeleton y se anuncia por su propia semántica.', 'La animación respeta `prefers-reduced-motion`.'],
          content: [['Cargando trabajos de hoy', "Loading today's jobs"], ['Cargando contenido', 'Loading content']],
          example: '**Ejemplo de negocio**: bandeja “Trabajos de hoy” del operador y tarjeta de paquete Detailing Completo: skeleton durante 2 s y luego los datos, con las mismas medidas.',
        }),
      },
    },
  },
} satisfies Meta<typeof SkeletonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = { name: 'Interactivo', args: { children: null, label: undefined }, argTypes: { children: { control: false } }, render: () => <InteractiveDemo /> };
export const Patterns: Story = { name: 'Patrones', args: { children: null }, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio · Trabajos de hoy', args: { children: null }, render: () => <JobsDemo /> };
