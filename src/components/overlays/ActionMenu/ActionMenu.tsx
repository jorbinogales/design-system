import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import MoreVertRounded from '@mui/icons-material/MoreVertRounded';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Fragment, useId, useState, type MouseEvent, type ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { Button } from '../../actions/Button/Button';
import { IconButton } from '../../actions/IconButton/IconButton';

export interface ActionMenuItem {
  value: string;
  label: string;
  icon?: ReactNode;
  /** Irreversible action (Cancelar reserva): danger tone, separated by a divider. */
  destructive?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  /** Accessible name of the trigger and the menu ("Acciones de la reserva"). */
  label: string;
  /** `icon` (⋮ overflow, default) or `button` (text + chevron). */
  trigger?: 'icon' | 'button';
  /** Visible text of the `button` trigger ("Acciones"). Defaults to `label`. */
  triggerText?: string;
  /** Called after any enabled item is chosen, in addition to the item's own `onSelect`. */
  onSelect?: (value: string) => void;
  /** Which edge of the trigger the menu aligns to. Use `end` for triggers at the right edge. */
  align?: 'start' | 'end';
}

/** Trigger plus menu of actions. Esc closes, arrows move, focus returns to the trigger. */
export function ActionMenu({ items, label, trigger = 'icon', triggerText, onSelect, align = 'end' }: ActionMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const id = useId();
  const open = Boolean(anchor);
  const close = () => setAnchor(null);
  const aria = { 'aria-haspopup': 'menu' as const, 'aria-expanded': open || undefined, 'aria-controls': open ? `${id}-menu` : undefined };
  const toggle = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);

  return (
    <>
      {trigger === 'icon' ? (
        <IconButton label={label} icon={<MoreVertRounded />} variant="outlined" onClick={toggle} {...aria} />
      ) : (
        <Button variant="secondary" size="md" endIcon={<KeyboardArrowDownRounded />} onClick={toggle} {...aria}>
          {triggerText ?? label}
        </Button>
      )}
      <Menu
        id={`${id}-menu`}
        anchorEl={anchor}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: align === 'end' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: align === 'end' ? 'right' : 'left' }}
        slotProps={{ list: { 'aria-label': label } }}
      >
        {items.map((item, i) => (
          <Fragment key={item.value}>
            {item.destructive && i > 0 && <Divider component="li" sx={{ my: 1 }} />}
            <MenuItem
              disabled={item.disabled}
              onClick={() => {
                close();
                item.onSelect?.();
                onSelect?.(item.value);
              }}
              sx={item.destructive ? { color: bs.status.danger.fg, '& .MuiListItemIcon-root': { color: bs.status.danger.fg } } : undefined}
            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              {item.label}
            </MenuItem>
          </Fragment>
        ))}
      </Menu>
    </>
  );
}
