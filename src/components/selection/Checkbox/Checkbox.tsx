import Box from '@mui/material/Box';
import MuiCheckbox, { type CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { useId, type ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { typeScale } from '../../../theme/tokens';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'color' | 'size'> {
  label: ReactNode;
  /** Second line under the label. */
  description?: ReactNode;
  /** Error message (e.g. terms not accepted). */
  error?: string;
}

/** Checkbox with label, description and error. Orange fill with charcoal check when selected. */
export function Checkbox({ label, description, error, disabled, ...rest }: CheckboxProps) {
  const id = useId();
  const describedBy = [description && `${id}-desc`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;
  return (
    <Box>
      <FormControlLabel
        disabled={disabled}
        sx={{ alignItems: description ? 'flex-start' : 'center' }}
        control={<MuiCheckbox {...rest} slotProps={{ input: { 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined } }} sx={description ? { mt: -1.5 } : undefined} />}
        label={
          <Box>
            <Box component="span" sx={{ ...typeScale.body1, display: 'block' }}>
              {label}
            </Box>
            {description && (
              <Box component="span" id={`${id}-desc`} sx={{ ...typeScale.body2, display: 'block', color: disabled ? bs.text.disabled : bs.text.secondary }}>
                {description}
              </Box>
            )}
          </Box>
        }
      />
      {error && (
        <FormHelperText id={`${id}-err`} error role="alert" sx={{ ml: '34px', mt: 0 }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}
