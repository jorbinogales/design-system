import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Checkbox } from './Checkbox';

const m = {
  es: { tires: 'Brillo de llantas · +$12.00', engine: 'Limpieza de motor · +$24.00', engineDesc: 'Desengrasado y protección de plásticos. 30 min.', terms: 'Acepto los términos del servicio', termsError: 'Debes aceptar los términos para confirmar la reserva.', all: 'Seleccionar todos los trabajos', keys: 'Llaves entregadas por la subasta', disabled: 'Encerado a mano (no disponible para motos)' },
  en: { tires: 'Tire shine · +$12.00', engine: 'Engine bay cleaning · +$24.00', engineDesc: 'Degreasing and trim protection. 30 min.', terms: 'I accept the terms of service', termsError: 'You need to accept the terms to confirm the booking.', all: 'Select all jobs', keys: 'Keys handed over by the auction', disabled: 'Hand wax (not available for motorcycles)' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <Showcase maxWidth={390}>
      <Specimen label={`${l.businessExample} · extras de Detailing`} direction="column" align="stretch">
        <Checkbox label={t.tires} checked={a} onChange={(_, v) => setA(v)} />
        <Checkbox label={t.engine} description={t.engineDesc} checked={b} onChange={(_, v) => setB(v)} />
      </Specimen>
      <Specimen label={`indeterminado · ${l.operator}`} direction="column" align="stretch">
        <Checkbox label={t.all} indeterminate checked={false} onChange={() => undefined} />
        <Checkbox label={t.keys} defaultChecked />
      </Specimen>
      <Specimen label={l.error} direction="column" align="stretch">
        <Checkbox label={t.terms} error={t.termsError} required />
      </Specimen>
      <Specimen label={l.disabled} direction="column" align="stretch">
        <Checkbox label={t.disabled} disabled />
        <Checkbox label={t.keys} disabled checked />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Selección/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Selección múltiple e independiente: extras de un servicio, aceptar términos, marcar trabajos en la bandeja.',
          anatomy: ['**Casilla** de 20 px en un área táctil de 44 px', '**Etiqueta**', '**Descripción** (opcional)', '**Error** (opcional)'],
          props: ['Hereda las props de MUI Checkbox (`checked`, `onChange`, `indeterminate`, `required`). Añade `label`, `description` y `error`.'],
          states: ['Reposo (borde `border.strong`) · hover (puntero) · foco visible · marcado (relleno naranja, check carbón) · indeterminado · error · deshabilitado.'],
          tokens: [
            ['Borde', 'border.strong'],
            ['Relleno marcado', 'brand.primary'],
            ['Check', 'action.primary.fg (#111111)'],
            ['Deshabilitado', 'disabled.*'],
            ['Foco', 'focus.ring'],
          ],
          responsive: ['La etiqueta completa es área de toque. Textos largos hacen salto de línea alineados al texto, no bajo la casilla.'],
          a11y: ['`<input type="checkbox">` nativo con `<label>`; Espacio alterna.', 'Descripción y error enlazados con `aria-describedby`; error anunciado.', 'Marcado = relleno + check (forma), no solo color.'],
          content: [
            ['Brillo de llantas · +$12.00', 'Tire shine · +$12.00'],
            ['Debes aceptar los términos para confirmar la reserva.', 'You need to accept the terms to confirm the booking.'],
          ],
          example: 'En **Todas las variantes**: extras de una reserva de Detailing y las llaves entregadas en una recogida de Towing.',
        }),
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', args: { label: '' }, render: () => <AllDemo /> };
