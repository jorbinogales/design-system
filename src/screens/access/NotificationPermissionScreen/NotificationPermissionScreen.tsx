import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import NotificationsActiveRounded from '@mui/icons-material/NotificationsActiveRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { AuthHeading, HeroIcon, ScreenBody, ScreenRoot } from '../shared/AccessParts';

const messages = {
  es: {
    title: 'Activa las notificaciones',
    subtitle: 'Te avisamos cuando confirmemos tu reserva, cuando el equipo salga hacia ti y cuando tu auto esté listo.',
    sampleLabel: 'Así se verá un aviso',
    sampleTitle: 'Tu grúa va en camino',
    sampleBody: 'Lote 05503318 · Llega a Copart Miami South en 18 min.',
    sampleTime: 'ahora',
    allow: 'Permitir notificaciones',
    later: 'Ahora no',
    granted: 'Notificaciones activadas.',
  },
  en: {
    title: 'Turn on notifications',
    subtitle: 'We let you know when your booking is confirmed, when the team is on the way and when your car is ready.',
    sampleLabel: 'This is how an alert looks',
    sampleTitle: 'Your tow truck is on the way',
    sampleBody: 'Lot 05503318 · Arrives at Copart Miami South in 18 min.',
    sampleTime: 'now',
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
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const allow = () => {
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      toast.show({ message: t.granted, severity: 'success' });
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
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="caption" sx={{ color: bs.text.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t.sampleLabel}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, p: 4, borderRadius: `${radius.lg}px`, backgroundColor: bs.surface.raised, border: `1px solid ${bs.border.subtle}`, boxShadow: bs.elevation.e1 }}>
              <Box aria-hidden sx={{ width: 40, height: 40, borderRadius: `${radius.md}px`, display: 'grid', placeItems: 'center', flexShrink: 0, backgroundColor: bs.surface.inverse, color: bs.brand.primary }}>
                <LocalShippingOutlined />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography variant="label">{t.sampleTitle}</Typography>
                  <Typography variant="caption" sx={{ color: bs.text.secondary }}>
                    {t.sampleTime}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                  {t.sampleBody}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
          <Button fullWidth loading={busy} onClick={allow}>
            {t.allow}
          </Button>
          <Button variant="quiet" fullWidth onClick={onLater}>
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
