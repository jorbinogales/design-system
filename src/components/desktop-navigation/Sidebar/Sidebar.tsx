import AssessmentOutlined from '@mui/icons-material/AssessmentOutlined';
import AssessmentRounded from '@mui/icons-material/AssessmentRounded';
import BadgeOutlined from '@mui/icons-material/BadgeOutlined';
import BadgeRounded from '@mui/icons-material/BadgeRounded';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import EventNoteOutlined from '@mui/icons-material/EventNoteOutlined';
import EventNoteRounded from '@mui/icons-material/EventNoteRounded';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import GroupRounded from '@mui/icons-material/GroupRounded';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import TodayOutlined from '@mui/icons-material/TodayOutlined';
import TodayRounded from '@mui/icons-material/TodayRounded';
import WorkOutlineRounded from '@mui/icons-material/WorkOutlineRounded';
import WorkRounded from '@mui/icons-material/WorkRounded';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { BlackSeatMark } from '../../../brand/BlackSeatMark';
import { Wordmark } from '../../../brand/Wordmark';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius, transition } from '../../../theme/tokens';
import { IconButton } from '../../actions/IconButton/IconButton';

/** Who is signed in on the operator side. Items are gated by it. */
export type StaffRole = 'operator' | 'admin';

export interface SidebarItem {
  value: string;
  label: string;
  /** Outlined glyph at rest. */
  icon: ReactNode;
  /** Filled glyph when active. */
  activeIcon?: ReactNode;
  /** `true` dot or count (jobs pending assignment). */
  badge?: boolean | number;
  href?: string;
  /** Roles that can see it. Omit = everyone. */
  roles?: StaffRole[];
  /** Group heading shown above the first item of the group. */
  section?: string;
}

export interface SidebarProps {
  /** Defaults to `useSidebarItems()`. */
  items?: SidebarItem[];
  value: string;
  onChange: (value: string) => void;
  role: StaffRole;
  /** Compact (icon-only) rail, 72 px. Expanded is 248 px. */
  collapsed?: boolean;
  /** Shows the collapse toggle when provided. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Bottom slot: usually the UserMenu. */
  footer?: ReactNode;
  /** Accessible name of the navigation. */
  label?: string;
}

const messages = {
  es: {
    nav: 'Navegación del operador',
    operations: 'Operación',
    admin: 'Administración',
    today: 'Hoy',
    jobs: 'Trabajos',
    schedule: 'Agenda',
    staff: 'Personal',
    clients: 'Clientes',
    reports: 'Reportes',
    settings: 'Configuración',
    collapse: 'Contraer barra lateral',
    expand: 'Expandir barra lateral',
    pending: (n: number) => `${n} pendientes`,
  },
  en: {
    nav: 'Operator navigation',
    operations: 'Operations',
    admin: 'Administration',
    today: 'Today',
    jobs: 'Jobs',
    schedule: 'Schedule',
    staff: 'Staff',
    clients: 'Customers',
    reports: 'Reports',
    settings: 'Settings',
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
    pending: (n: number) => `${n} pending`,
  },
};

/**
 * Destinations of the operator/admin side. Operator: Hoy, Trabajos, Agenda.
 * Admin adds Personal, Clientes, Reportes, Configuración.
 */
export function useSidebarItems(badges: Partial<Record<string, boolean | number>> = {}): SidebarItem[] {
  const t = useT(messages);
  return [
    { value: 'today', label: t.today, icon: <TodayOutlined />, activeIcon: <TodayRounded />, section: t.operations, badge: badges.today },
    { value: 'jobs', label: t.jobs, icon: <WorkOutlineRounded />, activeIcon: <WorkRounded />, badge: badges.jobs },
    { value: 'schedule', label: t.schedule, icon: <EventNoteOutlined />, activeIcon: <EventNoteRounded /> },
    { value: 'staff', label: t.staff, icon: <BadgeOutlined />, activeIcon: <BadgeRounded />, roles: ['admin'], section: t.admin },
    { value: 'clients', label: t.clients, icon: <GroupOutlined />, activeIcon: <GroupRounded />, roles: ['admin'] },
    { value: 'reports', label: t.reports, icon: <AssessmentOutlined />, activeIcon: <AssessmentRounded />, roles: ['admin'] },
    { value: 'settings', label: t.settings, icon: <SettingsOutlined />, activeIcon: <SettingsRounded />, roles: ['admin'] },
  ];
}

export const sidebarWidth = { expanded: 248, collapsed: 72 } as const;

