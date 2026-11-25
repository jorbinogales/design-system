import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { businessUnits, type BusinessUnit } from '../../domain/units';
import { getUnit } from '../../mocks/catalog';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { BusinessUnitCard } from './BusinessUnitCard';

const meta = {
  title: 'Black Six/Tarjeta de unidad de negocio',
  component: BusinessUnitCard,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Presenta una de las tres unidades de Black Six (Detailing, Towing, Personal Washing) en Inicio y en el selector de servicio. El nombre siempre es texto: la unidad se distingue sin depender de la foto ni del color.',
          anatomy: ['**Fotografía** con respaldo de unidad (`Media`)', '**Etiqueta de lugar** sobre la foto: En nuestros centros · Recogida en subasta · A domicilio', '**Icono y nombre** de la unidad', '**Descripción breve**', '**Precio “Desde”** (opcional)', '**Acción “Explorar”** (opcional, solo cuando la tarjeta es interactiva)'],
          props: ['`variant="hero"` (Inicio): foto 3:2 arriba y texto debajo. `variant="compact"`: miniatura de 76 px a la izquierda, descripción en dos líneas.', 'Pasa `onSelect` o `href` para volverla interactiva; con `selected` usa los tokens de selección.', '`photoSrc` solo admite activos locales; sin foto se dibuja el respaldo con el icono de la unidad.'],
          states: ['Reposo', 'Hover (solo puntero): borde fuerte', 'Foco visible: anillo de foco', 'Presionado: escala 0.99', 'Seleccionado: fondo y borde de selección', 'Sin foto: respaldo con icono'],
          tokens: [['Superficie', 'surface.raised'], ['Borde', 'border.subtle · border.strong (hover)'], ['Seleccionada', 'selection.bg · selection.border'], ['Texto secundario', 'text.secondary'], ['Enlace “Explorar”', 'text.link'], ['Radio', 'radius.lg']],
          responsive: ['La tarjeta ocupa el ancho del contenedor: una columna en 390 px, tres columnas en escritorio dentro de una cuadrícula.', 'El texto largo se envuelve; en `compact` la descripción se corta a dos líneas.'],
          a11y: ['Cuando es interactiva, toda la tarjeta es un solo botón o enlace con el nombre de la unidad como nombre accesible.', 'La foto lleva `alt` descriptivo; el respaldo expone `role="img"`.', 'La selección se anuncia con `aria-pressed`; no depende solo del color (borde + fondo).'],
          content: [['Detailing · Limpieza profunda, pulido y protección de pintura e interiores.', 'Detailing · Deep cleaning, polishing and protection for paint and interiors.'], ['Recogida en subasta', 'Auction pickup'], ['Explorar', 'Explore']],
          example: '**Ejemplo de negocio**: la historia “Ejemplo de negocio” muestra Home con las tres unidades (hero) y el selector compacto de servicio con Towing elegido.',
        }),
      },
    },
  },
} satisfies Meta<typeof BusinessUnitCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { unit: 'detailing', variant: 'hero', fromPrice: 89, onSelect: () => undefined },
  render: (args) => (
    <Box sx={{ width: 350, maxWidth: '100%' }}>
      <BusinessUnitCard {...args} />
    </Box>
  ),
};

export const Variants: Story = {
  name: 'Variantes',
  args: { unit: 'detailing' },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        {businessUnits.map((u) => (
          <Specimen key={u} label={`Hero · ${l.fallback}`} direction="column" align="stretch">
            <BusinessUnitCard unit={u} fromPrice={getUnit(u).fromPrice} onSelect={() => undefined} />
          </Specimen>
        ))}
        <Specimen label="Compact" direction="column" align="stretch">
          {businessUnits.map((u) => (
            <BusinessUnitCard key={u} unit={u} variant="compact" fromPrice={getUnit(u).fromPrice} onSelect={() => undefined} />
          ))}
        </Specimen>
      </Showcase>
    );
  },
};

function ChooserDemo() {
  const [value, setValue] = useState<BusinessUnit>('towing');
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: 390, maxWidth: '100%' }}>
      {businessUnits.map((u) => (
        <BusinessUnitCard key={u} unit={u} variant="compact" selected={value === u} onSelect={setValue} fromPrice={getUnit(u).fromPrice} />
      ))}
    </Box>
  );
}

export const States: Story = {
  name: 'Estados',
  args: { unit: 'towing' },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label={l.rest} direction="column" align="stretch">
          <BusinessUnitCard unit="towing" variant="compact" onSelect={() => undefined} />
        </Specimen>
        <Specimen label={l.selected} direction="column" align="stretch">
          <BusinessUnitCard unit="towing" variant="compact" selected onSelect={() => undefined} />
        </Specimen>
        <Specimen label="Estático / Static" direction="column" align="stretch">
          <BusinessUnitCard unit="personal-washing" variant="compact" />
        </Specimen>
      </Showcase>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: { unit: 'detailing' },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase>
        <Specimen label={`${l.businessExample} · Home (hero)`} direction="column" align="stretch">
          <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, width: '100%' }}>
            {businessUnits.map((u) => (
              <BusinessUnitCard key={u} unit={u} fromPrice={getUnit(u).fromPrice} href="#" />
            ))}
          </Box>
        </Specimen>
        <Specimen label={`${l.businessExample} · Selector de servicio`} direction="column" align="stretch">
          <ChooserDemo />
        </Specimen>
      </Showcase>
    );
  },
};
