import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../i18n/locale';
import { getBookingDetail } from '../../mocks/bookings';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { bs } from '../../theme/theme';
import { BookingSummary, type SummaryField } from './BookingSummary';

const detailing = getBookingDetail('BS-24117');

const m = {
  es: { editing: (f: string) => `Corregir: ${f}`, none: 'Toca “Cambiar” en una fila para corregirla.' },
  en: { editing: (f: string) => `Correcting: ${f}`, none: 'Tap “Change” on a row to correct it.' },
};

function Demo({ id, editable = true }: { id: string; editable?: boolean }) {
  const t = useT(m);
  const [field, setField] = useState<SummaryField | null>(null);
  return (
    <Box sx={{ width: 390, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <BookingSummary booking={getBookingDetail(id)} onEdit={editable ? setField : undefined} />
      {editable && (
        <Typography variant="caption" role="status" sx={{ color: bs.text.secondary }}>
          {field ? t.editing(field) : t.none}
        </Typography>
      )}
    </Box>
  );
}

const meta = {
  title: 'Black Seat/Resumen de reserva',
  component: BookingSummary,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Último repaso antes de confirmar: qué se reserva, cuándo, dónde, con quién y cuánto cuesta. **Cada dato se puede corregir** sin volver a empezar.',
          anatomy: ['**Servicio**: unidad, paquete y duración', '**Fecha y hora** con término aproximado', '**Ubicación** completa (o **Entrega** en Towing)', '**Recogida en subasta** (solo Towing): patio, lote y código', '**Vehículo**', '**Responsable** o “Pendiente de asignación”', '**Método de pago**', '**Desglose de importes** y total (opcional con `hideAmounts`)'],
          props: ['`booking` es un `BookingDetail` (ver `src/domain/booking.ts`, `getBookingDetail` en `src/mocks/bookings.ts`).', '`onEdit(field)` activa una acción “Cambiar” por fila editable; el responsable no se edita aquí.', 'La pantalla decide cómo se corrige (hoja inferior o regreso al paso); el componente solo avisa qué fila.'],
          states: ['Editable (con “Cambiar”)', 'Solo lectura (sin acciones)', 'Sin responsable (pendiente de asignación)', 'Towing con subasta, lote y código', 'Descuento aplicado en el desglose'],
          tokens: [['Tarjeta', 'surface.raised · border.subtle'], ['Etiqueta de fila', 'text.secondary'], ['Separadores', 'border.subtle'], ['Acción de fila', 'action.secondary / text.link (Button quiet)'], ['Precios', 'text.primary (carbón)']],
          responsive: ['Una columna a 390 px; la dirección completa se envuelve (`overflow-wrap: anywhere`).', 'En escritorio ocupa una columna lateral junto al formulario.', 'Lote y código se muestran con cifras tabulares y cero tachado.'],
          a11y: ['Cada fila es un grupo con nombre; la acción dice “Cambiar fecha y hora”, “Cambiar vehículo”, etc.', 'El orden de foco sigue el orden visual.', 'El total se anuncia como parte del desglose.'],
          content: [['Pendiente de asignación', 'Awaiting assignment'], ['Cambiar fecha y hora', 'Change date and time'], ['Total a pagar', 'Total to pay']],
          example: '**Ejemplo de negocio**: BS-24117 (Detailing Premium con cupón BIENVENIDA, sin responsable, pago por Zelle pendiente) y BS-24120 (Towing con subasta Copart, lote 05503318, código 0071).',
        }),
      },
    },
  },
} satisfies Meta<typeof BookingSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = { name: 'Interactivo', args: { booking: detailing }, render: () => <Demo id="BS-24117" /> };

export const States: Story = {
  name: 'Estados',
  args: { booking: detailing },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label={l.readOnly} direction="column" align="stretch">
          <Demo id="BS-24118" editable={false} />
        </Specimen>
        <Specimen label="Sin responsable / No assignee" direction="column" align="stretch">
          <Demo id="BS-24117" />
        </Specimen>
      </Showcase>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: { booking: detailing },
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase>
        <Specimen label={`${l.businessExample} · Towing`} direction="column" align="stretch">
          <Demo id="BS-24120" />
        </Specimen>
        <Specimen label={`${l.businessExample} · Personal Washing`} direction="column" align="stretch">
          <Demo id="BS-24118" />
        </Specimen>
      </Showcase>
    );
  },
};
