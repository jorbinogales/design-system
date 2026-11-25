import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import EventNoteOutlined from '@mui/icons-material/EventNoteOutlined';
import HelpOutlineRounded from '@mui/icons-material/HelpOutlineRounded';
import LockOutlined from '@mui/icons-material/LockOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import PersonAddAltOutlined from '@mui/icons-material/PersonAddAltOutlined';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { InitialsAvatar } from '../../../components/data-display/InitialsAvatar/InitialsAvatar';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { ListGroup, ListRow } from '../../../components/layout/ListRow/ListRow';
import { BottomNav } from '../../../components/navigation/BottomNav/BottomNav';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { BottomSheet } from '../../../components/overlays/BottomSheet/BottomSheet';
import { AppearanceSelect, type AppearanceMode } from '../../../components/preferences/AppearanceSelect/AppearanceSelect';
import { LanguageSelect } from '../../../components/preferences/LanguageSelect/LanguageSelect';
import { formatMoney } from '../../../i18n/format';
import { LocaleProvider, useLocale, useT, type Locale } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { user, walletBalance } from '../data';
import { ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Perfil',
    account: 'Cuenta',
    yourProfile: 'Tu perfil',
    addresses: 'Direcciones',
    payments: 'Métodos de pago',
    bookings: 'Mis reservas',
    wallet: 'Wallet',
    prefs: 'Preferencias',
    language: 'Idioma',
    appearance: 'Apariencia',
    support: 'Ayuda y legal',
    help: 'Centro de ayuda',
    privacy: 'Política de privacidad',
    invite: 'Invitar amigos',
    logout: 'Cerrar sesión',
    sheetTitle: '¿Cerrar sesión?',
    sheetBody: 'Tus reservas y tu wallet seguirán guardados en tu cuenta. Podrás volver a entrar cuando quieras.',
    confirm: 'Sí, cerrar sesión',
    cancel: 'Cancelar',
    done: 'Cerraste sesión',
  },
  en: {
    title: 'Profile',
    account: 'Account',
    yourProfile: 'Your profile',
    addresses: 'Addresses',
    payments: 'Payment methods',
    bookings: 'My bookings',
    wallet: 'Wallet',
    prefs: 'Preferences',
    language: 'Language',
    appearance: 'Appearance',
    support: 'Help and legal',
    help: 'Help center',
    privacy: 'Privacy policy',
    invite: 'Invite friends',
    logout: 'Log out',
    sheetTitle: 'Log out?',
    sheetBody: 'Your bookings and wallet stay saved in your account. You can sign back in any time.',
    confirm: 'Yes, log out',
    cancel: 'Cancel',
    done: 'You are logged out',
  },
};

export interface ProfileScreenProps {
  /** Opens the logout confirmation sheet on mount (story 14). */
  signOutOpen?: boolean;
}

function GroupLabel({ children }: { children: string }) {
  return (
    <Typography variant="label" component="h2" sx={{ color: bs.text.secondary, px: `${layout.gutter.mobile}px`, pt: 5, pb: 1 }}>
      {children}
    </Typography>
  );
}

function ProfileContent({ signOutOpen, onLocaleChange }: ProfileScreenProps & { onLocaleChange: (l: Locale) => void }) {
  const t = useT(messages);
  const locale = useLocale();
  const toast = useToast();
  const [appearance, setAppearance] = useState<AppearanceMode>('system');
  const [sheet, setSheet] = useState(Boolean(signOutOpen));
  const icon = { color: 'inherit' } as const;

  return (
    <ScreenRoot>
      <TopBar title={t.title} align="start" />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, pt: 2, pb: 3, px: `${layout.gutter.mobile}px`, textAlign: 'center' }}>
          <InitialsAvatar name={user.name} size="xl" />
          <Typography variant="h2" component="p" sx={{ mt: 2 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary, overflowWrap: 'anywhere' }}>
            {user.email}
          </Typography>
        </Box>

        <GroupLabel>{t.account}</GroupLabel>
        <ListGroup label={t.account}>
          <ListRow leading={<PersonOutlineRounded sx={icon} />} title={t.yourProfile} onClick={() => undefined} />
          <ListRow leading={<LocationOnOutlined sx={icon} />} title={t.addresses} onClick={() => undefined} />
          <ListRow leading={<CreditCardOutlined sx={icon} />} title={t.payments} onClick={() => undefined} />
          <ListRow leading={<EventNoteOutlined sx={icon} />} title={t.bookings} onClick={() => undefined} />
          <ListRow leading={<AccountBalanceWalletOutlined sx={icon} />} title={t.wallet} trailing={formatMoney(walletBalance, locale)} onClick={() => undefined} />
        </ListGroup>

        <GroupLabel>{t.prefs}</GroupLabel>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, px: `${layout.gutter.mobile}px`, py: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" component="p" sx={{ fontWeight: 600 }}>
              {t.language}
            </Typography>
            <LanguageSelect value={locale} onChange={onLocaleChange} fullWidth />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" component="p" sx={{ fontWeight: 600 }}>
              {t.appearance}
            </Typography>
            <AppearanceSelect value={appearance} onChange={setAppearance} fullWidth />
          </Box>
        </Box>

        <GroupLabel>{t.support}</GroupLabel>
        <ListGroup label={t.support}>
          <ListRow leading={<HelpOutlineRounded sx={icon} />} title={t.help} onClick={() => undefined} />
          <ListRow leading={<LockOutlined sx={icon} />} title={t.privacy} onClick={() => undefined} />
          <ListRow leading={<PersonAddAltOutlined sx={icon} />} title={t.invite} onClick={() => undefined} />
          <ListRow leading={<LogoutRounded sx={icon} />} title={t.logout} destructive divider={false} onClick={() => setSheet(true)} />
        </ListGroup>
        <Box sx={{ height: 16 }} />
      </Box>

      <BottomNav side="client" value="profile" />

      <BottomSheet
        open={sheet}
        onClose={() => setSheet(false)}
        title={t.sheetTitle}
        description={t.sheetBody}
        disablePortal
        actions={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Button variant="destructive" fullWidth onClick={() => { setSheet(false); toast.show({ message: t.done, severity: 'neutral' }); }}>
              {t.confirm}
            </Button>
            <Button variant="quiet" fullWidth onClick={() => setSheet(false)}>
              {t.cancel}
            </Button>
          </Box>
        }
      />
    </ScreenRoot>
  );
}

/** Perfil (s69): avatar, account menu, language and appearance, help and logout, with the client BottomNav. */
export function ProfileScreen({ signOutOpen }: ProfileScreenProps) {
  // The language selector flips the whole screen locally; it also follows the Storybook toolbar.
  const global = useLocale();
  const [locale, setLocale] = useState<Locale>(global);
  useEffect(() => setLocale(global), [global]);
  return (
    <LocaleProvider locale={locale}>
      <ToastProvider offsetBottom={80}>
        <ProfileContent signOutOpen={signOutOpen} onLocaleChange={setLocale} />
      </ToastProvider>
    </LocaleProvider>
  );
}
