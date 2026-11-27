import NotificationsActiveRounded from '@mui/icons-material/NotificationsActiveRounded';
import Box from '@mui/material/Box';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { AuthHeading, HeroIcon, ScreenBody, ScreenRoot } from '../shared/AccessParts';

const messages = {
  es: {
    title: 'Activa las notificaciones',
    subtitle: 'Te avisamos cuando confirmemos tu reserva, cuando el equipo salga hacia ti y cuando tu auto esté listo.',
    allow: 'Permitir notificaciones',
    later: 'Ahora no',
    granted: 'Notificaciones activadas.',
  },
  en: {
    title: 'Turn on notifications',
    subtitle: 'We let you know when your booking is confirmed, when the team is on the way and when your car is ready.',
    allow: 'Allow notifications',
    later: 'Not now',
    granted: 'Notifications turned on.',
  },
};

export interface NotificationPermissionScreenProps {
  onLater?: () => void;
}

function Content({ onLater }: NotificationPermissionScreenProps) {
  const t = useT(messages);
  const toast = useToast();
  const nav = useNav();
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const allow = () => {
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      toast.show({ message: t.granted, severity: 'success' });
      nav.reset('home');
    }, 1000);
  };

  return (
    <ScreenRoot>
      <ScreenBody noTopBar sx={{ alignItems: 'center', gap: 7 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%' }}>
          <HeroIcon>
            <NotificationsActiveRounded sx={{ color: bs.text.primary }} />
          </HeroIcon>
          <AuthHeading align="center" title={t.title} subtitle={t.subtitle} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
          <Button fullWidth loading={busy} onClick={allow}>
            {t.allow}
          </Button>
          <Button variant="quiet" fullWidth onClick={onLater ?? (() => nav.reset('home'))}>
            {t.later}
          </Button>
        </Box>
      </ScreenBody>
    </ScreenRoot>
  );
}

/** Notification permission: value first (a real Towing alert), then allow / not now. */
export function NotificationPermissionScreen(props: NotificationPermissionScreenProps) {
  return (
    <ToastProvider>
      <Content {...props} />
    </ToastProvider>
  );
}
