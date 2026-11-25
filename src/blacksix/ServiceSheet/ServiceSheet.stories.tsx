import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLocale } from '../../i18n/locale';
import { getCategoryName, getCenter, getServiceOffering, getUnit } from '../../mocks/catalog';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { formatAddress } from '../../components/address/LocationCard/LocationCard';
import type { BusinessUnit } from '../../domain/units';
import { ServiceSheet } from './ServiceSheet';

const detailing = getServiceOffering('detailing');

function Sheet({ unit, action }: { unit: BusinessUnit; action?: 'inline' | 'none' }) {
  const locale = useLocale();
  const service = getServiceOffering(unit);
  const center = getCenter('c-doral')!;
  const place =
    service.place === 'center'
      ? `${center.name}, ${formatAddress(center.address)}`
      : service.place === 'auction-yard'
        ? locale === 'es'
          ? 'Patios de Copart e IAA en el sur de Florida'
          : 'Copart and IAA yards in South Florida'
        : locale === 'es'
          ? 'En tu casa, oficina o estacionamiento'
          : 'At your home, office or parking lot';
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <ServiceSheet service={service} fromPrice={getUnit(unit).fromPrice} categoryLabels={service.categories.map((c) => getCategoryName(c, locale))} placeLabel={place} action={action} onChooseTime={() => undefined} />
    </Box>
  );
}

const meta = {
  title: 'Black Six/Ficha de servicio',
  component: ServiceSheet,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Página de detalle de un servicio antes de reservar: qué es, qué cubre, cuándo se atiende y cuánto cuesta, con la acción “Elegir horario”.',
          anatomy: ['**Imagen** con respaldo de unidad y etiqueta de la unidad', '**Nombre**, **categorías** (opcional) y **descripción**', '**Dónde** ocurre (opcional)', '**Qué incluye** y **Qué no incluye** (alcance)', '**Horario de atención** por día', '**Precio “Desde”** y **Elegir horario** (la acción puede delegarse a una `BottomActionBar`)'],
          props: ['`service` es un `ServiceOffering` (ver `src/domain/booking.ts`).', '`action="none"` oculta el pie para que la pantalla use `BottomActionBar` pegajosa.', '`categoryLabels` y `placeLabel` llegan ya localizados.'],
          states: ['Reposo', 'Foco visible en la acción', 'Sin foto: respaldo de unidad', 'Día cerrado: la fila de horario dice “Cerrado”'],
          tokens: [['Texto', 'text.primary'], ['Descripción y “No incluye”', 'text.secondary'], ['Separador del pie', 'border.subtle'], ['Acción', 'action.primary.* (único naranja sólido)'], ['Radio de imagen', 'radius.lg']],
          responsive: ['Una columna a 390 px con 20 px de margen; en escritorio se centra con ancho de lectura.', 'El pie pasa a dos líneas si el precio y la acción no caben.'],
          a11y: ['Cada bloque es una sección con encabezado; las listas son listas reales.', '“No incluye” usa icono de cierre y texto secundario: el significado no depende del color.', 'La imagen tiene texto alternativo.'],
          content: [['Elegir horario', 'Choose a time'], ['Cerrado', 'Closed'], ['Qué no incluye', 'What is not included']],
          example: '**Ejemplo de negocio**: Detailing en el centro Black Six Doral, Towing con recogida en subasta y Personal Washing a domicilio.',
        }),
      },
    },
  },
} satisfies Meta<typeof ServiceSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { service: detailing, fromPrice: 89 },
  render: () => <Sheet unit="detailing" />,
};

export const States: Story = {
  name: 'Estados',
  args: { service: detailing, fromPrice: 89 },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label={`${l.fallback} · acción en línea`} direction="column" align="stretch">
          <Sheet unit="personal-washing" />
        </Specimen>
        <Specimen label="Sin acción (la pantalla pone la BottomActionBar) / No action" direction="column" align="stretch">
          <Sheet unit="detailing" action="none" />
        </Specimen>
      </Showcase>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: { service: detailing, fromPrice: 89 },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase>
        <Specimen label={`${l.businessExample} · Towing`} direction="column" align="stretch">
          <Sheet unit="towing" />
        </Specimen>
      </Showcase>
    );
  },
};
