import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Price } from './Price';

const m = {
  es: { perVehicle: 'por vehículo', perMile: 'por milla adicional' },
  en: { perVehicle: 'per vehicle', perMile: 'per extra mile' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase>
      <Specimen label={l.sizes}>
        <Price amount={89} size="sm" />
        <Price amount={89} size="md" />
        <Price amount={89} size="lg" />
        <Price amount={89} size="xl" />
      </Specimen>
      <Specimen label={`${l.variants}: desde · descuento · unidad`}>
        <Price amount={49} from />
        <Price amount={53.4} originalAmount={89} size="lg" />
        <Price amount={2.75} unit={t.perMile} size="sm" />
      </Specimen>
      <Specimen label={l.businessExample}>
        <Price amount={185} from unit={t.perVehicle} size="lg" />
        <Price amount={1289.5} size="xl" />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Presentación de datos/Precio',
  component: Price,
  args: { amount: 89, currency: 'USD', size: 'md', from: false },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] } },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Muestra un importe con el formato del idioma activo. El precio va en carbón, nunca en naranja.',
          anatomy: ['**Prefijo** “Desde” (opcional)', '**Importe** con cifras tabulares', '**Precio anterior** tachado (opcional)', '**Unidad** (opcional)'],
          props: ['`amount` en unidades mayores (89.5 = $89.50). `currency` ISO 4217, por defecto USD.', 'Formato vía `formatMoney` de `src/i18n/format.ts` (es-US / en-US).'],
          states: ['Solo presentación: sin estados interactivos.'],
          tokens: [
            ['Importe', 'text.primary · typeScale.price'],
            ['Prefijo, unidad y precio anterior', 'text.secondary · typeScale.body2'],
          ],
          responsive: ['Las partes hacen salto de línea entre sí; el importe nunca se parte (`nowrap`).', '`xl` para totales en recibos y resúmenes; `sm` en filas de tabla.'],
          a11y: ['Con descuento, el lector oye “Ahora $53.40, Antes $89.00”: el tachado no es la única pista.', 'Cifras reales en el DOM (no imágenes ni pseudo-elementos).'],
          content: [
            ['Desde $49.00', 'From $49.00'],
            ['$185.00 por vehículo', '$185.00 per vehicle'],
            ['$2.75 por milla adicional', '$2.75 per extra mile'],
          ],
          example: 'En **Todas las variantes**: tarifa base de Towing “Desde $185.00 por vehículo” y un total de recibo de $1,289.50.',
        }),
      },
    },
  },
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo' };
export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
