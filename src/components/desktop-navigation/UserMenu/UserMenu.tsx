import CheckRounded from '@mui/icons-material/CheckRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useId, useState } from 'react';
import { useT, type Locale } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius, transition } from '../../../theme/tokens';
import { InitialsAvatar } from '../../data-display/InitialsAvatar/InitialsAvatar';
import type { AppearanceMode } from '../../preferences/AppearanceSelect/AppearanceSelect';
import type { StaffRole } from '../Sidebar/Sidebar';

export interface UserMenuProps {
  name: string;
  role: StaffRole;
  language: Locale;
  onLanguageChange: (value: Locale) => void;
  appearance: AppearanceMode;
  onAppearanceChange: (value: AppearanceMode) => void;
  onProfile: () => void;
  onLogout: () => void;
  /** Avatar only (inside a compact sidebar). The name and role stay in the accessible name. */
  compact?: boolean;
  /** `above` opens upward (sidebar footer); `below` downward (top header). */
  placement?: 'above' | 'below';
}

const messages = {
  es: { profile: 'Perfil', appearance: 'Apariencia', language: 'Idioma', logout: 'Cerrar sesión', light: 'Claro', dark: 'Oscuro', system: 'Sistema', operator: 'Operador', admin: 'Administrador', open: 'Menú de usuario' },
  en: { profile: 'Profile', appearance: 'Appearance', language: 'Language', logout: 'Log out', light: 'Light', dark: 'Dark', system: 'System', operator: 'Operator', admin: 'Admin', open: 'User menu' },
};

/** Avatar, name and role; opens Perfil, Apariencia, Idioma and Cerrar sesión. */
export function UserMenu({ name, role, language, onLanguageChange, appearance, onAppearanceChange, onProfile, onLogout, compact = false, placement = 'above' }: UserMenuProps) {
  const t = useT(messages);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const id = useId();
  const open = Boolean(anchor);
  const close = () => setAnchor(null);
  const above = placement === 'above';
  const roleLabel = t[role];

  const radio = (checked: boolean, label: string, onSelect: () => void) => (
    <MenuItem key={label} role="menuitemradio" aria-checked={checked} selected={checked} onClick={() => { onSelect(); close(); }}>
      <Box component="span" sx={{ flex: 1 }}>
        {label}
      </Box>
      {checked && (
        <ListItemIcon sx={{ ml: 2, color: `${bs.text.primary} !important` }}>
          <CheckRounded fontSize="small" />
        </ListItemIcon>
      )}
    </MenuItem>
  );

  return (
    <>
      <ButtonBase
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={open || undefined}
        aria-controls={open ? `${id}-menu` : undefined}
        aria-label={`${t.open}: ${name}, ${roleLabel}`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          width: compact ? 44 : '100%',
          minHeight: 48,
          justifyContent: compact ? 'center' : 'flex-start',
          px: compact ? 0 : 2,
          borderRadius: `${radius.md}px`,
          font: 'inherit',
          textAlign: 'left',
          color: bs.text.primary,
          transition: transition('background-color'),
          '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover } },
          '&:active': { backgroundColor: bs.action.pressed },
          '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: '2px' },
        }}
      >
        <InitialsAvatar name={name} size="md" decorative />
        {!compact && (
          <>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="label" component="span" noWrap sx={{ display: 'block' }}>
                {name}
              </Typography>
              <Typography variant="caption" component="span" noWrap sx={{ display: 'block', color: bs.text.secondary }}>
                {roleLabel}
              </Typography>
            </Box>
            <KeyboardArrowDownRounded aria-hidden sx={{ color: bs.text.secondary, transform: above ? 'rotate(180deg)' : undefined }} />
          </>
        )}
      </ButtonBase>
      <Menu
        id={`${id}-menu`}
        anchorEl={anchor}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: above ? 'top' : 'bottom', horizontal: above ? 'left' : 'right' }}
        transformOrigin={{ vertical: above ? 'bottom' : 'top', horizontal: above ? 'left' : 'right' }}
        slotProps={{ list: { 'aria-label': t.open }, paper: { sx: { minWidth: 240, mb: above ? 1 : 0 } } }}
      >
        <MenuItem onClick={() => { close(); onProfile(); }}>
          <ListItemIcon>
            <PersonOutlineRounded />
          </ListItemIcon>
          {t.profile}
        </MenuItem>
        <Divider component="li" sx={{ my: 1 }} />
        <ListSubheader component="li" role="presentation" sx={{ lineHeight: '28px', backgroundColor: 'transparent', color: bs.text.secondary, typography: 'caption', fontWeight: 600 }}>
          {t.appearance}
        </ListSubheader>
        {radio(appearance === 'light', t.light, () => onAppearanceChange('light'))}
        {radio(appearance === 'dark', t.dark, () => onAppearanceChange('dark'))}
        {radio(appearance === 'system', t.system, () => onAppearanceChange('system'))}
        <Divider component="li" sx={{ my: 1 }} />
        <ListSubheader component="li" role="presentation" sx={{ lineHeight: '28px', backgroundColor: 'transparent', color: bs.text.secondary, typography: 'caption', fontWeight: 600 }}>
          {t.language}
        </ListSubheader>
        {radio(language === 'es', 'Español', () => onLanguageChange('es'))}
        {radio(language === 'en', 'English', () => onLanguageChange('en'))}
        <Divider component="li" sx={{ my: 1 }} />
        <MenuItem onClick={() => { close(); onLogout(); }} sx={{ color: bs.status.danger.fg, '& .MuiListItemIcon-root': { color: bs.status.danger.fg } }}>
          <ListItemIcon>
            <LogoutRounded />
          </ListItemIcon>
          {t.logout}
        </MenuItem>
      </Menu>
    </>
  );
}
