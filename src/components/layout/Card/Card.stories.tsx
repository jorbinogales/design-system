import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { Price } from '../../data-display/Price/Price';
import { StatusBadge } from '../../data-display/StatusBadge/StatusBadge';
import { Tag } from '../../data-display/Tag/Tag';
import { Media, MediaRating } from '../Media/Media';
import { Card } from './Card';

const m = {
  es: {
    basic: 'Detailing Completo',
    basicBody: 'Lavado, descontaminado, pulido de un paso y sellador. 3 h aprox.',
    express: 'Lavado Express',
    expressBody: 'Exterior a mano y secado. 40 min aprox.',
    premium: 'Pulido Cerámico Premium',
    premiumBody: 'Corrección de pintura y capa cerámica de 12 meses. 6 h aprox.',
    shop: 'ProShine Detailing Doral',
    shopMeta: '2.4 mi · Abierto hasta las 7:00 p. m.',
    job: 'Recogida · Copart Miami Norte',
    jobMeta: 'Lote 04217753 · Toyota Camry 2019 · 10:30 a. m.',
    exterior: 'Lavado exterior',
  },
  en: {
    basic: 'Full Detailing',
    basicBody: 'Wash, decontamination, one-step polish and sealant. About 3 h.',
    express: 'Express Wash',
    expressBody: 'Hand exterior wash and dry. About 40 min.',
    premium: 'Premium Ceramic Polish',
    premiumBody: 'Paint correction and a 12-month ceramic coat. About 6 h.',
    shop: 'ProShine Detailing Doral',
    shopMeta: '2.4 mi · Open until 7:00 PM',
    job: 'Pickup · Copart Miami North',
    jobMeta: 'Lot 04217753 · 2019 Toyota Camry · 10:30 AM',
    exterior: 'Exterior wash',
  },
};

function PackageBody({ title, body, amount }: { title: string; body: string; amount: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, alignItems: 'baseline' }}>
        <Typography variant="h4" component="h3">
          {title}
        </Typography>
        <Price amount={amount} />
      </Box>
      <Typography variant="body2" sx={{ color: bs.text.secondary }}>
        {body}
      </Typography>
    </Box>
  );
}

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [pick, setPick] = useState('basic');
  return (
    <Showcase maxWidth={380}>
      <Specimen label="outlined · elevated · filled" direction="column" align="stretch">
        <Card>
          <PackageBody title={t.express} body={t.expressBody} amount={35} />
        </Card>
        <Card variant="elevated">
          <PackageBody title={t.basic} body={t.basicBody} amount={149} />
        </Card>
        <Card variant="filled" density="compact">
          <PackageBody title={t.premium} body={t.premiumBody} amount={489} />
        </Card>
      </Specimen>
      <Specimen label={`${l.selected} · interactivo (selección única)`} direction="column" align="stretch">
        <Card onClick={() => setPick('basic')} selected={pick === 'basic'}>
          <PackageBody title={t.basic} body={t.basicBody} amount={149} />
        </Card>
        <Card onClick={() => setPick('premium')} selected={pick === 'premium'}>
          <PackageBody title={t.premium} body={t.premiumBody} amount={489} />
        </Card>
      </Specimen>
      <Specimen label={`flush + Media · ${l.businessExample}`} direction="column" align="stretch">
        <Card flush href="#taller">
          <Media unit="detailing" alt={t.shop} ratio="16:9" radius="none" topStart={<MediaRating value={4.9} count={212} />} />
          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Tag label={t.exterior} size="sm" />
            <Typography variant="h4" component="h3">
              {t.shop}
            </Typography>
            <Typography variant="body2" sx={{ color: bs.text.secondary }}>
              {t.shopMeta}
            </Typography>
          </Box>
        </Card>
        <Card density="compact" component="article">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="label" component="h3">
              {t.job}
            </Typography>
            <Typography variant="body2" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
              {t.jobMeta}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <StatusBadge dimension="booking" status="confirmed" size="sm" />
              <StatusBadge dimension="assignment" status="unassigned" size="sm" />
            </Box>
          </Box>
        </Card>
      </Specimen>
      <Specimen label={l.disabled} direction="column" align="stretch">
        <Card disabled onClick={() => undefined}>
          <PackageBody title={t.express} body={t.expressBody} amount={35} />
        </Card>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Estructura/Tarjeta base',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Superficie base para agrupar contenido. Las tarjetas propias de Black Seat (paquete, profesional, trabajo) se construyen sobre esta.',
          anatomy: ['**Superficie** con radio de 16 px', '**Contenido** libre', '**Área interactiva** completa (opcional: `href` u `onClick`)', '**Estado seleccionado** (opcional)'],
          props: [
            '`variant`: `outlined` (por defecto) · `elevated` · `filled`. `density`: `comfortable` 16 px · `compact` 12 px. `flush` sin relleno para imágenes de borde a borde.',
            'Interactiva = un único destino: no metas otros botones dentro. Para varias acciones, deja la tarjeta estática y pon botones dentro.',
            '`selected` aplica fondo naranja suave y borde naranja (paquete u horario elegido); combínalo con un indicador no cromático en el contenido cuando sea selección de formulario.',
          ],
          states: ['Reposo · hover (borde `border.strong`, solo puntero) · presionado (escala 0,99) · foco visible · seleccionado (`aria-pressed`) · deshabilitado.'],
          tokens: [
            ['Fondo', 'surface.raised · surface.subtle (filled) · selection.bg'],
            ['Borde', 'border.subtle · border.strong (hover) · selection.border'],
            ['Sombra', 'elevation.e2 (elevated)'],
            ['Radio', 'radius.lg'],
            ['Relleno', 'density.comfortable.cardPadding 16 · compact 12'],
            ['Foco', 'focus.ring'],
          ],
          responsive: ['Ocupa el ancho de su columna. En móvil, listas de una columna; en escritorio, rejillas.', 'El contenido largo crece en alto; nunca se recorta salvo que el contenido lo pida.'],
          a11y: ['Interactiva: un solo `<a>` o `<button>` con todo el contenido como nombre accesible (o `label`).', 'Usa encabezados dentro (`h3`) para que la lista sea navegable.', 'La selección también se expresa con `aria-pressed`.'],
          content: [
            ['Detailing Completo · $149.00', 'Full Detailing · $149.00'],
            ['Recogida · Copart Miami Norte', 'Pickup · Copart Miami North'],
          ],
          example: 'En **Todas las variantes**: paquetes de Detailing seleccionables, un taller con foto (respaldo) y la tarjeta compacta de un trabajo de Towing con lote y estados.',
        }),
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', args: { children: null }, render: () => <AllDemo /> };
