import Box from '@mui/material/Box';
import MuiSwitch from '@mui/material/Switch';
import { useId, type ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { typeScale } from '../../../theme/tokens';

export interface SwitchProps {
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Label on the left, switch on the right (settings rows, default) or switch first. */
  placement?: 'end' | 'start';
}

/** On/off setting that applies immediately (notifications, availability). Not for form submits: use Checkbox. */
export function Switch({ label, description, checked, onChange, disabled, placement = 'end' }: SwitchProps) {
  const id = useId();
  const control = (
    <MuiSwitch
      checked={checked}
      disabled={disabled}
      onChange={(_, v) => onChange(v)}
      slotProps={{ input: { id, role: 'switch', 'aria-describedby': description ? `${id}-desc` : undefined } }}
      sx={{ flexShrink: 0, my: -1.5 }}
    />
  );
  return (
    <Box sx={{ display: 'flex', alignItems: description ? 'flex-start' : 'center', gap: 3, minHeight: 44, flexDirection: placement === 'start' ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
      <Box component="label" htmlFor={id} sx={{ flex: 1, minWidth: 0, cursor: disabled ? 'default' : 'pointer' }}>
        <Box component="span" sx={{ ...typeScale.body1, display: 'block', color: disabled ? bs.text.disabled : bs.text.primary }}>
          {label}
        </Box>
        {description && (
          <Box component="span" id={`${id}-desc`} sx={{ ...typeScale.body2, display: 'block', color: disabled ? bs.text.disabled : bs.text.secondary }}>
            {description}
          </Box>
        )}
      </Box>
      {control}
    </Box>
  );
}
