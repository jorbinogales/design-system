import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { AddressSearch, type AddressSuggestion } from './AddressSearch';

const directory: AddressSuggestion[] = [
  { id: '1', primary: '2150 NW 87th Ave', secondary: 'Doral, FL 33172' },
  { id: '2', primary: '2100 NW 84th Ave', secondary: 'Doral, FL 33122' },
  { id: '3', primary: '8250 NW 25th St', secondary: 'Doral, FL 33122' },
  { id: '4', primary: '10400 NW 25th Street, Suite 300-B', secondary: 'Doral, FL 33172' },
  { id: '5', primary: '1111 Brickell Ave', secondary: 'Miami, FL 33131' },
  { id: '6', primary: '1450 Brickell Bay Dr', secondary: 'Miami, FL 33131' },
  { id: '7', primary: '4500 NW 135th St', secondary: 'Opa-locka, FL 33054' },
];

const m = {
  es: {
    delivery: 'Dirección de entrega',
    picked: (a: string) => `Elegiste: ${a}`,
    located: 'Ubicación actual aplicada',
    manual: 'Pasarías al formulario manual',
    idle: 'Sin texto: solo “Usar mi ubicación actual”',
    loading: 'Cargando resultados',
    found: 'Direcciones encontradas',
    empty: 'Sin resultados: ofrece entrada manual',
    locating: 'Buscando la ubicación del dispositivo',
    towing: 'Towing · ¿Dónde entregamos el vehículo?',
    towingHint: 'Escribe la calle de la entrega, por ejemplo “NW 25th” o “Brickell”.',
  },
  en: {
    delivery: 'Delivery address',
    picked: (a: string) => `You chose: ${a}`,
    located: 'Current location applied',
    manual: 'You would move to the manual form',
    idle: 'No text: only "Use my current location"',
    loading: 'Loading results',
    found: 'Addresses found',
    empty: 'No results: offers manual entry',
    locating: 'Finding the device location',
    towing: 'Towing · Where do we deliver the vehicle?',
    towingHint: 'Type the delivery street, for example "NW 25th" or "Brickell".',
  },
};

function Demo({ initial = '', business = false }: { initial?: string; business?: boolean }) {
  const t = useT(m);
  const [query, setQuery] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (query.trim().length < 3) return undefined;
    setLoading(true);
    const id = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(id);
  }, [query]);

  const q = query.trim().toLocaleLowerCase();
  const results = q.length >= 3 ? directory.filter((d) => `${d.primary} ${d.secondary}`.toLocaleLowerCase().includes(q)) : [];

  return (
    <Box sx={{ width: 390, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {business && (
        <Box>
          <Typography variant="h3">{t.towing}</Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.towingHint}
          </Typography>
        </Box>
      )}
      <AddressSearch
        value={query}
        onChange={(v) => {
          setQuery(v);
          setMessage('');
        }}
        suggestions={results}
        loading={loading && query.trim().length >= 3}
        locating={locating}
        onSelect={(s) => {
          setQuery(`${s.primary}, ${s.secondary}`);
          setMessage(t.picked(`${s.primary}, ${s.secondary}`));
        }}
        onUseCurrentLocation={() => {
          setLocating(true);
          window.setTimeout(() => {
            setLocating(false);
            setMessage(t.located);
          }, 900);
        }}
        onManualEntry={() => setMessage(t.manual)}
      />
      <Typography variant="body2" aria-live="polite" sx={{ color: bs.text.secondary, minHeight: 20 }}>
        {message}
      </Typography>
    </Box>
  );
}

