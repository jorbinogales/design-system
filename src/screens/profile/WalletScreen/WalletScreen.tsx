import AddRounded from '@mui/icons-material/AddRounded';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { Price } from '../../../components/data-display/Price/Price';
import { SkeletonGroup, SkeletonListRow } from '../../../components/feedback/Skeleton/Skeleton';
import { Card } from '../../../components/layout/Card/Card';
import { ListGroup, ListRow } from '../../../components/layout/ListRow/ListRow';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { NoItemsState } from '../../../components/screen-states/StatePresets/StatePresets';
import { formatMoney } from '../../../i18n/format';
import { intlLocale } from '../../../i18n/format';
import { useLocale, useT, type Locale } from '../../../i18n/locale';
import { InverseSurface } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { TODAY, walletBalance, walletTransactions, type WalletTx } from '../data';
import { ScreenBody, ScreenRoot, pick } from '../ui';

const messages = {
  es: {
    title: 'Wallet',
    balance: 'Saldo del wallet',
    add: 'Agregar dinero',
    today: 'Hoy',
    yesterday: 'Ayer',
    history: 'Movimientos',
    topup: 'Dinero agregado al wallet',
    topupKind: 'Recarga',
    chargeTitle: (ref: string) => `Pedido ${ref}`,
    chargeKind: 'Cargo',
    refundTitle: (ref: string) => `Reembolso del pedido ${ref}`,
    refundKind: 'Reembolso',
    balanceAfter: (v: string) => `Saldo ${v}`,
    emptyTitle: 'Aún no hay movimientos',
    emptyBody: 'Cuando agregues dinero o pagues una reserva con tu wallet, lo verás aquí.',
    loading: 'Cargando movimientos',
  },
  en: {
    title: 'Wallet',
    balance: 'Wallet balance',
    add: 'Add money',
    today: 'Today',
    yesterday: 'Yesterday',
    history: 'Transactions',
    topup: 'Money added to wallet',
    topupKind: 'Top-up',
    chargeTitle: (ref: string) => `Order ${ref}`,
    chargeKind: 'Charge',
    refundTitle: (ref: string) => `Refund for order ${ref}`,
    refundKind: 'Refund',
    balanceAfter: (v: string) => `Balance ${v}`,
    emptyTitle: 'No transactions yet',
    emptyBody: 'When you add money or pay a booking with your wallet, you will see it here.',
    loading: 'Loading transactions',
  },
};

const MINUS = '−';
const dayMs = 24 * 60 * 60 * 1000;
const YESTERDAY = new Date(Date.parse(`${TODAY}T00:00:00Z`) - dayMs).toISOString().slice(0, 10);

const fmtDay = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(intlLocale[locale], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
const fmtTime = (time: string, locale: Locale) =>
  new Intl.DateTimeFormat(intlLocale[locale], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(new Date(`1970-01-01T${time}:00Z`));

export interface WalletScreenProps {
  state?: 'default' | 'empty' | 'loading';
}

function TxRow({ tx, last }: { tx: WalletTx; last: boolean }) {
  const t = useT(messages);
  const locale = useLocale();
  const credit = tx.kind !== 'charge';
  const title = tx.kind === 'topup' ? t.topup : tx.kind === 'refund' ? t.refundTitle(tx.ref ?? '') : t.chargeTitle(tx.ref ?? '');
  const kind = tx.kind === 'topup' ? t.topupKind : tx.kind === 'refund' ? t.refundKind : t.chargeKind;
  const unit = tx.unit ? ` · ${pick(tx.unit, locale)}` : '';
  const amount = `${credit ? '+' : MINUS} ${formatMoney(tx.amount, locale)}`;
  return (
    <ListRow
      as="li"
      inset="none"
      divider={!last}
      title={title}
      description={`${kind}${unit} · ${fmtTime(tx.time, locale)}`}
      trailing={
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="label" component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: credit ? bs.status.success.fg : bs.text.primary }}>
            {amount}
          </Typography>
          <Typography variant="caption" component="p" sx={{ color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
            {t.balanceAfter(formatMoney(tx.balanceAfter, locale))}
          </Typography>
        </Box>
      }
    />
  );
}

/** Wallet (s73): black balance card with "Agregar dinero" and transactions grouped by day. Signs and text carry meaning, not color. */
export function WalletScreen({ state = 'default' }: WalletScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const balance = state === 'empty' ? 0 : walletBalance;

  const groups = new Map<string, WalletTx[]>();
  if (state === 'default') for (const tx of walletTransactions) groups.set(tx.date, [...(groups.get(tx.date) ?? []), tx]);
  const heading = (iso: string) => (iso === TODAY ? t.today : iso === YESTERDAY ? t.yesterday : fmtDay(iso, locale));

  let list: ReactNode;
  if (state === 'loading') {
    list = (
      <SkeletonGroup label={t.loading}>
        <SkeletonListRow inset="none" />
        <SkeletonListRow inset="none" />
        <SkeletonListRow inset="none" />
        <SkeletonListRow inset="none" />
      </SkeletonGroup>
    );
  } else if (state === 'empty') {
    list = <NoItemsState layout="inline" title={t.emptyTitle} description={t.emptyBody} />;
  } else {
    list = [...groups.entries()].map(([iso, txs]) => (
      <Box component="section" key={iso} aria-label={heading(iso)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" component="h2">
          {heading(iso)}
        </Typography>
        <Card>
          <ListGroup>
            {txs.map((tx, i) => (
              <TxRow key={tx.id} tx={tx} last={i === txs.length - 1} />
            ))}
          </ListGroup>
        </Card>
      </Box>
    ));
  }

  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={() => undefined} />
      <ScreenBody gap={6} sx={{ flex: 1 }}>
        <InverseSurface sx={{ borderRadius: `${radius.lg}px`, p: 5, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3 }}>
            <Box>
              <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                {t.balance}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Price amount={balance} size="xl" />
              </Box>
            </Box>
            <Box aria-hidden sx={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', backgroundColor: bs.surface.subtle, flexShrink: 0 }}>
              <AccountBalanceWalletOutlined />
            </Box>
          </Box>
          <Button fullWidth startIcon={<AddRounded />}>
            {t.add}
          </Button>
        </InverseSurface>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }} role="region" aria-label={t.history}>
          {list}
        </Box>
      </ScreenBody>
    </ScreenRoot>
  );
}
