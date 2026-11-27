import AddRounded from '@mui/icons-material/AddRounded';
import ArrowUpwardRounded from '@mui/icons-material/ArrowUpwardRounded';
import CameraAltOutlined from '@mui/icons-material/CameraAltOutlined';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import DoneAllRounded from '@mui/icons-material/DoneAllRounded';
import MicNoneRounded from '@mui/icons-material/MicNoneRounded';
import MyLocationRounded from '@mui/icons-material/MyLocationRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import PhotoLibraryOutlined from '@mui/icons-material/PhotoLibraryOutlined';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import VideocamOutlined from '@mui/icons-material/VideocamOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useNav } from '../../../app/nav';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { Card } from '../../../components/layout/Card/Card';
import { ListGroup, ListRow } from '../../../components/layout/ListRow/ListRow';
import { Media } from '../../../components/layout/Media/Media';
import { chatPhoto } from '../../../mocks/photos';
import { TextField } from '../../../components/fields/TextField/TextField';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { BottomSheet } from '../../../components/overlays/BottomSheet/BottomSheet';
import { unitIcon } from '../../../icons/unitIcon';
import { visuallyHidden } from '../../../theme/a11y';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout, radius } from '../../../theme/tokens';
import { conversations, formatDuration, mateoThread, waveform, type ThreadMessage } from '../data';
import { ConversationAvatar } from '../shared/ChatParts';

const messages = {
  es: {
    online: 'En línea',
    offline: 'Fuera de línea',
    call: 'Llamar',
    video: 'Videollamada',
    today: 'Hoy',
    thread: 'Mensajes de la conversación',
    viewBooking: (code: string) => `Ver reserva ${code}`,
    lot: 'Lote',
    composer: 'Mensaje',
    placeholder: 'Escribe un mensaje',
    attach: 'Adjuntar',
    send: 'Enviar mensaje',
    record: 'Grabar nota de voz',
    read: 'Leído',
    play: (d: string) => `Reproducir nota de voz, ${d}`,
    pause: (d: string) => `Pausar nota de voz, ${d}`,
    sheetTitle: 'Adjuntar',
    takePhoto: 'Tomar foto',
    choosePhoto: 'Elegir de la galería',
    shareLocation: 'Compartir mi ubicación',
    myPhoto: 'Foto enviada por ti',
    fromThem: (n: string) => `${n} dice`,
    fromMe: 'Tú dices',
  },
  en: {
    online: 'Online',
    offline: 'Offline',
    call: 'Call',
    video: 'Video call',
    today: 'Today',
    thread: 'Conversation messages',
    viewBooking: (code: string) => `View booking ${code}`,
    lot: 'Lot',
    composer: 'Message',
    placeholder: 'Type a message',
    attach: 'Attach',
    send: 'Send message',
    record: 'Record voice note',
    read: 'Read',
    play: (d: string) => `Play voice note, ${d}`,
    pause: (d: string) => `Pause voice note, ${d}`,
    sheetTitle: 'Attach',
    takePhoto: 'Take photo',
    choosePhoto: 'Choose from library',
    shareLocation: 'Share my location',
    myPhoto: 'Photo you sent',
    fromThem: (n: string) => `${n} says`,
    fromMe: 'You say',
  },
};

const orangeButtonSx = {
  backgroundColor: bs.action.primary.bg,
  color: bs.action.primary.fg,
  '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.primary.hover } },
  '&:active': { backgroundColor: bs.action.primary.pressed },
};

function MessageMeta({ time, mine, read }: { time: string; mine: boolean; read?: boolean }) {
  const t = useT(messages);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: mine ? 'flex-end' : 'flex-start', color: bs.text.secondary, mt: 1 }}>
      <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {time}
      </Typography>
      {mine && read && (
        <>
          <DoneAllRounded aria-hidden sx={{ fontSize: 14 }} />
          <Typography variant="caption">{t.read}</Typography>
        </>
      )}
    </Box>
  );
}

