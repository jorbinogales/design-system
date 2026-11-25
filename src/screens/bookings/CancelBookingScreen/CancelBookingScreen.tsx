import EventOutlined from '@mui/icons-material/EventOutlined';
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { formatDateShort } from '../../../blackseat/shared/format';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { formatSlotTime } from '../../../components/date-time/TimeSlot/TimeSlot';
import { Price } from '../../../components/data-display/Price/Price';
import { TextArea } from '../../../components/fields/TextArea/TextArea';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { Card } from '../../../components/layout/Card/Card';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { ConfirmDialog } from '../../../components/overlays/ConfirmDialog/ConfirmDialog';
import { RadioGroup } from '../../../components/selection/Radio/Radio';
import type { BookingDetail } from '../../../domain/booking';
import { unitMeta } from '../../../domain/units';
import { formatMoney } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { unitIcon } from '../../../icons/unitIcon';
import { getBookingDetail } from '../../../mocks/bookings';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { IconBubble, ScreenRoot } from '../../profile/ui';
import { cancelReasons, type CancelReason } from '../data';

const messages = {
  es: {
    title: 'Cancelar reserva',
    lead: 'Cuéntanos por qué cancelas. Nos ayuda a mejorar y no cambia tu reembolso.',
    reasonLabel: '¿Por qué cancelas?',
    reasons: {
      'no-need': 'Ya no necesito el servicio',
      reschedule: 'Necesito cambiar la fecha u hora',
      price: 'El precio es mayor al que esperaba',
      'other-service': 'Voy a resolverlo por otro medio',
      mistake: 'Me equivoqué al reservar',
      other: 'Otro motivo',
    } as Record<CancelReason, string>,
    otherLabel: 'Cuéntanos más',
    otherHelp: 'Cuéntanos qué pasó con tus palabras.',
    refundTitle: 'Qué pasa con tu pago',
    refundPaid: (amount: string, method: string) => `Cancelas con más de 24 horas de anticipación, así que te reembolsamos ${amount} completos a ${method}. El dinero llega en 3 a 5 días hábiles.`,
    refundNone: (method: string) => `Todavía no recibimos tu pago con ${method}, así que no se te cobra nada por cancelar.`,
    cancel: 'Cancelar reserva',
    keep: 'Mantener mi reserva',
    dialogTitle: (id: string) => `¿Cancelar la reserva ${id}?`,
    dialogBodyPaid: (amount: string) => `Liberamos tu horario y te reembolsamos ${amount}. No se puede deshacer.`,
    dialogBodyNone: 'Liberamos tu horario. No se puede deshacer.',
    dialogConfirm: 'Sí, cancelar',
    dialogBack: 'Volver',
    done: (id: string) => `Reserva ${id} cancelada`,
  },
  en: {
    title: 'Cancel booking',
    lead: 'Tell us why you are cancelling. It helps us improve and does not change your refund.',
    reasonLabel: 'Why are you cancelling?',
    reasons: {
      'no-need': 'I no longer need the service',
      reschedule: 'I need to change the date or time',
      price: 'The price is higher than I expected',
      'other-service': 'I will sort it out another way',
      mistake: 'I made a mistake when booking',
      other: 'Another reason',
    } as Record<CancelReason, string>,
    otherLabel: 'Tell us more',
    otherHelp: 'Tell us what happened in your own words.',
    refundTitle: 'What happens to your payment',
    refundPaid: (amount: string, method: string) => `You are cancelling more than 24 hours ahead, so we refund the full ${amount} to ${method}. The money arrives in 3 to 5 business days.`,
    refundNone: (method: string) => `We have not received your ${method} payment yet, so you are not charged for cancelling.`,
    cancel: 'Cancel booking',
    keep: 'Keep my booking',
    dialogTitle: (id: string) => `Cancel booking ${id}?`,
    dialogBodyPaid: (amount: string) => `We release your time slot and refund ${amount}. This cannot be undone.`,
    dialogBodyNone: 'We release your time slot. This cannot be undone.',
    dialogConfirm: 'Yes, cancel',
    dialogBack: 'Go back',
    done: (id: string) => `Booking ${id} cancelled`,
  },
};

