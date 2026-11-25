import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { AmountBreakdown } from '../../../components/data-display/AmountBreakdown/AmountBreakdown';
import { InlineAlert } from '../../../components/feedback/InlineAlert/InlineAlert';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { RadioGroup } from '../../../components/selection/Radio/Radio';
import { formatMoney } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import type { PaymentMethodId } from '../data';
import { useMethodOptions } from '../methodOptions';
import { ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Recargar wallet',
    summary: 'Resumen',
    line: 'Recarga de wallet',
    fee: 'Comisión por recarga',
    total: 'Total a pagar',
    method: 'Método de pago',
    pay: (v: string) => `Pagar ${v}`,
    note: 'El pago lo procesa nuestro proveedor de pagos. Black Six no ve ni guarda el número completo de tu tarjeta.',
    done: 'Pago recibido. Actualizando tu saldo…',
    failedTitle: 'No pudimos procesar el pago',
    failedBody: 'No se te cobró nada. Prueba con otro método.',
  },
  en: {
    title: 'Top up wallet',
    summary: 'Summary',
    line: 'Wallet top-up',
    fee: 'Top-up fee',
    total: 'Total to pay',
    method: 'Payment method',
    pay: (v: string) => `Pay ${v}`,
    note: 'The payment is processed by our payment provider. Black Six never sees or stores your full card number.',
    done: 'Payment received. Updating your balance…',
    failedTitle: 'We could not process the payment',
    failedBody: 'You were not charged. Try another method.',
  },
};

export interface TopUpWalletScreenProps {
  amount?: number;
  /** Payment already in progress (story "Cargando"). */
  submitting?: boolean;
  /** Payment declined by the provider (story "Con error"). */
  declined?: boolean;
}

function Content({ amount = 50, submitting = false, declined = false }: TopUpWalletScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const toast = useToast();
  const options = useMethodOptions(false);
  const [method, setMethod] = useState<PaymentMethodId>('visa-4242');
  const [busy, setBusy] = useState(submitting);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pay = () => {
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      toast.show({ message: t.done, severity: 'success' });
    }, 1400);
  };

  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={() => undefined} />
      <ScreenBody gap={6} sx={{ flex: 1 }}>
        {declined && (
          <InlineAlert severity="error" title={t.failedTitle}>
            {t.failedBody}
          </InlineAlert>
        )}
        <Box component="section" aria-labelledby="topup-summary" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography id="topup-summary" variant="h3" component="h2">
            {t.summary}
          </Typography>
          <AmountBreakdown
            lines={[
              { label: t.line, amount },
              { label: t.fee, amount: 0, kind: 'free' },
            ]}
            total={amount}
            totalLabel={t.total}
          />
        </Box>
        <Box sx={{ border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, backgroundColor: bs.surface.raised, px: 4, py: 3 }}>
          <RadioGroup label={t.method} options={options} value={method} onChange={setMethod} />
        </Box>
        <InlineAlert severity="info">{t.note}</InlineAlert>
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth loading={busy} onClick={pay}>
          {t.pay(formatMoney(amount, locale))}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}

/** Recargar wallet (s74): amount summary, payment method and confirm. Only lists methods; card entry is the provider's. */
export function TopUpWalletScreen(props: TopUpWalletScreenProps) {
  return (
    <ToastProvider offsetBottom={88}>
      <Content {...props} />
    </ToastProvider>
  );
}
