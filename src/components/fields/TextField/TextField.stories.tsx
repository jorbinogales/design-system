import DirectionsCarOutlined from '@mui/icons-material/DirectionsCarOutlined';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { TextField, type TextFieldProps } from './TextField';

const m = {
  es: {
    name: 'Nombre completo',
    namePh: 'Mariana López',
    plate: 'Placa del vehículo',
    platePh: 'ABC-1234',
    plateHelp: 'Como aparece en el registro del vehículo.',
    company: 'Empresa',
    vin: 'Número de identificación (VIN)',
    vinError: 'El VIN tiene 17 caracteres; faltan 3.',
    auction: 'Subasta',
    model: 'Marca y modelo',
    modelPh: 'Toyota RAV4 2021',
    longLabel: 'Instrucciones de acceso para el personal de recogida en la subasta',
  },
  en: {
    name: 'Full name',
    namePh: 'Mariana López',
    plate: 'License plate',
    platePh: 'ABC-1234',
    plateHelp: 'As shown on the vehicle registration.',
    company: 'Company',
    vin: 'Vehicle identification number (VIN)',
    vinError: 'A VIN has 17 characters; 3 are missing.',
    auction: 'Auction',
    model: 'Make and model',
    modelPh: 'Toyota RAV4 2021',
    longLabel: 'Access instructions for the pickup crew at the auction',
  },
};

function PlaygroundDemo(args: TextFieldProps) {
  const t = useT(m);
  const [value, setValue] = useState('');
  return <TextField {...args} label={args.label || t.name} placeholder={t.namePh} value={value} onChange={(e) => setValue(e.target.value)} onClear={() => setValue('')} />;
}

function StatesDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [plate, setPlate] = useState('FLX-4821');
  return (
    <Showcase maxWidth={390}>
      <Specimen label={`${l.rest} · ${l.required}`} direction="column" align="stretch">
        <TextField label={t.name} placeholder={t.namePh} required autoComplete="name" />
      </Specimen>
      <Specimen label={`${l.optional} · helper · clear`} direction="column" align="stretch">
        <TextField label={t.plate} optional helperText={t.plateHelp} placeholder={t.platePh} clearable value={plate} onChange={(e) => setPlate(e.target.value)} onClear={() => setPlate('')} />
      </Specimen>
      <Specimen label={l.error} direction="column" align="stretch">
        <TextField label={t.vin} defaultValue="1HGCM82633A0043" error={t.vinError} required />
      </Specimen>
      <Specimen label={l.readOnly} direction="column" align="stretch">
        <TextField label={t.auction} value="Copart Miami North" readOnly />
      </Specimen>
      <Specimen label={l.disabled} direction="column" align="stretch">
        <TextField label={t.company} value="Black Six LLC" disabled />
      </Specimen>
      <Specimen label={`${l.withIcon} · md`} direction="column" align="stretch">
        <TextField label={t.model} placeholder={t.modelPh} startIcon={<DirectionsCarOutlined />} size="md" />
      </Specimen>
      <Specimen label={l.longText} direction="column" align="stretch">
        <TextField label={t.longLabel} optional />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Campos/Campo de texto',
  component: TextField,
  args: { label: '', required: false, optional: false, readOnly: false, disabled: false, clearable: true, size: 'lg' },
  argTypes: { size: { control: 'inline-radio', options: ['md', 'lg'] }, error: { control: 'text' }, helperText: { control: 'text' } },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Captura texto corto. Es la base de todos los campos de Black Six: Correo, Teléfono, Búsqueda, Contraseña, Código y Texto largo son configuraciones de este componente.',
          anatomy: ['**Etiqueta** encima (siempre visible salvo `hideLabel`) + marca de requerido `*` u “(opcional)”', '**Campo** gris suave: icono o prefijo (opcional), valor/placeholder, adorno final (opcional), botón **Borrar** (opcional)', '**Ayuda** o **mensaje de error** con icono'],
          props: [
            '`error`: `true` marca el campo; un texto además sustituye la ayuda y se anuncia (`role="alert"`).',
            '`optional` y `required` no se combinan: marca la minoría de campos del formulario.',
            '`clearable` + `onClear` muestran Borrar mientras hay valor. `prefix` para el código de país; `startIcon` y `endAdornment` para iconos o unidades.',
            'El `TextField` de MUI ya está tematizado igual: la Fase 2 puede usarlo directo (selectores de fecha, Autocomplete).',
          ],
          states: [
            'Reposo: `surface.subtle` sin borde visible (claro) o con borde fino (oscuro).',
            'Hover (puntero): borde `border.strong`.',
            'Foco: fondo `surface.raised` y borde de 2 px `selection.border`.',
            'Error: borde de 2 px `status.danger.solid` + mensaje con icono en `status.danger.fg`.',
            'Solo lectura: sin relleno, borde discontinuo; el valor sigue siendo seleccionable.',
            'Deshabilitado: `disabled.bg` y texto `text.disabled`.',
          ],
          tokens: [
            ['Fondo', 'surface.subtle → surface.raised (foco)'],
            ['Borde', 'border.field · border.strong (hover) · selection.border (foco) · status.danger.solid (error)'],
            ['Etiqueta', 'text.primary · typeScale.label'],
            ['Valor / placeholder', 'text.primary · text.secondary'],
            ['Ayuda / error', 'text.secondary · status.danger.fg'],
            ['Radio', 'radius.md (12 px)'],
            ['Altura', 'layout.fieldHeight (52 px) · md 44 px'],
          ],
          responsive: ['Ocupa todo el ancho por defecto (`fullWidth`). En escritorio, limita el ancho con el contenedor del formulario.', 'Etiquetas largas hacen salto de línea encima del campo; nunca se recortan.', 'Al abrir el teclado, el navegador desplaza el campo enfocado a la vista; la Barra de acción inferior sigue disponible.'],
          a11y: [
            'La etiqueta es un `<label for>` real: nombre accesible y área de toque ampliada.',
            'Requerido: `required` añade `aria-required` y el asterisco; “(opcional)” forma parte del nombre.',
            'Error: `aria-invalid` + `aria-describedby` hacia el mensaje, que se anuncia; el icono y el texto no dependen del color.',
            'Borrar tiene nombre propio (“Borrar placa del vehículo”).',
          ],
          content: [
            ['Placa del vehículo (opcional)', 'License plate (optional)'],
            ['El VIN tiene 17 caracteres; faltan 3.', 'A VIN has 17 characters; 3 are missing.'],
            ['Instrucciones de acceso para el personal de recogida en la subasta', 'Access instructions for the pickup crew at the auction'],
          ],
          example: '**Estados** usa datos de un vehículo de Towing: placa, VIN con error y la subasta en solo lectura.',
        }),
      },
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo', render: (args) => <PlaygroundDemo {...args} />, decorators: [(S) => <div style={{ width: 360 }}><S /></div>] };
export const States: Story = { name: 'Estados', render: () => <StatesDemo /> };
