import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Pagination } from './Pagination';

const m = {
  es: {
    label: 'Paginación del historial',
    wide: 'Contenedor ancho: números de página',
    narrow: 'Contenedor estrecho (390 px): Anterior / Siguiente',
    empty: 'Sin resultados',
    one: 'Una sola página',
    history: 'Historial de reservas · 47 trabajos completados este mes',
  },
  en: {
    label: 'History pagination',
    wide: 'Wide container: page numbers',
    narrow: 'Narrow container (390 px): Previous / Next',
    empty: 'No results',
    one: 'Single page',
    history: 'Booking history · 47 jobs completed this month',
  },
};

function Demo({ total = 47, initialPage = 1, initialSize = 10, sizeSelector = true }: { total?: number; initialPage?: number; initialSize?: number; sizeSelector?: boolean }) {
  const t = useT(m);
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  return (
    <Pagination
      label={t.label}
      page={Math.min(page, Math.max(1, Math.ceil(total / size)))}
      pageSize={size}
      total={total}
      onPageChange={setPage}
      onPageSizeChange={sizeSelector ? (n) => { setSize(n); setPage(1); } : undefined}
    />
  );
}

function StatesDemo() {
  const t = useT(m);
  return (
    <Showcase>
      <Specimen label={t.wide} direction="column" align="stretch">
        <Box sx={{ maxWidth: 760 }}>
          <Demo initialPage={3} />
        </Box>
      </Specimen>
      <Specimen label={t.narrow} direction="column" align="stretch">
        <Box sx={{ width: 390, maxWidth: '100%' }}>
          <Demo initialPage={2} sizeSelector={false} />
        </Box>
      </Specimen>
      <Specimen label={t.one} direction="column" align="stretch">
        <Box sx={{ maxWidth: 760 }}>
          <Demo total={8} />
        </Box>
      </Specimen>
      <Specimen label={t.empty} direction="column" align="stretch">
        <Box sx={{ maxWidth: 760 }}>
          <Demo total={0} />
        </Box>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Tablas y bandejas/Paginación',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Recorre listas largas por páginas: resumen del rango (“Mostrando 11–20 de 47”), páginas numeradas y, si se quiere, **filas por página**. En un contenedor estrecho pasa a **Anterior / Siguiente**.',
          anatomy: ['**Resumen de rango** (anunciado al cambiar)', '**Filas por página** (opcional)', '**Páginas numeradas** con primera, última y vecinas (contenedor ancho)', '**Anterior · Página 2 de 5 · Siguiente** (contenedor estrecho)'],
          props: ['`page` empieza en 1. `total` es el total de filas, no de páginas.', '`onPageSizeChange` activa el selector de filas por página (`pageSizeOptions`, por defecto 10 / 25 / 50). Al cambiar el tamaño, el padre vuelve a la página 1.', '`label` nombra la navegación (“Paginación del historial”).'],
          states: ['Página actual (fondo naranja suave + borde) · hover · foco visible · Anterior/Siguiente deshabilitados en los extremos · sin resultados · una sola página.'],
          tokens: [
            ['Página actual', 'selection.bg · selection.border'],
            ['Resumen', 'text.secondary · typeScale.body2 (cifras tabulares)'],
            ['Elementos', '40 px, radius.pill'],
            ['Botones móviles', 'Button secondary md (44 px)'],
          ],
          responsive: ['El cambio entre números y Anterior/Siguiente depende del ancho de su contenedor (560 px) con container query.', 'En móvil los botones miden 44 px y el resumen queda arriba.'],
          a11y: [
            '`<nav>` con nombre; cada página dice “Ir a la página 3”, la actual “Página 2, actual” (`aria-current`).',
            'El resumen es `aria-live="polite"`: el lector anuncia el rango nuevo.',
            'En la variante estrecha, “Página 2 de 5” es texto, no solo posición.',
            'La versión no visible se elimina del árbol de accesibilidad (`display: none`).',
          ],
          content: [
            ['Mostrando 11–20 de 47 · Filas por página · 10 por página', 'Showing 11–20 of 47 · Rows per page · 10 per page'],
            ['Anterior · Siguiente · Página 2 de 5', 'Previous · Next · Page 2 of 5'],
          ],
          example: '**Ejemplo de negocio**: historial de 47 trabajos completados en el mes, de 10 en 10; cambia el tamaño y la página y observa el resumen. En la tabla de agenda se usa con 5 filas por página.',
        }),
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { page: 1, pageSize: 10, total: 47, onPageChange: () => undefined };

export const Interactive: Story = {
  name: 'Interactivo',
  args: base,
  render: () => (
    <Box sx={{ maxWidth: 760 }}>
      <Demo />
    </Box>
  ),
};

export const States: Story = { name: 'Estados', args: base, render: () => <StatesDemo /> };

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: base,
  render: function Render() {
    const t = useT(m);
    return (
      <Showcase>
        <Specimen label={t.history} direction="column" align="stretch">
          <Box sx={{ maxWidth: 760 }}>
            <Demo initialPage={2} />
          </Box>
        </Specimen>
      </Showcase>
    );
  },
};
