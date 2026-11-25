import BlockRounded from '@mui/icons-material/BlockRounded';
import EventRepeatOutlined from '@mui/icons-material/EventRepeatOutlined';
import ManageAccountsOutlined from '@mui/icons-material/ManageAccountsOutlined';
import OpenInFullRounded from '@mui/icons-material/OpenInFullRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { RowMenu, type RowMenuItem } from './RowMenu';

const m = {
  es: {
    trigger: 'Acciones de Marcos Peña, 8:30 a. m.',
    view: 'Ver detalle',
    reassign: 'Reasignar operador',
    reschedule: 'Reprogramar',
    cancel: 'Cancelar reserva',
    last: 'Última acción',
    none: 'Ninguna todavía',
    disabled: 'Con acciones deshabilitadas (trabajo completado)',
    row: 'Fila clicable: el menú no abre el detalle',
    rowText: 'Marcos Peña · Towing · lote 04217753',
    opened: 'Detalle abierto',
    touch: 'Tamaño táctil (tarjeta móvil)',
  },
  en: {
    trigger: 'Actions for Marcos Peña, 8:30 AM',
    view: 'View detail',
    reassign: 'Reassign operator',
    reschedule: 'Reschedule',
    cancel: 'Cancel booking',
    last: 'Last action',
    none: 'None yet',
    disabled: 'With disabled actions (completed job)',
    row: 'Clickable row: the menu does not open the detail',
    rowText: 'Marcos Peña · Towing · lot 04217753',
    opened: 'Detail opened',
    touch: 'Touch size (mobile card)',
  },
};

function useItems(log: (s: string) => void, completed = false): RowMenuItem[] {
  const t = useT(m);
  return [
    { id: 'view', label: t.view, icon: <OpenInFullRounded />, onClick: () => log(t.view) },
    { id: 'reassign', label: t.reassign, icon: <ManageAccountsOutlined />, onClick: () => log(t.reassign), disabled: completed },
    { id: 'reschedule', label: t.reschedule, icon: <EventRepeatOutlined />, onClick: () => log(t.reschedule), disabled: completed },
    { id: 'cancel', label: t.cancel, icon: <BlockRounded />, onClick: () => log(t.cancel), destructive: true, dividerBefore: true, disabled: completed },
  ];
}

function Demo({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const t = useT(m);
  const [last, setLast] = useState('');
  const items = useItems(setLast);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <RowMenu items={items} label={t.trigger} size={size} />
      <Typography variant="body2" aria-live="polite" sx={{ color: bs.text.secondary }}>
        {t.last}: {last || t.none}
      </Typography>
    </Box>
  );
}

function StatesDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [opened, setOpened] = useState(false);
  const [, setLast] = useState('');
  const active = useItems(setLast);
  const done = useItems(setLast, true);
  return (
    <Showcase>
      <Specimen label={`${l.rest} · ${t.touch}`}>
        <RowMenu items={active} label={t.trigger} size="sm" />
        <RowMenu items={active} label={t.trigger} size="md" />
      </Specimen>
      <Specimen label={t.disabled}>
        <RowMenu items={done} label={t.trigger} />
      </Specimen>
      <Specimen label={t.row} direction="column" align="stretch">
        <Box
          role="button"
          tabIndex={0}
          onClick={() => setOpened(true)}
          onKeyDown={(e) => e.key === 'Enter' && setOpened(true)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, p: 3, pl: 4, maxWidth: 440, border: `1px solid ${bs.border.subtle}`, borderRadius: 3, cursor: 'pointer', '&:focus-visible': { outline: `2px solid ${bs.focus.ring}` } }}
        >
          <Typography variant="body2">{t.rowText}</Typography>
          <RowMenu items={active} label={t.trigger} />
        </Box>
        <Typography variant="caption" aria-live="polite" sx={{ color: bs.text.secondary }}>
          {opened ? t.opened : ''}
        </Typography>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Tablas y bandejas/Menú por fila',
  component: RowMenu,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Las **acciones secundarias de una fila** (ver detalle, reasignar, reprogramar, cancelar) detrás de un botón de tres puntos. Usa el `Menu` de MUI ya tematizado.',
          anatomy: ['**Botón** de icono con nombre que cita la fila', '**Menú** con elementos: icono (opcional) y texto', '**Divisor** antes del grupo destructivo (opcional)'],
          props: [
            '`items`: `{ id, label, icon?, onClick, destructive?, disabled?, dividerBefore? }`.',
            '`label` es obligatorio y debe nombrar la fila: “Acciones de Marcos Peña, 8:30 a. m.”.',
            '`size`: `sm` 36 px (tabla de escritorio) · `md` 44 px (tarjeta móvil).',
            'Detiene la propagación del clic y del teclado, incluido el del menú (que se abre en un portal): una fila clicable y su menú conviven.',
          ],
          states: ['Reposo · hover (puntero) · foco visible · abierto (`aria-expanded`) · elemento enfocado (fondo de hover + borde interior) · elemento deshabilitado · destructivo (texto de peligro).'],
          tokens: [
            ['Superficie del menú', 'surface.raised · border.subtle · elevation.e2 · radius.md'],
            ['Elemento', '44 px de alto · radius.sm'],
            ['Hover / foco', 'action.hover · focus.ring'],
            ['Destructivo', 'status.danger.fg'],
            ['Deshabilitado', 'text.disabled'],
          ],
          responsive: ['El menú se ancla a la derecha del botón y ajusta su posición para no salir de la pantalla.', 'En tarjetas móviles usa el botón de 44 px; las acciones frecuentes (Asignar operador) quedan fuera, visibles.'],
          a11y: [
            'El botón anuncia `aria-haspopup="menu"` y `aria-expanded`; Enter, Espacio y flecha abajo lo abren.',
            'Dentro del menú: flechas, Inicio/Fin y escritura de la primera letra; Escape lo cierra y **devuelve el foco** al botón.',
            'Los destructivos se distinguen por el verbo (“Cancelar reserva”) y la posición tras un divisor, no solo por el color.',
            'Tooltip con el nombre al enfocar con teclado o puntero.',
          ],
          content: [
            ['Ver detalle · Reasignar operador · Reprogramar · Cancelar reserva', 'View detail · Reassign operator · Reschedule · Cancel booking'],
            ['Acciones de Marcos Peña, 8:30 a. m.', 'Actions for Marcos Peña, 8:30 AM'],
          ],
          example: '**Ejemplo de negocio**: fila de Towing (lote 04217753) de la agenda de hoy. En un trabajo completado, reasignar, reprogramar y cancelar quedan deshabilitados.',
        }),
      },
    },
  },
} satisfies Meta<typeof RowMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { items: [], label: '' };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, size: 'sm' },
  render: (args) => <Demo size={args.size} />,
};

export const States: Story = { name: 'Estados', args: base, render: () => <StatesDemo /> };

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: base,
  render: function Render() {
    const t = useT(m);
    const [last, setLast] = useState('');
    const items = useItems(setLast);
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, p: 3, pl: 4, border: `1px solid ${bs.border.subtle}`, borderRadius: 3, maxWidth: 440 }}>
        <Typography variant="body2" sx={{ flex: 1 }}>
          {t.rowText}
        </Typography>
        <RowMenu items={items} label={t.trigger} />
        <Typography variant="caption" aria-live="polite" sx={{ color: bs.text.secondary, minWidth: 90 }}>
          {last}
        </Typography>
      </Box>
    );
  },
};
