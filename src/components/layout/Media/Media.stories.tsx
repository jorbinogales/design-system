import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { EngineBayIcon } from '../../../icons/EngineBayIcon';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { SchemeScope } from '../../../theme/SchemeScope';
import { Tag } from '../../data-display/Tag/Tag';
import { Media, MediaBookmark, MediaRating } from './Media';

const m = {
  es: {
    detailing: 'Pulido de pintura en un sedán negro',
    towing: 'Grúa de plataforma cargando un vehículo en la subasta',
    washing: 'Lavado a mano de un SUV en una entrada de casa',
    engine: 'Limpieza del compartimento del motor',
    shop: 'ProShine Detailing Doral',
    limited: 'Por tiempo limitado',
    promoTitle: 'Hasta 40 % en Detailing Completo',
    promoBody: 'Válido hasta el 31 de diciembre',
    broken: 'Foto no disponible del taller',
  },
  en: {
    detailing: 'Paint polishing on a black sedan',
    towing: 'Flatbed tow truck loading a vehicle at the auction',
    washing: 'Hand wash of an SUV in a home driveway',
    engine: 'Engine bay cleaning',
    shop: 'ProShine Detailing Doral',
    limited: 'Limited time',
    promoTitle: 'Up to 40% off Full Detailing',
    promoBody: 'Valid through December 31',
    broken: 'Shop photo unavailable',
  },
};

function FallbackDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={720}>
      <Specimen label={l.fallback} align="flex-start">
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 4, width: '100%' }}>
          <Media unit="detailing" alt={t.detailing} ratio="4:3" />
          <Media unit="towing" alt={t.towing} ratio="4:3" />
          <Media unit="personal-washing" alt={t.washing} ratio="4:3" />
        </Box>
      </Specimen>
      <Specimen label="1:1 · 16:9 · 21:9 · icono propio" align="flex-start">
        <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 4, width: '100%', alignItems: 'start' }}>
          <Media fallbackIcon={EngineBayIcon} alt={t.engine} ratio="1:1" radius="md" />
          <Box sx={{ display: 'grid', gap: 4 }}>
            <Media unit="detailing" alt={t.detailing} ratio="16:9" />
            <Media unit="towing" alt={t.towing} ratio="21:9" radius="xl" />
          </Box>
        </Box>
      </Specimen>
      <Specimen label={`${l.error}: src que no carga → respaldo`} align="flex-start">
        <Box sx={{ width: 280 }}>
          <Media src="/assets/no-existe.jpg" unit="detailing" alt={t.broken} ratio="3:2" />
        </Box>
      </Specimen>
    </Showcase>
  );
}

function OverlayDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [saved, setSaved] = useState(true);
  return (
    <Showcase maxWidth={360}>
      <Specimen label={`${l.businessExample} · rating + bookmark`} direction="column" align="stretch">
        <Media
          unit="detailing"
          alt={t.detailing}
          ratio="4:3"
          topStart={<MediaRating value={4.8} count={365} />}
          topEnd={<MediaBookmark saved={saved} onToggle={() => setSaved((s) => !s)} itemName={t.shop} />}
        />
      </Specimen>
      <Specimen label="scrim + overlay" direction="column" align="stretch">
        <Media unit="personal-washing" alt={t.washing} ratio="16:9" radius="xl" scrim topStart={<Tag tone="inverse" label={t.limited} />}>
          <SchemeScope scheme="dark" sx={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
            <Typography variant="h3" component="p">
              {t.promoTitle}
            </Typography>
            <Typography variant="body2">{t.promoBody}</Typography>
          </SchemeScope>
        </Media>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Estructura/Media',
  component: Media,
  args: { alt: 'Pulido de pintura en un sedán negro', unit: 'detailing', ratio: '16:9', radius: 'lg', scrim: false },
  argTypes: {
    unit: { control: 'inline-radio', options: ['detailing', 'towing', 'personal-washing'] },
    ratio: { control: 'select', options: ['1:1', '4:3', '3:2', '16:9', '21:9', '3:4', '4:5'] },
    radius: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg', 'xl'] },
  },
  decorators: [(Story) => <Box sx={{ width: 340, maxWidth: '100%' }}><Story /></Box>],
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Caja de fotografía con proporción fija, esquinas redondeadas y huecos para insignias. Si no hay foto (o falla la carga) muestra un respaldo diseñado, nunca una imagen rota.',
          anatomy: ['**Marco** con `aspect-ratio`', '**Foto** (`object-fit: cover`) o **respaldo**: trama tonal + icono de la unidad', '**Huecos** `topStart` · `topEnd` · `bottomStart` · `bottomEnd` (opcionales)', '**Degradado** inferior para texto (opcional, `scrim`)', '**Insignias** `MediaRating` y `MediaBookmark`'],
          props: [
            '`alt` es obligatorio: describe la foto; `""` solo si es decorativa. El respaldo usa ese mismo texto como nombre accesible.',
            '`unit` elige el icono del respaldo; `fallbackIcon` lo sustituye por un icono de categoría.',
            'Sin fotografía real disponible: usa assets locales en `public/` (y `staticDirs` en `.storybook/main.ts`); nunca enlaces externos sin verificar.',
          ],
          states: ['Con foto · sin foto (respaldo) · error de carga (cae al respaldo automáticamente).', 'Guardar: `MediaBookmark` alterna contorno ↔ relleno y `aria-pressed`.'],
          tokens: [
            ['Fondo del respaldo', 'surface.muted + trama border.subtle'],
            ['Disco del icono', 'surface.raised · text.secondary · elevation.e1'],
            ['Radio', 'radius.sm · md · lg (por defecto) · xl'],
            ['Degradado', 'scrim (dos capas)'],
            ['Estrella', 'brand.primary'],
            ['Insignias', 'surface.raised · elevation.e1'],
          ],
          responsive: ['Ocupa el ancho de su contenedor; la proporción fija evita saltos de diseño al cargar.', 'Carga diferida (`loading="lazy"`) por defecto; usa `eager` en la imagen principal de la pantalla.'],
          a11y: ['El respaldo expone `role="img"` con el `alt`; si `alt` es `""` queda oculto.', '`MediaRating` se anuncia completo: “Calificación 4.8 de 5, 365 reseñas”.', '`MediaBookmark` usa el nombre del elemento: “Guardar ProShine Detailing Doral”.', 'Texto sobre foto: dentro de `SchemeScope scheme="dark"` con `scrim`; el degradado doble supera 4,5:1 incluso sobre blanco.'],
          content: [
            ['Calificación 4.8 de 5, 365 reseñas', 'Rated 4.8 out of 5, 365 reviews'],
            ['Guardar ProShine Detailing Doral', 'Save ProShine Detailing Doral'],
            ['Quitar ProShine Detailing Doral de guardados', 'Remove ProShine Detailing Doral from saved'],
            ['Hasta 40 % en Detailing Completo', 'Up to 40% off Full Detailing'],
          ],
          example: '**Insignias y degradado** muestra la tarjeta de un taller de Detailing (4.8, guardado) y una promoción de Personal Washing con texto sobre el degradado.',
        }),
      },
    },
  },
} satisfies Meta<typeof Media>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo' };
export const Fallbacks: Story = { name: 'Respaldo sin foto', decorators: [(Story) => <Box sx={{ width: 720, maxWidth: '100%' }}><Story /></Box>], render: () => <FallbackDemo /> };
export const Overlays: Story = { name: 'Insignias y degradado', render: () => <OverlayDemo /> };