export interface CancelBookingScreenProps {
  /** Defaults to BS-24118 (paid by card: full refund). `BS-24117` has payment pending: nothing to refund. */
  booking?: BookingDetail;
  initialReason?: CancelReason | null;
  initialDetail?: string;
  /** Opens the destructive confirmation dialog at the start. */
  confirmOpen?: boolean;
}

function Content({ booking = getBookingDetail('BS-24118'), initialReason = null, initialDetail = '', confirmOpen = false }: CancelBookingScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const toast = useToast();
  const b = booking;
  const Icon = unitIcon[b.unit];
  const [reason, setReason] = useState<CancelReason | null>(initialReason);
  const [detail, setDetail] = useState(initialDetail);
  const [open, setOpen] = useState(confirmOpen);

  const paid = b.payment.status === 'paid';
  const amount = formatMoney(b.total, locale);
  const method = b.paymentMethod.label[locale];
  const ready = reason !== null && (reason !== 'other' || detail.trim().length > 0);

  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={() => undefined} />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', gap: 6, px: `${layout.gutter.mobile}px`, pt: 3, pb: 6, flex: 1 }}>
        <Card variant="filled">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconBubble>
              <Icon />
            </IconBubble>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="label" component="p">
                {unitMeta[b.unit].name} {b.package.name[locale]}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: bs.text.secondary }}>
                <EventOutlined aria-hidden sx={{ fontSize: 16 }} />
                <Typography variant="caption" component="p" sx={{ color: 'inherit', fontVariantNumeric: 'tabular-nums' }}>
                  {b.id} · {formatDateShort(b.date, locale)} · {formatSlotTime(b.time, locale)}
                </Typography>
              </Box>
            </Box>
            <Price amount={b.total} size="md" />
          </Box>
        </Card>

        <Typography variant="body1" sx={{ color: bs.text.secondary }}>
          {t.lead}
        </Typography>

        <RadioGroup<CancelReason>
          label={t.reasonLabel}
          required
          value={reason}
          onChange={setReason}
          options={cancelReasons.map((r) => ({ value: r, label: t.reasons[r] }))}
        />
        {reason === 'other' && <TextArea label={t.otherLabel} required value={detail} onChange={(e) => setDetail(e.target.value)} maxLength={300} helperText={t.otherHelp} minRows={3} />}

        <Card variant="outlined" component="section">
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            <IconBubble>
              <PaymentsOutlined />
            </IconBubble>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="label" component="h2">
                {t.refundTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: bs.text.secondary, mt: 1 }}>
                {paid ? t.refundPaid(amount, method) : t.refundNone(method)}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      <BottomActionBar>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <Button variant="destructive" fullWidth disabled={!ready} onClick={() => setOpen(true)}>
            {t.cancel}
          </Button>
          <Button variant="quiet" fullWidth>
            {t.keep}
          </Button>
        </Box>
      </BottomActionBar>

      <ConfirmDialog
        disablePortal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          toast.show({ message: t.done(b.id), severity: 'success' });
        }}
        variant="destructive"
        title={t.dialogTitle(b.id)}
        description={paid ? t.dialogBodyPaid(amount) : t.dialogBodyNone}
        confirmLabel={t.dialogConfirm}
        cancelLabel={t.dialogBack}
      />
    </ScreenRoot>
  );
}

/**
 * Cancelar reserva (s67): RadioGroup of reasons ("Otro" opens a TextArea), what happens to the payment, and a destructive
 * ConfirmDialog before anything is cancelled.
 */
export function CancelBookingScreen(props: CancelBookingScreenProps) {
  return (
    <ToastProvider offsetBottom={150}>
      <Content {...props} />
    </ToastProvider>
  );
}
