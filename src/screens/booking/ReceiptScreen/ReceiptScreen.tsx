import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { PaymentPanel } from '../../../blacksix/PaymentPanel/PaymentPanel';
import { formatDateTime, formatDuration } from '../../../blacksix/shared/format';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { formatAddress } from '../../../components/address/LocationCard/LocationCard';
import { KeyValue, KeyValueList } from '../../../components/layout/KeyValue/KeyValue';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { useLocale, useT } from '../../../i18n/locale';
import { getBookingDetail, getReceipt } from '../../../mocks/bookings';
import { paymentMethods } from '../../../mocks/catalog';
import { vehicleName } from '../../../mocks/people';
import { SchemeScope } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { radius, typeScale } from '../../../theme/tokens';
import { ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Recibo electrónico',
    barcode: (code: string) => `Código de barras del recibo ${code}`,
    barcodeNote: 'Muéstralo si el centro te lo pide.',
    pendingBarcode: 'El código de barras estará disponible cuando se registre el pago.',
    booking: 'Reserva',
    bookingDate: 'Fecha de la reserva',
    vehicle: 'Vehículo',
    duration: 'Duración estimada',
    place: 'Lugar',
    download: 'Descargar recibo',
  },
  en: {
    title: 'E-Receipt',
    barcode: (code: string) => `Receipt barcode ${code}`,
    barcodeNote: 'Show it if the center asks for it.',
    pendingBarcode: 'The barcode will be available once the payment is recorded.',
    booking: 'Booking',
    bookingDate: 'Booking date',
    vehicle: 'Vehicle',
    duration: 'Estimated duration',
    place: 'Place',
    download: 'Download receipt',
  },
};

/** Deterministic bar widths from the code. It looks like a linear barcode but is illustrative, not a scannable symbology. */
function barsOf(code: string) {
  let seed = 7;
  for (const ch of code) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const out: { x: number; w: number }[] = [];
  let x = 0;
  while (x < 300) {
    const w = 1 + Math.floor(next() * 4);
    if (x + w > 300) break;
    out.push({ x, w });
    x += w + 1 + Math.floor(next() * 3);
  }
  return out;
}

/** Barcode on a light surface in both themes (scanners need dark bars on light). */
function Barcode({ code }: { code: string }) {
  const t = useT(messages);
  const bars = useMemo(() => barsOf(code), [code]);
  return (
    <SchemeScope scheme="light" sx={{ backgroundColor: bs.surface.canvas, borderRadius: `${radius.md}px`, border: `1px solid ${bs.border.subtle}`, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box component="svg" viewBox="0 0 300 64" preserveAspectRatio="none" role="img" aria-label={t.barcode(code)} sx={{ width: '100%', height: 72, display: 'block' }}>
        {bars.map((b) => (
          <rect key={b.x} x={b.x} y={0} width={b.w} height={64} fill="currentColor" />
        ))}
      </Box>
      <Typography component="p" sx={{ ...typeScale.code, letterSpacing: '0.2em', fontVariantNumeric: 'tabular-nums' }}>
        {code}
      </Typography>
    </SchemeScope>
  );
}

export interface ReceiptScreenProps {
  /** `BS-24090` (completed, paid, PAY-9F4K2L) or `BS-24117` (payment pending: no reference or barcode yet). */
  bookingId?: string;
}

/** Recibo electrónico (s37): barcode, booking data and PaymentPanel in receipt mode, with "Descargar recibo". */
export function ReceiptScreen({ bookingId = 'BS-24090' }: ReceiptScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const b = getBookingDetail(bookingId);
  const receipt = getReceipt(bookingId);
  const reference = receipt?.reference ?? b.payment.reference;
  const place = b.center ? `${b.center.name} · ${formatAddress(b.center.address)}` : b.address ? formatAddress(b.address) : '';
  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={() => undefined} />
      <ScreenBody gap={6} sx={{ flex: 1 }}>
        {reference ? (
          <Barcode code={reference} />
        ) : (
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.pendingBarcode}
          </Typography>
        )}
        <KeyValueList>
          <KeyValue label={t.booking} value={b.id} tabular />
          <KeyValue label={t.bookingDate} value={formatDateTime(`${b.date}T${b.time}`, locale)} tabular />
          <KeyValue label={t.vehicle} value={`${vehicleName(b.vehicle)} · ${b.vehicle.plate}`} />
          <KeyValue label={t.duration} value={formatDuration(b.package.durationMin)} />
          <KeyValue label={t.place} value={place} />
        </KeyValueList>
        <PaymentPanel
          mode="receipt"
          methods={paymentMethods}
          value={receipt?.methodId ?? b.payment.methodId}
          lines={receipt?.lines ?? b.lines}
          total={receipt?.total ?? b.total}
          status={receipt?.status ?? b.payment.status}
          reference={reference}
          issuedAt={receipt?.issuedAt}
        />
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth startIcon={<DownloadOutlined />} disabled={!reference}>
          {t.download}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
