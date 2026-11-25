import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT, type Locale } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { ActionGroup } from '../../actions/ActionGroup/ActionGroup';
import { Button } from '../../actions/Button/Button';
import { BottomNav } from '../../navigation/BottomNav/BottomNav';
import { TopBar } from '../../navigation/TopBar/TopBar';
import { BottomSheet } from '../../overlays/BottomSheet/BottomSheet';
import type { AppearanceMode } from '../AppearanceSelect/AppearanceSelect';
import { AccountMenu } from './AccountMenu';

const m = {
  es: {
    profile: 'Perfil',
    name: 'Sofía Ramírez',
    email: 'sofia.ramirez@email.com',
    logoutTitle: 'Cerrar sesión',
    logoutBody: '¿Seguro que quieres cerrar sesión? Tus reservas se conservan.',
    cancel: 'Cancelar',
    confirm: 'Sí, cerrar sesión',
    opened: 'Abriste',
    none: 'nada todavía',
    navLabel: { bookings: 'Mis reservas', addresses: 'Direcciones guardadas', payments: 'Métodos de pago', help: 'Centro de ayuda' },
  },
  en: {
    profile: 'Profile',
    name: 'Sofía Ramírez',
    email: 'sofia.ramirez@email.com',
    logoutTitle: 'Log out',
    logoutBody: 'Are you sure you want to log out? Your bookings are kept.',
    cancel: 'Cancel',
    confirm: 'Yes, log out',
    opened: 'You opened',
    none: 'nothing yet',
    navLabel: { bookings: 'My bookings', addresses: 'Saved addresses', payments: 'Payment methods', help: 'Help center' },
  },
};

function useMenuState() {
  const [language, setLanguage] = useState<Locale>('es');
  const [appearance, setAppearance] = useState<AppearanceMode>('system');
  return { language, setLanguage, appearance, setAppearance };
}

function InteractiveDemo() {
  const t = useT(m);
  const s = useMenuState();
  const [last, setLast] = useState<string | null>(null);
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <AccountMenu
        name={t.name}
        email={t.email}
        language={s.language}
        onLanguageChange={s.setLanguage}
        appearance={s.appearance}
        onAppearanceChange={s.setAppearance}
        onNavigate={(d) => setLast(t.navLabel[d])}
        onLogout={() => setLast(t.logoutTitle)}
      />
      <Box sx={{ typography: 'caption', px: 5, py: 3 }} aria-live="polite">
        {t.opened}: {last ?? t.none}
      </Box>
    </Box>
  );
}

/** Profile tab of the cliente app: Cerrar sesión asks first with the bottom sheet (pattern s81). */
function ProfileScreen() {
  const t = useT(m);
  const s = useMenuState();
  const [confirming, setConfirming] = useState(false);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <TopBar title={t.profile} />
      <AccountMenu
        name={t.name}
        email={t.email}
        language={s.language}
        onLanguageChange={s.setLanguage}
        appearance={s.appearance}
        onAppearanceChange={s.setAppearance}
        onNavigate={() => undefined}
        onLogout={() => setConfirming(true)}
      />
      <BottomNav side="client" value="profile" onChange={() => undefined} />
      <BottomSheet
        open={confirming}
        disablePortal
        onClose={() => setConfirming(false)}
        title={t.logoutTitle}
        description={t.logoutBody}
        actions={
          <ActionGroup>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              {t.cancel}
            </Button>
            <Button variant="destructive" onClick={() => setConfirming(false)}>
              {t.confirm}
            </Button>
          </ActionGroup>
        }
      />
    </Box>
  );
}

const meta = {
  title: 'Componentes/Preferencias/Menú de cuenta',
  component: AccountMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Pantalla de **cuenta en móvil** (pestaña Perfil): identidad de la persona, destinos de la cuenta, idioma y apariencia, y cerrar sesión.',
          anatomy: ['**Identidad**: avatar con iniciales, nombre y correo', '**Destinos**: Mis reservas, Direcciones, Métodos de pago, Ayuda (filas navegables)', '**Preferencias**: selector de idioma y de apariencia', '**Cerrar sesión** (fila destructiva)'],
          props: ['Totalmente controlado: `language` / `onLanguageChange`, `appearance` / `onAppearanceChange`.', '`onNavigate(destino)` abre un destino; sin él, las filas son estáticas.', '`onLogout` solo avisa: confirma con un **Panel inferior** (patrón s81) antes de cerrar la sesión.'],
          states: ['Filas: reposo · hover (puntero) · foco interior · presionado', 'Selectores: según **Selector de idioma** y **Selector de apariencia**', 'Cerrar sesión: título e icono en `status.danger.fg`'],
          tokens: [['Márgenes', 'layout.gutter.mobile'], ['Filas', 'density.comfortable (64 px)'], ['Divisores', 'border.subtle'], ['Cerrar sesión', 'status.danger.fg'], ['Avatar', 'InitialsAvatar xl']],
          responsive: ['Diseñado para 390 px y 320 px: correo largo con salto de línea, selectores a ancho completo.', 'En escritorio las mismas preferencias viven en el **Menú de usuario**.'],
          a11y: ['Lista con nombre “Opciones de la cuenta”; cada fila navegable es un único botón.', 'Sección de preferencias con encabezado `h3` y grupos con nombre propio.', 'Cerrar sesión se reconoce por el verbo y el icono, no solo por el rojo.', 'Objetivos táctiles de 64 px en filas y 52 px en selectores.'],
          content: [['Mis reservas · Direcciones guardadas · Métodos de pago · Centro de ayuda', 'My bookings · Saved addresses · Payment methods · Help center'], ['Cerrar sesión', 'Log out']],
          example: '**Ejemplo de negocio**: perfil de Sofía Ramírez, cliente de Detailing, dentro del marco de dispositivo con la navegación inferior y la confirmación de cierre de sesión.',
        }),
      },
    },
  },
} satisfies Meta<typeof AccountMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { name: '', email: '', language: 'es' as Locale, onLanguageChange: () => undefined, appearance: 'system' as AppearanceMode, onAppearanceChange: () => undefined, onLogout: () => undefined };

export const Interactive: Story = { name: 'Interactivo', args: base, render: () => <InteractiveDemo /> };
export const BusinessExample: Story = {
  name: 'Ejemplo de negocio · Perfil del cliente',
  args: base,
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
  render: () => <ProfileScreen />,
};
