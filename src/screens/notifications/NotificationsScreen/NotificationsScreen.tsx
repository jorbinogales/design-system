import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import NotificationsActiveOutlined from '@mui/icons-material/NotificationsActiveOutlined';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useState, type ReactNode } from 'react';
import { Link } from '../../../components/actions/Link/Link';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { SkeletonGroup, SkeletonListRow } from '../../../components/feedback/Skeleton/Skeleton';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { NoItemsState } from '../../../components/screen-states/StatePresets/StatePresets';
import { TowTruckIcon } from '../../../icons/TowTruckIcon';
import { useLocale, useT } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { bs } from '../../../theme/theme';
import { layout, transition } from '../../../theme/tokens';
import { IconBubble, ScreenRoot, pick } from '../../profile/ui';
import { notificationItems, type NotificationItem, type NotificationKind } from '../data';

const messages = {
  es: {
    title: 'Notificaciones',
    newCount: (n: number) => (n === 1 ? '1 nueva' : `${n} nuevas`),
    today: 'Hoy',
    yesterday: 'Ayer',
    markAll: 'Marcar todo como leído',
    unread: 'No leída. ',
    emptyTitle: 'Sin notificaciones',
    emptyBody: 'Te avisaremos aquí cuando confirmemos una reserva, asignemos un operador o recibamos un pago.',
    loading: 'Cargando notificaciones',
  },
  en: {
    title: 'Notifications',
    newCount: (n: number) => `${n} new`,
    today: 'Today',
    yesterday: 'Yesterday',
    markAll: 'Mark all as read',
    unread: 'Unread. ',
    emptyTitle: 'No notifications',
    emptyBody: 'We will let you know here when we confirm a booking, assign an operator or receive a payment.',
    loading: 'Loading notifications',
  },
};

const kindIcon: Record<NotificationKind, ReactNode> = {
  'booking-confirmed': <EventAvailableOutlined />,
  'operator-assigned': <PersonOutlineRounded />,
  'auction-pickup': <TowTruckIcon />,
  payment: <ReceiptLongOutlined />,
  reminder: <NotificationsActiveOutlined />,
  promo: <LocalOfferOutlined />,
};

export interface NotificationsScreenProps {
  state?: 'default' | 'empty' | 'loading';
}

function Row({ item, onRead }: { item: NotificationItem; onRead: () => void }) {
  const t = useT(messages);
  const locale = useLocale();
  return (
    <Box component="li" sx={{ listStyle: 'none' }}>
      <ButtonBase
        onClick={onRead}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 3,
          width: '100%',
          textAlign: 'left',
          font: 'inherit',
          px: `${layout.gutter.mobile}px`,
          py: 4,
          borderBottom: `1px solid ${bs.border.subtle}`,
          backgroundColor: item.unread ? bs.surface.subtle : 'transparent',
          transition: transition('background-color'),
          '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover } },
          '&:active': { backgroundColor: bs.action.pressed },
          '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: '-2px' },
        }}
      >
        <IconBubble>{kindIcon[item.kind]}</IconBubble>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 3 }}>
            <Typography variant="body1" component="span" sx={{ fontWeight: item.unread ? 700 : 500, overflowWrap: 'anywhere' }}>
              {item.unread && <span style={visuallyHidden}>{t.unread}</span>}
              {pick(item.title, locale)}
            </Typography>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
              <Typography variant="caption" component="span" sx={{ color: bs.text.secondary, whiteSpace: 'nowrap' }}>
                {pick(item.time, locale)}
              </Typography>
              {item.unread && <Box component="span" aria-hidden sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: bs.brand.primary }} />}
            </Box>
          </Box>
          <Typography variant="body2" component="span" sx={{ display: 'block', mt: 1, color: bs.text.secondary, overflowWrap: 'anywhere' }}>
            {pick(item.body, locale)}
          </Typography>
        </Box>
      </ButtonBase>
    </Box>
  );
}

/** Notificaciones (s44 + s45): grouped Hoy / Ayer, unread = bold title + dot + hidden text, "Marcar todo como leído". */
export function NotificationsScreen({ state = 'default' }: NotificationsScreenProps) {
  const t = useT(messages);
  const [readIds, setReadIds] = useState<string[]>([]);
  const items = state === 'default' ? notificationItems.map((n) => (readIds.includes(n.id) ? { ...n, unread: false } : n)) : [];
  const unreadCount = items.filter((n) => n.unread).length;

  const sections = [
    { key: 'today' as const, label: t.today },
    { key: 'yesterday' as const, label: t.yesterday },
  ];

  let body: ReactNode;
  if (state === 'loading') {
    body = (
      <SkeletonGroup label={t.loading}>
        <SkeletonListRow />
        <SkeletonListRow />
        <SkeletonListRow />
        <SkeletonListRow />
      </SkeletonGroup>
    );
  } else if (state === 'empty') {
    body = (
      <Box sx={{ flex: 1, display: 'flex' }}>
        <NoItemsState title={t.emptyTitle} description={t.emptyBody} />
      </Box>
    );
  } else {
    body = sections.map((s, idx) => {
      const group = items.filter((n) => n.group === s.key);
      return (
        <Box component="section" key={s.key} aria-labelledby={`notif-${s.key}`}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, px: `${layout.gutter.mobile}px`, pt: idx === 0 ? 2 : 5, pb: 2 }}>
            <Typography id={`notif-${s.key}`} variant="label" component="h2" sx={{ color: bs.text.secondary }}>
              {s.label}
            </Typography>
            {idx === 0 && unreadCount > 0 && (
              <Link component="button" variant="standalone" size="sm" onClick={() => setReadIds(notificationItems.map((n) => n.id))}>
                {t.markAll}
              </Link>
            )}
          </Box>
          <Box component="ul" sx={{ m: 0, p: 0 }}>
            {group.map((n) => (
              <Row key={n.id} item={n} onRead={() => setReadIds((ids) => [...ids, n.id])} />
            ))}
          </Box>
        </Box>
      );
    });
  }

  return (
    <ScreenRoot>
      <TopBar
        title={t.title}
        onBack={() => undefined}
        actions={unreadCount > 0 ? <Tag tone="brand" label={t.newCount(unreadCount)} /> : undefined}
      />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flex: 1, pb: 6 }}>
        {body}
      </Box>
    </ScreenRoot>
  );
}
