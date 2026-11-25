import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { InverseSurface, SchemeScope } from '../../../theme/SchemeScope';
import { SearchField } from './SearchField';

const m = {
  es: { ph: 'Buscar servicios o talleres', jobs: 'Buscar por cliente, lote o código', jobsLabel: 'Buscar trabajos' },
  en: { ph: 'Search services or shops', jobs: 'Search by customer, lot or code', jobsLabel: 'Search jobs' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [a, setA] = useState('');
  const [b, setB] = useState('lavado cerámico');
  const [c, setC] = useState('');
  const [d, setD] = useState('04217753');
  return (
    <Showcase maxWidth={390}>
      <Specimen label={l.rest} direction="column" align="stretch">
        <SearchField hideLabel placeholder={t.ph} value={a} onChange={(e) => setA(e.target.value)} onClear={() => setA('')} />
      </Specimen>
      <Specimen label="clear · filtros (2)" direction="column" align="stretch">
        <SearchField hideLabel placeholder={t.ph} value={b} onChange={(e) => setB(e.target.value)} onClear={() => setB('')} onFilterClick={() => undefined} activeFilters={2} />
      </Specimen>
      <Specimen label={l.onInverse} direction="column" align="stretch">
        <InverseSurface sx={{ p: 5, borderRadius: 6 }}>
          <SchemeScope scheme="page">
            <SearchField hideLabel placeholder={t.ph} value={c} onChange={(e) => setC(e.target.value)} onClear={() => setC('')} onFilterClick={() => undefined} />
          </SchemeScope>
        </InverseSurface>
      </Specimen>
      <Specimen label={`${l.operator} · ${l.businessExample}`} direction="column" align="stretch">
        <SearchField label={t.jobsLabel} placeholder={t.jobs} size="md" value={d} onChange={(e) => setD(e.target.value)} onClear={() => setD('')} />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Campos/Búsqueda',
  component: SearchField,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Busca servicios, talleres o trabajos. Puede llevar al lado el botón de filtros, como en el kit de referencia.',
          anatomy: ['**Etiqueta** (normalmente oculta con `hideLabel`)', '**Campo** con lupa, valor y botón **Borrar**', '**Botón de filtros** con contador de filtros activos (opcional)'],
          props: ['`onSubmit(value)` al pulsar Enter / Buscar del teclado. `clearable` activo por defecto (requiere `onClear`).', '`onFilterClick` muestra el botón de filtros; `activeFilters` añade la insignia y cambia su nombre accesible.'],
          states: ['Los de Campo de texto (reposo, hover, foco, error, deshabilitado).', 'Con valor: aparece Borrar. Filtros activos: insignia con número.'],
          tokens: [
            ['Campo', 'tokens de Campo de texto'],
            ['Lupa', 'text.secondary'],
            ['Botón de filtros', 'surface.subtle · radius.md · 52 px'],
            ['Insignia', 'brand.primary · action.primary.fg'],
          ],
          responsive: ['Móvil: dentro del encabezado negro del Inicio, con el esquema de la página (claro sobre negro en modo claro).', 'Escritorio: tamaño `md` en la barra de filtros de la bandeja.', 'Teclado: `enterKeyHint="search"` muestra la tecla Buscar.'],
          a11y: ['`type="search"` dentro de un landmark `role="search"`; la etiqueta oculta sigue siendo el nombre accesible.', 'El botón de filtros anuncia cuántos hay activos: “Filtros, 2 activos”.'],
          content: [
            ['Buscar servicios o talleres', 'Search services or shops'],
            ['Buscar por cliente, lote o código', 'Search by customer, lot or code'],
            ['Filtros, 2 activos', 'Filters, 2 active'],
          ],
          example: 'En **Todas las variantes**, el operador busca un trabajo de Towing por número de lote (04217753, con cero inicial).',
        }),
      },
    },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
