import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { EmailField } from './EmailField';

const m = {
  es: { help: 'Te enviaremos aquí la confirmación y el recibo.', error: 'Falta la @. Ejemplo: mariana@correo.com', billing: 'Correo de facturación' },
  en: { help: "We'll send the confirmation and receipt here.", error: 'The @ is missing. Example: mariana@mail.com', billing: 'Billing email' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [v, setV] = useState('mariana.lopez@correo.com');
  return (
    <Showcase maxWidth={390}>
      <Specimen label={`${l.required} · helper · clear`} direction="column" align="stretch">
        <EmailField required helperText={t.help} value={v} onChange={(e) => setV(e.target.value)} clearable onClear={() => setV('')} />
      </Specimen>
      <Specimen label={l.error} direction="column" align="stretch">
        <EmailField required defaultValue="mariana.correo.com" error={t.error} />
      </Specimen>
      <Specimen label={`${l.readOnly} · ${l.operator}`} direction="column" align="stretch">
        <EmailField label={t.billing} value="flota@autosdelsur.com" readOnly />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Campos/Correo',
  component: EmailField,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Captura un correo electrónico para la cuenta, la confirmación de la reserva y el recibo.',
          anatomy: ['Igual que Campo de texto, con etiqueta por defecto “Correo electrónico”.'],
          props: ['Configura `type="email"`, `inputMode="email"`, `autoComplete="email"`, sin mayúscula automática ni corrector.'],
          states: ['Los de Campo de texto. Valida al salir del campo o al enviar, no en cada tecla.'],
          tokens: [['Campo', 'tokens de Campo de texto']],
          responsive: ['El teclado móvil muestra @ y punto. Autocompletado del navegador habilitado.'],
          a11y: ['El mensaje de error dice qué falta y da un ejemplo; se anuncia al aparecer.'],
          content: [
            ['Correo electrónico', 'Email'],
            ['Te enviaremos aquí la confirmación y el recibo.', "We'll send the confirmation and receipt here."],
            ['Falta la @. Ejemplo: mariana@correo.com', 'The @ is missing. Example: mariana@mail.com'],
          ],
          example: 'En **Todas las variantes**, el correo de facturación de una flota cliente de Towing en solo lectura.',
        }),
      },
    },
  },
} satisfies Meta<typeof EmailField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
