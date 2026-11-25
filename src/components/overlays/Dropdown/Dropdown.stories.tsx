import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Dropdown } from './Dropdown';

const m = {
  es: {
    unit: 'Unidad',
    all: 'Todas',
    detailing: 'Detailing',
    towing: 'Towing',
    washing: 'Personal Washing',
    sort: 'Ordenar por',
    time: 'Hora',
    status: 'Estado',
    lot: 'Número de lote',
    owner: 'Responsable',
    anyone: 'Cualquiera',
    unassigned: 'Pendiente de asignación',
    luis: 'Luis Herrera',
    carla: 'Carla Méndez',
    closed: 'Cerrado (sin turnos)',
  },
  en: {
    unit: 'Unit',
    all: 'All',
    detailing: 'Detailing',
    towing: 'Towing',
    washing: 'Personal Washing',
    sort: 'Sort by',
    time: 'Time',
    status: 'Status',
    lot: 'Lot number',
    owner: 'Assignee',
    anyone: 'Anyone',
    unassigned: 'Awaiting assignment',
    luis: 'Luis Herrera',
    carla: 'Carla Méndez',
    closed: 'Closed (no shifts)',
  },
};

type Unit = 'all' | 'detailing' | 'towing' | 'washing';

function InteractiveDemo({ size, hideLabel, fullWidth }: { size?: 'sm' | 'md'; hideLabel?: boolean; fullWidth?: boolean }) {
  const t = useT(m);
  const [unit, setUnit] = useState<Unit>('all');
  return (
    <Box sx={{ width: 320, maxWidth: '100%' }}>
      <Dropdown<Unit>
        label={t.unit}
        size={size}
        hideLabel={hideLabel}
        fullWidth={fullWidth}
        value={unit}
        onChange={setUnit}
        options={[
          { value: 'all', label: t.all },
          { value: 'detailing', label: t.detailing },
          { value: 'towing', label: t.towing },
          { value: 'washing', label: t.washing },
        ]}
      />
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [sort, setSort] = useState('time');
  const sortOptions = [
    { value: 'time', label: t.time },
    { value: 'status', label: t.status },
    { value: 'lot', label: t.lot },
  ];
  return (
    <Showcase maxWidth={390}>
      <Specimen label={l.comfortable}>
        <Dropdown label={t.sort} value={sort} onChange={setSort} options={sortOptions} />
      </Specimen>
      <Specimen label={l.compact}>
        <Dropdown label={t.sort} size="sm" value={sort} onChange={setSort} options={sortOptions} />
      </Specimen>
      <Specimen label={`${l.fullWidth} · ${l.disabled}`} direction="column" align="stretch">
        <Dropdown label={t.sort} fullWidth value="lot" onChange={setSort} options={[...sortOptions, { value: 'closed', label: t.closed, disabled: true }]} />
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  const [unit, setUnit] = useState<Unit>('towing');
  const [owner, setOwner] = useState('anyone');
  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <Dropdown<Unit>
        label={t.unit}
        size="sm"
        value={unit}
        onChange={setUnit}
        options={[
          { value: 'all', label: t.all },
          { value: 'detailing', label: t.detailing },
          { value: 'towing', label: t.towing },
          { value: 'washing', label: t.washing },
        ]}
      />
      <Dropdown
        label={t.owner}
        size="sm"
        value={owner}
        onChange={setOwner}
        options={[
          { value: 'anyone', label: t.anyone },
          { value: 'unassigned', label: t.unassigned },
          { value: 'luis', label: t.luis },
          { value: 'carla', label: t.carla },
        ]}
      />
    </Box>
  );
}

const meta = {
  title: 'Componentes/Capas y menús/Desplegable',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Botón que **muestra el valor actual** y abre una lista de opciones. Para filtros y orden en barras de herramientas; en formularios se usa **Select**.',
          anatomy: ['**Etiqueta** visible ("Unidad"), ocultable', '**Valor actual**', '**Flecha** (decorativa, gira al abrir)', '**Lista** de opciones con marca de selección'],
          props: ['Una sola opción activa; no se puede deseleccionar. Para filtros combinables usa **Chip de filtro**.', '`size`: `md` 44 px (táctil) · `sm` 36 px (escritorio denso).', '`hideLabel` mantiene la etiqueta para lectores de pantalla.'],
          states: ['Reposo · hover (puntero) `action.hover` · foco visible · presionado · abierto (`aria-expanded`)', 'Opción: seleccionada con `selection.bg` y marca · deshabilitada `text.disabled`'],
          tokens: [['Borde del botón', 'border.strong'], ['Texto', 'text.primary · text.secondary'], ['Foco', 'focus.ring'], ['Selección', 'selection.bg'], ['Radio', 'radius.pill']],
          responsive: ['Con `fullWidth` ocupa su contenedor (móvil). El valor se trunca con puntos suspensivos y la lista muestra el texto completo.', 'La lista se reposiciona si no cabe.'],
          a11y: ['Nombre accesible "Unidad: Towing" (etiqueta + valor).', '`aria-haspopup="listbox"`, lista con `role="listbox"` y opciones `aria-selected`.', 'Enter/Espacio abre, flechas navegan, Esc cierra y devuelve el foco al botón.', 'La selección se marca con icono de check, no solo con color.'],
          content: [['Unidad: Todas · Detailing · Towing · Personal Washing', 'Unit: All · Detailing · Towing · Personal Washing'], ['Responsable: Pendiente de asignación', 'Assignee: Awaiting assignment']],
          example: '**Ejemplo de negocio**: barra de filtros de la bandeja del operador con Unidad (Towing) y Responsable.',
        }),
      },
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { label: '', options: [], value: '', onChange: () => undefined, size: 'md', hideLabel: false, fullWidth: false },
  argTypes: { options: { control: false }, value: { control: false }, onChange: { control: false }, label: { control: false } },
  render: (args) => <InteractiveDemo size={args.size} hideLabel={args.hideLabel} fullWidth={args.fullWidth} />,
};
export const Variants: Story = { name: 'Tamaños y estados', args: { label: '', options: [], value: '', onChange: () => undefined }, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: { label: '', options: [], value: '', onChange: () => undefined }, render: () => <BusinessDemo /> };
