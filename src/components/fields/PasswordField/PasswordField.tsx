import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import MuiIconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { TextField, type TextFieldProps } from '../TextField/TextField';

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'label' | 'clearable' | 'endAdornment'> {
  /** Defaults to "Contraseña" / "Password". */
  label?: string;
  /** `current` for sign-in, `new` for sign-up / reset (lets password managers suggest one). */
  purpose?: 'current' | 'new';
}

const messages = {
  es: { password: 'Contraseña', show: 'Mostrar contraseña', hide: 'Ocultar contraseña' },
  en: { password: 'Password', show: 'Show password', hide: 'Hide password' },
};

/** Password input with a show/hide toggle. Only used if sign-in by password is enabled. */
export function PasswordField({ label, purpose = 'current', ...rest }: PasswordFieldProps) {
  const t = useT(messages);
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      label={label ?? t.password}
      type={visible ? 'text' : 'password'}
      autoComplete={purpose === 'new' ? 'new-password' : 'current-password'}
      {...rest}
      endAdornment={
        <MuiIconButton
          aria-label={visible ? t.hide : t.show}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          edge="end"
          sx={{ color: bs.text.secondary }}
        >
          {visible ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
        </MuiIconButton>
      }
    />
  );
}
