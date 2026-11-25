import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../i18n/locale';
import { SchemeScope } from '../theme/SchemeScope';
import { bs } from '../theme/theme';
import { radius } from '../theme/tokens';
import { FoundationPage, FoundationSection } from './foundationKit';

const m = {
  es: {
    title: 'Elevación',
    intro: 'Pocas capas y con propósito. En claro, sombras suaves con desplazamiento; en oscuro la profundidad la dan los pasos de superficie (#111111 → #1C1C1C → #282828) y la sombra solo acompaña. Las sombras cambian con el esquema porque son tokens (bs.elevation.*).',
    levels: 'Niveles',
    use: { e0: 'Plano: lienzo, listas', e1: 'Insignias sobre fotos, segmento activo', e2: 'Tarjeta elevada, menús, barra de acción inferior', e3: 'Diálogos, paneles, selectores de fecha' },
  },
  en: {
    title: 'Elevation',
    intro: 'Few layers, each with a purpose. In light mode, soft offset shadows; in dark mode depth comes from surface steps (#111111 → #1C1C1C → #282828) and the shadow only supports it. Shadows switch with the scheme because they are tokens (bs.elevation.*).',
    levels: 'Levels',
    use: { e0: 'Flat: canvas, lists', e1: 'Badges over photos, active segment', e2: 'Elevated card, menus, bottom action bar', e3: 'Dialogs, sheets, date pickers' },
  },
};

const levels = ['e0', 'e1', 'e2', 'e3'] as const;

function Panel({ scheme }: { scheme: 'light' | 'dark' }) {
  const t = useT(m);
  return (
    <SchemeScope scheme={scheme} sx={{ backgroundColor: bs.surface.canvas, borderRadius: `${radius.lg}px`, border: `1px solid ${bs.border.subtle}`, p: 6, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 5 }}>
      {levels.map((l) => (
        <Box key={l} sx={{ backgroundColor: bs.surface.raised, borderRadius: `${radius.lg}px`, boxShadow: bs.elevation[l], border: l === 'e0' ? `1px solid ${bs.border.subtle}` : 'none', p: 4, minHeight: 96 }}>
          <Typography variant="label">elevation.{l}</Typography>
          <Typography variant="caption" sx={{ display: 'block', color: bs.text.secondary, mt: 1 }}>
            {t.use[l]}
          </Typography>
        </Box>
      ))}
    </SchemeScope>
  );
}

function ElevationPage() {
  const t = useT(m);
  return (
    <FoundationPage title={t.title} intro={t.intro}>
      <FoundationSection title={t.levels}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 4 }}>
          <Panel scheme="light" />
          <Panel scheme="dark" />
        </Box>
      </FoundationSection>
    </FoundationPage>
  );
}

const meta = { title: 'Fundamentos/Elevación', tags: ['!autodocs'], parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
export const Elevacion: StoryObj = { name: 'Elevación', render: () => <ElevationPage /> };
