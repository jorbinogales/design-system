import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { Button } from '../../actions/Button/Button';
import { Card } from '../../layout/Card/Card';
import { TopBar } from '../../navigation/TopBar/TopBar';
import { EmptyState } from './EmptyState';
import { EmptyIllustration, ErrorIllustration, NoResultsIllustration, OfflineIllustration, RestrictedIllustration } from './Illustrations';

const m = {
  es: {
    title: 'Hoy no tienes trabajos',
    body: 'No hay reservas asignadas para hoy. Las nuevas aparecerán aquí en cuanto se confirmen.',
    primary: 'Ver agenda de mañana',
    secondary: 'Actualizar',
    jobs: 'Trabajos',
    page: 'Pantalla completa',
    inline: 'En línea (dentro de una tarjeta)',
    illustrations: 'Ilustraciones',
    inlineTitle: 'Sin pagos pendientes',
    inlineBody: 'Los pagos por cobrar aparecerán en esta tarjeta.',
    names: ['Vacío', 'Sin resultados', 'Error', 'Sin conexión', 'Restringido'],
  },
  en: {
    title: 'You have no jobs today',
    body: 'No bookings are assigned to you today. New ones will appear here as soon as they are confirmed.',
    primary: "View tomorrow's schedule",
    secondary: 'Refresh',
    jobs: 'Jobs',
    page: 'Full screen',
    inline: 'Inline (inside a card)',
    illustrations: 'Illustrations',
    inlineTitle: 'No pending payments',
    inlineBody: 'Payments to collect will show up in this card.',
    names: ['Empty', 'No results', 'Error', 'Offline', 'Restricted'],
  },
};

function Stage({ children, height = 520 }: { children: ReactNode; height?: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height, width: '100%', border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, overflow: 'hidden', backgroundColor: bs.surface.canvas }}>
      {children}
    </Box>
  );
}

function InteractiveDemo({ layout, headingLevel }: { layout?: 'page' | 'inline'; headingLevel?: 'h1' | 'h2' | 'h3' }) {
  const t = useT(m);
  return (
    <Box sx={{ width: 380, maxWidth: '100%' }}>
      <Stage>
        <EmptyState
          layout={layout}
          headingLevel={headingLevel}
          illustration={<EmptyIllustration />}
          title={t.title}
          description={t.body}
          primaryAction={<Button size="md" fullWidth>{t.primary}</Button>}
          secondaryAction={<Button variant="quiet" size="md" fullWidth>{t.secondary}</Button>}
        />
      </Stage>
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const art = [EmptyIllustration, NoResultsIllustration, ErrorIllustration, OfflineIllustration, RestrictedIllustration];
  return (
    <Showcase maxWidth={720}>
      <Specimen label={t.illustrations}>
        {art.map((Art, i) => (
          <Box key={i} sx={{ textAlign: 'center' }}>
            <Art size={120} />
            <Box sx={{ typography: 'caption', color: bs.text.secondary }}>{t.names[i]}</Box>
          </Box>
        ))}
      </Specimen>
      <Specimen label={t.inline} direction="column" align="stretch">
        <Box sx={{ maxWidth: 380 }}>
          <Card>
            <EmptyState layout="inline" headingLevel="h3" title={t.inlineTitle} description={t.inlineBody} />
          </Card>
        </Box>
      </Specimen>
      <Specimen label={`${l.optional}: sin ilustración, sin acciones`} direction="column" align="stretch">
        <Box sx={{ maxWidth: 380 }}>
          <Card>
            <EmptyState layout="inline" headingLevel="h3" title={t.inlineTitle} />
          </Card>
        </Box>
      </Specimen>
    </Showcase>
  );
}

function BusinessScreen() {
  const t = useT(m);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <TopBar title={t.jobs} />
      <EmptyState
        illustration={<EmptyIllustration />}
        title={t.title}
        description={t.body}
        primaryAction={<Button size="md" fullWidth>{t.primary}</Button>}
        secondaryAction={<Button variant="quiet" size="md" fullWidth>{t.secondary}</Button>}
      />
    </Box>
  );
}

const meta = {
  title: 'Componentes/Estados de pantalla/Estado vacío',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Base de todas las pantallas **“no hay nada que mostrar”**: ilustración, título, texto, acción principal y acción secundaria. Los **Estados predefinidos** la usan con el texto y las acciones de cada caso.',
          anatomy: ['**Ilustración** (opcional): composición SVG con el icono de auto del sistema', '**Título** y **texto** de apoyo', '**Acción principal** (opcional)', '**Acción secundaria** (opcional)'],
          props: [
            '`layout="page"` (por defecto) llena la pantalla y centra; `inline` es compacto para tarjetas, listas y tablas.',
            '`headingLevel`: `h1` si es todo el contenido de la pantalla, `h2`/`h3` dentro de una sección.',
            '`role`: `alert` para fallos que aparecen tras una acción; `status` para cambios anunciados; sin rol cuando ya estaba al cargar.',
            'Vacío y error son casos distintos: **Hoy no tienes trabajos** (vacío, sin error) lleva a otra vista; **No pudimos cargar los trabajos** (error) pide **Reintentar**. Ver “Estados predefinidos”.',
          ],
          states: ['Estático: sin interacción propia', 'Las acciones son Botones con sus estados (hover, foco, cargando)'],
          tokens: [['Título', 'typeScale.h3 · text.primary'], ['Texto', 'typeScale.body1 · text.secondary'], ['Ilustración', 'surface.subtle · surface.muted · text.primary'], ['Margen lateral', 'layout.gutter.mobile'], ['Ancho de texto', '360 px máx.']],
          responsive: ['Móvil: columna centrada con botones a ancho completo (máx. 320 px).', 'Escritorio: mismo bloque centrado; en tablas usa `inline`.', 'Títulos largos hacen salto de línea completo.'],
          a11y: ['Título como encabezado real (nivel configurable).', 'La ilustración es decorativa (`aria-hidden`); el significado está en el texto.', 'Las acciones son alcanzables por teclado en orden: principal y secundaria.', 'Contraste de `text.secondary` sobre el lienzo ≥ 4.5:1 en ambos temas.'],
          content: [['Hoy no tienes trabajos · Ver agenda de mañana · Actualizar', 'You have no jobs today · View tomorrow’s schedule · Refresh'], ['Sin pagos pendientes', 'No pending payments']],
          example: '**Ejemplo de negocio**: pantalla Trabajos del operador sin reservas asignadas para hoy, dentro del marco de dispositivo.',
        }),
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { title: '' };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, layout: 'page', headingLevel: 'h2' },
  argTypes: { layout: { control: 'inline-radio', options: ['page', 'inline'] }, headingLevel: { control: 'inline-radio', options: ['h1', 'h2', 'h3'] }, title: { control: false }, illustration: { control: false }, primaryAction: { control: false }, secondaryAction: { control: false } },
  render: (args) => <InteractiveDemo layout={args.layout} headingLevel={args.headingLevel} />,
};
export const Variants: Story = { name: 'Ilustraciones y variantes', args: base, render: () => <VariantsDemo /> };
export const BusinessExample: Story = {
  name: 'Ejemplo de negocio · Hoy sin trabajos',
  args: base,
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
  render: () => <BusinessScreen />,
};
