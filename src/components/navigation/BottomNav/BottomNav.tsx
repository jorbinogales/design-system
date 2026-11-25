import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import ChatBubbleRounded from '@mui/icons-material/ChatBubbleRounded';
import EventNoteOutlined from '@mui/icons-material/EventNoteOutlined';
import EventNoteRounded from '@mui/icons-material/EventNoteRounded';
import ExploreOutlined from '@mui/icons-material/ExploreOutlined';
import ExploreRounded from '@mui/icons-material/ExploreRounded';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import HomeRounded from '@mui/icons-material/HomeRounded';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import TodayOutlined from '@mui/icons-material/TodayOutlined';
import TodayRounded from '@mui/icons-material/TodayRounded';
import WorkOutlineRounded from '@mui/icons-material/WorkOutlineRounded';
import WorkRounded from '@mui/icons-material/WorkRounded';
import Badge from '@mui/material/Badge';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout, radius, transition, zLayer } from '../../../theme/tokens';

/** Which side of the product: `client` (cliente) or `operator` (operador). */
export type NavSide = 'client' | 'operator';
export type ClientDestination = 'home' | 'explore' | 'bookings' | 'chat' | 'profile';
export type OperatorDestination = 'today' | 'jobs' | 'messages' | 'profile';

export interface NavDestination {
  value: string;
  label: string;
  /** Outlined glyph at rest. */
  icon: ReactNode;
  /** Filled glyph when active. */
  activeIcon?: ReactNode;
  /** `true` dot or unread count. */
  badge?: boolean | number;
  href?: string;
}

const messages = {
  es: {
    nav: 'Navegación principal',
    home: 'Inicio',
    explore: 'Explorar',
    bookings: 'Reservas',
    chat: 'Chat',
    profile: 'Perfil',
    today: 'Hoy',
    jobs: 'Trabajos',
    messages: 'Mensajes',
  },
  en: {
    nav: 'Main navigation',
    home: 'Home',
    explore: 'Explore',
    bookings: 'Bookings',
    chat: 'Chat',
    profile: 'Profile',
    today: 'Today',
    jobs: 'Jobs',
    messages: 'Messages',
  },
};

/** Localized preset destinations for each side. Override `badge` per screen. */
export function useNavDestinations(side: NavSide): NavDestination[] {
  const t = useT(messages);
  if (side === 'operator') {
    return [
      { value: 'today', label: t.today, icon: <TodayOutlined />, activeIcon: <TodayRounded /> },
      { value: 'jobs', label: t.jobs, icon: <WorkOutlineRounded />, activeIcon: <WorkRounded /> },
      { value: 'messages', label: t.messages, icon: <ChatBubbleOutlineRounded />, activeIcon: <ChatBubbleRounded /> },
      { value: 'profile', label: t.profile, icon: <PersonOutlineRounded />, activeIcon: <PersonRounded /> },
    ];
  }
  return [
    { value: 'home', label: t.home, icon: <HomeOutlined />, activeIcon: <HomeRounded /> },
    { value: 'explore', label: t.explore, icon: <ExploreOutlined />, activeIcon: <ExploreRounded /> },
    { value: 'bookings', label: t.bookings, icon: <EventNoteOutlined />, activeIcon: <EventNoteRounded /> },
    { value: 'chat', label: t.chat, icon: <ChatBubbleOutlineRounded />, activeIcon: <ChatBubbleRounded /> },
    { value: 'profile', label: t.profile, icon: <PersonOutlineRounded />, activeIcon: <PersonRounded /> },
  ];
}

export interface BottomNavProps {
  /** Preset destinations: cliente (5) or operador (4). Ignored when `destinations` is given. */
  side?: NavSide;
  destinations?: NavDestination[];
  /** Badges keyed by destination value, merged onto presets: `{ chat: 2 }`. */
  badges?: Record<string, boolean | number>;
  value: string;
  onChange?: (value: string) => void;
  position?: 'sticky' | 'fixed' | 'static';
}

/** Mobile bottom navigation with an orange-tinted active pill and safe-area padding. */
export function BottomNav({ side = 'client', destinations, badges, value, onChange, position = 'sticky' }: BottomNavProps) {
  const t = useT(messages);
  const preset = useNavDestinations(side);
  const items = (destinations ?? preset).map((d) => ({ ...d, badge: badges?.[d.value] ?? d.badge }));
  return (
    <Box
      component="nav"
      aria-label={t.nav}
      sx={{
        position,
        ...(position !== 'static' && { bottom: 0, left: 0, right: 0, zIndex: zLayer.bottomBar }),
        mt: 'auto',
        backgroundColor: bs.surface.raised,
        borderTop: `1px solid ${bs.border.subtle}`,
        pb: layout.safeAreaBottom,
      }}
    >
      <BottomNavigation showLabels value={value} onChange={(_, next: string) => onChange?.(next)} sx={{ maxWidth: layout.maxWidth.mobile, mx: 'auto' }}>
        {items.map((d) => {
          const selected = d.value === value;
          const glyph = selected ? (d.activeIcon ?? d.icon) : d.icon;
          return (
            <BottomNavigationAction
              key={d.value}
              value={d.value}
              label={d.label}
              aria-current={selected ? 'page' : undefined}
              {...(d.href ? { component: 'a', href: d.href } : {})}
              icon={
                <Box
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 56,
                    height: 30,
                    borderRadius: `${radius.pill}px`,
                    backgroundColor: selected ? bs.selection.bg : 'transparent',
                    transition: transition('background-color'),
                  }}
                >
                  {d.badge ? (
                    <Badge color="primary" variant={d.badge === true ? 'dot' : 'standard'} badgeContent={d.badge === true ? undefined : d.badge} max={99}>
                      {glyph}
                    </Badge>
                  ) : (
                    glyph
                  )}
                </Box>
              }
            />
          );
        })}
      </BottomNavigation>
    </Box>
  );
}
