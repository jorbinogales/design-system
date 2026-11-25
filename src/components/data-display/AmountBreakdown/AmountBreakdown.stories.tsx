import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { AmountBreakdown } from './AmountBreakdown';

const m = {
  es: { full: 'Detailing Completo · SUV', engine: 'Limpieza de motor', tires: 'Brillo de llantas', promo: 'Promoción SEMANA40', fees: 'Impuestos y cargos', note: 'Se cobrará a Visa •••• 4821 al terminar el servicio.', tow: 'Recogida en Copart Miami Norte', miles: 'Millas adicionales', milesDetail: '12 mi × $2.75', storage: 'Almacenaje en subasta', delivery: 'Entrega en Doral' },
  en: { full: 'Full Detailing · SUV', engine: 'Engine bay cleaning', tires: 'Tire shine', promo: 'WEEK40 promotion', fees: 'Taxes and fees', note: 'Visa •••• 4821 will be charged when the service is done.', tow: 'Pickup at Copart Miami North', miles: 'Extra miles', milesDetail: '12 mi × $2.75', storage: 'Auction storage', delivery: 'Delivery in Doral' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Box sx={{ width: 358 }}>
      <Showcase>
        <Specimen label={`${l.businessExample} · Detailing`} direction="column" align="stretch">
          <AmountBreakdown
            lines={[
              { label: t.full, amount: 149 },
              { label: t.engine, amount: 24 },
              { label: t.tires, amount: 12 },
              { label: t.promo, amount: 40, kind: 'discount' },
              { label: t.fees, amount: 10.15 },
            ]}
            total={155.15}
            note={t.note}
          />
        </Specimen>
        <Specimen label={`${l.compact} · Towing`} direction="column" align="stretch">
          <AmountBreakdown
            density="compact"
            lines={[
              { label: t.tow, amount: 185 },
              { label: t.miles, amount: 33, detail: t.milesDetail },
              { label: t.storage, amount: 0, kind: 'free' },
              { label: t.delivery, amount: 0, kind: 'free' },
            ]}
            total={218}
          />
        </Specimen>
      </Showcase>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Presentación de datos/Desglose de importes',
  component: AmountBreakdown,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Detalla los conceptos de una reserva o recibo y su total, como en Resumen de la reserva y Recibo.',
          anatomy: ['**Líneas**: concepto, detalle (opcional) e importe', '**Descuentos** “−$X” en tono éxito', '**Línea discontinua**', '**Total** destacado', '**Nota** (opcional)'],
          props: ['Importes positivos en unidades mayores; `kind: "discount"` resta visualmente y `"free"` muestra “Gratis”.', 'El componente no suma: `total` lo calcula el negocio (impuestos, redondeos).'],
          states: ['Solo presentación.'],
          tokens: [
            ['Concepto', 'text.secondary'],
            ['Importe', 'text.primary 600, cifras tabulares'],
            ['Descuento / gratis', 'status.success.fg'],
            ['Separador', 'border.subtle (discontinuo)'],
            ['Total', 'typeScale.h4 · typeScale.price'],
          ],
          responsive: ['Los conceptos largos hacen salto de línea; los importes nunca se parten.', '`compact` en paneles de escritorio.'],
          a11y: ['`<dl>` por línea; el descuento se anuncia como “Descuento $40.00” (el signo menos no se lee de forma fiable).', 'El total es texto real, no imagen.'],
          content: [
            ['Impuestos y cargos', 'Taxes and fees'],
            ['Promoción SEMANA40', 'WEEK40 promotion'],
            ['Se cobrará a Visa •••• 4821 al terminar el servicio.', 'Visa •••• 4821 will be charged when the service is done.'],
          ],
          example: 'En **Todas las variantes**: una reserva de Detailing con promoción y una recogida de Towing con millas adicionales.',
        }),
      },
    },
  },
} satisfies Meta<typeof AmountBreakdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', args: { lines: [], total: 0 }, render: () => <AllDemo /> };
