import Box from '@mui/material/Box';
import { visuallyHidden } from '../../../theme/a11y';
import { InitialsAvatar } from '../../../components/data-display/InitialsAvatar/InitialsAvatar';
import { BlackSeatMark } from '../../../brand/BlackSeatMark';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import type { Conversation } from '../data';

const messages = { es: { online: 'en línea' }, en: { online: 'online' } };

/** Avatar for a conversation: brand mark for support, initials for people and centers; optional presence dot. */
export function ConversationAvatar({ conversation, size = 'lg', showPresence = true }: { conversation: Conversation; size?: 'md' | 'lg'; showPresence?: boolean }) {
  const t = useT(messages);
  const px = size === 'lg' ? 56 : 40;
  return (
    <Box sx={{ position: 'relative', width: px, height: px, flexShrink: 0 }}>
      {conversation.kind === 'support' ? <BlackSeatMark size={px} variant="inverse" /> : <InitialsAvatar name={conversation.name} size={size} />}
      {showPresence && conversation.online && (
        <>
          <Box
            aria-hidden
            sx={{ position: 'absolute', right: -1, bottom: -1, width: 14, height: 14, borderRadius: '50%', backgroundColor: bs.status.success.solid, border: `2px solid ${bs.surface.canvas}`, boxSizing: 'border-box' }}
          />
          <Box component="span" sx={visuallyHidden}>
            {t.online}
          </Box>
        </>
      )}
    </Box>
  );
}
