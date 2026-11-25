import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import Apple from '@mui/icons-material/Apple';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import Google from '@mui/icons-material/Google';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { RadioOption } from '../../components/selection/Radio/Radio';
import { formatMoney } from '../../i18n/format';
import { useLocale } from '../../i18n/locale';
import { bs } from '../../theme/theme';
import { paymentMethods, walletBalance, type PaymentMethodData, type PaymentMethodId } from './data';
import { IconBubble, pick } from './ui';

const icons: Record<PaymentMethodData['kind'], ReactNode> = {
  card: <CreditCardOutlined />,
  wallet: <AccountBalanceWalletOutlined />,
  'apple-pay': <Apple />,
  'google-pay': <Google />,
};

const balanceLabel = { es: 'Saldo disponible', en: 'Available balance' };

/** RadioGroup options for the payment-method lists (profile list and wallet top-up). Wallet is left out when topping up. */
export function useMethodOptions(includeWallet = true): RadioOption<PaymentMethodId>[] {
  const locale = useLocale();
  return paymentMethods
    .filter((m) => includeWallet || m.kind !== 'wallet')
    .map((m) => ({
      value: m.id,
      label: (
        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 1 }}>
          <IconBubble>{icons[m.kind]}</IconBubble>
          <Box component="span">
            <Typography variant="body1" component="span" sx={{ display: 'block', fontWeight: 500 }}>
              {pick(m.title, locale)}
            </Typography>
            <Typography variant="body2" component="span" sx={{ display: 'block', color: bs.text.secondary }}>
              {m.kind === 'wallet' ? `${balanceLabel[locale]}: ${formatMoney(walletBalance, locale)}` : pick(m.description, locale)}
            </Typography>
          </Box>
        </Box>
      ),
    }));
}
