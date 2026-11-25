import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useLocale } from '../../i18n/locale';
import { getDayState } from '../../mocks/availability';
import { auctionYards, mockToday } from '../../mocks/catalog';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { AuctionPickupForm, emptyAuctionPickup, validateAuctionPickup, type AuctionPickupErrors, type AuctionPickupValue } from './AuctionPickupForm';

const filled: AuctionPickupValue = { auction: 'iaa', yardId: 'iaa-miami-north', lot: '04217753', code: '0093', date: mockToday.add(2, 'day') };

function Demo({ initial = emptyAuctionPickup, validateNow = false }: { initial?: AuctionPickupValue; validateNow?: boolean }) {
  const locale = useLocale();
  const [value, setValue] = useState(initial);
  const [errors, setErrors] = useState<AuctionPickupErrors>(validateNow ? validateAuctionPickup(initial, locale) : {});
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <AuctionPickupForm
        value={value}
        onChange={(next) => {
          setValue(next);
          if (Object.keys(errors).length) setErrors(validateAuctionPickup(next, locale));
        }}
        yards={auctionYards}
        errors={errors}
        start={mockToday}
        today={mockToday}
        getDayState={(d) => getDayState(d, 'towing')}
        onSubmit={() => setErrors(validateAuctionPickup(value, locale))}
      />
    </Box>
  );
}

const meta = {
  title: 'Black Seat/Formulario de recogida en subasta',
  component: AuctionPickupForm,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Reúne los datos que Towing necesita para retirar un vehículo comprado en subasta: casa de subastas, patio, número de lote, código de recogida y fecha. Cada identificador tiene su propia etiqueta y conserva los ceros iniciales.',
          anatomy: ['**Subasta** (Copart / IAA)', '**Patio** filtrado por subasta', '**Número de lote** (`CodeField` numérico, cadena)', '**Código de recogida** (`CodeField` numérico, cadena)', '**Fecha de recogida** (`DayStrip`)', '**Ubicación del patio** (`LocationCard` con dirección completa y horario)', '**Continuar** (opcional, si pasas `onSubmit`)'],
          props: ['`value` usa cadenas para lote y código: nunca conviertas a número.', '`errors` viene de `validateAuctionPickup(value, locale)`: lote de 6 a 8 dígitos, código de 4 dígitos, patio y fecha obligatorios.', 'Cambiar de subasta limpia el patio si no pertenece a la nueva subasta.'],
          states: ['Vacío', 'Parcial', 'Completo', 'Error de validación por campo', 'Patio deshabilitado hasta elegir subasta', 'Enviando (botón con progreso)'],
          tokens: [['Campos', 'surface.subtle · border.field'], ['Error', 'status.danger.*'], ['Tarjeta de patio', 'surface.raised · border.subtle'], ['Texto de ayuda', 'text.secondary']],
          responsive: ['Una columna a 390 px con campos de 52 px de alto; en escritorio se limita a un ancho de lectura.', 'El teclado numérico se abre en lote y código (`inputMode="numeric"`).', 'La dirección del patio nunca se trunca.'],
          a11y: ['Cada campo tiene etiqueta visible y ayuda enlazada; los errores se anuncian y llevan icono.', 'Subasta es un grupo de radios con leyenda; la fecha es un grupo de radios con nombre.', 'Orden de foco: subasta, patio, lote, código, fecha, continuar.'],
          content: [['Número de lote · Código de recogida', 'Lot number · Pickup code'], ['El lote debe tener entre 6 y 8 dígitos.', 'The lot must have 6 to 8 digits.'], ['Como aparece en tu factura de la subasta. Conservamos los ceros del inicio.', 'As shown on your auction invoice. We keep the leading zeros.']],
          example: '**Ejemplo de negocio**: IAA Miami North, lote `04217753`, código `0093`: los ceros iniciales se muestran y se conservan al enviar.',
        }),
      },
    },
  },
} satisfies Meta<typeof AuctionPickupForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { value: emptyAuctionPickup, onChange: () => undefined, yards: auctionYards, start: mockToday };

export const Interactive: Story = { name: 'Interactivo', args: base, render: () => <Demo /> };

export const States: Story = {
  name: 'Estados',
  args: base,
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label={`${l.rest} · vacío`} direction="column" align="stretch">
          <Demo />
        </Specimen>
        <Specimen label={`${l.error} · enviado vacío`} direction="column" align="stretch">
          <Demo validateNow />
        </Specimen>
        <Specimen label="Lote inválido / Invalid lot" direction="column" align="stretch">
          <Demo initial={{ ...filled, lot: '4217' }} validateNow />
        </Specimen>
      </Showcase>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: base,
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase>
        <Specimen label={`${l.businessExample} · Towing · IAA Miami North`} direction="column" align="stretch">
          <Demo initial={filled} />
        </Specimen>
      </Showcase>
    );
  },
};
