import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../i18n/locale';
import { InverseSurface, SchemeScope } from '../theme/SchemeScope';
import { bs } from '../theme/theme';
import { color, radius, type ColorScheme } from '../theme/tokens';
import { contrastRatio, FoundationPage, FoundationSection, mono, SpecTable } from './foundationKit';

type Row = { path: string; light: string; dark: string };

const flatten = (node: object, path: string[] = []): { path: string; value: string }[] =>
  Object.entries(node).flatMap(([k, v]) => (typeof v === 'string' ? [{ path: [...path, k].join('.'), value: v }] : flatten(v as object, [...path, k])));

const rows: Row[] = flatten(color.light)
  .filter((r) => !r.path.startsWith('elevation'))
  .map((r) => ({ path: r.path, light: r.value, dark: flatten(color.dark).find((d) => d.path === r.path)?.value ?? '' }));

const usage: Record<string, { es: string; en: string }> = {
  'brand.primary': { es: 'Naranja de las tres unidades', en: 'Orange shared by the three units' },
  'action.primary.bg': { es: 'Reservar, Confirmar recogida, Asignar', en: 'Book, Confirm pickup, Assign' },
  'action.primary.fg': { es: 'Texto e icono en el botón naranja', en: 'Text and icon on the orange button' },
  'action.primary.hover': { es: 'Botón con cursor (escritorio)', en: 'Button on hover (desktop)' },
  'action.primary.pressed': { es: 'Botón mientras se pulsa', en: 'Button while pressed' },
  'surface.canvas': { es: 'Fondo general', en: 'Page background' },
  'surface.subtle': { es: 'Campos, buscador, agrupaciones', en: 'Fields, search, groupings' },
  'surface.raised': { es: 'Tarjetas, menús, panel de detalle', en: 'Cards, menus, detail panel' },
  'surface.inverse': { es: 'Encabezado negro del Inicio', en: 'Black Home header' },
  'surface.muted': { es: 'Riel segmentado, skeleton, respaldo de Media', en: 'Segmented track, skeleton, Media fallback' },
  'text.primary': { es: 'Títulos, precios, horarios, lotes', en: 'Titles, prices, times, lot numbers' },
  'text.secondary': { es: 'Descripciones, fechas, etiquetas', en: 'Descriptions, dates, labels' },
  'text.link': { es: 'Ver detalle, Cambiar horario', en: 'View details, Change time' },
  'text.disabled': { es: 'Texto deshabilitado', en: 'Disabled text' },
  'selection.bg': { es: 'Paquete u hora seleccionada', en: 'Selected package or time' },
  'selection.border': { es: 'Contorno de la opción seleccionada', en: 'Selected option outline' },
  'border.subtle': { es: 'Separadores de tarjetas, listas, tablas', en: 'Card, list and table separators' },
  'border.strong': { es: 'Contornos de controles (3:1)', en: 'Control outlines (3:1)' },
  'border.field': { es: 'Borde del campo en reposo', en: 'Field outline at rest' },
  'focus.ring': { es: 'Anillo de foco de teclado', en: 'Keyboard focus ring' },
  scrim: { es: 'Fondo detrás de diálogos y paneles', en: 'Backdrop behind dialogs and sheets' },
};

const groupUsage = (p: string, l: 'es' | 'en') => {
  if (usage[p]) return usage[p][l];
  if (p.startsWith('status.')) return l === 'es' ? `Estado ${p.split('.')[1]}: ${p.split('.')[2]}` : `${p.split('.')[1]} status: ${p.split('.')[2]}`;
  if (p.startsWith('action.secondary')) return l === 'es' ? 'Botón secundario' : 'Secondary button';
  if (p.startsWith('action.destructive') || p === 'text.onDestructive') return l === 'es' ? 'Botón destructivo' : 'Destructive button';
  if (p.startsWith('action.')) return l === 'es' ? 'Velo de hover / presionado' : 'Hover / pressed wash';
  if (p.startsWith('disabled.')) return l === 'es' ? 'Controles deshabilitados' : 'Disabled controls';
  return '';
};

/** Text tokens get a contrast figure against the surface they sit on. */
const contrastFor = (path: string, scheme: ColorScheme): string | null => {
  const v = (p: string) => flatten(scheme).find((r) => r.path === p)?.value ?? '';
  const pairs: Record<string, string> = {
    'text.primary': 'surface.canvas',
    'text.secondary': 'surface.canvas',
    'text.link': 'surface.canvas',
    'action.primary.fg': 'action.primary.bg',
    'action.secondary.fg': 'action.secondary.bg',
    'text.onDestructive': 'action.destructive.bg',
    'focus.ring': 'surface.canvas',
    'border.strong': 'surface.canvas',
  };
  const m = path.match(/^status\.(\w+)\.fg$/);
  const bg = m ? `status.${m[1]}.bg` : pairs[path];
  if (!bg) return null;
  return `${contrastRatio(v(path), v(bg)).toFixed(2)}:1 · ${bg}`;
};

