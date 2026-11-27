import CheckRounded from '@mui/icons-material/CheckRounded';
import ShareOutlined from '@mui/icons-material/ShareOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNav } from '../../../app/nav';
import { Button } from '../../../components/actions/Button/Button';
import { IdentifierBlock } from '../../../components/data-display/IdentifierBlock/IdentifierBlock';
import { InitialsAvatar } from '../../../components/data-display/InitialsAvatar/InitialsAvatar';
import { Tag } from '../../../components/data-display/Tag/Tag';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { ListGroup, ListRow } from '../../../components/layout/ListRow/ListRow';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { formatMoney } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { inviteCode, inviteContacts, inviteReward } from '../data';
import { ScreenRoot } from '../ui';

const link = `https://blackseatmiami.com/i/${inviteCode}`;

const messages = {
  es: {
    title: 'Invitar amigos',
    headline: (v: string) => `Invita a un amigo y gana ${v}`,
    body: (v: string) => `Tu amigo recibe ${v} en su primera reserva. Tú recibes ${v} en tu wallet cuando la complete.`,
    code: 'Tu código de invitación',
    share: 'Compartir enlace',
    shareText: (v: string) => `Reserva Detailing, Towing o Personal Washing con Black Seat y recibe ${v} en tu primera reserva.`,
    copied: 'Enlace copiado',
    contacts: 'Tus contactos',
    invite: 'Invitar',
    inviteName: (n: string) => `Invitar a ${n}`,
    sent: 'Invitación enviada',
    sentToast: (n: string) => `Invitación enviada a ${n}`,
  },
  en: {
    title: 'Invite friends',
    headline: (v: string) => `Invite a friend and earn ${v}`,
    body: (v: string) => `Your friend gets ${v} on their first booking. You get ${v} in your wallet when they complete it.`,
    code: 'Your invite code',
    share: 'Share link',
    shareText: (v: string) => `Book Detailing, Towing or Personal Washing with Black Seat and get ${v} on your first booking.`,
    copied: 'Link copied',
    contacts: 'Your contacts',
    invite: 'Invite',
    inviteName: (n: string) => `Invite ${n}`,
    sent: 'Invitation sent',
    sentToast: (n: string) => `Invitation sent to ${n}`,
  },
};

function Content() {
  const t = useT(messages);
  const nav = useNav();
  const locale = useLocale();
  const toast = useToast();
  const [sent, setSent] = useState<string[]>(['c3']);
  const reward = formatMoney(inviteReward, locale).replace(/\.00$/, '');

  const share = async () => {
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: 'Black Seat', text: t.shareText(reward), url: link });
        return;
      }
      await navigator.clipboard.writeText(link);
      toast.show({ message: t.copied, severity: 'success' });
    } catch {
      // The user dismissed the share sheet or the clipboard is blocked: nothing to report.
    }
  };

  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={nav.back} />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, px: `${layout.gutter.mobile}px`, pt: 3, pb: 6 }}>
          <Box>
            <Typography variant="h2" component="h2">
              {t.headline(reward)}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: bs.text.secondary }}>
              {t.body(reward)}
            </Typography>
          </Box>
          <IdentifierBlock label={t.code} value={inviteCode} size="lg" />
          <Button fullWidth startIcon={<ShareOutlined />} onClick={share}>
            {t.share}
          </Button>
        </Box>

        <Box component="section" aria-labelledby="invite-contacts" sx={{ pb: 6 }}>
          <Typography id="invite-contacts" variant="h3" component="h2" sx={{ px: `${layout.gutter.mobile}px`, pb: 2 }}>
            {t.contacts}
          </Typography>
          <ListGroup>
            {inviteContacts.map((c) => {
              const done = sent.includes(c.id);
              return (
                <ListRow
                  key={c.id}
                  leading={<InitialsAvatar name={c.name} size="lg" />}
                  title={c.name}
                  description={c.phone}
                  trailing={
                    done ? (
                      <Tag label={t.sent} tone="success" icon={<CheckRounded />} />
                    ) : (
                      <Button
                        variant="secondary"
                        size="md"
                        aria-label={t.inviteName(c.name)}
                        onClick={() => {
                          setSent((s) => [...s, c.id]);
                          toast.show({ message: t.sentToast(c.name), severity: 'success' });
                        }}
                      >
                        {t.invite}
                      </Button>
                    )
                  }
                />
              );
            })}
          </ListGroup>
        </Box>
      </Box>
    </ScreenRoot>
  );
}

/** Invitar amigos (s82): invite code with copy, share action and a contacts list with "Invitar" buttons. */
export function InviteFriendsScreen() {
  return (
    <ToastProvider>
      <Content />
    </ToastProvider>
  );
}
