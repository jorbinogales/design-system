import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { DetailingIcon } from '../../../icons/DetailingIcon';
import { PersonalWashingIcon } from '../../../icons/PersonalWashingIcon';
import { TowingIcon } from '../../../icons/TowingIcon';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { FilterChipGroup } from './FilterChip';

const m = {
  es: { services: 'Servicios', all: 'Todos', exterior: 'Lavado exterior', interior: 'Interior', vacuum: 'Aspirado', engine: 'Motor', polish: 'Pulido', unit: 'Unidad', status: 'Estado', unassigned: 'Sin asignar', today: 'Hoy', late: 'Con retraso' },
  en: { services: 'Services', all: 'All', exterior: 'Exterior wash', interior: 'Interior', vacuum: 'Vacuum', engine: 'Engine bay', polish: 'Polish', unit: 'Unit', status: 'Status', unassigned: 'Unassigned', today: 'Today', late: 'Running late' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [svc, setSvc] = useState<string | null>('all');
  const [units, setUnits] = useState<string[]>(['towing']);
  const [flags, setFlags] = useState<string[]>(['unassigned', 'today']);
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <Showcase>
        <Specimen label={`single · scroll · ${l.client}`} direction="column" align="stretch">
          <FilterChipGroup
            selectionMode="single"
            label={t.services}
            value={svc}
            onChange={setSvc}
            options={[
              { value: 'all', label: t.all },
              { value: 'exterior', label: t.exterior },
              { value: 'interior', label: t.interior },
              { value: 'vacuum', label: t.vacuum },
              { value: 'engine', label: t.engine },
              { value: 'polish', label: t.polish },
            ]}
          />
        </Specimen>
        <Specimen label={`multiple · wrap · ${l.operator} · ${l.businessExample}`} direction="column" align="stretch">
          <FilterChipGroup
            selectionMode="multiple"
            overflow="wrap"
            label={t.unit}
            value={units}
            onChange={setUnits}
            options={[
              { value: 'detailing', label: 'Detailing', icon: <DetailingIcon />, count: 4 },
              { value: 'towing', label: 'Towing', icon: <TowingIcon />, count: 7 },
              { value: 'personal-washing', label: 'Personal Washing', icon: <PersonalWashingIcon />, count: 2 },
            ]}
          />
          <FilterChipGroup
            selectionMode="multiple"
            overflow="wrap"
            size="sm"
            label={t.status}
            value={flags}
            onChange={setFlags}
            options={[
              { value: 'unassigned', label: t.unassigned },
              { value: 'today', label: t.today },
              { value: 'late', label: t.late, disabled: true },
            ]}
          />
        </Specimen>
      </Showcase>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Selección/Chip de filtro',
  component: FilterChipGroup,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Filtra listas. Selección **única** (Todos / Exterior / Interior) o **múltiple** combinable (filtros de la bandeja por unidad y estado).',
          anatomy: ['**Grupo** con nombre', '**Chip** en píldora: icono (opcional, se cambia por un check al seleccionar), etiqueta, contador (opcional)'],
          props: ['`selectionMode`: `single` (`value: T | null`) o `multiple` (`value: T[]`).', '`overflow`: `scroll` una fila deslizable (móvil, como el kit) · `wrap` varias filas (escritorio).'],
          states: ['Reposo (`surface.subtle`) · hover (puntero) · foco visible · seleccionado (fondo naranja suave, borde naranja y check) · deshabilitado.'],
          tokens: [
            ['Reposo', 'surface.subtle · border.subtle · text.primary'],
            ['Seleccionado', 'selection.bg · selection.border'],
            ['Radio', 'radius.pill'],
            ['Altura', '36 px · sm 28 px'],
            ['Foco', 'focus.ring'],
          ],
          responsive: ['Móvil: una fila con desplazamiento horizontal sin barra visible. Escritorio: `wrap`.', 'Etiquetas largas (“Personal Washing”) no se recortan; el chip crece.'],
          a11y: ['Única: `role="radiogroup"` + `role="radio"` con `aria-checked`. Múltiple: botones con `aria-pressed`.', 'Seleccionado = check + borde, no solo color.'],
          content: [
            ['Todos · Lavado exterior · Interior', 'All · Exterior wash · Interior'],
            ['Sin asignar · Hoy · Con retraso', 'Unassigned · Today · Running late'],
          ],
          example: 'En **Todas las variantes**, la bandeja del operador combina unidad (Towing, 7) con estados Sin asignar y Hoy.',
        }),
      },
    },
  },
} satisfies Meta<typeof FilterChipGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  name: 'Todas las variantes',
  args: { selectionMode: 'single', label: '', options: [], value: null, onChange: () => undefined },
  render: () => <AllDemo />,
};
