import CreditCardRounded from '@mui/icons-material/CreditCardRounded';
import EventNoteOutlined from '@mui/icons-material/EventNoteOutlined';
import HelpOutlineRounded from '@mui/icons-material/HelpOutlineRounded';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useId } from 'react';
import { useT, type Locale } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { InitialsAvatar } from '../../data-display/InitialsAvatar/InitialsAvatar';
import { ListGroup, ListRow } from '../../layout/ListRow/ListRow';
import { AppearanceSelect, type AppearanceMode } from '../AppearanceSelect/AppearanceSelect';
import { LanguageSelect } from '../LanguageSelect/LanguageSelect';

export type AccountDestination = 'bookings' | 'addresses' | 'payments' | 'help';

export interface AccountMenuProps {
  name: string;
  email: string;
  language: Locale;
  onLanguageChange: (value: Locale) => void;
  appearance: AppearanceMode;
  onAppearanceChange: (value: AppearanceMode) => void;
  /** Opens a destination. Without it the rows are static. */
  onNavigate?: (destination: AccountDestination) => void;
  /** Cerrar sesión. Confirm it with a BottomSheet (see the Panel inferior story). */
  onLogout: () => void;
}

const messages = {
  es: {
    account: 'Opciones de la cuenta',
    bookings: 'Mis reservas',
    bookingsDesc: 'Próximas, completadas y canceladas',
    addresses: 'Direcciones guardadas',
    addressesDesc: 'Casa, trabajo y recogidas frecuentes',
    payments: 'Métodos de pago',
    paymentsDesc: 'Tarjetas y comprobantes',
    help: 'Centro de ayuda',
    preferences: 'Preferencias',
    logout: 'Cerrar sesión',
  },
  en: {
    account: 'Account options',
    bookings: 'My bookings',
    bookingsDesc: 'Upcoming, completed and cancelled',
    addresses: 'Saved addresses',
    addressesDesc: 'Home, work and frequent pickups',
    payments: 'Payment methods',
    paymentsDesc: 'Cards and receipts',
    help: 'Help center',
    preferences: 'Preferences',
    logout: 'Log out',
  },
};

/** Mobile account menu (Perfil): identity, account destinations, language and appearance, log out. */
export function AccountMenu({ name, email, language, onLanguageChange, appearance, onAppearanceChange, onNavigate, onLogout }: AccountMenuProps) {
  const t = useT(messages);
  const prefsId = useId();
  const go = (d: AccountDestination) => (onNavigate ? () => onNavigate(d) : undefined);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, px: `${layout.gutter.mobile}px`, pt: 4, pb: 6, textAlign: 'center' }}>
        <InitialsAvatar name={name} size="xl" decorative />
        <Box sx={{ minWidth: 0, maxWidth: '100%' }}>
          <Typography variant="h3" component="h2" sx={{ overflowWrap: 'anywhere' }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary, overflowWrap: 'anywhere' }}>
            {email}
          </Typography>
        </Box>
      </Box>
      <ListGroup label={t.account}>
        <ListRow leading={<EventNoteOutlined />} title={t.bookings} description={t.bookingsDesc} onClick={go('bookings')} />
        <ListRow leading={<LocationOnOutlined />} title={t.addresses} description={t.addressesDesc} onClick={go('addresses')} />
        <ListRow leading={<CreditCardRounded />} title={t.payments} description={t.paymentsDesc} onClick={go('payments')} />
        <ListRow leading={<HelpOutlineRounded />} title={t.help} onClick={go('help')} />
      </ListGroup>
      <Box component="section" aria-labelledby={prefsId} sx={{ px: `${layout.gutter.mobile}px`, py: 6, display: 'flex', flexDirection: 'column', gap: 4, borderBottom: `1px solid ${bs.border.subtle}` }}>
        <Typography id={prefsId} variant="h4" component="h3">
          {t.preferences}
        </Typography>
        <LanguageSelect value={language} onChange={onLanguageChange} fullWidth size="lg" />
        <AppearanceSelect value={appearance} onChange={onAppearanceChange} fullWidth size="lg" />
      </Box>
      <ListGroup>
        <ListRow leading={<LogoutRounded />} title={t.logout} onClick={onLogout} destructive divider={false} />
      </ListGroup>
    </Box>
  );
}
