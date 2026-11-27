import Box from '@mui/material/Box';
import { useNav } from '../../../app/nav';
import { Button } from '../../../components/actions/Button/Button';
import { IdentifierBlock } from '../../../components/data-display/IdentifierBlock/IdentifierBlock';
import { KeyValue, KeyValueList } from '../../../components/layout/KeyValue/KeyValue';
import { SuccessState } from '../../../components/screen-states/SuccessState/SuccessState';
import { formatMoney } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { layout } from '../../../theme/tokens';
import { walletBalance } from '../data';
import { ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Recarga exitosa',
    body: (v: string) => `Agregamos ${v} a tu wallet. Ya puedes usarlo para pagar tus reservas.`,
    ref: 'Referencia',
    method: 'Método de pago',
    methodValue: 'Visa •••• 4242',
    balance: 'Nuevo saldo',
    wallet: 'Ver wallet',
    home: 'Ir al inicio',
  },
  en: {
    title: 'Top-up successful',
    body: (v: string) => `We added ${v} to your wallet. You can now use it to pay for your bookings.`,
    ref: 'Reference',
    method: 'Payment method',
    methodValue: 'Visa •••• 4242',
    balance: 'New balance',
    wallet: 'View wallet',
    home: 'Go to home',
  },
};

export interface TopUpSuccessScreenProps {
  amount?: number;
}

/** Recarga exitosa (s76): confirmation with reference, method and new balance. */
export function TopUpSuccessScreen({ amount: amountProp }: TopUpSuccessScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const amount = amountProp ?? (Number(nav.route.params?.amount) || 50);
  const locale = useLocale();
  return (
    <ScreenRoot sx={{ pt: `calc(${layout.safeAreaTop} + 24px)` }}>
      <SuccessState
        title={t.title}
        description={t.body(formatMoney(amount, locale))}
        primaryAction={
          <Button fullWidth onClick={() => nav.reset('wallet')}>
            {t.wallet}
          </Button>
        }
        secondaryAction={
          <Button variant="quiet" fullWidth onClick={() => nav.reset('home')}>
            {t.home}
          </Button>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, textAlign: 'left' }}>
          <IdentifierBlock label={t.ref} value="BS-24131" />
          <KeyValueList>
            <KeyValue label={t.method} value={t.methodValue} />
            <KeyValue label={t.balance} value={formatMoney(walletBalance, locale)} emphasis tabular />
          </KeyValueList>
        </Box>
      </SuccessState>
    </ScreenRoot>
  );
}
