import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { BookingSummary, type SummaryField } from '../../blackseat/BookingSummary/BookingSummary';
import { PaymentPanel } from '../../blackseat/PaymentPanel/PaymentPanel';
import { BottomActionBar } from '../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../components/actions/Button/Button';
import { formatMoney } from '../../i18n/format';
import { useLocale, useT } from '../../i18n/locale';
import { bs } from '../../theme/theme';
import { buildBooking, getPackage, me, myAddresses, myVehicle, paymentMethods, totalOf } from '../data';
import { draftLines, useProto } from '../store';
import { BlockTitle, FlowTopBar, ScreenBody, ScreenRoot, TotalSummary } from './shared';

const messages = {
  es: {
    title: 'Revisa y paga',
    summary: 'Tu reserva',
    payment: 'Método de pago',
    chargedNow: (a: string) => `Se cobran ${a} al confirmar.`,
    payLater: 'Hoy no pagas nada. La reserva queda con el pago pendiente.',
    legal: 'Al confirmar aceptas las condiciones de servicio y la política de cancelación de Black Seat.',
    total: 'Total',
    dueToday: 'Pagas hoy',
    confirm: 'Confirmar reserva',
  },
  en: {
    title: 'Review and pay',
    summary: 'Your booking',
    payment: 'Payment method',
    chargedNow: (a: string) => `${a} is charged on confirmation.`,
    payLater: 'You pay nothing today. The booking stays payment pending.',
    legal: "By confirming you accept Black Seat's terms of service and cancellation policy.",
    total: 'Total',
    dueToday: 'Due today',
    confirm: 'Confirm booking',
  },
};

/** Resumen y pago: editable summary (each row goes back to its step), payment method and price breakdown. */
export function CheckoutScreen() {
  const t = useT(messages);
  const locale = useLocale();
  const { draft, setDraft, go, confirmDraft, isVip } = useProto();
  const [sending, setSending] = useState(false);
  const pkg = getPackage(draft.packageId);
  const lines = draftLines(draft, isVip, locale);
  const total = totalOf(lines);
  const online = draft.methodId === 'pm-card' || draft.methodId === 'pm-apple-pay';
  const steps = draft.unit === 'detailing' ? 3 : 4;

  const preview = useMemo(() => {
    const b = buildBooking({
      id: 'BS-NUEVA',
      pkg: pkg.id,
      cus: me.id,
      veh: pkg.unit === 'personal-washing' ? undefined : myVehicle.id,
      date: (draft.day ?? draft.auction.date)?.format('YYYY-MM-DD') ?? '2026-11-27',
      time: draft.time ?? '08:00',
      address: pkg.unit === 'detailing' ? undefined : myAddresses.find((a) => a.id === draft.addressId),
      auction: pkg.unit === 'towing' && draft.auction.auction ? { auction: draft.auction.auction, yardId: draft.auction.yardId, lot: draft.auction.lot, code: draft.auction.code } : undefined,
      status: 'pending_confirmation',
      pay: 'pending',
      method: draft.methodId,
    });
    return { ...b, lines, total };
  }, [draft, pkg, lines, total]);

  const edit = (field: SummaryField) => {
    if (field === 'service') go({ name: 'unit', unit: draft.unit });
    else if (field === 'schedule') go({ name: draft.unit === 'towing' ? 'towing' : 'schedule' });
    else if (field === 'auction') go({ name: 'towing' });
    else if (field === 'location') go(draft.unit === 'detailing' ? { name: 'unit', unit: draft.unit } : { name: 'address' });
  };

  return (
    <ScreenRoot>
      <FlowTopBar title={t.title} step={steps - 1} />
      <ScreenBody gap={7}>
        <Box component="section" aria-labelledby="h-sum" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <BlockTitle id="h-sum">{t.summary}</BlockTitle>
          <BookingSummary booking={preview} onEdit={edit} hideAmounts />
        </Box>
        <Box component="section" aria-label={t.payment} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <PaymentPanel methods={paymentMethods} value={draft.methodId} onChange={(id) => setDraft({ methodId: id })} lines={lines} total={total} status="pending" />
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {online ? t.chargedNow(formatMoney(total, locale)) : t.payLater}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: bs.text.secondary }}>
          {t.legal}
        </Typography>
      </ScreenBody>
      <BottomActionBar summary={<TotalSummary label={online ? t.total : t.dueToday} amount={online ? total : 0} from={online && pkg.priceFrom} />}>
        <Button
          loading={sending}
          onClick={() => {
            setSending(true);
            window.setTimeout(() => {
              const id = confirmDraft();
              setSending(false);
              go({ name: 'confirmed', id });
            }, 700);
          }}
        >
          {t.confirm}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
