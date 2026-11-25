import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { SchemeScope } from '../../../theme/SchemeScope';
import { radius } from '../../../theme/tokens';
import { StatusBadge } from '../../data-display/StatusBadge/StatusBadge';
import { Card } from '../../layout/Card/Card';
import { AppearanceSelect, type AppearanceMode } from './AppearanceSelect';

const m = {
  es: {
    title: 'Apariencia',
    help: 'Sistema sigue el ajuste claro u oscuro de tu dispositivo.',
    preview: 'Vista previa',
    job: 'Detailing Completo',
    jobBody: 'Sábado 14 de diciembre · 10:00 a. m.',
    applied: 'Se aplica',
    light: 'Claro',
    dark: 'Oscuro',
    systemNote: (s: string) => `Sistema (ahora ${s})`,
    device: 'Tu dispositivo está en modo',
  },
  en: {
    title: 'Appearance',
    help: 'System follows your device’s light or dark setting.',
    preview: 'Preview',
    job: 'Full Detailing',
    jobBody: 'Saturday, December 14 · 10:00 AM',
    applied: 'Applied',
    light: 'Light',
    dark: 'Dark',
    systemNote: (s: string) => `System (now ${s})`,
    device: 'Your device is in',
  },
};

function InteractiveDemo({ fullWidth, size }: { fullWidth?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const [value, setValue] = useState<AppearanceMode>('system');
  return (
    <Box sx={{ width: 360, maxWidth: '100%' }}>
      <AppearanceSelect value={value} onChange={setValue} fullWidth={fullWidth} size={size} />
    </Box>
  );
}

function VariantsDemo() {
  const l = useStoryLabels();
  const [value, setValue] = useState<AppearanceMode>('dark');
  return (
    <Showcase maxWidth={400}>
      <Specimen label={l.sizes} direction="column" align="flex-start">
        <AppearanceSelect value={value} onChange={setValue} size="sm" />
        <AppearanceSelect value={value} onChange={setValue} size="md" />
        <AppearanceSelect value={value} onChange={setValue} size="lg" />
      </Specimen>
      <Specimen label={l.fullWidth} direction="column" align="stretch">
        <AppearanceSelect value={value} onChange={setValue} fullWidth size="lg" />
      </Specimen>
    </Showcase>
  );
}

/** The selector only reports; this demo scopes the chosen scheme to a preview card (the app applies it to the theme). */
function BusinessDemo() {
  const t = useT(m);
  const [value, setValue] = useState<AppearanceMode>('dark');
  const deviceScheme = 'light';
  const resolved = value === 'system' ? deviceScheme : value;
  return (
    <Box sx={{ width: 360, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h3" component="h2">
        {t.title}
      </Typography>
      <AppearanceSelect value={value} onChange={setValue} fullWidth size="lg" />
      <Typography variant="caption" sx={{ color: bs.text.secondary }}>
        {t.help}
      </Typography>
      <Typography variant="body2" sx={{ color: bs.text.secondary }}>
        {t.preview} · {value === 'system' ? t.systemNote(t[deviceScheme]) : t.applied}: {t[resolved]}
      </Typography>
      <SchemeScope scheme={resolved} sx={{ backgroundColor: bs.surface.canvas, borderRadius: `${radius.lg}px`, p: 4, border: `1px solid ${bs.border.subtle}` }}>
        <Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 3 }}>
            <Box>
              <Typography variant="h4" component="p">
                {t.job}
              </Typography>
              <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                {t.jobBody}
              </Typography>
            </Box>
            <StatusBadge dimension="booking" status="confirmed" size="sm" />
          </Box>
        </Card>
      </SchemeScope>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Preferencias/Selector de apariencia',
  component: AppearanceSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Elige la apariencia de la app: **Claro**, **Oscuro** o **Sistema**. Es controlado (`value` / `onChange`); la pantalla que lo monta aplica el tema y guarda la elección. No maneja la barra de herramientas de Storybook.',
          anatomy: ['**Grupo segmentado** de tres opciones con icono y texto', '**Opción activa** con `selection.bg` y borde `selection.border`'],
          props: ['`value`: `"light"` | `"dark"` | `"system"` · `onChange(value)`.', '`size`: `sm` 36 · `md` 44 (por defecto) · `lg` 52 px. `fullWidth` reparte el ancho en tres partes iguales.', '`Sistema` sigue la preferencia del dispositivo; mientras esté activo, la app cambia sola con el ajuste del sistema.'],
          states: ['Reposo · hover (puntero) · foco visible · presionado · seleccionado'],
          tokens: [['Contenedor', 'surface.subtle'], ['Opción activa', 'selection.bg · selection.border'], ['Foco', 'focus.ring'], ['Alturas', 'layout.controlHeight']],
          responsive: ['`fullWidth` en móvil; las etiquetas con icono caben en 320 px.', 'En escritorio puede ir dentro del menú de usuario como opciones de radio.'],
          a11y: ['Grupo con nombre “Apariencia” / “Appearance”; cada opción expone su estado presionado.', 'Teclado: Tab entra, flechas mueven, Espacio/Enter eligen.', 'Cada opción lleva icono y texto: el significado no depende del color.', 'Respeta `prefers-color-scheme` solo cuando la elección es Sistema.'],
          content: [['Apariencia · Claro · Oscuro · Sistema', 'Appearance · Light · Dark · System']],
          example: '**Ejemplo de negocio**: preferencias del cliente con una vista previa de la tarjeta de una reserva de Detailing Completo en el esquema elegido.',
        }),
      },
    },
  },
} satisfies Meta<typeof AppearanceSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { value: 'system' as AppearanceMode, onChange: () => undefined };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, size: 'md', fullWidth: false },
  argTypes: { value: { control: false }, onChange: { control: false }, size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => <InteractiveDemo size={args.size} fullWidth={args.fullWidth} />,
};
export const Variants: Story = { name: 'Tamaños', args: base, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: base, render: () => <BusinessDemo /> };
