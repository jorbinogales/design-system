import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Combobox, type ComboboxOption } from './Combobox';

const yards: ComboboxOption[] = [
  { value: 'copart-miami-n', label: 'Copart Miami Norte', description: '13350 NW 42nd Ave, Opa-locka, FL', group: 'Copart' },
  { value: 'copart-miami-s', label: 'Copart Miami Sur', description: '12900 SW 232nd St, Homestead, FL', group: 'Copart' },
  { value: 'copart-ftpierce', label: 'Copart Fort Pierce', description: '7700 Orange Ave, Fort Pierce, FL', group: 'Copart' },
  { value: 'iaa-ftl', label: 'IAA Fort Lauderdale', description: '4900 SW 30th Ave, Fort Lauderdale, FL', group: 'IAA' },
  { value: 'iaa-miami', label: 'IAA Miami', description: '17200 NW 27th Ave, Miami Gardens, FL', group: 'IAA' },
  { value: 'manheim-ftl', label: 'Manheim Fort Lauderdale', description: '5353 S State Rd 7, Davie, FL', group: 'Manheim' },
];

const team: ComboboxOption[] = [
  { value: 'lh', label: 'Luis Herrera', description: 'Grúa plataforma' },
  { value: 'ag', label: 'Ana Gutiérrez', description: 'Detailing' },
  { value: 'jr', label: 'Jorge Ramírez', description: 'Personal Washing' },
  { value: 'mp', label: 'María José Pérez', description: 'Detailing' },
];

const m = {
  es: { yard: 'Subasta', yardPh: 'Busca por nombre o ciudad', yardHelp: 'Escribe “Copart”, “IAA” o una ciudad.', staff: 'Responsables', staffPh: 'Añadir responsable', error: 'Elige la subasta donde está el vehículo.' },
  en: { yard: 'Auction', yardPh: 'Search by name or city', yardHelp: 'Type “Copart”, “IAA” or a city.', staff: 'Assignees', staffPh: 'Add an assignee', error: 'Choose the auction where the vehicle is.' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [yard, setYard] = useState<ComboboxOption | null>(yards[0]);
  const [empty, setEmpty] = useState<ComboboxOption | null>(null);
  const [staff, setStaff] = useState<ComboboxOption[]>([team[0]]);
  return (
    <Showcase maxWidth={390}>
      <Specimen label={`${l.businessExample} · grupos`} direction="column" align="stretch">
        <Combobox label={t.yard} placeholder={t.yardPh} helperText={t.yardHelp} options={yards} value={yard} onChange={setYard} required />
      </Specimen>
      <Specimen label={l.error} direction="column" align="stretch">
        <Combobox label={t.yard} placeholder={t.yardPh} options={yards} value={empty} onChange={setEmpty} error={t.error} />
      </Specimen>
      <Specimen label={`multiple · ${l.operator}`} direction="column" align="stretch">
        <Combobox multiple label={t.staff} placeholder={t.staffPh} options={team} value={staff} onChange={setStaff} />
      </Specimen>
      <Specimen label={l.loading} direction="column" align="stretch">
        <Combobox label={t.yard} placeholder={t.yardPh} options={[]} loading value={null} onChange={() => undefined} />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Selección/Combobox con búsqueda',
  component: Combobox,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Selecciona de una lista larga escribiendo para filtrar: subasta, responsable, modelo. Selección única o múltiple.',
          anatomy: ['**Campo** con texto de búsqueda', '**Lista** con opciones (título + descripción) agrupadas (opcional)', '**Chips** de selección (múltiple)', '**Borrar** y **abrir/cerrar**'],
          props: ['`options` con `value`, `label`, `description` y `group`. `multiple` cambia `value` a lista.', '`loading` muestra “Buscando…”; `noOptionsText` personaliza el vacío.'],
          states: ['Reposo · foco · lista abierta · opción enfocada · seleccionada · cargando · sin resultados · error · deshabilitado.'],
          tokens: [
            ['Campo', 'tokens de Campo de texto'],
            ['Lista', 'surface.raised · elevation.e2 · radius.md'],
            ['Opción seleccionada', 'selection.bg 600'],
            ['Chips', 'tokens de Chip (surface.subtle)'],
          ],
          responsive: ['Móvil: la lista se abre bajo el campo; con el teclado abierto el navegador desplaza el campo arriba.', 'Descripciones largas (direcciones) hacen salto de línea completo.'],
          a11y: ['Patrón WAI-ARIA combobox de MUI: flechas, Enter, Escape; los resultados se anuncian.', 'Textos de controles traducidos (“Borrar selección”, “Abrir lista”).', 'El vacío dice qué hacer: “Revisa la escritura o prueba otro término”.'],
          content: [
            ['Sin resultados. Revisa la escritura o prueba otro término.', 'No results. Check the spelling or try another term.'],
            ['Buscando…', 'Searching…'],
            ['Elige la subasta donde está el vehículo.', 'Choose the auction where the vehicle is.'],
          ],
          example: 'En **Todas las variantes**, subastas reales del sur de Florida agrupadas por empresa y la asignación múltiple de responsables.',
        }),
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', args: { label: '', options: [], value: null, onChange: () => undefined }, render: () => <AllDemo /> };
