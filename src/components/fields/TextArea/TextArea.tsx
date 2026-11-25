import Box from '@mui/material/Box';
import { formatNumber } from '../../../i18n/format';
import { useLocale } from '../../../i18n/locale';
import { TextField, type TextFieldProps } from '../TextField/TextField';

export interface TextAreaProps extends Omit<TextFieldProps, 'multiline' | 'type' | 'clearable' | 'startIcon' | 'prefix'> {
  minRows?: number;
  maxRows?: number;
  /** Hard limit; also shows a live "120 / 500" counter. */
  maxLength?: number;
}

/** Multi-line text (notes for the provider, access instructions, review). Grows with content. */
export function TextArea({ minRows = 3, maxRows = 8, maxLength, value, helperText, slotProps, ...rest }: TextAreaProps) {
  const locale = useLocale();
  const length = String(value ?? '').length;
  const counter = maxLength ? (
    <Box component="span" aria-live="polite" sx={{ ml: 'auto', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
      {formatNumber(length, locale)} / {formatNumber(maxLength, locale)}
    </Box>
  ) : null;
  return (
    <TextField
      {...rest}
      multiline
      minRows={minRows}
      maxRows={maxRows}
      value={value}
      helperText={
        counter ? (
          <Box component="span" sx={{ display: 'flex', gap: 3, width: '100%' }}>
            <span>{helperText}</span>
            {counter}
          </Box>
        ) : (
          helperText
        )
      }
      slotProps={{ ...slotProps, htmlInput: { maxLength } }}
    />
  );
}
