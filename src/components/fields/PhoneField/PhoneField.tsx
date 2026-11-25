import { useT } from '../../../i18n/locale';
import { TextField, type TextFieldProps } from '../TextField/TextField';

export interface PhoneFieldProps extends Omit<TextFieldProps, 'type' | 'label' | 'prefix'> {
  /** Defaults to "Teléfono móvil" / "Mobile phone". */
  label?: string;
  /** Country calling code shown as a fixed prefix. */
  countryCode?: string;
}

const messages = { es: { phone: 'Teléfono móvil' }, en: { phone: 'Mobile phone' } };

/** Phone input: tel keyboard, national-number autofill and a country-code prefix (+1 by default). */
export function PhoneField({ label, countryCode = '+1', slotProps, ...rest }: PhoneFieldProps) {
  const t = useT(messages);
  return (
    <TextField
      type="tel"
      autoComplete="tel-national"
      placeholder="(305) 555-0142"
      label={label ?? t.phone}
      prefix={countryCode}
      {...rest}
      slotProps={{
        ...slotProps,
        htmlInput: { inputMode: 'tel', ...(typeof slotProps?.htmlInput === 'object' ? slotProps.htmlInput : {}) },
      }}
    />
  );
}