const m = {
  es: {
    title: 'Colores',
    intro: 'Naranja #FF5000 con carbón #111111 y blanco como base. El naranja se reserva para la acción principal, la selección y los indicadores activos; los botones naranjas siempre llevan texto carbón (5,75:1). Todos los pares se verifican con scripts/contrast.mjs (114 pares AA).',
    token: 'Token',
    light: 'Claro',
    dark: 'Oscuro',
    use: 'Uso',
    contrast: 'Contraste (claro / oscuro)',
    palette: 'Tabla completa',
    paletteDesc: 'Los valores viven en src/theme/tokens.ts. En código se usan como bs.<token> (variables CSS), nunca como hex.',
    swatches: 'Superficies y acción en contexto',
    status: 'Estados',
  },
  en: {
    title: 'Colors',
    intro: 'Orange #FF5000 on a charcoal #111111 and white base. Orange is reserved for the primary action, selection and active indicators; orange buttons always carry charcoal text (5.75:1). Every pair is verified by scripts/contrast.mjs (114 AA pairs).',
    token: 'Token',
    light: 'Light',
    dark: 'Dark',
    use: 'Usage',
    contrast: 'Contrast (light / dark)',
    palette: 'Full table',
    paletteDesc: 'Values live in src/theme/tokens.ts. In code use bs.<token> (CSS variables), never hex.',
    swatches: 'Surfaces and action in context',
    status: 'Statuses',
  },
};

const Swatch = ({ value }: { value: string }) => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ width: 22, height: 22, borderRadius: `${radius.xs}px`, backgroundColor: value, boxShadow: `inset 0 0 0 1px ${bs.border.subtle}`, flexShrink: 0 }} />
    <Box component="code" sx={{ ...mono, fontSize: '0.8125rem' }}>
      {value}
    </Box>
  </Box>
);

function SchemePreview({ scheme }: { scheme: 'light' | 'dark' }) {
  return (
    <SchemeScope scheme={scheme} sx={{ backgroundColor: bs.surface.canvas, borderRadius: `${radius.lg}px`, border: `1px solid ${bs.border.subtle}`, p: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <InverseSurface sx={{ borderRadius: `${radius.md}px`, p: 3 }}>
        <Typography variant="label">surface.inverse</Typography>
      </InverseSurface>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1, backgroundColor: bs.surface.subtle, borderRadius: `${radius.md}px`, p: 3 }}>
          <Typography variant="caption">surface.subtle</Typography>
        </Box>
        <Box sx={{ flex: 1, backgroundColor: bs.surface.raised, border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.md}px`, p: 3, boxShadow: bs.elevation.e1 }}>
          <Typography variant="caption">surface.raised</Typography>
        </Box>
      </Box>
      <Box sx={{ backgroundColor: bs.selection.bg, boxShadow: `inset 0 0 0 2px ${bs.selection.border}`, borderRadius: `${radius.md}px`, p: 3 }}>
        <Typography variant="label">selection.bg / selection.border</Typography>
      </Box>
      <Box sx={{ backgroundColor: bs.action.primary.bg, color: bs.action.primary.fg, borderRadius: `${radius.pill}px`, p: 3, textAlign: 'center', fontWeight: 650 }}>action.primary · Reservar</Box>
      <Typography variant="body2">
        <Box component="span" sx={{ color: bs.text.primary }}>text.primary</Box> · <Box component="span" sx={{ color: bs.text.secondary }}>text.secondary</Box> · <Box component="span" sx={{ color: bs.text.link, fontWeight: 600, textDecoration: 'underline' }}>text.link</Box>
      </Typography>
    </SchemeScope>
  );
}

function ColorsPage() {
  const t = useT(m);
  const locale = useT({ es: 'es' as const, en: 'en' as const });
  const statusRows = (['success', 'warning', 'danger', 'info', 'neutral', 'brand'] as const).map((tone) => [
    <Box key="s" sx={{ display: 'inline-flex', px: 2.5, py: 1, borderRadius: `${radius.pill}px`, backgroundColor: bs.status[tone].bg, color: bs.status[tone].fg, border: `1px solid ${bs.status[tone].border}`, fontWeight: 600 }}>
      {tone}
    </Box>,
    <Swatch key="l" value={color.light.status[tone].fg} />,
    <Swatch key="d" value={color.dark.status[tone].fg} />,
    `${contrastRatio(color.light.status[tone].fg, color.light.status[tone].bg).toFixed(2)} / ${contrastRatio(color.dark.status[tone].fg, color.dark.status[tone].bg).toFixed(2)}`,
  ]);
  return (
    <FoundationPage title={t.title} intro={t.intro}>
      <FoundationSection title={t.swatches}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 4 }}>
          <SchemePreview scheme="light" />
          <SchemePreview scheme="dark" />
        </Box>
      </FoundationSection>
      <FoundationSection title={t.status}>
        <SpecTable head={['tone', `fg · ${t.light}`, `fg · ${t.dark}`, 'fg/bg']} rows={statusRows} />
      </FoundationSection>
      <FoundationSection title={t.palette} description={t.paletteDesc}>
        <SpecTable
          head={[t.token, t.light, t.dark, t.use, t.contrast]}
          rows={rows.map((r) => {
            const cl = contrastFor(r.path, color.light);
            const cd = contrastFor(r.path, color.dark);
            return [
              <Box key="p" component="code" sx={{ ...mono, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{r.path}</Box>,
              <Swatch key="l" value={r.light} />,
              <Swatch key="d" value={r.dark} />,
              groupUsage(r.path, locale),
              cl ? <Box key="c" sx={{ ...mono, fontSize: '0.75rem', color: bs.text.secondary }}>{cl.split(' · ')[0]} / {cd?.split(' · ')[0]}</Box> : '',
            ];
          })}
        />
      </FoundationSection>
    </FoundationPage>
  );
}

const meta = { title: 'Fundamentos/Colores', tags: ['!autodocs'], parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
export const Colores: StoryObj = { name: 'Colores', render: () => <ColorsPage /> };
