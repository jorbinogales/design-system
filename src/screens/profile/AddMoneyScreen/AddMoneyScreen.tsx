import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNav } from '../../../app/nav';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { TextField } from '../../../components/fields/TextField/TextField';
import { KeyValue, KeyValueList } from '../../../components/layout/KeyValue/KeyValue';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { FilterChipGroup } from '../../../components/selection/FilterChip/FilterChip';
import { formatMoney } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { quickAmounts, TOPUP_MAX, TOPUP_MIN, walletBalance } from '../data';
import { ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Agregar dinero',
    intro: 'Elige cuánto quieres sumar a tu wallet. Lo usarás para pagar reservas sin pasar tarjeta.',
    quick: 'Montos rápidos',
    amount: 'Otro monto',
    hint: (min: string, max: string) => `Entre ${min} y ${max}.`,
    errMin: (min: string) => `El monto mínimo es ${min}.`,
    errMax: (max: string) => `El monto máximo es ${max}.`,
    errInvalid: 'Escribe un monto válido, por ejemplo 75 o 75.50.',
    current: 'Saldo actual',
    next: 'Saldo después de la recarga',
    next_cta: 'Continuar',
  },
  en: {
    title: 'Add money',
    intro: 'Choose how much to add to your wallet. You will use it to pay bookings without entering a card.',
    quick: 'Quick amounts',
    amount: 'Other amount',
    hint: (min: string, max: string) => `Between ${min} and ${max}.`,
    errMin: (min: string) => `The minimum amount is ${min}.`,
    errMax: (max: string) => `The maximum amount is ${max}.`,
    errInvalid: 'Enter a valid amount, for example 75 or 75.50.',
    current: 'Current balance',
    next: 'Balance after top-up',
    next_cta: 'Continue',
  },
};

export interface AddMoneyScreenProps {
  initialAmount?: string;
}

/** Agregar dinero (s75): quick-amount chips and an amount field validated between $10 and $1,000. */
export function AddMoneyScreen({ initialAmount = '' }: AddMoneyScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const locale = useLocale();
  const [amount, setAmount] = useState(initialAmount);

  const money0 = (n: number) => formatMoney(n, locale).replace(/\.00$/, '');
  const num = amount === '' ? NaN : Number(amount);
  let error: string | undefined;
  if (amount !== '') {
    if (!Number.isFinite(num)) error = t.errInvalid;
    else if (num < TOPUP_MIN) error = t.errMin(money0(TOPUP_MIN));
    else if (num > TOPUP_MAX) error = t.errMax(money0(TOPUP_MAX));
  }
  const valid = amount !== '' && !error;
  const chip = quickAmounts.map(String).find((v) => v === amount) ?? null;

  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={nav.back} />
      <ScreenBody gap={6} sx={{ flex: 1 }}>
        <Typography variant="body1" sx={{ color: bs.text.secondary }}>
          {t.intro}
        </Typography>
        <FilterChipGroup
          selectionMode="single"
          label={t.quick}
          value={chip}
          onChange={setAmount}
          options={quickAmounts.map((n) => ({ value: String(n), label: money0(n) }))}
        />
        <TextField
          label={t.amount}
          prefix="$"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 7))}
          error={error}
          helperText={t.hint(money0(TOPUP_MIN), money0(TOPUP_MAX))}
          placeholder="0.00"
          slotProps={{ htmlInput: { inputMode: 'decimal', autoComplete: 'off' } }}
        />
        <Box sx={{ borderTop: `1px solid ${bs.border.subtle}`, pt: 5 }}>
          <KeyValueList>
            <KeyValue label={t.current} value={formatMoney(walletBalance, locale)} tabular />
            <KeyValue label={t.next} value={formatMoney(walletBalance + (valid ? num : 0), locale)} emphasis tabular />
          </KeyValueList>
        </Box>
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth disabled={!valid} onClick={() => nav.go('top-up-wallet', { amount: String(num) })}>
          {t.next_cta}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
