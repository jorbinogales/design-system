import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Select } from './Select';

const m = {
  es: { make: 'Marca del vehículo', ph: 'Elige una marca', type: 'Tipo de vehículo', typePh: 'Elige el tipo', sedan: 'Sedán', suv: 'SUV', truck: 'Pickup', van: 'Van', moto: 'Motocicleta', error: 'Elige el tipo para calcular el precio.', unit: 'Unidad', help: 'En móvil usa la lista nativa del sistema.' },
  en: { make: 'Vehicle make', ph: 'Choose a make', type: 'Vehicle type', typePh: 'Choose the type', sedan: 'Sedan', suv: 'SUV', truck: 'Pickup truck', van: 'Van', moto: 'Motorcycle', error: 'Choose the type to calculate the price.', unit: 'Unit', help: "On mobile it uses the system's native list." },
};

const makes = ['Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Nissan', 'Tesla', 'Toyota'].map((x) => ({ value: x.toLowerCase(), label: x }));

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [make, setMake] = useState('toyota');
  const [type, setType] = useState('');
  const [unit, setUnit] = useState('towing');
  const types = [
    { value: 'sedan', label: t.sedan },
    { value: 'suv', label: t.suv },
    { value: 'truck', label: t.truck },
    { value: 'van', label: t.van },
    { value: 'moto', label: t.moto, disabled: true },
  ];
  return (
    <Showcase maxWidth={390}>
      <Specimen label={l.rest} direction="column" align="stretch">
        <Select label={t.make} placeholder={t.ph} options={makes} value={make} onChange={setMake} required />
      </Specimen>
      <Specimen label={l.error} direction="column" align="stretch">
        <Select label={t.type} placeholder={t.typePh} options={types} value={type} onChange={setType} error={t.error} />
      </Specimen>
      <Specimen label={`native · ${l.businessExample}`} direction="column" align="stretch">
        <Select native label={t.unit} helperText={t.help} options={[{ value: 'detailing', label: 'Detailing' }, { value: 'towing', label: 'Towing' }, { value: 'personal-washing', label: 'Personal Washing' }]} value={unit} onChange={setUnit} />
      </Specimen>
      <Specimen label={l.disabled} direction="column" align="stretch">
        <Select label={t.make} options={makes} value="honda" onChange={() => undefined} disabled />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Selección/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Elige una opción de una lista demasiado larga para radios: marca, tipo de vehículo, unidad.',
          anatomy: ['Mismo campo que Campo de texto con **flecha**', '**Menú** de opciones (o lista nativa)'],
          props: ['`options`, `value`, `onChange`, `placeholder`. `native` usa `<select>` del sistema (recomendado en móvil para listas simples).', 'Con más de ~15 opciones o búsqueda, usa Combobox.'],
          states: ['Los del campo + menú abierto · opción enfocada (`action.hover`) · seleccionada (`selection.bg`) · opción deshabilitada.'],
          tokens: [
            ['Campo', 'tokens de Campo de texto'],
            ['Menú', 'surface.raised · elevation.e2 · border.subtle · radius.md'],
            ['Opción seleccionada', 'selection.bg'],
          ],
          responsive: ['Móvil: `native` abre el selector del sistema. Escritorio: menú con teclado.'],
          a11y: ['Patrón combobox/listbox de MUI: flechas, Enter, Escape, escribir para saltar.', 'Placeholder no sustituye a la etiqueta.'],
          content: [
            ['Marca del vehículo · Elige una marca', 'Vehicle make · Choose a make'],
            ['Elige el tipo para calcular el precio.', 'Choose the type to calculate the price.'],
          ],
          example: 'En **Todas las variantes**, datos del vehículo para una reserva y la unidad de negocio en lista nativa.',
        }),
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', args: { label: '', options: [], value: '', onChange: () => undefined }, render: () => <AllDemo /> };
