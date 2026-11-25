import { useT } from '../../../i18n/locale';
import { TextField, type TextFieldProps } from '../TextField/TextField';

export interface EmailFieldProps extends Omit<TextFieldProps, 'type' | 'label'> {
  /** Defaults to "Correo electrónico" / "Email". */
  label?: string;
}

const messages = { es: { email: 'Correo electrónico' }, en: { email: 'Email' } };

/** Email input: email keyboard, autofill, no autocapitalize or spellcheck. */
export function EmailField({ label, slotProps, ...rest }: EmailFieldProps) {
  const t = useT(messages);
  return (
    <TextField
      type="email"
      autoComplete="email"
      label={label ?? t.email}
      {...rest}
      slotProps={{
        ...slotProps,
        htmlInput: { inputMode: 'email', autoCapitalize: 'none', spellCheck: false, ...(typeof slotProps?.htmlInput === 'object' ? slotProps.htmlInput : {}) },
      }}
    />
  );
}