function StatesDemo() {
  const t = useT(m);
  const noop = () => undefined;
  const common = { onChange: noop, onSelect: noop, onUseCurrentLocation: noop, onManualEntry: noop };
  return (
    <Showcase maxWidth={390}>
      <Specimen label={t.idle} direction="column" align="stretch">
        <AddressSearch {...common} value="" suggestions={[]} />
      </Specimen>
      <Specimen label={t.loading} direction="column" align="stretch">
        <AddressSearch {...common} value="NW 25" suggestions={[]} loading />
      </Specimen>
      <Specimen label={t.found} direction="column" align="stretch">
        <AddressSearch {...common} value="NW 25" suggestions={directory.filter((d) => d.primary.includes('NW 25'))} />
      </Specimen>
      <Specimen label={t.empty} direction="column" align="stretch">
        <AddressSearch {...common} value="Calle Falsa 123" suggestions={[]} />
      </Specimen>
      <Specimen label={t.locating} direction="column" align="stretch">
        <AddressSearch {...common} value="" suggestions={[]} locating />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Direcciones/Búsqueda de dirección',
  component: AddressSearch,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Autocompletado de direcciones: el cliente escribe, ve **resultados completos** y elige uno, o usa **su ubicación actual**. Si no hay resultados, ofrece **ingresar la dirección manualmente**.',
          anatomy: ['**Campo de búsqueda** con icono y botón para borrar', '**Fila “Usar mi ubicación actual”** (opcional) con icono de navegación', '**Lista de resultados**: calle resaltada y resto de la dirección completo', '**Estado cargando** (esqueleto), **sin resultados** (mensaje y acción manual) y **ayuda** de caracteres mínimos', '**Enlace “¿No aparece? Ingrésala manualmente”** bajo los resultados (opcional)'],
          props: [
            'Controlado: `value` / `onChange`; el padre consulta el servicio y devuelve `suggestions` y `loading`.',
            '`suggestions`: `{ id, primary, secondary }`. `secondary` lleva ciudad, estado y ZIP completos; nunca se trunca.',
            '`minChars` (3 por defecto): por debajo solo se muestra la ayuda y la ubicación actual.',
            '`onUseCurrentLocation` + `locating`: la fila muestra un indicador y queda deshabilitada mientras el dispositivo responde.',
            '`onManualEntry` activa la salida a formulario manual en sin resultados y en resultados.',
          ],
          states: ['Vacío · cargando · encontrado · sin resultados · localizando · foco visible · opción activa (teclado) con contorno.'],
          tokens: [
            ['Campo', 'surface.subtle (TextField)'],
            ['Opción activa / hover', 'action.hover · focus.ring'],
            ['Texto de resultado', 'text.primary · text.secondary'],
            ['Coincidencia', 'peso 750 (sin color)'],
            ['Alto de fila', '56 px mínimo (objetivo táctil ≥ 44 px)'],
          ],
          responsive: ['La lista está siempre visible bajo el campo (no es un menú flotante): funciona con el teclado del móvil abierto.', 'Direcciones largas hacen salto de línea completo.', 'En escritorio se coloca en un panel de ancho fijo (≈ 390 px) o en la columna de un formulario.'],
          a11y: [
            'Patrón combobox: el campo tiene `role="combobox"`, `aria-expanded`, `aria-controls` y `aria-activedescendant`; el foco no sale del campo.',
            'Flechas arriba/abajo recorren las opciones, Enter elige y Escape borra el texto.',
            'Una región `role="status"` anuncia “3 resultados”, “Buscando direcciones” o “No encontramos esa dirección”.',
            'La coincidencia se resalta con peso de fuente, no solo con color.',
          ],
          content: [
            ['Usar mi ubicación actual · Buscando tu ubicación…', 'Use my current location · Finding your location…'],
            ['No encontramos esa dirección · Ingresar dirección manualmente', "We couldn't find that address · Enter address manually"],
            ['Escribe al menos 3 caracteres para ver direcciones.', 'Type at least 3 characters to see addresses.'],
          ],
          example: '**Ejemplo de negocio**: Towing, entrega del vehículo comprado en subasta. Prueba “NW 25th” (2 resultados), “Brickell” (2 resultados) o un texto sin coincidencias.',
        }),
      },
    },
  },
} satisfies Meta<typeof AddressSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { value: '', onChange: () => undefined, suggestions: [], onSelect: () => undefined };

export const Interactive: Story = { name: 'Interactivo', args: base, render: () => <Demo /> };

export const States: Story = { name: 'Estados', args: base, render: () => <StatesDemo /> };

export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: base, render: () => <Demo business initial="NW 25" /> };
