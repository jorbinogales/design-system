import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import MuiRadio from '@mui/material/Radio';
import MuiRadioGroup from '@mui/material/RadioGroup';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { typeScale } from '../../../theme/tokens';

export interface RadioOption<T extends string = string> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string = string> {
  /** Question the group answers ("Método de pago"). Rendered as the legend. */
  label: string;
  options: RadioOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  orientation?: 'vertical' | 'horizontal';
  helperText?: ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
}

/** Single choice among 2–6 visible options (the brief: services are chosen by single selection). */
export function RadioGroup<T extends string>({ label, options, value, onChange, orientation = 'vertical', helperText, error, required, disabled, name }: RadioGroupProps<T>) {
  return (
    <FormControl component="fieldset" error={Boolean(error)} required={required} disabled={disabled} sx={{ border: 0, p: 0, m: 0 }}>
      <FormLabel component="legend" sx={{ mb: 2 }}>
        {label}
      </FormLabel>
      <MuiRadioGroup name={name} row={orientation === 'horizontal'} value={value ?? ''} onChange={(_, v) => onChange(v as T)} sx={{ columnGap: 6 }}>
        {options.map((o) => (
          <FormControlLabel
            key={o.value}
            value={o.value}
            disabled={o.disabled}
            control={<MuiRadio sx={o.description ? { mt: -1.5 } : undefined} />}
            sx={{ alignItems: o.description ? 'flex-start' : 'center', minHeight: 44 }}
            label={
              <Box>
                <Box component="span" sx={{ ...typeScale.body1, display: 'block' }}>
                  {o.label}
                </Box>
                {o.description && (
                  <Box component="span" sx={{ ...typeScale.body2, display: 'block', color: bs.text.secondary }}>
                    {o.description}
                  </Box>
                )}
              </Box>
            }
          />
        ))}
      </MuiRadioGroup>
      {(error || helperText) && <FormHelperText role={error ? 'alert' : undefined}>{error ?? helperText}</FormHelperText>}
    </FormControl>
  );
}

/** Single radio with label, for custom layouts. Prefer RadioGroup. */
export function Radio({ label, value, checked, onChange, disabled }: { label: ReactNode; value: string; checked: boolean; onChange: () => void; disabled?: boolean }) {
  return <FormControlLabel value={value} disabled={disabled} control={<MuiRadio checked={checked} onChange={onChange} />} label={label} />;
}
