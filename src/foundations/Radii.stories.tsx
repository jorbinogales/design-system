import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../i18n/locale';
import { bs } from '../theme/theme';
import { radius } from '../theme/tokens';
import { FoundationPage, FoundationSection } from './foundationKit';

const m = {
  es: {
    title: 'Radios',
    intro: 'Esquinas suaves heredadas del kit: píldora en botones y chips, 12 px en campos, 16 px en tarjetas y fotos, 24 px en paneles inferiores. Las etiquetas no interactivas usan 6 px para distinguirse de los chips pulsables.',
    usage: { none: 'Bordes a sangre', xs: 'Etiquetas (Tag)', sm: 'Opciones de menú, tooltip', md: 'Campos, menús, bloques', lg: 'Tarjetas, Media, tablas', xl: 'Panel inferior, diálogos, barra de acción', pill: 'Botones, chips, insignias, segmentado' },
    title2: 'Escala',
  },
  en: {
    title: 'Radii',
    intro: 'Soft corners from the kit: pill on buttons and chips, 12px on fields, 16px on cards and photos, 24px on bottom sheets. Non-interactive tags use 6px to stand apart from tappable chips.',
    usage: { none: 'Full bleed', xs: 'Tags', sm: 'Menu items, tooltip', md: 'Fields, menus, blocks', lg: 'Cards, Media, tables', xl: 'Bottom sheet, dialogs, action bar', pill: 'Buttons, chips, badges, segmented' },
    title2: 'Scale',
  },
};

function RadiiPage() {
  const t = useT(m);
  return (
    <FoundationPage title={t.title} intro={t.intro}>
      <FoundationSection title={t.title2}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 4 }}>
          {(Object.keys(radius) as (keyof typeof radius)[]).map((k) => (
            <Box key={k} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ height: 88, borderRadius: `${radius[k]}px`, backgroundColor: bs.surface.subtle, border: `1.5px solid ${bs.border.strong}` }} />
              <Typography variant="label">
                radius.{k} · {k === 'pill' ? '999' : radius[k]}px
              </Typography>
              <Typography variant="caption" sx={{ color: bs.text.secondary }}>
                {t.usage[k]}
              </Typography>
            </Box>
          ))}
        </Box>
      </FoundationSection>
    </FoundationPage>
  );
}

const meta = { title: 'Fundamentos/Radios', tags: ['!autodocs'], parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
export const Radios: StoryObj = { name: 'Radios', render: () => <RadiiPage /> };
