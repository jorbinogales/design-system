import MenuItem from '@mui/material/MenuItem';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { TextField, type TextFieldProps } from '../../fields/TextField/TextField';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> extends Omit<TextFieldProps, 'select' | 'value' | 'onChange' | 'children' | 'clearable' | 'onClear'> {
  options: SelectOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
  /** Shown while nothing is selected. */
  placeholder?: string;
  /** Native `<select>` (best on mobile for long lists of plain text). */
  native?: boolean;
  /** Custom rendering for each option (menu mode only). */
  renderOption?: (option: SelectOption<T>) => ReactNode;
}

/** Single choice from a list too long for radios (vehicle make, state, auction). Field look shared with TextField. */
export function Select<T extends string>({ options, value, onChange, placeholder, native = false, renderOption, slotProps, ...rest }: SelectProps<T>) {
  return (
    <TextField
      {...rest}
      select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      slotProps={{
        ...slotProps,
        select: {
          native,
          displayEmpty: !native,
          renderValue: native ? undefined : (v: unknown) => (v === '' ? <span style={{ color: bs.text.secondary }}>{placeholder}</span> : options.find((o) => o.value === v)?.label),
        },
      }}
    >
      {native
        ? [
            <option key="" value="" disabled>
              {placeholder ?? ''}
            </option>,
            ...options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            )),
          ]
        : options.map((o) => (
            <MenuItem key={o.value} value={o.value} disabled={o.disabled}>
              {renderOption ? renderOption(o) : o.label}
            </MenuItem>
          ))}
    </TextField>
  );
}
