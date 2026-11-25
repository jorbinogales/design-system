import MoreVertRounded from '@mui/icons-material/MoreVertRounded';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { Fragment, useId, useState, type ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { IconButton } from '../../actions/IconButton/IconButton';

export interface RowMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  /** Irreversible action (Cancelar reserva): danger text. */
  destructive?: boolean;
  disabled?: boolean;
  /** Hairline above this item, to separate the destructive group. */
  dividerBefore?: boolean;
}

export interface RowMenuProps {
  items: RowMenuItem[];
  /** Accessible name of the trigger, naming the row: "Acciones de Valeria Ortiz". */
  label: string;
  /** `sm` 36 px for dense desktop tables · `md` 44 px on touch cards. */
  size?: 'sm' | 'md';
}

/**
 * Per-row "more actions" menu: a kebab button and the themed MUI Menu. Pressing it never triggers the row's own
 * click (it stops propagation, including from the portaled menu), so a clickable row and its menu coexist.
 */
export function RowMenu({ items, label, size = 'sm' }: RowMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const id = useId();
  const open = Boolean(anchor);
  return (
    <Box component="span" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} sx={{ display: 'inline-flex' }}>
      <IconButton
        label={label}
        icon={<MoreVertRounded />}
        size={size}
        tooltip
        aria-haspopup="menu"
        aria-expanded={open || undefined}
        aria-controls={open ? id : undefined}
        onClick={(e) => setAnchor(e.currentTarget)}
      />
      <Menu id={id} anchorEl={anchor} open={open} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {items.map((item) => (
          <Fragment key={item.id}>
            {item.dividerBefore && <Divider sx={{ my: 0.5 }} />}
            <MenuItem
              disabled={item.disabled}
              onClick={() => {
                setAnchor(null);
                item.onClick();
              }}
              sx={item.destructive ? { color: bs.status.danger.fg, '& .MuiListItemIcon-root': { color: bs.status.danger.fg } } : undefined}
            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText>{item.label}</ListItemText>
            </MenuItem>
          </Fragment>
        ))}
      </Menu>
    </Box>
  );
}
