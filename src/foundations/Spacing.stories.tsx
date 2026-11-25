import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../i18n/locale';
import { bs } from '../theme/theme';
import { density, layout, space } from '../theme/tokens';
import { FoundationPage, FoundationSection, mono, SpecTable } from './foundationKit';

const m = {
  es: {
    title: 'Espaciado',
    intro: 'Base de 4 px. En MUI, theme.spacing(1) = 4 px, así que p: 4 son 16 px. Grupos apretados, separación generosa entre bloques y más espacio sobre un título que debajo.',
    scale: 'Escala',
    layout: 'Diseño',
    density: 'Densidades',
    densityDesc: 'Cómoda para el cliente (táctil), compacta para el escritorio del operador.',
    token: 'Token',
    value: 'Valor',
    gutter: 'Margen lateral móvil · tableta · escritorio',
    widths: 'Ancho máximo móvil · contenido · amplio',
    controls: 'Altura de controles sm · md · lg',
    field: 'Altura de campo',
    touch: 'Área táctil mínima',
    bars: 'Barra superior · navegación inferior',
  },
  en: {
    title: 'Spacing',
    intro: '4px base. In MUI, theme.spacing(1) = 4px, so p: 4 is 16px. Tight groups, generous separation between blocks, and more space above a heading than below it.',
    scale: 'Scale',
    layout: 'Layout',
    density: 'Densities',
    densityDesc: 'Comfortable for the customer (touch), compact for the operator desktop.',
    token: 'Token',
    value: 'Value',
    gutter: 'Side gutter mobile · tablet · desktop',
    widths: 'Max width mobile · content · wide',
    controls: 'Control height sm · md · lg',
    field: 'Field height',
    touch: 'Minimum touch target',
    bars: 'Top bar · bottom nav',
  },
};

function SpacingPage() {
  const t = useT(m);
  return (
    <FoundationPage title={t.title} intro={t.intro}>
      <FoundationSection title={t.scale}>
        <SpecTable
          head={[t.token, t.value, '']}
          rows={Object.entries(space).map(([k, v]) => [
            <Box key="k" component="code" sx={mono}>space.{k}</Box>,
            <Box key="v" sx={mono}>{v}px · spacing({v / 4})</Box>,
            <Box key="b" sx={{ width: v, height: 12, backgroundColor: bs.brand.primary, borderRadius: 1 }} />,
          ])}
        />
      </FoundationSection>
      <FoundationSection title={t.layout}>
        <SpecTable
          head={[t.token, t.value]}
          rows={[
            [t.gutter, `${layout.gutter.mobile} · ${layout.gutter.tablet} · ${layout.gutter.desktop}px`],
            [t.widths, `${layout.maxWidth.mobile} · ${layout.maxWidth.content} · ${layout.maxWidth.wide}px`],
            [t.controls, `${layout.controlHeight.sm} · ${layout.controlHeight.md} · ${layout.controlHeight.lg}px`],
            [t.field, `${layout.fieldHeight}px`],
            [t.touch, `${layout.touchTarget}px`],
            [t.bars, `${layout.topBarHeight} · ${layout.bottomNavHeight}px`],
          ]}
        />
      </FoundationSection>
      <FoundationSection title={t.density} description={t.densityDesc}>
        <SpecTable
          head={['', 'rowMinHeight', 'rowPaddingY', 'cardPadding', 'gap']}
          rows={(Object.keys(density) as (keyof typeof density)[]).map((k) => [k, `${density[k].rowMinHeight}px`, `${density[k].rowPaddingY}px`, `${density[k].cardPadding}px`, `${density[k].gap}px`])}
        />
      </FoundationSection>
    </FoundationPage>
  );
}

const meta = { title: 'Fundamentos/Espaciado', tags: ['!autodocs'], parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
export const Espaciado: StoryObj = { name: 'Espaciado', render: () => <SpacingPage /> };
