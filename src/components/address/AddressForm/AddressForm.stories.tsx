import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { MapCanvas } from '../MapCanvas/MapCanvas';
import { AddressForm, emptyAddressForm, type AddressFormErrors, type AddressFormValue } from './AddressForm';

const m = {
  es: {
    saved: (a: string) => `Dirección guardada: ${a}`,
    empty: 'Vacío',
    errors: 'Con errores de validación (el foco va al primero)',
    other: 'Etiqueta “Otro” con nombre propio',
    server: 'Error devuelto por el servidor',
    loading: 'Guardando',
    noChips: 'Sin etiquetas (punto de entrega de Towing)',
    zipServer: 'Ese ZIP no corresponde a Doral.',
    required: 'Este dato es obligatorio.',
    zipBad: 'El ZIP debe tener 5 dígitos (por ejemplo 33172).',
    mapLabel: 'Mapa con el pin de la dirección que estás agregando',
    pin: 'Tu dirección',
    pinHint: 'Mueve el pin o completa los datos.',
    title: 'Agregar dirección',
    delivery: 'Towing · Punto de entrega',
  },
  en: {
    saved: (a: string) => `Address saved: ${a}`,
    empty: 'Empty',
    errors: 'With validation errors (focus goes to the first)',
    other: '"Other" label with its own name',
    server: 'Error returned by the server',
    loading: 'Saving',
    noChips: 'No labels (Towing delivery point)',
    zipServer: "That ZIP doesn't belong to Doral.",
    required: 'This field is required.',
    zipBad: 'ZIP must have 5 digits (for example 33172).',
    mapLabel: 'Map with the pin of the address you are adding',
    pin: 'Your address',
    pinHint: 'Move the pin or fill in the details.',
    title: 'Add address',
    delivery: 'Towing · Delivery point',
  },
};

const filled: AddressFormValue = { label: 'home', customLabel: '', street: '2150 NW 87th Ave', unit: 'Apt 4B', city: 'Doral', state: 'FL', zip: '33172', reference: 'Portón negro, junto a la farmacia.' };