function VoiceBubble({ duration }: { duration: number }) {
  const t = useT(messages);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setElapsed((e) => {
        if (e >= duration) {
          setPlaying(false);
          return 0;
        }
        return e + 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, duration]);
  const label = formatDuration(duration);
  const progress = elapsed / duration;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 236 }}>
      <IconButton
        label={playing ? t.pause(label) : t.play(label)}
        icon={playing ? <PauseRounded /> : <PlayArrowRounded />}
        variant="plain"
        size="md"
        onClick={() => setPlaying((p) => !p)}
        sx={{ backgroundColor: bs.text.primary, color: bs.surface.canvas, '&:hover': { backgroundColor: bs.text.primary } }}
      />
      <Box aria-hidden sx={{ display: 'flex', alignItems: 'center', gap: '2px', height: 32, flex: 1 }}>
        {waveform.map((h, i) => (
          <Box key={i} sx={{ width: 3, height: `${Math.round(h * 100)}%`, borderRadius: 2, backgroundColor: i / waveform.length < progress ? bs.text.primary : bs.border.strong }} />
        ))}
      </Box>
      <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums', color: bs.text.primary, fontWeight: 600 }}>
        {playing ? formatDuration(elapsed) : label}
      </Typography>
    </Box>
  );
}

function Bubble({ message, personName }: { message: ThreadMessage; personName: string }) {
  const t = useT(messages);
  const locale = useLocale();
  const mine = message.from === 'me';
  const isPhoto = message.kind === 'photo';
  return (
    <Box component="li" sx={{ listStyle: 'none', alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
      <Box component="span" sx={visuallyHidden}>
        {mine ? t.fromMe : t.fromThem(personName)}
      </Box>
      <Box
        sx={{
          p: isPhoto ? 1 : undefined,
          px: isPhoto ? undefined : 4,
          py: isPhoto ? undefined : 3,
          borderRadius: `${radius.lg}px`,
          borderBottomRightRadius: mine ? '4px' : `${radius.lg}px`,
          borderBottomLeftRadius: mine ? `${radius.lg}px` : '4px',
          backgroundColor: mine ? bs.selection.bg : bs.surface.subtle,
          color: bs.text.primary,
          width: isPhoto ? 240 : undefined,
        }}
      >
        {message.kind === 'text' && <Typography variant="body1">{message.text[locale]}</Typography>}
        {message.kind === 'photo' && <Media src={chatPhoto} alt={message.alt[locale]} ratio="4:3" radius="md" unit="towing" />}
        {message.kind === 'voice' && <VoiceBubble duration={message.duration} />}
      </Box>
      <MessageMeta time={message.time[locale]} mine={mine} read={message.read} />
    </Box>
  );
}

export interface ConversationScreenProps {
  conversationId?: string;
  /** Open the attach sheet on mount. */
  initialSheetOpen?: boolean;
  /** Text already typed in the composer. */
  defaultDraft?: string;
  onBack?: () => void;
  onCall?: () => void;
  onVideo?: () => void;
}

/** Conversation: inverse header with presence and call actions, booking chip, bubbles, composer. */
export function ConversationScreen({ conversationId = 'mateo', initialSheetOpen = false, defaultDraft = '', onBack, onCall, onVideo }: ConversationScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const nav = useNav();
  const inApp = Boolean(nav.route.name);
  const conversation = conversations.find((c) => c.id === conversationId) ?? conversations[0];
  const [thread, setThread] = useState<ThreadMessage[]>(mateoThread);
  const [draft, setDraft] = useState(defaultDraft);
  const [sheet, setSheet] = useState(initialSheetOpen);
  const endRef = useRef<HTMLLIElement>(null);
  const sent = useRef(0);

  useEffect(() => {
    if (sent.current > 0) endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [thread.length]);

  const push = (m: ThreadMessage) => {
    sent.current += 1;
    setThread((prev) => [...prev, m]);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const time = new Intl.DateTimeFormat(locale === 'es' ? 'es-US' : 'en-US', { hour: 'numeric', minute: '2-digit' }).format(now);
    push({ id: `me-${sent.current}`, from: 'me', kind: 'text', time: { es: time, en: time }, text: { es: text, en: text } });
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const booking = conversation.booking;
  const BookingIcon = booking ? unitIcon[booking.unit] : undefined;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar
        tone="inverse"
        align="start"
        onBack={onBack ?? (inApp ? nav.back : undefined)}
        leading={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 0 }}>
            <ConversationAvatar conversation={conversation} size="md" showPresence={false} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h3" component="h1" noWrap>
                {conversation.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box aria-hidden sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: conversation.online ? bs.status.success.solid : 'transparent', border: conversation.online ? 'none' : `1.5px solid ${bs.text.secondary}`, boxSizing: 'border-box' }} />
                <Typography variant="caption" sx={{ color: bs.text.secondary }} noWrap>
                  {conversation.online ? t.online : t.offline} · {conversation.role[locale]}
                </Typography>
              </Box>
            </Box>
          </Box>
        }
        actions={
          <>
            <IconButton label={t.call} icon={<PhoneOutlined />} variant="filled" onClick={onCall ?? (() => nav.go('voice-call', { conversationId: conversation.id }))} />
            <IconButton label={t.video} icon={<VideocamOutlined />} variant="filled" onClick={onVideo ?? (() => nav.go('video-call', { conversationId: conversation.id }))} />
          </>
        }
      />

      {booking && BookingIcon && (
        <Box sx={{ px: `${layout.gutter.mobile}px`, pt: 3 }}>
          <Card variant="filled" density="compact" onClick={() => nav.go('track-order', { bookingId: booking.code })} label={t.viewBooking(booking.code)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box aria-hidden sx={{ width: 40, height: 40, borderRadius: `${radius.md}px`, display: 'grid', placeItems: 'center', flexShrink: 0, backgroundColor: bs.surface.raised, boxShadow: bs.elevation.e1 }}>
                <BookingIcon />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="label" component="p" noWrap sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {booking.code}
                  {booking.lot ? ` · ${t.lot} ${booking.lot}` : ''} · {booking.title[locale]}
                </Typography>
                <Typography variant="caption" component="p" noWrap sx={{ color: bs.text.secondary }}>
                  {booking.detail[locale]}
                </Typography>
              </Box>
              <ChevronRightRounded aria-hidden sx={{ color: bs.text.secondary }} />
            </Box>
          </Card>
        </Box>
      )}

      <Box sx={{ flex: 1, px: `${layout.gutter.mobile}px`, pt: 4, pb: 4 }}>
        <Typography variant="caption" component="p" sx={{ textAlign: 'center', color: bs.text.secondary, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 4 }}>
          {t.today}
        </Typography>
        <Box component="ul" role="log" aria-label={t.thread} sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {thread.map((m) => (
            <Bubble key={m.id} message={m} personName={conversation.name} />
          ))}
          <Box component="li" ref={endRef} aria-hidden sx={{ listStyle: 'none', height: 0 }} />
        </Box>
      </Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          mt: 'auto',
          zIndex: 2,
          backgroundColor: bs.surface.raised,
          borderTop: `1px solid ${bs.border.subtle}`,
          px: 3,
          pt: 3,
          pb: `calc(12px + ${layout.safeAreaBottom})`,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 2,
        }}
      >
        <IconButton label={t.attach} icon={<AddRounded />} variant="filled" size="lg" onClick={() => setSheet(true)} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TextField label={t.composer} hideLabel placeholder={t.placeholder} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown} multiline maxRows={4} autoComplete="off" />
        </Box>
        {draft.trim() ? (
          <IconButton label={t.send} icon={<ArrowUpwardRounded />} size="lg" onClick={send} sx={orangeButtonSx} />
        ) : (
          <IconButton label={t.record} icon={<MicNoneRounded />} variant="filled" size="lg" />
        )}
      </Box>

      <BottomSheet open={sheet} onClose={() => setSheet(false)} title={t.sheetTitle} disablePortal>
        <ListGroup>
          <ListRow
            as="li"
            title={t.takePhoto}
            leading={<CameraAltOutlined />}
            inset="none"
            onClick={() => {
              push({ id: `photo-${sent.current}`, from: 'me', kind: 'photo', time: { es: '9:44 a. m.', en: '9:44 AM' }, alt: { es: t.myPhoto, en: t.myPhoto } });
              setSheet(false);
            }}
          />
          <ListRow as="li" title={t.choosePhoto} leading={<PhotoLibraryOutlined />} inset="none" onClick={() => setSheet(false)} />
          <ListRow as="li" title={t.shareLocation} leading={<MyLocationRounded />} inset="none" divider={false} onClick={() => setSheet(false)} />
        </ListGroup>
      </BottomSheet>
    </Box>
  );
}
