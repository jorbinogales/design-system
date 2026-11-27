import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius, transition, typeScale } from '../../../theme/tokens';
import { TextField } from '../TextField/TextField';
import { normalizeCode, type CodeCharset } from './normalizeCode';

export interface CodeFieldProps {
  /**
   * `identifier` (default): one field for lot numbers, pickup codes, plates; keeps leading zeros.
   * `otp`: one box per digit for verification codes, with paste and SMS autofill.
   */
  variant?: 'identifier' | 'otp';
  label: string;
  /** Always a string. Never convert to a number (leading zeros would be lost). */
  value: string;
  onChange: (value: string) => void;
  /** OTP only: number of boxes. */
  length?: number;
  /** Identifier only: allowed characters. `alphanumeric` uppercases input. */
  charset?: CodeCharset;
  /** Identifier only: maximum length. */
  maxLength?: number;
  helperText?: ReactNode;
  error?: boolean | string;
  required?: boolean;
  optional?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Identifier only. */
  clearable?: boolean;
  autoFocus?: boolean;
  name?: string;
}

const messages = {
  es: { digit: (i: number, n: number) => `Dígito ${i} de ${n}` },
  en: { digit: (i: number, n: number) => `Digit ${i} of ${n}` },
};

const codeInputSx = { '& .MuiInputBase-input': { ...typeScale.code, fontSize: '1.0625rem', fontVariantNumeric: 'tabular-nums slashed-zero' } };

/** Code entry: verification codes (OTP boxes) or operational identifiers (lot, pickup code). */
export function CodeField(props: CodeFieldProps) {
  if (props.variant === 'otp') return <OtpField {...props} />;
  const { label, value, onChange, charset = 'numeric', maxLength, clearable = true, ...rest } = props;
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(normalizeCode(e.target.value, charset, maxLength))}
      onClear={() => onChange('')}
      clearable={clearable}
      helperText={rest.helperText}
      error={rest.error}
      required={rest.required}
      optional={rest.optional}
      readOnly={rest.readOnly}
      disabled={rest.disabled}
      placeholder={rest.placeholder}
      autoFocus={rest.autoFocus}
      name={rest.name}
      autoComplete="off"
      sx={codeInputSx}
      slotProps={{
        htmlInput: {
          inputMode: charset === 'numeric' ? 'numeric' : 'text',
          pattern: charset === 'numeric' ? '[0-9]*' : '[A-Z0-9]*',
          autoCapitalize: charset === 'numeric' ? 'off' : 'characters',
          spellCheck: false,
          maxLength,
        },
      }}
    />
  );
}

function OtpField({ label, value, onChange, length = 4, helperText, error, required, disabled, autoFocus, name }: CodeFieldProps) {
  const t = useT(messages);
  const base = useId();
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = Array.from({ length }, (_, i) => value[i] ?? '');
  const errorMessage = typeof error === 'string' ? error : undefined;
  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const write = (i: number, raw: string) => {
    const digits = normalizeCode(raw, 'numeric');
    if (!digits) return;
    const next = (value.slice(0, i) + digits).slice(0, length);
    onChange(next);
    // Defer: onFocus bounces focus back while `value` is still the pre-update closure.
    requestAnimationFrame(() => focus(next.length));
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (chars[i]) onChange(value.slice(0, i) + value.slice(i + 1));
      else if (i > 0) {
        onChange(value.slice(0, i - 1) + value.slice(i));
        focus(i - 1);
      }
    } else if (e.key === 'ArrowLeft') focus(i - 1);
    else if (e.key === 'ArrowRight') focus(i + 1);
  };

  return (
    <Box role="group" aria-labelledby={`${base}-label`} aria-describedby={helperText || errorMessage ? `${base}-help` : undefined}>
      <Box component="label" id={`${base}-label`} htmlFor={`${base}-0`} sx={{ ...typeScale.label, display: 'block', mb: 2, color: disabled ? bs.text.disabled : bs.text.primary }}>
        {label}
        {required && (
          <Box component="span" aria-hidden sx={{ color: bs.status.danger.fg }}>
            {' *'}
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {chars.map((c, i) => (
          <Box
            key={i}
            component="input"
            id={`${base}-${i}`}
            ref={(el: HTMLInputElement | null) => {
              refs.current[i] = el;
            }}
            name={name ? `${name}-${i}` : undefined}
            value={c}
            disabled={disabled}
            autoFocus={autoFocus && i === 0}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={length}
            aria-label={t.digit(i + 1, length)}
            aria-invalid={Boolean(error) || undefined}
            aria-required={required || undefined}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => write(i, e.target.value.replace(c, '') || e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => onKeyDown(i, e)}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
              if (i > value.length) focus(value.length);
              else e.target.select();
            }}
            sx={{
              ...typeScale.h2,
              fontFamily: 'inherit',
              fontVariantNumeric: 'tabular-nums',
              width: 0,
              flex: '1 1 0',
              maxWidth: 64,
              height: 64,
              textAlign: 'center',
              color: bs.text.primary,
              caretColor: bs.brand.primary,
              backgroundColor: bs.surface.subtle,
              border: `1px solid ${c ? bs.border.strong : bs.border.field}`,
              borderRadius: `${radius.md}px`,
              outline: 'none',
              transition: transition('border-color', 'background-color', 'box-shadow'),
              '&:focus': { backgroundColor: bs.surface.raised, borderColor: bs.selection.border, boxShadow: `inset 0 0 0 1px ${bs.selection.border}` },
              ...(error && { borderColor: bs.status.danger.solid, boxShadow: `inset 0 0 0 1px ${bs.status.danger.solid}` }),
              '&:disabled': { backgroundColor: bs.disabled.bg, color: bs.text.disabled, borderColor: bs.disabled.border },
            }}
          />
        ))}
      </Box>
      {(errorMessage || helperText) && (
        <FormHelperText id={`${base}-help`} error={Boolean(error)} role={errorMessage ? 'alert' : undefined}>
          {errorMessage ? (
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'flex-start', gap: 1 }}>
              <ErrorOutlineRounded aria-hidden sx={{ fontSize: 16, mt: '1px' }} />
              {errorMessage}
            </Box>
          ) : (
            helperText
          )}
        </FormHelperText>
      )}
    </Box>
  );
}
