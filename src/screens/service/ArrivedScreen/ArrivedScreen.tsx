import Box from '@mui/material/Box';
import { Button } from '../../../components/actions/Button/Button';
import { IdentifierBlock } from '../../../components/data-display/IdentifierBlock/IdentifierBlock';
import { SuccessState } from '../../../components/screen-states/SuccessState/SuccessState';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { getCenter } from '../../../mocks/catalog';
import { layout } from '../../../theme/tokens';
import { serviceCenterId } from '../data';

const messages = {
  es: {
    title: '¡Has llegado!',
    body: (n: string) => `Estás en ${n}. Muestra el código de tu reserva en recepción y empezamos.`,
    code: 'Reserva',
    primary: 'Ver mi reserva',
    secondary: 'Avisar al equipo por chat',
  },
  en: {
    title: "You've arrived!",
    body: (n: string) => `You're at ${n}. Show your booking code at the front desk and we'll get started.`,
    code: 'Booking',
    primary: 'View my booking',
    secondary: 'Message the team',
  },
};

/** Has llegado: confirmation that the customer reached the center, with the booking code (BS-24117). */
export function ArrivedScreen() {
  const t = useT(messages);
  const nav = useNav();
  const center = getCenter(serviceCenterId)!;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%', pt: `calc(${layout.safeAreaTop} + 24px)` }}>
      <SuccessState
        title={t.title}
        description={t.body(center.name)}
        primaryAction={
          <Button variant="primary" size="lg" fullWidth onClick={() => nav.go('track-order', { bookingId: 'BS-24117' })}>
            {t.primary}
          </Button>
        }
        secondaryAction={
          <Button variant="quiet" size="lg" fullWidth onClick={() => nav.go('chat')}>
            {t.secondary}
          </Button>
        }
      >
        <IdentifierBlock label={t.code} value="BS-24117" copyable />
      </SuccessState>
    </Box>
  );
}
