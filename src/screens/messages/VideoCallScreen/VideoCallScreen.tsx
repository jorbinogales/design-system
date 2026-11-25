import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import MicNoneRounded from '@mui/icons-material/MicNoneRounded';
import MicOffRounded from '@mui/icons-material/MicOffRounded';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import VideocamOffOutlined from '@mui/icons-material/VideocamOffOutlined';
import VideocamOutlined from '@mui/icons-material/VideocamOutlined';
import VolumeOffRounded from '@mui/icons-material/VolumeOffRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { Media } from '../../../components/layout/Media/Media';
import { TowingIcon } from '../../../icons/TowingIcon';
import { useLocale, useT } from '../../../i18n/locale';
import { SchemeScope } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { layout, radius } from '../../../theme/tokens';
import { conversations } from '../data';
import { CallControls, CallTimer, useCallTimer } from '../shared/CallParts';

const messages = {
  es: {
    feed: (n: string) => `Video de ${n}`,
    self: 'Tu cámara',
    selfOff: 'Tu cámara está apagada',
    speaker: 'Altavoz',
    mute: 'Silenciar',
    camera: 'Cámara',
    chat: 'Chat',
    end: 'Colgar',
    lot: 'Lote',
    videoCall: 'Videollamada',
  },
  en: {
    feed: (n: string) => `Video of ${n}`,
    self: 'Your camera',
    selfOff: 'Your camera is off',
    speaker: 'Speaker',
    mute: 'Mute',
    camera: 'Camera',
    chat: 'Chat',
    end: 'End',
    lot: 'Lot',
    videoCall: 'Video call',
  },
};

export interface VideoCallScreenProps {
  conversationId?: string;
  initialSeconds?: number;
  initialMuted?: boolean;
  initialCameraOff?: boolean;
  onEnd?: () => void;
  onChat?: () => void;
}

/** Video call: full-bleed remote feed (designed fallback), self view, booking chip, timer and controls. */
export function VideoCallScreen({ conversationId = 'mateo', initialSeconds = 128, initialMuted = false, initialCameraOff = false, onEnd, onChat }: VideoCallScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const c = conversations.find((x) => x.id === conversationId) ?? conversations[0];
  const seconds = useCallTimer(initialSeconds);
  const [speaker, setSpeaker] = useState(true);
  const [muted, setMuted] = useState(initialMuted);
  const [cameraOff, setCameraOff] = useState(initialCameraOff);

  return (
    <SchemeScope scheme="dark" sx={{ flex: 1, minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: bs.surface.canvas }}>
      <Box sx={{ position: 'absolute', inset: 0, '& > *': { aspectRatio: 'auto !important', height: '100%' } }}>
        <Media alt={t.feed(c.name)} radius="none" unit="towing" scrim />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1, pt: `calc(${layout.safeAreaTop} + 12px)`, px: `${layout.gutter.mobile}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 3 }}>
        <Box sx={{ minWidth: 0 }}>
          <Tag tone="inverse" icon={<TowingIcon />} label={c.booking ? `${c.booking.code} · ${t.lot} ${c.booking.lot ?? ''}`.trim() : t.videoCall} />
        </Box>
        <Box sx={{ width: 96, flexShrink: 0, borderRadius: `${radius.lg}px`, overflow: 'hidden', boxShadow: `0 0 0 2px ${bs.surface.canvas}, ${bs.elevation.e3}` }}>
          {cameraOff ? (
            <Box role="img" aria-label={t.selfOff} sx={{ aspectRatio: '3 / 4', display: 'grid', placeItems: 'center', backgroundColor: bs.surface.raised, color: bs.text.secondary }}>
              <VideocamOffOutlined />
            </Box>
          ) : (
            <Media alt={t.self} ratio="3:4" radius="none" fallbackIcon={PersonOutlineRounded} />
          )}
        </Box>
      </Box>

      <Box sx={{ flex: 1 }} />

      <Box sx={{ position: 'relative', zIndex: 1, px: `${layout.gutter.mobile}px`, pb: 6, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h1" component="h1">
          {c.name}
        </Typography>
        <Typography variant="body2" sx={{ color: bs.text.secondary }}>
          {c.role[locale]}
        </Typography>
        <CallTimer seconds={seconds} />
      </Box>

      <CallControls
        endLabel={t.end}
        onEnd={onEnd}
        left={[
          { id: 'speaker', label: t.speaker, icon: <VolumeUpRounded />, activeIcon: <VolumeOffRounded />, pressed: !speaker, onToggle: () => setSpeaker((s) => !s) },
          { id: 'mute', label: t.mute, icon: <MicNoneRounded />, activeIcon: <MicOffRounded />, pressed: muted, onToggle: () => setMuted((m) => !m) },
        ]}
        right={[
          { id: 'camera', label: t.camera, icon: <VideocamOutlined />, activeIcon: <VideocamOffOutlined />, pressed: cameraOff, onToggle: () => setCameraOff((v) => !v) },
          { id: 'chat', label: t.chat, icon: <ChatBubbleOutlineRounded />, onToggle: onChat },
        ]}
      />
    </SchemeScope>
  );
}
