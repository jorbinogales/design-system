import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { IdentifierBlock } from './IdentifierBlock';

const m = {
  es: { pickup: 'Código de recogida', lot: 'Número de lote', ref: 'Referencia de la reserva', vin: 'VIN' },
  en: { pickup: 'Pickup code', lot: 'Lot number', ref: 'Booking reference', vin: 'VIN' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Box sx={{ width: 358 }}>
      <Showcase>
        <Specimen label={`block · ${l.businessExample}`} direction="column" align="stretch">
          <IdentifierBlock label={t.pickup} value="0093" size="lg" />
          <IdentifierBlock label={t.lot} value="04217753" groupSize={4} />
        </Specimen>
        <Specimen label="inline" direction="column" align="stretch">
          <IdentifierBlock variant="inline" label={t.ref} value="BS-240117" />
          <IdentifierBlock variant="inline" label={t.vin} value="1HGCM82633A004352" />
        </Specimen>
        <Specimen label="sin copiar" direction="column" align="stretch">
          <IdentifierBlock variant="inline" label={t.lot} value="04217753" copyable={false} />
        </Specimen>
      </Showcase>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Presentación de datos/Bloque de identificador',
  component: IdentifierBlock,
  args: { label: 'Código de recogida', value: '0093', copyable: true, variant: 'block', size: 'md' },
  argTypes: { variant: { control: 'inline-radio', options: ['block', 'inline'] }, size: { control: 'inline-radio', options: ['md', 'lg'] } },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Muestra un identificador operativo (código de recogida, número de lote, referencia de reserva) con su etiqueta y una acción para copiarlo.',
          anatomy: ['**Etiqueta** propia', '**Valor** con cifras tabulares y cero barrado', '**Botón Copiar** → “Copiado” durante 2 s', '**Región viva** oculta para el anuncio'],
          props: ['`value` siempre texto (conserva ceros iniciales). `groupSize` agrupa visualmente (“0421 7753”) pero copia el valor sin espacios.', '`variant`: `block` (detalle) · `inline` (tarjetas, filas).'],
          states: ['Reposo · hover (puntero) · foco visible · **Copiado** (icono de check, tono éxito, 2 s) · **No se pudo copiar** (tono error) si el portapapeles falla.'],
          tokens: [
            ['Panel', 'surface.subtle · radius.md'],
            ['Valor', 'typeScale.code · text.primary'],
            ['Botón', 'surface.raised · border.subtle · status.success.fg (copiado)'],
            ['Duración de la confirmación', 'duration.confirm (2000 ms)'],
          ],
          responsive: ['Valores largos (VIN) hacen salto de línea en cualquier carácter; el botón conserva 44 px.', 'El valor es seleccionable entero con un toque (`user-select: all`) como alternativa al botón.'],
          a11y: ['El botón se nombra con contexto: “Copiar código de recogida”.', 'La confirmación se anuncia por `role="status"`: “Código de recogida copiado”.', 'El cambio no depende del color: cambia icono y texto.'],
          content: [
            ['Copiar · Copiado', 'Copy · Copied'],
            ['No se pudo copiar', "Couldn't copy"],
            ['Código de recogida copiado', 'Pickup code copied'],
          ],
          example: 'En **Todas las variantes**, el código de recogida 0093 y el lote 04217753 de un vehículo comprado en Copart, más la referencia de la reserva.',
        }),
      },
    },
  },
} satisfies Meta<typeof IdentifierBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo', decorators: [(S) => <Box sx={{ width: 358 }}><S /></Box>] };
export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