/**
 * Desktop navigation rail: expanded or compact, active destination, items gated by role.
 * Hiding items is a convenience; the server must still authorize every route and action.
 */
export function Sidebar({ items, value, onChange, role, collapsed = false, onCollapsedChange, footer, label }: SidebarProps) {
  const t = useT(messages);
  const defaults = useSidebarItems();
  const visible = (items ?? defaults).filter((i) => !i.roles || i.roles.includes(role));
  const width = collapsed ? sidebarWidth.collapsed : sidebarWidth.expanded;

  return (
    <Box
      component="aside"
      sx={{
        width,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: bs.surface.subtle,
        borderRight: `1px solid ${bs.border.subtle}`,
        transition: transition('width'),
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', gap: 2, height: 64, px: collapsed ? 0 : 5, flexShrink: 0 }}>
        {collapsed ? <BlackSeatMark size={32} /> : <Wordmark size="sm" withMark />}
        {onCollapsedChange && !collapsed && <IconButton label={t.collapse} icon={<ChevronLeftRounded />} size="sm" tooltip onClick={() => onCollapsedChange(true)} aria-expanded />}
      </Box>
      <Box component="nav" aria-label={label ?? t.nav} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: collapsed ? 2 : 3, py: 2 }}>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {visible.map((item, i) => {
            const active = item.value === value;
            const showSection = item.section && (collapsed ? i > 0 : true);
            const count = typeof item.badge === 'number' ? item.badge : undefined;
            const glyph = (
              <Badge color="primary" variant={item.badge === true ? 'dot' : 'standard'} badgeContent={count} max={99} invisible={!item.badge} overlap="circular">
                {active && item.activeIcon ? item.activeIcon : item.icon}
              </Badge>
            );
            const accessibleName = count ? `${item.label}, ${t.pending(count)}` : item.label;
            const control = (
              <ButtonBase
                component={item.href ? 'a' : 'button'}
                href={item.href}
                onClick={() => onChange(item.value)}
                aria-current={active ? 'page' : undefined}
                aria-label={collapsed || count ? accessibleName : undefined}
                sx={{
                  position: 'relative',
                  width: '100%',
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: 3,
                  px: collapsed ? 0 : 3,
                  borderRadius: `${radius.sm}px`,
                  font: 'inherit',
                  textAlign: 'left',
                  color: bs.text.primary,
                  backgroundColor: active ? bs.selection.bg : 'transparent',
                  transition: transition('background-color'),
                  '@media (hover: hover)': { '&:hover': { backgroundColor: active ? bs.selection.bg : bs.action.hover } },
                  '&:active': { backgroundColor: bs.action.pressed },
                  '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: '2px' },
                  '&::before': active ? { content: '""', position: 'absolute', left: collapsed ? -6 : -12, top: 10, bottom: 10, width: 3, borderRadius: `${radius.pill}px`, backgroundColor: bs.brand.primary } : undefined,
                  '& .MuiSvgIcon-root': { color: active ? bs.text.primary : bs.text.secondary },
                }}
              >
                {glyph}
                {!collapsed && (
                  <Typography variant="label" component="span" sx={{ fontWeight: active ? 700 : 500, flex: 1, overflowWrap: 'anywhere' }}>
                    {item.label}
                  </Typography>
                )}
                {!collapsed && count !== undefined && (
                  <Typography variant="caption" component="span" aria-hidden sx={{ color: bs.text.secondary, fontWeight: 600 }}>
                    {count}
                  </Typography>
                )}
              </ButtonBase>
            );
            return (
              <Box component="li" key={item.value} sx={{ listStyle: 'none' }}>
                {showSection && !collapsed && (
                  <Typography variant="caption" component="p" sx={{ color: bs.text.secondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', px: 3, pt: i > 0 ? 4 : 2, pb: 1 }}>
                    {item.section}
                  </Typography>
                )}
                {showSection && collapsed && <Box role="separator" sx={{ height: 1, backgroundColor: bs.border.subtle, mx: 2, my: 2 }} />}
                {collapsed ? (
                  <Tooltip title={item.label} placement="right">
                    {control}
                  </Tooltip>
                ) : (
                  control
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2, p: collapsed ? 2 : 3, borderTop: `1px solid ${bs.border.subtle}`, alignItems: collapsed ? 'center' : 'stretch' }}>
        {footer}
        {onCollapsedChange && collapsed && <IconButton label={t.expand} icon={<ChevronRightRounded />} size="sm" tooltip onClick={() => onCollapsedChange(false)} aria-expanded={false} />}
      </Box>
    </Box>
  );
}
