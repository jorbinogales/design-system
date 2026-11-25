import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { Button } from '../../actions/Button/Button';
import { TopBar } from '../../navigation/TopBar/TopBar';
import { NoItemsState, NoResultsState, ErrorState, OfflineState, RestrictedState } from './StatePresets';

const m = {
  es: {
    empty: 'Estado vacío',
    noResults: 'Búsqueda sin resultados',
    error: 'Error con reintento',
    offline: 'Sin conexión',
    restricted: 'Acceso restringido',
    emptyJobsTitle: 'Hoy no tienes trabajos',
    emptyJobsBody: 'No hay reservas asignadas para hoy. Las nuevas aparecerán aquí en cuanto se confirmen.',
    emptyJobsAction: 'Ver agenda de mañana',
    errorJobsTitle: 'No pudimos cargar los trabajos',
    errorJobsBody: 'Fue un problema de nuestro lado, no de tu conexión. Tus trabajos están a salvo.',
    support: 'Contactar a soporte',
    compare: 'Vacío frente a error: cada uno pide una acción distinta',
    jobs: 'Trabajos de hoy',
    lot: 'Lote 04217753',
    retrying: 'Reintentando…',
  },
  en: {
    empty: 'Empty state',
    noResults: 'No search results',
    error: 'Error with retry',
    offline: 'Offline',
    restricted: 'Restricted access',
    emptyJobsTitle: 'You have no jobs today',
    emptyJobsBody: 'No bookings are assigned to you today. New ones will appear here as soon as they are confirmed.',
    emptyJobsAction: "View tomorrow's schedule",
    errorJobsTitle: 'We could not load the jobs',
    errorJobsBody: 'This was a problem on our side, not your connection. Your jobs are safe.',
    support: 'Contact support',
    compare: 'Empty versus error: each one needs a different action',
    jobs: "Today's jobs",
    lot: 'Lot 04217753',
    retrying: 'Retrying…',
  },
};

function Stage({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <Box role="group" aria-label={label} sx={{ display: 'flex', flexDirection: 'column', height: 480, width: 360, maxWidth: '100%', border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, overflow: 'hidden', backgroundColor: bs.surface.canvas }}>
      {children}
    </Box>
  );
}

function AllDemo() {
  const t = useT(m);
  return (
    <Showcase>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: 6 }}>
        <Specimen label={t.empty} direction="column" align="stretch">
          <Stage label={t.empty}>
            <NoItemsState primaryAction={<Button size="md" fullWidth>{t.emptyJobsAction}</Button>} />
          </Stage>
        </Specimen>
        <Specimen label={t.noResults} direction="column" align="stretch">
          <Stage label={t.noResults}>
            <NoResultsState query="04217" onClear={() => undefined} />
          </Stage>
        </Specimen>
        <Specimen label={t.error} direction="column" align="stretch">
          <Stage label={t.error}>
            <ErrorState onRetry={() => undefined} />
          </Stage>
        </Specimen>
        <Specimen label={t.offline} direction="column" align="stretch">
          <Stage label={t.offline}>
            <OfflineState onRetry={() => undefined} />
          </Stage>
        </Specimen>
        <Specimen label={t.restricted} direction="column" align="stretch">
          <Stage label={t.restricted}>
            <RestrictedState requiredRole="admin" onBack={() => undefined} onRequestAccess={() => undefined} />
          </Stage>
        </Specimen>
      </Box>
    </Showcase>
  );
}

function InteractiveDemo() {
  const t = useT(m);
  const [retrying, setRetrying] = useState(false);
  return (
    <Stage>
      <ErrorState
        retrying={retrying}
        onRetry={() => {
          setRetrying(true);
          window.setTimeout(() => setRetrying(false), 1600);
        }}
        secondaryAction={<Button variant="quiet" size="md" fullWidth>{t.support}</Button>}
      />
    </Stage>
  );
}

