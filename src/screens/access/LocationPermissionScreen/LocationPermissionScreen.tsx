import ApartmentRounded from '@mui/icons-material/ApartmentRounded';
import LocationOnRounded from '@mui/icons-material/LocationOnRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { InlineAlert } from '../../../components/feedback/InlineAlert/InlineAlert';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { AuthHeading, HeroIcon, ScreenBody, ScreenRoot } from '../shared/AccessParts';

const messages = {
  es: {
    title: 'Activa tu ubicación',
    subtitle: 'La usamos solo para mostrarte lo que tienes cerca.',
    benefits: [
      { icon: StorefrontOutlined, text: 'El centro Black Seat más cercano' },
      { icon: ApartmentRounded, text: 'Si llegamos a tu casa u oficina para lavado a domicilio' },
      { icon: ScheduleRounded, text: 'Tiempos de llegada más precisos' },
    ],
    allow: 'Permitir ubicación',
    manual: 'Ingresar manualmente',
    skip: 'Omitir',
    deniedTitle: 'La ubicación está desactivada',
    denied: 'Puedes activarla en los ajustes de tu teléfono o ingresar tu dirección a mano.',
    granted: 'Ubicación activada.',
  },
  en: {
    title: 'Turn on your location',
    subtitle: 'We only use it to show you what is nearby.',
    benefits: [
      { icon: StorefrontOutlined, text: 'The closest Black Seat center' },
      { icon: ApartmentRounded, text: 'Whether we reach your home or office for at-home washing' },
      { icon: ScheduleRounded, text: 'More accurate arrival times' },
    ],
    allow: 'Allow location',
    manual: 'Enter it manually',
    skip: 'Skip',
    deniedTitle: 'Location is turned off',
    denied: 'You can turn it on in your phone settings or enter your address by hand.',
    granted: 'Location turned on.',
  },
};

export interface LocationPermissionScreenProps {
  /** The person already refused the system prompt. */
  denied?: boolean;
  onManual?: () => void;
}

function Content({ denied = false, onManual }: LocationPermissionScreenProps) {
  const t = useT(messages);
  const toast = useToast();
  const nav = useNav();
  const [locating, setLocating] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const allow = () => {
    setLocating(true);
    timer.current = window.setTimeout(() => {
      setLocating(false);
      toast.show({ message: t.granted, severity: 'success' });
      nav.go('notification-permission');
    }, 1200);
  };

  return (
    <ScreenRoot>
      <ScreenBody noTopBar sx={{ alignItems: 'center', gap: 7 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%' }}>
          <HeroIcon>
            <LocationOnRounded sx={{ color: bs.text.primary }} />
          </HeroIcon>
          <AuthHeading align="center" title={t.title} subtitle={t.subtitle} />
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
            {t.benefits.map(({ icon: Icon, text }) => (
              <Box component="li" key={text} sx={{ display: 'flex', alignItems: 'center', gap: 3, color: bs.text.primary }}>
                <Icon aria-hidden sx={{ color: bs.text.secondary, flexShrink: 0 }} />
                <Typography variant="body2">{text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
          {denied && (
            <InlineAlert severity="warning" title={t.deniedTitle}>
              {t.denied}
            </InlineAlert>
          )}
          {!denied && (
            <Button fullWidth loading={locating} onClick={allow}>
              {t.allow}
            </Button>
          )}
          <Button variant={denied ? 'primary' : 'quiet'} fullWidth onClick={onManual ?? (() => nav.go('enter-location'))}>
            {t.manual}
          </Button>
          <Button variant="quiet" fullWidth onClick={() => nav.go('notification-permission')}>
            {t.skip}
          </Button>
        </Box>
      </ScreenBody>
    </ScreenRoot>
  );
}

/** Location permission: why we ask, one primary action, manual fallback. */
export function LocationPermissionScreen(props: LocationPermissionScreenProps) {
  return (
    <ToastProvider>
      <Content {...props} />
    </ToastProvider>
  );
}
