import CancelRounded from '@mui/icons-material/CancelRounded';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import MuiIconButton from '@mui/material/IconButton';
import MuiTextField, { type TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import type { ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { bs } from '../../../theme/theme';

type SlotObject = Record<string, unknown>;

export interface TextFieldProps
  extends Omit<MuiTextFieldProps, 'variant' | 'error' | 'helperText' | 'color' | 'label' | 'size' | 'hiddenLabel'> {
  /** Visible label above the field. Always required (it is the accessible name). */
  label: string;
  /** Keep the label for screen readers only (search inside a header). */
  hideLabel?: boolean;
  helperText?: ReactNode;
  /** `true` marks the field invalid; a string also replaces the helper with the error message. */
  error?: boolean | string;
  /** Adds "(opcional)" after the label. Use on the minority of fields, never with `required`. */
  optional?: boolean;
  readOnly?: boolean;
  /** Shows a clear button while there is a value. Requires `onClear`. */
  clearable?: boolean;
  onClear?: () => void;
  /** Leading icon inside the field. */
  startIcon?: ReactNode;
  /** Trailing element (unit text, IconButton). Rendered before the clear button. */
  endAdornment?: ReactNode;
  /** Leading text such as a country code ("+1"). */
  prefix?: string;
  /** `lg` 52px (default, touch) · `md` 44px (dense desktop). */
  size?: 'md' | 'lg';
}

const messages = {
  es: { optional: 'opcional', clear: (l: string) => `Borrar ${l.toLowerCase()}` },
  en: { optional: 'optional', clear: (l: string) => `Clear ${l.toLowerCase()}` },
};

const asObject = (v: unknown): SlotObject => (v && typeof v === 'object' ? (v as SlotObject) : {});

/**
 * Base text field: label above, soft gray fill, helper or error with icon. Every Black Six
 * field (email, phone, search, password, code, textarea) is a preset of this one.
 * Raw MUI `TextField` is themed to look the same, so Phase 2 can also use it directly.
 */
export function TextField({
  label,
  hideLabel = false,
  helperText,
  error,
  optional = false,
  readOnly = false,
  clearable = false,
  onClear,
  startIcon,
  endAdornment,
  prefix,
  size = 'lg',
  value,
  disabled,
  slotProps,
  ...rest
}: TextFieldProps) {
  const t = useT(messages);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const showClear = clearable && hasValue && !readOnly && !disabled && Boolean(onClear);
  const errorMessage = typeof error === 'string' ? error : undefined;

  const userInput = asObject(slotProps?.input);
  const userLabel = asObject(slotProps?.inputLabel);
  const userHtml = asObject(slotProps?.htmlInput);

  const start =
    startIcon || prefix ? (
      <InputAdornment position="start">
        {startIcon}
        {prefix && (
          <Box component="span" sx={{ color: bs.text.primary, fontWeight: 600 }}>
            {prefix}
          </Box>
        )}
      </InputAdornment>
    ) : undefined;

  const end =
    endAdornment || showClear ? (
      <InputAdornment position="end" sx={{ gap: 1 }}>
        {endAdornment}
        {showClear && (
          <MuiIconButton size="small" aria-label={t.clear(label)} onClick={onClear} edge="end" sx={{ color: bs.text.secondary }}>
            <CancelRounded />
          </MuiIconButton>
        )}
      </InputAdornment>
    ) : undefined;

  return (
    <MuiTextField
      {...rest}
      value={value}
      disabled={disabled}
      error={Boolean(error)}
      size={size === 'md' ? 'small' : 'medium'}
      label={
        <>
          {label}
          {optional && (
            <Box component="span" sx={{ color: bs.text.secondary, fontWeight: 400 }}>
              {` (${t.optional})`}
            </Box>
          )}
        </>
      }
      helperText={
        errorMessage ? (
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'flex-start', gap: 1 }}>
            <ErrorOutlineRounded aria-hidden sx={{ fontSize: 16, mt: '1px' }} />
            {errorMessage}
          </Box>
        ) : (
          helperText
        )
      }
      slotProps={{
        ...slotProps,
        inputLabel: { shrink: true, ...userLabel, sx: hideLabel ? visuallyHidden : undefined },
        input: { startAdornment: start, endAdornment: end, readOnly, ...userInput },
        htmlInput: { ...userHtml },
        formHelperText: { ...asObject(slotProps?.formHelperText), role: errorMessage ? 'alert' : undefined },
      }}
    />
  );
}
