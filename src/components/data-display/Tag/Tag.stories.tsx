import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { DetailingIcon } from '../../../icons/DetailingIcon';
import { TowingIcon } from '../../../icons/TowingIcon';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Tag } from './Tag';

const m = {
  es: { exterior: 'Lavado exterior', suv: 'SUV', promo: '−40 %', newTag: 'Nuevo', copart: 'Copart', limited: 'Por tiempo limitado', long: 'Protección cerámica de 12 meses' },
  en: { exterior: 'Exterior wash', suv: 'SUV', promo: '−40%', newTag: 'New', copart: 'Copart', limited: 'Limited time', long: '12-month ceramic protection' },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={520}>
      <Specimen label={l.variants}>
        <Tag label={t.exterior} />
        <Tag label={t.promo} tone="brand" icon={<LocalOfferOutlined />} />
        <Tag label={t.newTag} tone="info" />
        <Tag label={t.limited} tone="inverse" />
        <Tag label={t.suv} tone="outline" />
      </Specimen>
      <Specimen label={l.sizes}>
        <Tag label={t.exterior} size="sm" />
        <Tag label={t.exterior} size="md" />
      </Specimen>
      <Specimen label={l.businessExample}>
        <Tag label="Detailing" icon={<DetailingIcon />} />
        <Tag label="Towing" icon={<TowingIcon />} />
        <Tag label={t.copart} tone="outline" />
        <Tag label={t.long} />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Presentación de datos/Etiqueta',
  component: Tag,
  args: { label: 'Lavado exterior', tone: 'neutral', size: 'md' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info', 'inverse', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Rótulo no interactivo: categoría del servicio, unidad de negocio, tamaño del vehículo, subasta o promoción.',
          anatomy: ['**Contenedor** rectangular de radio 6 px (distinto de la píldora de los chips interactivos)', '**Icono** (opcional)', '**Texto** corto'],
          props: ['`tone`: `neutral` por defecto; `brand` para promociones; tonos de estado solo si el rótulo describe un estado; `inverse` sobre fotos; `outline` el de menor peso.', 'Para estados de reserva, asignación o pago usa Insignia de estado.'],
          states: ['Solo presentación. Si necesitas que sea pulsable, usa Chip de filtro.'],
          tokens: [
            ['Fondo / texto / borde', 'status.<tono>.bg · fg · border'],
            ['Inverso', 'surface.raised · elevation.e1'],
            ['Radio', 'radius.xs (6 px)'],
            ['Tipografía', 'typeScale.caption 600'],
          ],
          responsive: ['Una línea; si no cabe se recorta con puntos suspensivos. Mantén el texto en 1–3 palabras.'],
          a11y: ['Es texto: el lector lo lee tal cual. Todos los tonos superan 4,5:1 entre texto y fondo.', 'Su forma rectangular lo diferencia de los chips pulsables, además del color.'],
          content: [
            ['Lavado exterior', 'Exterior wash'],
            ['Por tiempo limitado', 'Limited time'],
            ['Protección cerámica de 12 meses', '12-month ceramic protection'],
          ],
          example: 'En **Todas las variantes**: rótulos de unidad (Detailing, Towing) y la subasta Copart de un trabajo de recogida.',
        }),
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo' };
export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
