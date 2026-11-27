import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { PaymentMethod, PriceLine } from '../../domain/booking';
import type { PaymentStatus } from '../../domain/status';
import { useLocale, useT } from '../../i18n/locale';
import { AmountBreakdown } from '../../components/data-display/AmountBreakdown/AmountBreakdown';
import { IdentifierBlock } from '../../components/data-display/IdentifierBlock/IdentifierBlock';
import { StatusBadge } from '../../components/data-display/StatusBadge/StatusBadge';
import { KeyValue, KeyValueList } from '../../components/layout/KeyValue/KeyValue';
import { RadioGroup } from '../../components/selection/Radio/Radio';
import { bs } from '../../theme/theme';
import { radius } from '../../theme/tokens';
import { formatDateTime } from '../shared/format';

export interface PaymentPanelProps {
  methods: PaymentMethod[];
  /** Selected method id. */
  value: string;
  onChange?: (id: string) => void;
  lines: PriceLine[];
  total: number;
  status: PaymentStatus;
  /** Payment reference ("PAY-9F4K2L"), once it exists. */
  reference?: string;
  /**
   * `checkout`: choose the method, see the secure fields and the amount (before confirming).
   * `receipt`: read-only comprobante of what was paid (after).
   */
  mode?: 'checkout' | 'receipt';
  /** ISO "YYYY-MM-DDTHH:mm" of the receipt. */
  issuedAt?: string;
  /** The payment provider's secure card fields (its own iframe/elements). Without it the container shows where they mount. */
  secureFields?: ReactNode;
}

const messages = {
  es: {
    method: 'Método de pago',
    secureTitle: 'Datos de la tarjeta',
    secureBody: 'Estos campos los muestra y procesa el proveedor de pagos. Black Seat nunca ve ni guarda el número de tarjeta.',
    secureLabel: 'Campos de tarjeta seguros del proveedor de pagos',
    cardNumber: 'Número de tarjeta',
    expiry: 'Vencimiento',
    cvc: 'CVC',
    offlineTitle: 'El pago queda pendiente',
    offlineZelle: 'Tu reserva se confirma, pero el pago sigue pendiente hasta que recibamos tu Zelle. Verás el estado actualizado en la reserva.',
    offlineCash: 'Pagas al profesional cuando termine el servicio. El pago aparece como pendiente hasta entonces.',
    amount: 'Importe',
    total: 'Total',
    reference: 'Referencia de pago',
    receipt: 'Comprobante',
    paidWith: 'Método',
    issued: 'Emitido',
    status: 'Estado del pago',
    pendingRef: 'La referencia aparece cuando el pago se procesa.',
  },
  en: {
    method: 'Payment method',
    secureTitle: 'Card details',
    secureBody: 'These fields are shown and processed by the payment provider. Black Seat never sees or stores your card number.',
    secureLabel: "Secure card fields from the payment provider",
    cardNumber: 'Card number',
    expiry: 'Expiry',
    cvc: 'CVC',
    offlineTitle: 'Payment stays pending',
    offlineZelle: 'Your booking is confirmed, but payment stays pending until we receive your Zelle. You will see the updated status on the booking.',
    offlineCash: 'You pay the professional when the service is done. Payment shows as pending until then.',
    amount: 'Amount',
    total: 'Total',
    reference: 'Payment reference',
    receipt: 'Receipt',
    paidWith: 'Method',
    issued: 'Issued',
    status: 'Payment status',
    pendingRef: 'The reference appears once the payment is processed.',
  },
};

const Slot = ({ label }: { label: string }) => (
  <Box aria-hidden sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Typography variant="caption" sx={{ color: bs.text.secondary }}>
      {label}
    </Typography>
    <Box sx={{ height: 44, borderRadius: `${radius.md}px`, backgroundColor: bs.surface.subtle, border: `1px solid ${bs.border.field}` }} />
  </Box>
);

/**
 * Payment step and receipt in one component. For online methods the card fields belong to the payment provider:
 * the container is clearly labeled secure and never contains raw card inputs of our own.
 */
export function PaymentPanel({ methods, value, onChange, lines, total, status, reference, mode = 'checkout', issuedAt, secureFields }: PaymentPanelProps) {
  const t = useT(messages);
  const locale = useLocale();
  const selected = methods.find((m) => m.id === value);
  const breakdown = <AmountBreakdown lines={lines.map((l) => ({ label: l.label[locale], amount: l.amount, kind: l.kind }))} total={total} totalLabel={t.total} />;

  if (mode === 'receipt') {
    return (
      <Box component="section" aria-label={t.receipt} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Typography variant="h3" component="h2">
            {t.receipt}
          </Typography>
          <StatusBadge dimension="payment" status={status} />
        </Box>
        {reference ? <IdentifierBlock label={t.reference} value={reference} size="lg" /> : <Typography variant="body2" sx={{ color: bs.text.secondary }}>{t.pendingRef}</Typography>}
        <KeyValueList aligned>
          {selected && <KeyValue icon={<CreditCardOutlined />} label={t.paidWith} value={`${selected.label[locale]}${selected.detail ? ` · ${selected.detail[locale]}` : ''}`} />}
          {issuedAt && <KeyValue icon={<ReceiptLongOutlined />} label={t.issued} value={formatDateTime(issuedAt, locale)} tabular />}
        </KeyValueList>
        {breakdown}
      </Box>
    );
  }

  return (
    <Box component="section" aria-label={t.method} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <RadioGroup
        label={t.method}
        value={value}
        onChange={(id) => onChange?.(id)}
        options={methods.map((m) => ({ value: m.id, label: m.detail ? `${m.label[locale]} · ${m.detail[locale]}` : m.label[locale] }))}
      />

      {selected?.kind === 'card' && (
        <Box
          role="group"
          aria-label={t.secureLabel}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4, borderRadius: `${radius.lg}px`, border: `1px dashed ${bs.border.strong}`, backgroundColor: bs.surface.raised }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LockOutlined aria-hidden sx={{ fontSize: 20 }} />
            <Typography variant="label" component="p">
              {t.secureTitle}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: bs.text.secondary }}>
            {t.secureBody}
          </Typography>
          {secureFields ?? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Slot label={t.cardNumber} />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <Slot label={t.expiry} />
                <Slot label={t.cvc} />
              </Box>
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Typography variant="h4" component="h3">
            {t.amount}
          </Typography>
        </Box>
        {breakdown}
        {reference && <IdentifierBlock label={t.reference} value={reference} variant="inline" />}
      </Box>
    </Box>
  );
}
