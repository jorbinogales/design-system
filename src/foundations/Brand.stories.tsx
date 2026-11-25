import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BlackSixMark } from '../brand/BlackSixMark';
import { Wordmark } from '../brand/Wordmark';
import { useT } from '../i18n/locale';
import { InverseSurface, SchemeScope } from '../theme/SchemeScope';
import { bs } from '../theme/theme';
import { radius } from '../theme/tokens';
import { FoundationPage, FoundationSection } from './foundationKit';

const m = {
  es: {
    title: 'Marca',
    intro: 'PROVISIONAL hasta recibir el logotipo oficial. Logotipo tipográfico: “BLACK” en Archivo de peso máximo y anchura expandida frente a “SIX” en peso ligero: el contraste está en el propio nombre. El símbolo es un seis geométrico dibujado con trazos (no depende de la fuente) sobre una loseta naranja con el carbón de los botones.',
    marks: 'Símbolo',
    wordmarks: 'Logotipo',
    surfaces: 'Sobre cada superficie',
    splash: 'Splash',
    variants: { orange: 'orange (por defecto)', inverse: 'inverse (solo sobre claro)', glyph: 'glyph (currentColor)' },
    rules: 'Reglas de uso',
    rulesList: ['Margen libre mínimo: la altura de la “B” alrededor del logotipo.', 'No cambies los colores del símbolo ni pongas el logotipo en naranja.', 'Sobre fotos, usa el logotipo blanco dentro de un degradado oscuro.', 'Tamaño mínimo: logotipo 15 px de alto de letra; símbolo 24 px.'],
  },
  en: {
    title: 'Brand',
    intro: 'PROVISIONAL until the official logo is supplied. Typographic wordmark: “BLACK” in Archivo at maximum weight and expanded width against “SIX” in a light weight: the contrast lives in the name itself. The symbol is a geometric six drawn with strokes (no font dependency) on an orange tile with the button charcoal.',
    marks: 'Symbol',
    wordmarks: 'Wordmark',
    surfaces: 'On every surface',
    splash: 'Splash',
    variants: { orange: 'orange (default)', inverse: 'inverse (light surfaces only)', glyph: 'glyph (currentColor)' },
    rules: 'Usage rules',
    rulesList: ['Minimum clear space: the height of the “B” around the wordmark.', "Don't recolor the symbol or set the wordmark in orange.", 'Over photos, use the white wordmark inside a dark gradient.', 'Minimum size: 15px letter height for the wordmark; 24px for the symbol.'],
  },
};

function BrandPage() {
  const t = useT(m);
  return (
    <FoundationPage title={t.title} intro={t.intro}>
      <FoundationSection title={t.marks}>
        <Box sx={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {(['orange', 'inverse', 'glyph'] as const).map((v) => (
            <Box key={v} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <BlackSixMark size={72} variant={v} title="Black Six" />
              <Typography variant="caption" sx={{ color: bs.text.secondary }}>
                {t.variants[v]}
              </Typography>
            </Box>
          ))}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
            <BlackSixMark size={24} />
            <BlackSixMark size={32} />
            <BlackSixMark size={48} />
          </Box>
        </Box>
      </FoundationSection>
      <FoundationSection title={t.wordmarks}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start' }}>
          <Wordmark size="xl" />
          <Wordmark size="lg" withMark />
          <Wordmark size="md" withMark />
          <Wordmark size="sm" withMark />
        </Box>
      </FoundationSection>
      <FoundationSection title={t.surfaces}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 4 }}>
          <SchemeScope scheme="light" sx={{ backgroundColor: bs.surface.canvas, border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, p: 6, display: 'grid', placeItems: 'center' }}>
            <Wordmark withMark />
          </SchemeScope>
          <SchemeScope scheme="dark" sx={{ backgroundColor: bs.surface.canvas, borderRadius: `${radius.lg}px`, p: 6, display: 'grid', placeItems: 'center' }}>
            <Wordmark withMark />
          </SchemeScope>
          <InverseSurface sx={{ borderRadius: `${radius.lg}px`, p: 6, display: 'grid', placeItems: 'center' }}>
            <Wordmark withMark />
          </InverseSurface>
        </Box>
      </FoundationSection>
      <FoundationSection title={t.splash}>
        <Box sx={{ width: 300, height: 560, borderRadius: '36px', border: `8px solid ${bs.surface.inverse}`, backgroundColor: bs.surface.canvas, display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <Wordmark size="lg" withMark orientation="stacked" />
          <Box sx={{ position: 'absolute', bottom: 10, width: 100, height: 4, borderRadius: `${radius.pill}px`, backgroundColor: bs.text.primary, left: '50%', transform: 'translateX(-50%)' }} />
        </Box>
      </FoundationSection>
      <FoundationSection title={t.rules}>
        <Box component="ul" sx={{ m: 0, pl: 5, color: bs.text.secondary, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {t.rulesList.map((r) => (
            <li key={r}>
              <Typography variant="body1">{r}</Typography>
            </li>
          ))}
        </Box>
      </FoundationSection>
    </FoundationPage>
  );
}

const meta = { title: 'Fundamentos/Marca', tags: ['!autodocs'], parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
export const Marca: StoryObj = { name: 'Marca', render: () => <BrandPage /> };
