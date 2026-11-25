import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { LocationCard, type AddressData } from './LocationCard';

const m = {
  es: {
    home: 'Casa',
    homeRef: 'Portón negro, junto a la farmacia. Tocar el timbre 4B.',
    yard: 'IAA Miami North',
    yardRef: 'Entrar por la puerta 3 y pedir el lote en la oficina de salidas.',
    warehouse: 'Bodega del cliente en Doral',
    warehouseRef: 'Muelle de carga trasero, portón azul. Llamar a Marcos al llegar; si no contesta, preguntar en la caseta de seguridad por la entrega de vehículos de Black Six.',
    stacked: 'Apilada (móvil)',
    inline: 'En línea (escritorio)',
    noMap: 'Sin mapa',
    long: 'Dirección larga: se lee completa',
    readOnly: 'Solo lectura: sin acciones',
    editable: 'Con Editar (cliente)',
  },
  en: {
    home: 'Home',
    homeRef: 'Black gate next to the pharmacy. Ring bell 4B.',
    yard: 'IAA Miami North',
    yardRef: 'Enter through gate 3 and ask for the lot at the release office.',
    warehouse: 'Customer warehouse in Doral',
    warehouseRef: 'Rear loading dock, blue gate. Call Marcos on arrival; if no answer, ask security at the booth for the Black Six vehicle delivery.',
    stacked: 'Stacked (mobile)',
    inline: 'Inline (desktop)',
    noMap: 'No map',
    long: 'Long address: fully readable',
    readOnly: 'Read-only: no actions',
    editable: 'With Edit (customer)',
  },
};

const homeAddress: AddressData = { line1: '2150 NW 87th Ave', line2: 'Apt 4B', city: 'Doral', state: 'FL', zip: '33172' };
const yardAddress: AddressData = { line1: '4500 NW 135th St', city: 'Opa-locka', state: 'FL', zip: '33054' };
const warehouseAddress: AddressData = { line1: '10400 NW 25th Street', line2: 'Building C, Suite 300-B', city: 'Doral', state: 'FL', zip: '33172' };

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={760}>
      <Specimen label={`${t.stacked} · ${t.editable}`} direction="column" align="stretch">
        <Box sx={{ maxWidth: 390 }}>
          <LocationCard title={t.home} address={{ ...homeAddress, reference: t.homeRef }} layout="stacked" onEdit={() => undefined} />
        </Box>
      </Specimen>
      <Specimen label={t.inline} direction="column" align="stretch">
        <LocationCard title={t.yard} address={{ ...yardAddress, reference: t.yardRef }} layout="inline" pinKind="auction" />
      </Specimen>
      <Specimen label={`${t.long} · ${l.longText}`} direction="column" align="stretch">
        <Box sx={{ maxWidth: 390 }}>
          <LocationCard title={t.warehouse} address={{ ...warehouseAddress, reference: t.warehouseRef }} layout="stacked" pinKind="destination" />
        </Box>
      </Specimen>
      <Specimen label={t.noMap} direction="column" align="stretch">
        <Box sx={{ maxWidth: 390 }}>
          <LocationCard title={t.home} address={homeAddress} showMap={false} onEdit={() => undefined} />
        </Box>
      </Specimen>
      <Specimen label={t.readOnly} direction="column" align="stretch">
        <Box sx={{ maxWidth: 390 }}>
          <LocationCard title={t.yard} address={{ ...yardAddress, reference: t.yardRef }} pinKind="auction" actions={false} layout="stacked" />
        </Box>
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  return (
    <Box sx={{ width: 640, maxWidth: '100%' }}>
      <LocationCard title={t.warehouse} address={{ ...warehouseAddress, reference: t.warehouseRef }} pinKind="destination" />
    </Box>
  );
}

function InteractiveDemo(props: { layout?: 'auto' | 'stacked' | 'inline'; showMap?: boolean; actions?: boolean }) {
  const t = useT(m);
  return (
    <Box sx={{ width: props.layout === 'inline' ? 640 : 390, maxWidth: '100%' }}>
      <LocationCard {...props} title={t.home} address={{ ...homeAddress, reference: t.homeRef }} onEdit={() => undefined} />
    </Box>
  );
}

const meta = {
  title: 'Componentes/Direcciones/Tarjeta de ubicación',
  component: LocationCard,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Muestra **dónde** es el servicio: miniatura de mapa y la **dirección completa y legible** (el personal debe poder leerla entera). Acciones para copiarla, abrirla en mapas y editarla.',
          anatomy: ['**Miniatura de mapa** con el pin del lugar (opcional)', '**Nombre del lugar** (Casa, Oficina, IAA Miami North)', '**Dirección** en dos líneas: calle y interior; ciudad, estado y ZIP', '**Referencia** de acceso con icono (opcional)', '**Acciones**: Copiar dirección, Abrir en mapas, Editar (opcional)'],
          props: [
            '`address`: `{ line1, line2?, city, state, zip, reference? }`, todo texto (el ZIP conserva ceros iniciales). `formatAddress()` y `mapsHref()` se exportan para resúmenes y enlaces.',
            '`layout`: `stacked` (mapa arriba), `inline` (mapa al lado) o `auto`, que pasa a línea cuando la tarjeta supera 520 px de ancho (container query).',
            '`onEdit` añade Editar; `actions={false}` la deja en solo lectura; `showMap={false}` quita la miniatura.',
          ],
          states: ['Reposo · foco visible en cada acción · copiado (el botón cambia a “Dirección copiada” con check durante 2 s y se anuncia) · error al copiar · sin mapa · solo lectura.'],
          tokens: [
            ['Superficie y borde', 'surface.raised · border.subtle · radius.lg'],
            ['Dirección', 'text.primary (typeScale.body1)'],
            ['Referencia', 'text.secondary (typeScale.body2)'],
            ['Acciones', 'action.secondary.* (Button secondary md, 44 px)'],
            ['Miniatura', 'Mapa (ver Direcciones / Mapa)'],
          ],
          responsive: ['Móvil: mapa arriba (proporción 2.2:1) y acciones en varias líneas si hace falta.', 'Escritorio: mapa a la izquierda con 220 px de ancho.', 'La dirección **nunca se trunca**: `overflow-wrap: anywhere` hace salto de línea en calles, interiores y referencias largas.'],
          a11y: [
            'Es un `article` con el nombre del lugar como encabezado y la dirección en un elemento `address`.',
            'La miniatura es una imagen descrita (“Mapa de Casa”).',
            '“Abrir en mapas” abre una pestaña nueva y lo dice en su nombre accesible.',
            'La confirmación de copia se anuncia con `role="status"`; el texto del botón cambia además del icono.',
          ],
          content: [
            ['Copiar dirección · Dirección copiada · Abrir en mapas · Editar', 'Copy address · Address copied · Open in maps · Edit'],
            ['Portón negro, junto a la farmacia. Tocar el timbre 4B.', 'Black gate next to the pharmacy. Ring bell 4B.'],
          ],
          example: '**Ejemplo de negocio**: destino de una entrega de Towing en una bodega de Doral, con interior (Suite 300-B) y una referencia larga de acceso que se lee completa.',
        }),
      },
    },
  },
} satisfies Meta<typeof LocationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { title: '', address: homeAddress };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, layout: 'stacked', showMap: true, actions: true },
  render: (args) => <InteractiveDemo layout={args.layout} showMap={args.showMap} actions={args.actions} />,
};

export const Variants: Story = { name: 'Variantes y texto largo', args: base, render: () => <VariantsDemo /> };

export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: base, render: () => <BusinessDemo /> };
