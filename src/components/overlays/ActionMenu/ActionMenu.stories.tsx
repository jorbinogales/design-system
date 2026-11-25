import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditCalendarOutlined from '@mui/icons-material/EditCalendarOutlined';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import SwapHorizRounded from '@mui/icons-material/SwapHorizRounded';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { StatusBadge } from '../../data-display/StatusBadge/StatusBadge';
import { Card } from '../../layout/Card/Card';
import { ActionMenu, type ActionMenuItem } from './ActionMenu';

const m = {
  es: {
    menu: 'Acciones de la reserva',
    actions: 'Acciones',
    view: 'Ver detalle',
    copy: 'Copiar código de recogida',
    reassign: 'Reasignar',
    reschedule: 'Reprogramar',
    start: 'Iniciar trabajo',
    cancel: 'Cancelar reserva',
    last: 'Última acción',
    job: 'Detailing Completo · Toyota Camry 2022',
    jobWhen: 'Sábado 14 de diciembre · 10:00 a. m. · Coral Gables',
    tow: 'Recogida Copart Miami Norte · Lote 04217753',
    towWhen: 'Código 0093 · 1:00 p. m.',
  },
  en: {
    menu: 'Booking actions',
    actions: 'Actions',
    view: 'View details',
    copy: 'Copy pickup code',
    reassign: 'Reassign',
    reschedule: 'Reschedule',
    start: 'Start job',
    cancel: 'Cancel booking',
    last: 'Last action',
    job: 'Full Detailing · 2022 Toyota Camry',
    jobWhen: 'Saturday, December 14 · 10:00 AM · Coral Gables',
    tow: 'Copart Miami North pickup · Lot 04217753',
    towWhen: 'Code 0093 · 1:00 PM',
  },
};

function useItems(assigned: boolean): ActionMenuItem[] {
  const t = useT(m);
  return [
    { value: 'view', label: t.view, icon: <VisibilityOutlined /> },
    { value: 'copy', label: t.copy, icon: <ContentCopyRounded /> },
    { value: 'reassign', label: t.reassign, icon: <SwapHorizRounded /> },
    { value: 'reschedule', label: t.reschedule, icon: <EditCalendarOutlined /> },
    { value: 'start', label: t.start, icon: <PlayArrowRounded />, disabled: !assigned },
    { value: 'cancel', label: t.cancel, icon: <DeleteOutlineRounded />, destructive: true },
  ];
}

function InteractiveDemo({ trigger, align }: { trigger?: 'icon' | 'button'; align?: 'start' | 'end' }) {
  const t = useT(m);
  const items = useItems(true);
  const [last, setLast] = useState<string | null>(null);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: align === 'start' ? 'flex-start' : 'flex-end', minWidth: 260 }}>
      <ActionMenu label={t.menu} triggerText={t.actions} trigger={trigger} align={align} items={items} onSelect={setLast} />
      <Typography variant="caption" sx={{ color: bs.text.secondary, alignSelf: 'flex-start' }} aria-live="polite">
        {t.last}: {last ?? '—'}
      </Typography>
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const items = useItems(false);
  return (
    <Showcase>
      <Specimen label={`${l.iconOnly} · ${l.disabled}`}>
        <ActionMenu label={t.menu} items={items} />
      </Specimen>
      <Specimen label={l.withIcon}>
        <ActionMenu label={t.menu} triggerText={t.actions} trigger="button" align="start" items={items} />
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  const detailing = useItems(true);
  const towing = useItems(false);
  return (
    <Showcase maxWidth={420}>
      {[
        { title: t.job, when: t.jobWhen, items: detailing, assignment: 'assigned' as const },
        { title: t.tow, when: t.towWhen, items: towing, assignment: 'unassigned' as const },
      ].map((job) => (
        <Card key={job.title} density="compact">
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="label" component="p" sx={{ overflowWrap: 'anywhere' }}>
                {job.title}
              </Typography>
              <Typography variant="body2" sx={{ color: bs.text.secondary, mb: 2, overflowWrap: 'anywhere' }}>
                {job.when}
              </Typography>
              <StatusBadge dimension="assignment" status={job.assignment} size="sm" />
            </Box>
            <ActionMenu label={`${t.menu}: ${job.title}`} items={job.items} />
          </Box>
        </Card>
      ))}
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Capas y menús/Menú de acciones',
  component: ActionMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Reúne las **acciones secundarias** de un objeto (una reserva, una fila) detrás de un solo disparador. La acción principal nunca va dentro del menú.',
          anatomy: ['**Disparador**: botón de icono (⋮) o botón con texto y flecha', '**Menú** de elementos', '**Icono** por elemento (opcional)', '**Elemento destructivo** separado por un divisor', '**Elementos deshabilitados**'],
          props: ['`label` es el nombre accesible del disparador y del menú; en listas incluye el objeto ("Acciones de la reserva: Detailing Completo").', '`align="end"` por defecto para disparadores en el borde derecho de una fila.', 'Cada elemento puede traer su `onSelect` o usar el `onSelect` global del menú.'],
          states: ['Disparador: reposo · hover · foco visible · presionado · expandido (`aria-expanded`)', 'Elemento: reposo · hover `action.hover` · foco `action.hover` + anillo interior · deshabilitado `text.disabled`', 'Destructivo: texto e icono `status.danger.fg`'],
          tokens: [['Fondo del menú', 'surface.raised'], ['Borde', 'border.subtle'], ['Sombra', 'elevation.e2'], ['Destructivo', 'status.danger.fg'], ['Alto de elemento', '44 px'], ['Radio', 'radius.md (menú) · radius.sm (elemento)']],
          responsive: ['El menú se ancla al disparador y se reposiciona si no cabe; ancho mínimo 200 px.', 'Etiquetas largas hacen salto de línea; no se truncan.', 'Elementos de 44 px: aptos para táctil.'],
          a11y: ['Disparador con `aria-haspopup="menu"` y `aria-expanded`.', 'Teclado: Enter/Espacio abre, flechas mueven, Inicio/Fin saltan, Esc cierra y devuelve el foco al disparador.', 'El foco queda atrapado mientras está abierto; clic fuera cierra.', 'Los elementos deshabilitados se saltan con las flechas: explica el motivo en la propia pantalla (por ejemplo, el estado “Pendiente de asignación”).', 'Lo destructivo se reconoce por el verbo, el icono y el divisor, no solo por el rojo.'],
          content: [['Ver detalle · Reasignar · Reprogramar · Iniciar trabajo', 'View details · Reassign · Reschedule · Start job'], ['Cancelar reserva', 'Cancel booking'], ['Copiar código de recogida', 'Copy pickup code']],
          example: '**Ejemplo de negocio**: dos tarjetas de trabajo del operador, un Detailing asignado (Iniciar trabajo habilitado) y una recogida de Towing en Copart Miami Norte sin asignar (Iniciar trabajo deshabilitado).',
        }),
      },
    },
  },
} satisfies Meta<typeof ActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { items: [], label: '', trigger: 'icon', align: 'end' },
  argTypes: { trigger: { control: 'inline-radio', options: ['icon', 'button'] }, align: { control: 'inline-radio', options: ['start', 'end'] }, items: { control: false } },
  render: (args) => <InteractiveDemo trigger={args.trigger} align={args.align} />,
};
export const Variants: Story = { name: 'Variantes y estados', args: { items: [], label: '' }, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: { items: [], label: '' }, render: () => <BusinessDemo /> };
