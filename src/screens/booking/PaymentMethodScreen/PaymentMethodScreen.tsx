import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState, type ReactNode } from 'react';
import { useNav } from '../../../app/nav';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { AmountBreakdown } from '../../../components/data-display/AmountBreakdown/AmountBreakdown';
import { Price } from '../../../components/data-display/Price/Price';
import { RadioGroup } from '../../../components/selection/Radio/Radio';
import type { PaymentMethod } from '../../../domain/booking';
import { useLocale, useT } from '../../../i18n/locale';
import { paymentMethods } from '../../../mocks/catalog';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { useMethodOptions } from '../../profile/methodOptions';
import { flowBooking } from '../data';
import { AddRow, BookingTopBar, IconBubble, ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: { title: 'Método de pago', method: 'Elige cómo pagar', addCard: 'Agregar tarjeta', myCards: 'Mis tarjetas', amount: 'Importe', total: 'Total', next: 'Continuar' },
  en: { title: 'Payment method', method: 'Choose how to pay', addCard: 'Add card', myCards: 'My cards', amount: 'Amount', total: 'Total', next: 'Continue' },
};

export interface PaymentMethodScreenProps {
  /** Method selected at the start. `pm-zelle` matches the booking BS-24117. */
  initialId?: string;
}

// Checkout offers card, Zelle and cash; Apple Pay stays in the catalog for older bookings.
const checkoutMethods = paymentMethods.filter((m) => m.kind !== 'apple-pay');
const icons: Partial<Record<PaymentMethod['kind'], ReactNode>> = { card: <CreditCardOutlined />, zelle: <AccountBalanceOutlined />, cash: <PaymentsOutlined /> };
/** Same bordered panel as the Wallet payment-method list. */
const panel = { border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, backgroundColor: bs.surface.raised, px: 4, py: 3 };

/** Método de pago (s32): Wallet-style method list; choosing card reveals the saved cards and "Agregar tarjeta". Step 4 of 5. */
export function PaymentMethodScreen({ initialId = 'pm-zelle' }: PaymentMethodScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const locale = useLocale();
  const params = nav.route.params ?? {};
  const [method, setMethod] = useState(initialId);
  const cardOptions = useMethodOptions(false).filter((o) => o.value.startsWith('visa') || o.value.startsWith('mc'));
  const [card, setCard] = useState(cardOptions[0]?.value ?? '');
  const isCard = checkoutMethods.find((m) => m.id === method)?.kind === 'card';
  // The coupon is applied on the next step (Resumen), so this step shows the package price.
  const lines = flowBooking(params).lines.filter((l) => l.kind !== 'discount');
  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return (
    <ScreenRoot>
      <BookingTopBar title={t.title} step={3} />
      <ScreenBody sx={{ flex: 1 }}>
        <Box sx={panel}>
          <RadioGroup
            label={t.method}
            value={method}
            onChange={setMethod}
            options={checkoutMethods.map((m) => ({
              value: m.id,
              label: (
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 1 }}>
                  <IconBubble>{icons[m.kind]}</IconBubble>
                  <Typography variant="body1" component="span" sx={{ fontWeight: 500 }}>
                    {m.label[locale]}
                  </Typography>
                </Box>
              ),
            }))}
          />
        </Box>
        {isCard && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {cardOptions.length > 0 && (
              <Box sx={panel}>
                <RadioGroup label={t.myCards} value={card} onChange={setCard} options={cardOptions} />
              </Box>
            )}
            <AddRow label={t.addCard} onClick={() => nav.go('add-card', params)} />
          </Box>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4" component="h2">
            {t.amount}
          </Typography>
          <AmountBreakdown lines={lines.map((l) => ({ label: l.label[locale], amount: l.amount, kind: l.kind }))} total={total} totalLabel={t.total} />
        </Box>
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
        <Button onClick={() => nav.go('review-summary', { ...params, methodId: method })}>{t.next}</Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
