import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { getBookingDetail, getReceipt } from '../../mocks/bookings';
import { paymentMethods } from '../../mocks/catalog';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { PaymentPanel } from './PaymentPanel';

const pending = getBookingDetail('BS-24117');
const receipt = getReceipt('BS-24090')!;

function Checkout({ initial = 'pm-card', status = 'pending' as const, reference }: { initial?: string; status?: 'pending' | 'failed' | 'paid'; reference?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <PaymentPanel methods={paymentMethods} value={value} onChange={setValue} lines={pending.lines} total={pending.total} status={status} reference={reference} />
    </Box>
  );
}

const meta = {
  title: 'Black Six/Método de pago y comprobante',
  component: PaymentPanel,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Elegir cómo pagar, ver el importe y el estado del pago, y después consultar el comprobante con su referencia. En pagos en línea, los datos sensibles de la tarjeta pertenecen al proveedor de pagos.',
          anatomy: ['**Selector de método** (selección única con descripción)', '**Contenedor de campos seguros** rotulado, con candado (solo tarjeta)', '**Aviso** para métodos sin cobro en línea (Zelle, efectivo)', '**Importe**: desglose y total', '**Estado del pago** (insignia) y **referencia** (`IdentifierBlock`)', '**Modo comprobante**: estado, referencia, método, fecha de emisión y desglose'],
          props: ['`mode="checkout"` (defecto) o `"receipt"`. En receipt no hay selector; `issuedAt` y `reference` completan el comprobante.', '`secureFields` es el lugar donde el proveedor monta sus campos. **No hay `<input>` propios de número de tarjeta, vencimiento ni CVC.** Sin `secureFields` se dibuja un marcador no interactivo.', 'La decisión de negocio sobre si elegir un método confirma la reserva queda pendiente; el componente solo muestra el estado de pago.'],
          states: ['Pago pendiente', 'Pago fallido (reintentar o cambiar método)', 'Pagado con referencia', 'Método sin cobro en línea', 'Comprobante'],
          tokens: [['Contenedor seguro', 'surface.raised · border.strong (punteado)'], ['Marcadores de campo', 'surface.subtle · border.field'], ['Estado', 'status.*.bg/fg/border'], ['Referencia', 'IdentifierBlock (surface.subtle)']],
          responsive: ['Una columna a 390 px; en escritorio el selector y el resumen pueden ir en dos columnas.', 'Los textos largos del método y su descripción se envuelven.'],
          a11y: ['El selector es un grupo de radios con leyenda “Método de pago”.', 'El contenedor seguro es un `group` con nombre explícito.', 'La referencia se copia con un botón con confirmación anunciada.', 'El estado del pago es texto + icono.'],
          content: [['Método de pago', 'Payment method'], ['Estos campos los muestra y procesa el proveedor de pagos.', 'These fields are shown and processed by the payment provider.'], ['El pago queda pendiente', 'Payment stays pending']],
          example: '**Ejemplo de negocio**: BS-24117 con tarjeta, Zelle o efectivo y, en modo comprobante, el lavado BS-24090 pagado con la referencia PAY-9F4K2L.',
        }),
      },
    },
  },
} satisfies Meta<typeof PaymentPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { methods: paymentMethods, value: 'pm-card', lines: pending.lines, total: pending.total, status: 'pending' as const };

export const Interactive: Story = { name: 'Interactivo', args: base, render: () => <Checkout /> };

export const States: Story = {
  name: 'Estados',
  args: base,
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label="Tarjeta · campos seguros del proveedor" direction="column" align="stretch">
          <Checkout />
        </Specimen>
        <Specimen label="Zelle · pago pendiente" direction="column" align="stretch">
          <Checkout initial="pm-zelle" />
        </Specimen>
        <Specimen label={`${l.error} · pago fallido`} direction="column" align="stretch">
          <Checkout status="failed" />
        </Specimen>
        <Specimen label="Pagado con referencia / Paid with reference" direction="column" align="stretch">
          <Checkout status="paid" reference="PAY-9F4K2L" />
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
      <Showcase maxWidth={390}>
        <Specimen label={`${l.businessExample} · Comprobante (BS-24090, Personal Washing)`} direction="column" align="stretch">
          <PaymentPanel mode="receipt" methods={paymentMethods} value={receipt.methodId} lines={receipt.lines} total={receipt.total} status={receipt.status} reference={receipt.reference} issuedAt={receipt.issuedAt} />
        </Specimen>
        <Specimen label="Comprobante con pago pendiente / Pending receipt" direction="column" align="stretch">
          <PaymentPanel mode="receipt" methods={paymentMethods} value={pending.payment.methodId} lines={pending.lines} total={pending.total} status="pending" />
        </Specimen>
      </Showcase>
    );
  },
};
