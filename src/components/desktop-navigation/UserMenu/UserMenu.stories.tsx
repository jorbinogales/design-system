import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useLocale, useT, type Locale } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import type { AppearanceMode } from '../../preferences/AppearanceSelect/AppearanceSelect';
import type { StaffRole } from '../Sidebar/Sidebar';
import { UserMenu } from './UserMenu';

const m = {
  es: {
    luis: 'Luis Herrera',
    carla: 'Carla Méndez',
    last: 'Última acción',
    none: 'ninguna',
    profile: 'Perfil abierto',
    logout: 'Cerrar sesión solicitado',
    hint: 'Sesión actual',
    lang: 'Idioma',
    mode: 'Apariencia',
    long: 'María Fernanda Rodríguez-Castellanos',
  },
  en: {
    luis: 'Luis Herrera',
    carla: 'Carla Méndez',
    last: 'Last action',
    none: 'none',
    profile: 'Profile opened',
    logout: 'Log out requested',
    hint: 'Current session',
    lang: 'Language',
    mode: 'Appearance',
    long: 'María Fernanda Rodríguez-Castellanos',
  },
};

function useMenuState() {
  const locale = useLocale();
  const [language, setLanguage] = useState<Locale>(locale);
  const [appearance, setAppearance] = useState<AppearanceMode>('system');
  return { language, setLanguage, appearance, setAppearance };
}

function InteractiveDemo({ role, compact, placement }: { role?: StaffRole; compact?: boolean; placement?: 'above' | 'below' }) {
  const t = useT(m);
  const s = useMenuState();
  const [last, setLast] = useState<string | null>(null);
  return (
    <Box sx={{ width: 280, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 3, pt: placement === 'above' ? 36 : 0, pb: placement === 'below' ? 40 : 0 }}>
      <UserMenu
        name={role === 'operator' ? t.luis : t.carla}
        role={role ?? 'admin'}
        compact={compact}
        placement={placement}
        language={s.language}
        onLanguageChange={s.setLanguage}
        appearance={s.appearance}
        onAppearanceChange={s.setAppearance}
        onProfile={() => setLast(t.profile)}
        onLogout={() => setLast(t.logout)}
      />
      <Typography variant="caption" sx={{ color: bs.text.secondary }} aria-live="polite">
        {t.last}: {last ?? t.none} · {t.lang}: {s.language.toUpperCase()} · {t.mode}: {s.appearance}
      </Typography>
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const s = useMenuState();
  const common = { language: s.language, onLanguageChange: s.setLanguage, appearance: s.appearance, onAppearanceChange: s.setAppearance, onProfile: () => undefined, onLogout: () => undefined };
  return (
    <Showcase maxWidth={320}>
      <Specimen label={`${l.operator} · expandido`} direction="column" align="stretch">
        <UserMenu name={t.luis} role="operator" placement="below" {...common} />
      </Specimen>
      <Specimen label={`Admin · ${l.compact.split(' ')[0].toLowerCase()}`} direction="column" align="flex-start">
        <UserMenu name={t.carla} role="admin" compact placement="below" {...common} />
      </Specimen>
      <Specimen label={l.longText} direction="column" align="stretch">
        <UserMenu name={t.long} role="admin" placement="below" {...common} />
      </Specimen>
    </Showcase>
  );
}

/** Sidebar footer: the menu opens upward over the content. */
function BusinessDemo() {
  const t = useT(m);
  const s = useMenuState();
  return (
    <Box sx={{ width: 248, height: 260, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3, gap: 2, backgroundColor: bs.surface.subtle, border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px` }}>
      <Typography variant="caption" sx={{ color: bs.text.secondary, px: 2 }}>
        {t.hint}
      </Typography>
      <UserMenu name={t.carla} role="admin" language={s.language} onLanguageChange={s.setLanguage} appearance={s.appearance} onAppearanceChange={s.setAppearance} onProfile={() => undefined} onLogout={() => undefined} />
    </Box>
  );
}

const meta = {
  title: 'Componentes/Navegación de escritorio/Menú de usuario',
  component: UserMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Identifica a la persona con sesión (avatar, nombre y rol) y reúne sus opciones: **Perfil**, **Apariencia**, **Idioma** y **Cerrar sesión**. Vive en el pie de la barra lateral o en un encabezado.',
          anatomy: ['**Disparador**: avatar, nombre, rol y flecha (solo avatar en compacto)', '**Perfil**', '**Apariencia**: Claro, Oscuro, Sistema (opciones de radio)', '**Idioma**: Español, English (opciones de radio)', '**Cerrar sesión** (destructivo, separado)'],
          props: ['Totalmente controlado: `language` / `onLanguageChange`, `appearance` / `onAppearanceChange`; `onProfile` y `onLogout` solo avisan.', '`compact`: solo avatar, para la barra lateral compacta.', '`placement`: `above` abre hacia arriba (pie de barra lateral), `below` hacia abajo (encabezado superior).', 'Roles: Operador / Administrador (`operator` | `admin`).'],
          states: ['Disparador: reposo · hover · foco visible · presionado · expandido', 'Opción de radio: reposo · hover · foco · seleccionada (marca + `selection.bg`)', 'Cerrar sesión: `status.danger.fg`'],
          tokens: [['Menú', 'surface.raised · border.subtle · elevation.e2'], ['Opción seleccionada', 'selection.bg'], ['Cabeceras', 'text.secondary · typeScale.caption'], ['Cerrar sesión', 'status.danger.fg']],
          responsive: ['Nombres largos se truncan con puntos suspensivos en el disparador y se leen completos en el nombre accesible.', 'El menú se reposiciona si no cabe; ancho mínimo 240 px.'],
          a11y: ['Disparador con `aria-haspopup="menu"`, `aria-expanded` y nombre “Menú de usuario: nombre, rol”.', 'Opciones de apariencia e idioma como `menuitemradio` con `aria-checked`.', 'Teclado: Enter/Espacio abre, flechas navegan, Esc cierra y devuelve el foco.', 'Cerrar sesión: confirma con un **Diálogo de confirmación** si hay cambios sin guardar.'],
          content: [['Perfil · Apariencia · Idioma · Cerrar sesión', 'Profile · Appearance · Language · Log out'], ['Claro · Oscuro · Sistema', 'Light · Dark · System'], ['Operador · Administrador', 'Operator · Admin']],
          example: '**Ejemplo de negocio**: Carla Méndez, administradora, en el pie de la barra lateral (el menú abre hacia arriba); Luis Herrera, operador, con el menú hacia abajo.',
        }),
      },
    },
  },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { name: '', role: 'admin' as StaffRole, language: 'es' as Locale, onLanguageChange: () => undefined, appearance: 'system' as AppearanceMode, onAppearanceChange: () => undefined, onProfile: () => undefined, onLogout: () => undefined };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, compact: false, placement: 'below' },
  argTypes: { name: { control: false }, language: { control: false }, appearance: { control: false }, onLanguageChange: { control: false }, onAppearanceChange: { control: false }, onProfile: { control: false }, onLogout: { control: false }, role: { control: 'inline-radio', options: ['operator', 'admin'] }, placement: { control: 'inline-radio', options: ['above', 'below'] } },
  render: (args) => <InteractiveDemo role={args.role} compact={args.compact} placement={args.placement} />,
};
export const Variants: Story = { name: 'Variantes', args: base, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio · Pie de barra lateral', args: base, render: () => <BusinessDemo /> };