function CompareDemo() {
  const t = useT(m);
  return (
    <Showcase>
      <Specimen label={t.compare}>
        <Stage label={t.emptyJobsTitle}>
          <NoItemsState title={t.emptyJobsTitle} description={t.emptyJobsBody} primaryAction={<Button size="md" fullWidth>{t.emptyJobsAction}</Button>} />
        </Stage>
        <Stage label={t.errorJobsTitle}>
          <ErrorState title={t.errorJobsTitle} description={t.errorJobsBody} onRetry={() => undefined} secondaryAction={<Button variant="quiet" size="md" fullWidth>{t.support}</Button>} />
        </Stage>
      </Specimen>
    </Showcase>
  );
}

function ScreenDemo() {
  const t = useT(m);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <TopBar title={t.jobs} subtitle={t.lot} />
      <ErrorState title={t.errorJobsTitle} description={t.errorJobsBody} onRetry={() => undefined} secondaryAction={<Button variant="quiet" size="md" fullWidth>{t.support}</Button>} layout="page" headingLevel="h1" />
    </Box>
  );
}

const meta = {
  title: 'Componentes/Estados de pantalla/Estados predefinidos',
  component: NoItemsState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Cinco estados de pantalla listos para usar: **Estado vacío**, **Búsqueda sin resultados**, **Error con reintento**, **Sin conexión** y **Acceso restringido**. Cada uno trae su ilustración, texto por defecto (ES/EN) y la acción que le corresponde.',
          anatomy: ['**Ilustración** propia de cada caso', '**Título** y **texto**', '**Acción principal** y **secundaria** según el caso'],
          props: [
            '`NoItemsState` · `NoResultsState {query, onClear}` · `ErrorState {onRetry, retrying}` · `OfflineState {onRetry, retrying}` · `RestrictedState {requiredRole: "operator" | "admin", onBack, onRequestAccess}`.',
            'Todos aceptan `title`, `description`, `primaryAction`, `secondaryAction`, `layout`, `headingLevel` para sustituir el texto por el de la pantalla.',
            '**Vacío ≠ error.** “Hoy no tienes trabajos” no falló nada: ofrece ir a otra vista (agenda de mañana). “No pudimos cargar los trabajos” sí falló: ofrece **Reintentar** y un camino de ayuda. Nunca muestres Reintentar en un vacío ni “no hay nada” en un error.',
            'Sin conexión se anuncia con `role="status"` y el error con `role="alert"`.',
          ],
          states: ['Reintentar: reposo · cargando (deshabilitado con indicador) · resultado', 'Acciones con hover, foco y presionado propios'],
          tokens: [['Título', 'typeScale.h3 · text.primary'], ['Texto', 'text.secondary'], ['Insignia de error', 'status.danger.solid'], ['Ilustración', 'surface.subtle · surface.muted']],
          responsive: ['Botones a ancho completo hasta 320 px en móvil.', 'En escritorio quedan centrados en el área de contenido; en tablas usa `layout="inline"`.'],
          a11y: ['Error: `role="alert"`; sin conexión: `role="status"`; vacío y restringido sin rol (estaban al cargar).', 'Título como encabezado; la ilustración es decorativa.', 'Acceso restringido dice qué rol lo necesita y cómo pedir acceso, sin culpar a la persona.', 'El significado no depende del color: cada caso tiene texto propio.'],
          content: [['Hoy no tienes trabajos · Ver agenda de mañana', 'You have no jobs today · View tomorrow’s schedule'], ['No pudimos cargar los trabajos · Reintentar · Contactar a soporte', 'We could not load the jobs · Try again · Contact support'], ['No tienes acceso a esta sección', 'You do not have access to this section'], ['Sin resultados para “04217”', 'No results for “04217”']],
          example: '**Ejemplo de negocio**: lista “Trabajos de hoy” del operador, con el vacío (sin reservas asignadas) y el error (falló la carga) lado a lado.',
        }),
      },
    },
  },
} satisfies Meta<typeof NoItemsState>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { title: undefined };

export const Interactive: Story = { name: 'Interactivo · Reintentar', args: base, render: () => <InteractiveDemo /> };
export const AllPresets: Story = { name: 'Los cinco estados', args: base, parameters: { layout: 'padded' }, render: () => <AllDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio · Vacío frente a error', args: base, parameters: { layout: 'padded' }, render: () => <CompareDemo /> };
export const ErrorScreen: Story = {
  name: 'Ejemplo de negocio · Pantalla con error',
  args: base,
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
  render: () => <ScreenDemo />,
};
