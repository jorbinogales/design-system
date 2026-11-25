import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { PhoneField } from './PhoneField';

const m = {
  es: { help: 'El profesional te escribirá aquí cuando vaya en camino.', error: 'Faltan dígitos: un número de EE. UU. tiene 10.', contact: 'Teléfono de contacto en la subasta' },
  en: { help: 'The professional will text you here when on the way.', error: 'Digits missing: a US number has 10.', contact: 'Contact phone at the auction' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [v, setV] = useState('');
  return (
    <Showcase maxWidth={390}>
      <Specimen label={`${l.required} · helper`} direction="column" align="stretch">
        <PhoneField required helperText={t.help} value={v} onChange={(e) => setV(e.target.value)} clearable onClear={() => setV('')} />
      </Specimen>
      <Specimen label={l.error} direction="column" align="stretch">
        <PhoneField required defaultValue="(305) 555-01" error={t.error} />
      </Specimen>
      <Specimen label={`${l.optional} · ${l.businessExample}`} direction="column" align="stretch">
        <PhoneField label={t.contact} optional defaultValue="(786) 555-0199" />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Campos/Teléfono',
  component: PhoneField,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Captura un teléfono móvil para avisos de llegada y coordinación de la recogida.',
          anatomy: ['**Etiqueta** “Teléfono móvil”', '**Prefijo** de país fijo (+1 por defecto)', '**Número** con placeholder de ejemplo'],
          props: ['`countryCode` cambia el prefijo. Configura `type="tel"`, `inputMode="tel"`, `autoComplete="tel-national"`.'],
          states: ['Los de Campo de texto.'],
          tokens: [
            ['Campo', 'tokens de Campo de texto'],
            ['Prefijo', 'text.primary 600'],
          ],
          responsive: ['El teclado móvil numérico aparece al enfocar. El prefijo no se borra ni se edita.'],
          a11y: ['El prefijo es texto visible; el nombre accesible es la etiqueta.', 'Error con el motivo concreto (“Faltan dígitos…”).'],
          content: [
            ['Teléfono móvil', 'Mobile phone'],
            ['El profesional te escribirá aquí cuando vaya en camino.', 'The professional will text you here when on the way.'],
            ['Teléfono de contacto en la subasta (opcional)', 'Contact phone at the auction (optional)'],
          ],
          example: 'En **Todas las variantes**, el teléfono de contacto opcional para una recogida de Towing.',
        }),
      },
    },
  },
} satisfies Meta<typeof PhoneField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
