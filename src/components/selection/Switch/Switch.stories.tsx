import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Switch } from './Switch';

const m = {
  es: { arrival: 'Avisos de llegada', arrivalD: 'Te escribimos cuando el profesional va en camino.', promos: 'Ofertas y promociones', available: 'Disponible para recogidas', availableD: 'Apágalo para no recibir trabajos de Towing hoy.', location: 'Compartir ubicación en ruta (requerido por la operación)' },
  en: { arrival: 'Arrival alerts', arrivalD: "We'll text you when the professional is on the way.", promos: 'Deals and promotions', available: 'Available for pickups', availableD: 'Turn it off to stop receiving Towing jobs today.', location: 'Share location while en route (required by operations)' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);
  return (
    <Showcase maxWidth={390}>
      <Specimen label={l.client} direction="column" align="stretch">
        <Switch label={t.arrival} description={t.arrivalD} checked={a} onChange={setA} />
        <Switch label={t.promos} checked={b} onChange={setB} />
      </Specimen>
      <Specimen label={`${l.operator} · ${l.businessExample}`} direction="column" align="stretch">
        <Switch label={t.available} description={t.availableD} checked={c} onChange={setC} />
      </Specimen>
      <Specimen label={l.disabled} direction="column" align="stretch">
        <Switch label={t.location} checked disabled onChange={() => undefined} />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Selección/Interruptor',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Activa o desactiva un ajuste que se aplica al momento (avisos, disponibilidad del operador). Si el cambio necesita “Guardar”, usa Checkbox.',
          anatomy: ['**Etiqueta** y **descripción** (opcional) a la izquierda', '**Riel** 52×32 con **pulgar**'],
          props: ['`placement="start"` pone el interruptor antes del texto.'],
          states: ['Apagado (riel `border.strong`) · encendido (riel naranja) · foco visible en el riel · deshabilitado.'],
          tokens: [
            ['Riel apagado / encendido', 'border.strong · brand.primary'],
            ['Pulgar', 'blanco con sombra'],
            ['Deshabilitado', 'disabled.border · disabled.bg'],
            ['Foco', 'focus.ring'],
          ],
          responsive: ['Fila completa; la etiqueta es área de toque. Textos largos hacen salto de línea, el interruptor queda arriba a la derecha.'],
          a11y: ['`role="switch"` con estado on/off; Espacio alterna.', 'Encendido = posición del pulgar (forma) además del color.'],
          content: [
            ['Avisos de llegada', 'Arrival alerts'],
            ['Disponible para recogidas', 'Available for pickups'],
          ],
          example: 'En **Todas las variantes**, el operador de Towing marca su disponibilidad del día.',
        }),
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', args: { label: '', checked: false, onChange: () => undefined }, render: () => <AllDemo /> };
