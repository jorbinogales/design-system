import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useLocale, useT, type Locale } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { Card } from '../../layout/Card/Card';
import { LanguageSelect } from './LanguageSelect';

const m = {
  es: {
    current: 'Idioma de la interfaz',
    card: 'Detailing Completo',
    cardBody: 'Lavado exterior e interior, descontaminación y cera. Duración estimada: 3 h.',
    pickup: 'Recogida en subasta',
    pickupBody: 'Necesitamos el código de recogida y el número de lote.',
    title: 'Tus preferencias',
    note: 'El idioma se aplica a toda la app. Los datos como direcciones y lotes no se traducen.',
  },
  en: {
    current: 'Interface language',
    card: 'Full Detailing',
    cardBody: 'Exterior and interior wash, decontamination and wax. Estimated duration: 3 h.',
    pickup: 'Auction pickup',
    pickupBody: 'We need the pickup code and the lot number.',
    title: 'Your preferences',
    note: 'The language applies to the whole app. Data such as addresses and lots is not translated.',
  },
};

function InteractiveDemo({ fullWidth, size }: { fullWidth?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const [value, setValue] = useState<Locale>('es');
  return (
    <Box sx={{ width: 320, maxWidth: '100%' }}>
      <LanguageSelect value={value} onChange={setValue} fullWidth={fullWidth} size={size} />
    </Box>
  );
}

function VariantsDemo() {
  const l = useStoryLabels();
  const [value, setValue] = useState<Locale>('en');
  return (
    <Showcase maxWidth={360}>
      <Specimen label={l.sizes} direction="column" align="flex-start">
        <LanguageSelect value={value} onChange={setValue} size="sm" />
        <LanguageSelect value={value} onChange={setValue} size="md" />
        <LanguageSelect value={value} onChange={setValue} size="lg" />
      </Specimen>
      <Specimen label={l.fullWidth} direction="column" align="stretch">
        <LanguageSelect value={value} onChange={setValue} fullWidth size="lg" />
      </Specimen>
    </Showcase>
  );
}

/** The selector reports the choice; here the demo previews the copy in the chosen language. */
function BusinessDemo() {
  const [value, setValue] = useState<Locale>(useLocale());
  const t = useT(m);
  const preview = m[value];
  return (
    <Box sx={{ width: 360, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h3" component="h2">
        {t.title}
      </Typography>
      <Box>
        <Typography variant="body2" sx={{ color: bs.text.secondary, mb: 2 }}>
          {t.current}
        </Typography>
        <LanguageSelect value={value} onChange={setValue} fullWidth size="lg" />
      </Box>
      <Card>
        <Typography variant="h4" component="p" lang={value}>
          {preview.card}
        </Typography>
        <Typography variant="body2" lang={value} sx={{ color: bs.text.secondary, mt: 1 }}>
          {preview.cardBody}
        </Typography>
        <Typography variant="label" component="p" lang={value} sx={{ mt: 3 }}>
          {preview.pickup}
        </Typography>
        <Typography variant="body2" lang={value} sx={{ color: bs.text.secondary }}>
          {preview.pickupBody}
        </Typography>
      </Card>
      <Typography variant="caption" sx={{ color: bs.text.secondary }}>
        {t.note}
      </Typography>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Preferencias/Selector de idioma',
  component: LanguageSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Elige el idioma de la interfaz: **Español** o **English**. Es controlado (`value` / `onChange`); la pantalla que lo monta aplica y guarda el cambio. No maneja la barra de herramientas de Storybook.',
          anatomy: ['**Grupo segmentado** de dos opciones', '**Opción activa** con `selection.bg` y borde `selection.border`'],
          props: ['`value`: `"es"` | `"en"` · `onChange(value)`.', '`size`: `sm` 36 · `md` 44 (por defecto) · `lg` 52 px. `fullWidth` reparte el ancho.', 'Los nombres van en su propio idioma (Español, English) para reconocerse con cualquier idioma activo.'],
          states: ['Reposo · hover (puntero) · foco visible · presionado · seleccionado'],
          tokens: [['Contenedor', 'surface.subtle'], ['Opción activa', 'selection.bg · selection.border'], ['Foco', 'focus.ring'], ['Alturas', 'layout.controlHeight']],
          responsive: ['Con `fullWidth` ocupa el ancho de la fila en móvil; en escritorio queda a su ancho natural.'],
          a11y: ['Grupo con nombre “Idioma” / “Language”; cada opción expone su estado presionado.', 'Teclado: Tab entra, flechas mueven, Espacio/Enter eligen.', 'La opción activa no depende solo del color: lleva fondo y borde distintos.', 'El contenido traducido debe marcar `lang` cuando mezcla idiomas.'],
          content: [['Idioma · Español · English', 'Language · Español · English']],
          example: '**Ejemplo de negocio**: preferencias del cliente: al cambiar, la tarjeta de Detailing Completo y el aviso de recogida muestran el texto en el idioma elegido.',
        }),
      },
    },
  },
} satisfies Meta<typeof LanguageSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { value: 'es' as Locale, onChange: () => undefined };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, size: 'md', fullWidth: false },
  argTypes: { value: { control: false }, onChange: { control: false }, size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => <InteractiveDemo size={args.size} fullWidth={args.fullWidth} />,
};
export const Variants: Story = { name: 'Tamaños', args: base, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: base, render: () => <BusinessDemo /> };
