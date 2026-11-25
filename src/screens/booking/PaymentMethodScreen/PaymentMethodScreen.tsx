import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { PaymentPanel } from '../../../blackseat/PaymentPanel/PaymentPanel';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { Price } from '../../../components/data-display/Price/Price';
import { InlineAlert } from '../../../components/feedback/InlineAlert/InlineAlert';
import { useT } from '../../../i18n/locale';
import { getBooking } from '../../../mocks/bookings';
import { paymentMethods } from '../../../mocks/catalog';
import { bs } from '../../../theme/theme';
import { FLOW_BOOKING_ID } from '../data';
import { AddRow, BookingTopBar, ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Método de pago',
    alertTitle: 'Cuándo se cobra',
    alert: 'Con tarjeta o Apple Pay el cobro se hace en línea al confirmar la reserva. Con Zelle o efectivo la reserva se confirma igual y el pago queda pendiente hasta que lo recibamos.',
    addCard: 'Agregar tarjeta',
    total: 'Total',
    next: 'Continuar',
  },
  en: {
    title: 'Payment method',
    alertTitle: 'When you are charged',
    alert: 'With card or Apple Pay you are charged online when you confirm the booking. With Zelle or cash the booking is confirmed anyway and payment stays pending until we receive it.',
    addCard: 'Add card',
    total: 'Total',
    next: 'Continue',
  },
};

export interface PaymentMethodScreenProps {
  /** Method selected at the start. `pm-zelle` matches the booking BS-24117; `pm-card` shows the provider's secure fields. */
  initialId?: string;
}

/** Método de pago (s32): PaymentPanel in checkout mode, with an honest note on which methods are charged online. Step 4 of 5. */
export function PaymentMethodScreen({ initialId = 'pm-zelle' }: PaymentMethodScreenProps) {
  const t = useT(messages);
  const [method, setMethod] = useState(initialId);
  // The coupon is applied on the next step (Resumen), so this step shows the package price.
  const lines = getBooking(FLOW_BOOKING_ID)!.lines.filter((l) => l.kind !== 'discount');
  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return (
    <ScreenRoot>
      <BookingTopBar title={t.title} step={3} />
      <ScreenBody sx={{ flex: 1 }}>
        <InlineAlert severity="info" title={t.alertTitle}>
          {t.alert}
        </InlineAlert>
        <PaymentPanel methods={paymentMethods} value={method} onChange={setMethod} lines={lines} total={total} status="pending" />
        <AddRow label={t.addCard} />
      </ScreenBody>
      <BottomActionBar
        summary={
          <Box>
            <Typography variant="caption" sx={{ color: bs.text.secondary, display: 'block' }}>
              {t.total}
            </Typography>
            <Price amount={total} size="lg" />
          </Box>
        }
      >
        <Button>{t.next}</Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