function Demo({ initial = emptyAddressForm, hideLabelChips = false, serverErrors, loading = false }: { initial?: AddressFormValue; hideLabelChips?: boolean; serverErrors?: AddressFormErrors; loading?: boolean }) {
  const t = useT(m);
  const [value, setValue] = useState(initial);
  const [message, setMessage] = useState('');
  return (
    <Box sx={{ width: 390, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <AddressForm
        value={value}
        onChange={(v) => {
          setValue(v);
          setMessage('');
        }}
        errors={serverErrors}
        loading={loading}
        hideLabelChips={hideLabelChips}
        onSubmit={(v) => setMessage(t.saved(`${v.street}, ${v.city}, ${v.state} ${v.zip}`))}
      />
      <Typography variant="body2" role="status" sx={{ color: bs.status.success.fg, minHeight: 20 }}>
        {message}
      </Typography>
    </Box>
  );
}

function StatesDemo() {
  const t = useT(m);
  return (
    <Showcase maxWidth={390}>
      <Specimen label={t.empty} direction="column" align="stretch">
        <Demo />
      </Specimen>
      <Specimen label={t.errors} direction="column" align="stretch">
        <Demo initial={{ ...emptyAddressForm, zip: '3317' }} serverErrors={{ street: t.required, city: t.required, state: t.required, zip: t.zipBad }} />
      </Specimen>
      <Specimen label={t.other} direction="column" align="stretch">
        <Demo initial={{ ...filled, label: 'other', customLabel: 'Bodega en Doral' }} />
      </Specimen>
      <Specimen label={t.server} direction="column" align="stretch">
        <Demo initial={filled} serverErrors={{ zip: t.zipServer }} />
      </Specimen>
      <Specimen label={t.loading} direction="column" align="stretch">
        <Demo initial={filled} loading />
      </Specimen>
      <Specimen label={t.noChips} direction="column" align="stretch">
        <Demo initial={{ ...filled, reference: '' }} hideLabelChips />
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  return (
    <Box sx={{ width: 390, maxWidth: '100%', borderRadius: 4, overflow: 'hidden', border: `1px solid ${bs.border.subtle}` }}>
      <MapCanvas label={t.mapLabel} ratio={2.1} rounded={false} seed={13} pins={[{ id: 'me', kind: 'address', x: 50, y: 70, label: t.pin }]} selectedPinId="me" />
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
          <Typography variant="h3" component="h2">
            {t.title}
          </Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.pinHint}
          </Typography>
        </Box>
        <Demo initial={{ ...filled, reference: '' }} />
      </Box>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Direcciones/Formulario manual',
  component: AddressForm,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Captura una dirección **a mano**: etiqueta, calle, interior, ciudad, estado, ZIP y referencia de acceso. Sigue el patrón de “Agregar dirección” (chips de etiqueta arriba, campos con etiqueta encima).',
          anatomy: ['**Chips de etiqueta**: Casa / Oficina / Otro (selección única) y nombre propio si es Otro', '**Calle y número** (obligatorio)', '**Apartamento, suite o piso** (opcional)', '**Ciudad**, **Estado** y **ZIP** (obligatorios)', '**Referencia** o instrucciones de acceso (opcional, hasta 140 caracteres)', '**Botón Guardar dirección** (aparece si hay `onSubmit`)'],
          props: [
            'Controlado: `value` (`AddressFormValue`) y `onChange`. Todos los datos son texto; el ZIP conserva ceros iniciales (02134).',
            '`onSubmit` solo se llama con datos válidos. Antes, valida obligatorios y ZIP de 5 dígitos (o 5+4) y mueve el foco al primer error. `validateAddressForm(valor, idioma)` se exporta para repetir la validación en pantallas.',
            '`errors` fusiona errores del servidor sobre los locales. `loading` pone el botón en carga. `hideLabelChips` quita la etiqueta (puntos de entrega de Towing).',
            '`stateOptions` reemplaza la lista de estados.',
          ],
          states: ['Vacío · relleno · error de validación (borde de peligro, icono y mensaje bajo el campo) · error del servidor · cargando · “Otro” con campo extra · foco visible.'],
          tokens: [
            ['Campos', 'surface.subtle · border.field (tema de campos)'],
            ['Error', 'status.danger.solid · status.danger.fg'],
            ['Chip seleccionado', 'selection.bg · selection.border + check'],
            ['Botón principal', 'action.primary.* (texto #111111)'],
            ['Separación entre campos', 'space 20 px'],
          ],
          responsive: ['Una columna a 390 px; Estado y ZIP comparten fila cuando caben (≥ 150 px cada uno).', 'Todos los campos miden 52 px (touch). En escritorio el formulario se limita a una columna de 390–480 px o se distribuye en una cuadrícula del contenedor.', 'Con el teclado abierto, el foco automático al primer error mantiene el campo visible.'],
          a11y: [
            'Cada campo tiene etiqueta visible, no solo placeholder; los obligatorios llevan `required` y los opcionales lo dicen en la etiqueta (“opcional”).',
            'Atributos `autocomplete` correctos (`address-line1`, `address-level2`, `postal-code`…) para autocompletado del navegador.',
            'ZIP con `inputMode="numeric"` pero tipo texto: no pierde ceros ni muestra flechas.',
            'Errores en texto con icono, anunciados (`role="alert"`) y el foco va al primer campo inválido.',
            'Grupo de chips como `radiogroup` con nombre.',
          ],
          content: [
            ['Guardar dirección como · Casa · Oficina · Otro', 'Save address as · Home · Office · Other'],
            ['Este dato es obligatorio. · El ZIP debe tener 5 dígitos (por ejemplo 33172).', 'This field is required. · ZIP must have 5 digits (for example 33172).'],
            ['Apartamento, suite o piso (opcional)', 'Apartment, suite or floor (optional)'],
          ],
          example: '**Ejemplo de negocio**: “Agregar dirección” de Personal Washing en Doral, con el mapa y el pin arriba. Prueba a enviarlo vacío para ver la validación.',
        }),
      },
    },
  },
} satisfies Meta<typeof AddressForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { value: emptyAddressForm, onChange: () => undefined };

export const Interactive: Story = { name: 'Interactivo', args: base, render: () => <Demo /> };

export const States: Story = { name: 'Estados', args: base, render: () => <StatesDemo /> };

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: base,
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase>
        <Specimen label={`${l.businessExample} · Personal Washing`} direction="column" align="stretch">
          <BusinessDemo />
        </Specimen>
      </Showcase>
    );
  },
};
