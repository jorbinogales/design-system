import CheckRounded from '@mui/icons-material/CheckRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useId, useState } from 'react';
import { bs } from '../../../theme/theme';
import { layout, radius, transition } from '../../../theme/tokens';

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps<T extends string = string> {
  /** What the dropdown controls ("Unidad", "Ordenar por"). Always part of the accessible name. */
  label: string;
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Hide the visible label (keep it for screen readers) when the context already says it. */
  hideLabel?: boolean;
  /** `md` 44px (default) or `sm` 36px for dense desktop toolbars. */
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

/**
 * Button that shows the current value and opens a list of options (filter and sort toolbars).
 * For form fields use `Select`; this one is a toolbar control.
 */
export function Dropdown<T extends string>({ label, options, value, onChange, hideLabel = false, size = 'md', fullWidth = false }: DropdownProps<T>) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const id = useId();
  const open = Boolean(anchor);
  const current = options.find((o) => o.value === value);
  const height = size === 'sm' ? layout.controlHeight.sm : layout.controlHeight.md;

  return (
    <>
      <ButtonBase
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-haspopup="listbox"
        aria-expanded={open || undefined}
        aria-controls={open ? `${id}-list` : undefined}
        aria-label={`${label}: ${current?.label ?? ''}`}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          minHeight: height,
          width: fullWidth ? '100%' : undefined,
          maxWidth: '100%',
          px: 3.5,
          borderRadius: `${radius.pill}px`,
          border: `1px solid ${bs.border.strong}`,
          color: bs.text.primary,
          backgroundColor: 'transparent',
          font: 'inherit',
          transition: transition('background-color'),
          '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover } },
          '&:active': { backgroundColor: bs.action.pressed },
          '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: '2px' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, minWidth: 0 }}>
          {!hideLabel && (
            <Typography variant="body2" component="span" sx={{ color: bs.text.secondary, flexShrink: 0 }}>
              {label}
            </Typography>
          )}
          <Typography variant="label" component="span" noWrap sx={{ fontWeight: 600 }}>
            {current?.label}
          </Typography>
        </Box>
        <KeyboardArrowDownRounded aria-hidden sx={{ fontSize: 20, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: transition('transform') }} />
      </ButtonBase>
      <Menu
        id={`${id}-list`}
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        slotProps={{ list: { role: 'listbox', 'aria-label': label } }}
      >
        {options.map((o) => (
          <MenuItem
            key={o.value}
            role="option"
            selected={o.value === value}
            aria-selected={o.value === value}
            disabled={o.disabled}
            onClick={() => {
              setAnchor(null);
              onChange(o.value);
            }}
          >
            <Box component="span" sx={{ flex: 1 }}>
              {o.label}
            </Box>
            {o.value === value && (
              <ListItemIcon sx={{ ml: 2, color: `${bs.text.primary} !important` }}>
                <CheckRounded fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
