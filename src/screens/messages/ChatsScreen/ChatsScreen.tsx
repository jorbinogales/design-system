import EditOutlined from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { Counter } from '../../../components/data-display/Counter/Counter';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { SearchField } from '../../../components/fields/SearchField/SearchField';
import { SkeletonGroup, SkeletonListRow } from '../../../components/feedback/Skeleton/Skeleton';
import { BottomNav } from '../../../components/navigation/BottomNav/BottomNav';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { NoItemsState, NoResultsState } from '../../../components/screen-states/StatePresets/StatePresets';
import { FilterChipGroup } from '../../../components/selection/FilterChip/FilterChip';
import { unitIcon } from '../../../icons/unitIcon';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout, transition } from '../../../theme/tokens';
import { conversations as allConversations, type Conversation } from '../data';
import { ConversationAvatar } from '../shared/ChatParts';

const messages = {
  es: {
    title: 'Mensajes',
    search: 'Buscar conversaciones',
    searchPlaceholder: 'Buscar por nombre o reserva',
    newMessage: 'Nueva conversación',
    filters: 'Filtrar conversaciones',
    all: 'Todos',
    unread: 'No leídos',
    list: 'Conversaciones',
    you: 'Tú: ',
    unreadLabel: (n: number) => (n === 1 ? '1 mensaje sin leer' : `${n} mensajes sin leer`),
    emptyTitle: 'Aún no tienes conversaciones',
    emptyBody: 'Cuando reserves un servicio podrás escribirle al equipo desde aquí. También puedes hablar con Soporte.',
    emptyAction: 'Escribir a Soporte',
    loading: 'Cargando conversaciones',
  },
  en: {
    title: 'Messages',
    search: 'Search conversations',
    searchPlaceholder: 'Search by name or booking',
    newMessage: 'New conversation',
    filters: 'Filter conversations',
    all: 'All',
    unread: 'Unread',
    list: 'Conversations',
    you: 'You: ',
    unreadLabel: (n: number) => (n === 1 ? '1 unread message' : `${n} unread messages`),
    emptyTitle: "You don't have any conversations yet",
    emptyBody: 'Once you book a service you can message the team from here. You can also talk to Support.',
    emptyAction: 'Message Support',
    loading: 'Loading conversations',
  },
};

const ellipsis = { display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

/** One conversation: avatar, name + time, preview + unread counter, booking context. Local because ListRow adds a chevron to navigable rows. */
function ConversationRow({ conversation: c, onOpen }: { conversation: Conversation; onOpen?: (id: string) => void }) {
  const t = useT(messages);
  const locale = useLocale();
  const unread = c.unread > 0;
  const UnitIcon = c.booking ? unitIcon[c.booking.unit] : undefined;
  return (
    <Box component="li" sx={{ listStyle: 'none' }}>
      <ButtonBase
        onClick={() => onOpen?.(c.id)}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '56px minmax(0, 1fr)',
          columnGap: 4,
          alignItems: 'start',
          textAlign: 'left',
          px: `${layout.gutter.mobile}px`,
          py: 4,
          borderBottom: `1px solid ${bs.border.subtle}`,
          minHeight: 88,
          transition: transition('background-color'),
          '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover } },
          '&:active': { backgroundColor: bs.action.pressed },
        }}
      >
        <ConversationAvatar conversation={c} />
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 3 }}>
            <Typography variant="h4" component="span" sx={{ ...ellipsis }}>
              {c.name}
            </Typography>
            <Typography variant="caption" component="span" sx={{ color: unread ? bs.text.primary : bs.text.secondary, fontWeight: unread ? 700 : 500, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
              {c.when[locale]}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Typography variant="body2" component="span" sx={{ ...ellipsis, color: unread ? bs.text.primary : bs.text.secondary, fontWeight: unread ? 600 : 400 }}>
              {c.lastFromMe && t.you}
              {c.last[locale]}
            </Typography>
            {unread && <Counter value={c.unread} tone="brand" size="sm" label={t.unreadLabel(c.unread)} />}
          </Box>
          {c.booking ? (
            <Box sx={{ pt: 1 }}>
              <Tag size="sm" tone="outline" icon={UnitIcon && <UnitIcon />} label={c.booking.lot ? `${c.booking.code} · ${locale === 'es' ? 'Lote' : 'Lot'} ${c.booking.lot}` : c.booking.code} />
            </Box>
          ) : (
            <Typography variant="caption" component="span" sx={{ color: bs.text.secondary }}>
              {c.role[locale]}
            </Typography>
          )}
        </Box>
      </ButtonBase>
    </Box>
  );
}

export interface ChatsScreenProps {
  /** Conversations to list. Pass `[]` for the empty state. */
  conversations?: Conversation[];
  loading?: boolean;
  defaultQuery?: string;
  onOpen?: (id: string) => void;
}

/** Chats: inverse header with search, filter chips, conversation list, client bottom nav (Chat active). */
export function ChatsScreen({ conversations = allConversations, loading = false, defaultQuery = '', onOpen }: ChatsScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const [query, setQuery] = useState(defaultQuery);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [nav, setNav] = useState('chat');

  const unreadTotal = conversations.reduce((n, c) => n + c.unread, 0);
  const q = query.trim().toLocaleLowerCase();
  const visible = conversations.filter((c) => {
    if (filter === 'unread' && c.unread === 0) return false;
    if (!q) return true;
    return [c.name, c.booking?.code ?? '', c.booking?.lot ?? '', c.last[locale]].some((s) => s.toLocaleLowerCase().includes(q));
  });

  const clear = () => {
    setQuery('');
    setFilter('all');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar
        tone="inverse"
        align="start"
        title={t.title}
        actions={<IconButton label={t.newMessage} icon={<EditOutlined />} variant="filled" />}
      >
        <SearchField label={t.search} hideLabel placeholder={t.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />
      </TopBar>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {conversations.length > 0 && !loading && (
          <Box sx={{ px: `${layout.gutter.mobile}px`, pt: 4, pb: 2 }}>
            <FilterChipGroup
              selectionMode="single"
              label={t.filters}
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: t.all },
                { value: 'unread', label: t.unread, count: unreadTotal },
              ]}
            />
          </Box>
        )}

        {loading ? (
          <Box sx={{ pt: 2 }}>
            <SkeletonGroup label={t.loading}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <SkeletonListRow key={i} />
              ))}
            </SkeletonGroup>
          </Box>
        ) : conversations.length === 0 ? (
          <NoItemsState title={t.emptyTitle} description={t.emptyBody} primaryAction={<Button variant="secondary" size="md" fullWidth>{t.emptyAction}</Button>} />
        ) : visible.length === 0 ? (
          <NoResultsState query={query || undefined} onClear={clear} />
        ) : (
          <Box component="ul" aria-label={t.list} sx={{ m: 0, p: 0 }}>
            {visible.map((c) => (
              <ConversationRow key={c.id} conversation={c} onOpen={onOpen} />
            ))}
          </Box>
        )}
      </Box>

      <BottomNav side="client" value={nav} onChange={setNav} badges={{ chat: unreadTotal }} />
    </Box>
  );
}
