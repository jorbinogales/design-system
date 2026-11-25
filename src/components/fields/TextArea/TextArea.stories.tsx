import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { TextArea } from './TextArea';

const m = {
  es: {
    note: 'Nota para el profesional',
    notePh: 'Ej.: el portón se abre con el código 4821; el auto está en la entrada.',
    noteHelp: 'Visible para quien realice el servicio.',
    access: 'Instrucciones de recogida',
    accessValue: 'Presentar el código de recogida en la ventanilla 3. El vehículo no enciende: llevar batería auxiliar.',
    review: 'Tu reseña',
    reviewError: 'Escribe al menos 20 caracteres para publicar tu reseña.',
  },
  en: {
    note: 'Note for the professional',
    notePh: 'E.g. the gate opens with code 4821; the car is in the driveway.',
    noteHelp: 'Visible to whoever performs the service.',
    access: 'Pickup instructions',
    accessValue: 'Show the pickup code at window 3. The vehicle does not start: bring a jump starter.',
    review: 'Your review',
    reviewError: 'Write at least 20 characters to post your review.',
  },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [note, setNote] = useState('');
  return (
    <Showcase maxWidth={390}>
      <Specimen label={`${l.optional} · ${l.rest} · contador`} direction="column" align="stretch">
        <TextArea label={t.note} optional placeholder={t.notePh} helperText={t.noteHelp} maxLength={280} value={note} onChange={(e) => setNote(e.target.value)} />
      </Specimen>
      <Specimen label={`${l.readOnly} · ${l.businessExample}`} direction="column" align="stretch">
        <TextArea label={t.access} value={t.accessValue} readOnly />
      </Specimen>
      <Specimen label={l.error} direction="column" align="stretch">
        <TextArea label={t.review} required defaultValue="Muy bien" error={t.reviewError} minRows={2} />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Campos/Texto largo',
  component: TextArea,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Texto de varias líneas: nota para el profesional, instrucciones de recogida, reseña.',
          anatomy: ['**Etiqueta**', '**Área** que crece entre `minRows` y `maxRows`', '**Ayuda** y **contador** “120 / 280” (opcional, con `maxLength`)'],
          props: ['Hereda Campo de texto salvo icono, prefijo y Borrar.', '`maxLength` limita y muestra el contador.'],
          states: ['Los de Campo de texto. El contador se actualiza en vivo.'],
          tokens: [
            ['Campo', 'tokens de Campo de texto'],
            ['Contador', 'text.secondary, cifras tabulares'],
          ],
          responsive: ['Crece con el contenido hasta `maxRows` y luego hace scroll interno; no empuja la Barra de acción inferior fuera de vista.'],
          a11y: ['El contador está dentro de la ayuda (`aria-describedby`) y anuncia cambios con `aria-live="polite"`.', 'Error con icono y texto, anunciado.'],
          content: [
            ['Nota para el profesional (opcional)', 'Note for the professional (optional)'],
            ['Escribe al menos 20 caracteres para publicar tu reseña.', 'Write at least 20 characters to post your review.'],
          ],
          example: 'En **Todas las variantes**, instrucciones reales de una recogida de Towing en solo lectura.',
        }),
      },
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', args: { label: '' }, render: () => <AllDemo /> };
