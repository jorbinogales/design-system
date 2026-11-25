import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../i18n/locale';
import { bs } from '../theme/theme';
import { typeScale } from '../theme/tokens';
import { FoundationPage, FoundationSection, mono, SpecTable } from './foundationKit';

const m = {
  es: {
    title: 'Tipografía',
    intro: 'Archivo, variable en peso (100–900) y anchura (62–125 %), alojada en el proyecto. Una sola familia: los títulos usan la anchura expandida para ganar presencia; la interfaz, la anchura normal. Cifras tabulares en precios, horas, lotes y códigos.',
    scale: 'Escala',
    variant: 'Variante',
    spec: 'Tamaño / interlineado / peso',
    sample: 'Muestra',
    samples: {
      display: 'Tu auto, impecable',
      h1: 'Resumen de la reserva',
      h2: 'Talleres populares',
      h3: 'Servicios',
      h4: 'Detailing Completo',
      body1: 'Lavado, descontaminado, pulido de un paso y sellador. Unas 3 horas.',
      body2: 'Sábado 14 de diciembre · 10:00 a. m.',
      label: 'Número de lote',
      caption: 'Visible para quien realice el servicio',
      button: 'Confirmar recogida',
      code: '04217753 · 0093',
      price: '$1,289.50',
    },
    rules: 'Reglas',
    rulesList: ['Un h1 por pantalla. La jerarquía la marcan tamaño y peso, nunca el color.', 'Sin rótulos en mayúsculas sobre los títulos (eyebrows).', 'Texto corrido a 65–75 caracteres por línea como máximo.', 'Nunca pongas texto naranja pequeño sobre blanco: usa text.link (#B33700).'],
  },
  en: {
    title: 'Typography',
    intro: 'Archivo, variable in weight (100–900) and width (62–125%), self-hosted. One family: headings use the expanded width for presence; the interface uses normal width. Tabular figures for prices, times, lot numbers and codes.',
    scale: 'Scale',
    variant: 'Variant',
    spec: 'Size / line height / weight',
    sample: 'Sample',
    samples: {
      display: 'Your car, spotless',
      h1: 'Booking summary',
      h2: 'Popular shops',
      h3: 'Services',
      h4: 'Full Detailing',
      body1: 'Wash, decontamination, one-step polish and sealant. About 3 hours.',
      body2: 'Saturday, December 14 · 10:00 AM',
      label: 'Lot number',
      caption: 'Visible to whoever performs the service',
      button: 'Confirm pickup',
      code: '04217753 · 0093',
      price: '$1,289.50',
    },
    rules: 'Rules',
    rulesList: ['One h1 per screen. Hierarchy comes from size and weight, never color.', 'No uppercase labels above headings (eyebrows).', 'Running text at 65–75 characters per line at most.', 'Never set small orange text on white: use text.link (#B33700).'],
  },
};

type V = keyof typeof typeScale;

function TypePage() {
  const t = useT(m);
  const variants = Object.keys(typeScale) as V[];
  return (
    <FoundationPage title={t.title} intro={t.intro}>
      <FoundationSection title={t.scale}>
        <SpecTable
          head={[t.variant, t.spec, t.sample]}
          rows={variants.map((v) => {
            const s = typeScale[v] as { fontSize: string; lineHeight: number; fontWeight: number; fontStretch?: string };
            return [
              <Box key="v" component="code" sx={mono}>{v}</Box>,
              <Box key="s" sx={{ ...mono, color: bs.text.secondary, whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>
                {parseFloat(s.fontSize) * 16}px / {s.lineHeight} / {s.fontWeight}
                {s.fontStretch ? ` / ${s.fontStretch}` : ''}
              </Box>,
              <Typography key="t" variant={v === 'button' ? 'button' : v} component="span" sx={{ display: 'block' }}>
                {t.samples[v]}
              </Typography>,
            ];
          })}
        />
      </FoundationSection>
      <FoundationSection title={t.rules}>
        <Box component="ul" sx={{ m: 0, pl: 5, display: 'flex', flexDirection: 'column', gap: 1.5, color: bs.text.secondary }}>
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

const meta = { title: 'Fundamentos/Tipografía', tags: ['!autodocs'], parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
export const Tipografia: StoryObj = { name: 'Tipografía', render: () => <TypePage /> };
