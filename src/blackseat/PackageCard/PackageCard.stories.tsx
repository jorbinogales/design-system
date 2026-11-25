import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { getPackage, getPackagesForUnit } from '../../mocks/catalog';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { PackageCard } from './PackageCard';

const premium = getPackage('det-premium')!;

const meta = {
  title: 'Black Seat/Tarjeta de paquete',
  component: PackageCard,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Muestra un paquete de una unidad con lo que incluye, la duración estimada y el precio, y deja elegirlo con una sola acción.',
          anatomy: ['**Nombre** y frase breve', '**Etiqueta “Más elegido”** (opcional) o **marca de elegido**', '**Lista “Incluye”** con marcas de verificación', '**Duración estimada**', '**Precio** (con “Desde” cuando depende de distancia o vehículo)', '**Acción “Elegir paquete”**'],
          props: ['`pkg` es un `ServicePackage` de `src/domain/booking.ts` (los datos viven en `src/mocks/catalog.ts`).', '`selected` y `onSelect(id)` son controlados por la pantalla; el selector es de selección única.', 'La acción es secundaria a propósito: el naranja se reserva para la selección y para “Confirmar reserva”.'],
          states: ['Reposo', 'Foco visible en la acción', 'Presionado', 'Seleccionado: fondo y borde de selección, marca de verificación y acción “Paquete elegido”'],
          tokens: [['Superficie', 'surface.raised'], ['Seleccionado', 'selection.bg · selection.border'], ['Etiqueta popular', 'status.brand.*'], ['Texto de apoyo', 'text.secondary'], ['Precio', 'text.primary (carbón), tabular'], ['Radio', 'radius.lg']],
          responsive: ['Una columna a 390 px; en escritorio se coloca en una cuadrícula de tres.', 'El precio y la acción bajan de línea si no caben (390 px con textos largos en inglés).'],
          a11y: ['La acción lleva el nombre del paquete en su nombre accesible y `aria-pressed` con el estado de selección.', 'La lista de inclusiones es una lista real con nombre de sección.', 'La selección se comunica con texto y marca, no solo con color.'],
          content: [['Elegir paquete / Paquete elegido', 'Choose package / Package chosen'], ['Duración estimada: ~2 h 30 min', 'Estimated duration: ~2 h 30 min'], ['Más elegido', 'Most chosen']],
          example: '**Ejemplo de negocio**: paquetes de Detailing (Esencial, Premium, Cerámico), Personal Washing y Towing con precios y duraciones de `src/mocks/catalog.ts`.',
        }),
      },
    },
  },
} satisfies Meta<typeof PackageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function Chooser({ unit }: { unit: 'detailing' | 'towing' | 'personal-washing' }) {
  const list = getPackagesForUnit(unit);
  const [value, setValue] = useState<string | null>(list.find((p) => p.popular)?.id ?? null);
  return (
    <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: `repeat(${list.length}, minmax(0, 1fr))` }, width: '100%' }}>
      {list.map((p) => (
        <PackageCard key={p.id} pkg={p} selected={value === p.id} onSelect={setValue} />
      ))}
    </Box>
  );
}

export const Interactive: Story = {
  name: 'Interactivo',
  args: { pkg: premium },
  render: function Render(args) {
    const [selected, setSelected] = useState(false);
    return (
      <Box sx={{ width: 390, maxWidth: '100%' }}>
        <PackageCard {...args} selected={selected} onSelect={() => setSelected((s) => !s)} />
      </Box>
    );
  },
};

export const States: Story = {
  name: 'Estados',
  args: { pkg: premium },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label={l.rest} direction="column" align="stretch">
          <PackageCard pkg={getPackage('det-essential')!} />
        </Specimen>
        <Specimen label={l.selected} direction="column" align="stretch">
          <PackageCard pkg={premium} selected />
        </Specimen>
        <Specimen label="Precio “Desde” / “From” price" direction="column" align="stretch">
          <PackageCard pkg={getPackage('det-ceramic')!} />
        </Specimen>
      </Showcase>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: { pkg: premium },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase>
        <Specimen label={`${l.businessExample} · Detailing`} direction="column" align="stretch">
          <Chooser unit="detailing" />
        </Specimen>
        <Specimen label={`${l.businessExample} · Towing`} direction="column" align="stretch">
          <Chooser unit="towing" />
        </Specimen>
        <Specimen label={`${l.businessExample} · Personal Washing`} direction="column" align="stretch">
          <Chooser unit="personal-washing" />
        </Specimen>
      </Showcase>
    );
  },
};
