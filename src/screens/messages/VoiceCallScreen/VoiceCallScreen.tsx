import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import MicNoneRounded from '@mui/icons-material/MicNoneRounded';
import MicOffRounded from '@mui/icons-material/MicOffRounded';
import VideocamOutlined from '@mui/icons-material/VideocamOutlined';
import VolumeOffRounded from '@mui/icons-material/VolumeOffRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { BlackSixMark } from '../../../brand/BlackSixMark';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { initialsOf } from '../../../components/data-display/InitialsAvatar/InitialsAvatar';
import { TowingIcon } from '../../../icons/TowingIcon';
import { useLocale, useT } from '../../../i18n/locale';
import { SchemeScope } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { conversations } from '../data';
import { CallControls, CallTimer, useCallTimer } from '../shared/CallParts';

const messages = {
  es: { speaker: 'Altavoz', mute: 'Silenciar', video: 'Video', chat: 'Chat', end: 'Colgar', voiceCall: 'Llamada de voz', lot: 'Lote', muted: 'Tu micrófono está silenciado' },
  en: { speaker: 'Speaker', mute: 'Mute', video: 'Video', chat: 'Chat', end: 'End', voiceCall: 'Voice call', lot: 'Lot', muted: 'Your microphone is muted' },
};

export interface VoiceCallScreenProps {
  conversationId?: string;
  initialSeconds?: number;
  initialMuted?: boolean;
  onEnd?: () => void;
  onVideo?: () => void;
  onChat?: () => void;
}

/** Voice call: avatar on rings over the dark canvas, name, timer, same controls as the video call. */
export function VoiceCallScreen({ conversationId = 'mateo', initialSeconds = 72, initialMuted = false, onEnd, onVideo, onChat }: VoiceCallScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const c = conversations.find((x) => x.id === conversationId) ?? conversations[0];
  const seconds = useCallTimer(initialSeconds);
  const [speaker, setSpeaker] = useState(false);
  const [muted, setMuted] = useState(initialMuted);

  return (
    <SchemeScope
      scheme="dark"
      sx={{
        flex: 1,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: bs.surface.canvas,
        backgroundImage: `radial-gradient(circle at 50% 38%, ${bs.surface.raised} 0%, ${bs.surface.canvas} 62%)`,
      }}
    >
      <Box sx={{ pt: `calc(${layout.safeAreaTop} + 12px)`, px: `${layout.gutter.mobile}px`, display: 'flex', justifyContent: 'center' }}>
        <Tag tone="inverse" icon={<TowingIcon />} label={c.booking ? `${c.booking.code} · ${t.lot} ${c.booking.lot ?? ''}`.trim() : t.voiceCall} />
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, px: `${layout.gutter.mobile}px` }}>
        <Box
          aria-hidden
          sx={{
            width: 148,
            height: 148,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: bs.surface.muted,
            color: bs.text.primary,
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            boxShadow: `0 0 0 18px ${bs.surface.raised}, 0 0 0 19px ${bs.border.subtle}, 0 0 0 52px ${bs.surface.canvas}, 0 0 0 53px ${bs.border.subtle}`,
            m: '53px',
          }}
        >
          {c.kind === 'support' ? <BlackSixMark size={148} variant="inverse" /> : initialsOf(c.name)}
        </Box>
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
          <Typography variant="h1" component="h1">
            {c.name}
          </Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.voiceCall} · {c.role[locale]}
          </Typography>
          <CallTimer seconds={seconds} />
          {muted && (
            <Typography variant="caption" role="status" sx={{ color: bs.text.secondary, mt: 1 }}>
              {t.muted}
            </Typography>
          )}
        </Box>
      </Box>

      <CallControls
        endLabel={t.end}
        onEnd={onEnd}
        left={[
          { id: 'speaker', label: t.speaker, icon: <VolumeOffRounded />, activeIcon: <VolumeUpRounded />, pressed: speaker, onToggle: () => setSpeaker((s) => !s) },
          { id: 'mute', label: t.mute, icon: <MicNoneRounded />, activeIcon: <MicOffRounded />, pressed: muted, onToggle: () => setMuted((m) => !m) },
        ]}
        right={[
          { id: 'video', label: t.video, icon: <VideocamOutlined />, onToggle: onVideo },
          { id: 'chat', label: t.chat, icon: <ChatBubbleOutlineRounded />, onToggle: onChat },
        ]}
      />
    </SchemeScope>
  );
}
