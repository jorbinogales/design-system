import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { RadioGroup } from './Radio';

const m = {
  es: { service: 'Servicio', express: 'Lavado Express · $35.00', expressD: 'Exterior a mano. 40 min.', full: 'Detailing Completo · $149.00', fullD: 'Interior y exterior, pulido de un paso. 3 h.', ceramic: 'Pulido Cerámico Premium · $489.00', ceramicD: 'Disponible desde el lunes.', payment: 'Método de pago', card: 'Tarjeta', cash: 'Efectivo al terminar', error: 'Elige un servicio para continuar.', size: 'Tamaño', sedan: 'Sedán', suv: 'SUV', truck: 'Pickup' },
  en: { service: 'Service', express: 'Express Wash · $35.00', expressD: 'Hand exterior wash. 40 min.', full: 'Full Detailing · $149.00', fullD: 'Inside and out, one-step polish. 3 h.', ceramic: 'Premium Ceramic Polish · $489.00', ceramicD: 'Available from Monday.', payment: 'Payment method', card: 'Card', cash: 'Cash when done', error: 'Pick a service to continue.', size: 'Size', sedan: 'Sedan', suv: 'SUV', truck: 'Pickup truck' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [svc, setSvc] = useState<string | null>('full');
  const [pay, setPay] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>('suv');
  return (
    <Showcase maxWidth={390}>
      <Specimen label={`${l.businessExample} · selección única de servicio`} direction="column" align="stretch">
        <RadioGroup
          label={t.service}
          value={svc}
          onChange={setSvc}
          required
          options={[
            { value: 'express', label: t.express, description: t.expressD },
            { value: 'full', label: t.full, description: t.fullD },
            { value: 'ceramic', label: t.ceramic, description: t.ceramicD, disabled: true },
          ]}
        />
      </Specimen>
      <Specimen label={l.error} direction="column" align="stretch">
        <RadioGroup label={t.payment} value={pay} onChange={setPay} error={t.error} options={[{ value: 'card', label: t.card }, { value: 'cash', label: t.cash }]} />
      </Specimen>
      <Specimen label="horizontal" direction="column" align="stretch">
        <RadioGroup label={t.size} orientation="horizontal" value={size} onChange={setSize} options={[{ value: 'sedan', label: t.sedan }, { value: 'suv', label: t.suv }, { value: 'truck', label: t.truck }]} />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Selección/Radio',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Selección única entre 2–6 opciones visibles. El servicio se elige con selección única.',
          anatomy: ['**Leyenda** (la pregunta)', '**Opciones**: círculo, etiqueta y descripción (opcional)', '**Ayuda** o **error**'],
          props: ['`RadioGroup` (recomendado) recibe `options`, `value`, `onChange`; `Radio` suelto para composiciones propias (p. ej. dentro de una Tarjeta de paquete).', '`orientation="horizontal"` solo con etiquetas cortas.'],
          states: ['Reposo (borde `border.strong`) · hover · foco visible · seleccionado (anillo y punto naranja) · deshabilitado · error del grupo.'],
          tokens: [
            ['Anillo', 'border.strong → selection.border'],
            ['Punto', 'selection.border'],
            ['Leyenda', 'typeScale.label'],
            ['Foco', 'focus.ring'],
          ],
          responsive: ['Vertical en móvil. Horizontal hace salto de línea si no cabe.'],
          a11y: ['`<fieldset>` + `<legend>`; flechas mueven la selección dentro del grupo.', 'Seleccionado = punto interior (forma) además del color.', 'Error del grupo anunciado (`role="alert"`).'],
          content: [
            ['Detailing Completo · $149.00', 'Full Detailing · $149.00'],
            ['Elige un servicio para continuar.', 'Pick a service to continue.'],
          ],
          example: 'En **Todas las variantes**, el cliente elige el paquete de Detailing; uno está deshabilitado con su motivo.',
        }),
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', args: { label: '', options: [], value: null, onChange: () => undefined }, render: () => <AllDemo /> };
