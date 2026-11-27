import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNav } from '../../../app/nav';
import { BookingSummary, type SummaryField } from '../../../blacksix/BookingSummary/BookingSummary';
import { Price } from '../../../components/data-display/Price/Price';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { AmountBreakdown } from '../../../components/data-display/AmountBreakdown/AmountBreakdown';
import { TextField } from '../../../components/fields/TextField/TextField';
import { FieldMessage } from '../../../components/feedback/FieldMessage/FieldMessage';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import type { BusinessUnit } from '../../../domain/units';
import { formatMoney } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { FLOW_BOOKING_ID, flowBooking } from '../data';
import { BookingTopBar, ScreenBody, ScreenRoot } from '../ui';

const PROMO_CODE = 'BIENVENIDA';
const PROMO_AMOUNT = 20;

const messages = {
  es: {
    title: 'Resumen',
    promo: 'Código promocional',
    apply: 'Aplicar',
    remove: 'Quitar',
    applied: (amount: string) => `Cupón ${PROMO_CODE} aplicado: ${amount} menos.`,
    invalid: 'Ese código no es válido o ya venció.',
    couponLine: `Cupón ${PROMO_CODE}`,
    priceFrom: (p: string) => `Desde ${p}: el precio final puede variar según la distancia y el estado del vehículo.`,
    total: 'Total a pagar',
    confirm: 'Confirmar reserva',
    confirmed: (id: string) => `Reserva ${id} confirmada`,
    edit: {
      service: 'Volverías a elegir el paquete.',
      schedule: 'Volverías a elegir día y horario.',
      location: 'Volverías a elegir la dirección.',
      vehicle: 'Volverías a elegir el vehículo.',
      auction: 'Volverías a los datos de la subasta.',
      payment: 'Volverías a elegir el método de pago.',
    } as Record<SummaryField, string>,
    payOnline: (amount: string, method: string) => `Al confirmar se cobran ${amount} a ${method}.`,
    payZelle: 'Tu reserva se confirma y el pago queda pendiente hasta que recibamos tu Zelle.',
    payCash: 'Pagas al profesional cuando termine el servicio. El pago queda pendiente hasta entonces.',
  },
  en: {
    title: 'Summary',
    promo: 'Promo code',
    apply: 'Apply',
    remove: 'Remove',
    applied: (amount: string) => `Coupon ${PROMO_CODE} applied: ${amount} off.`,
    invalid: 'That code is not valid or has expired.',
    couponLine: `${PROMO_CODE} coupon`,
    priceFrom: (p: string) => `From ${p}: the final price may vary with distance and vehicle condition.`,
    total: 'Total to pay',
    confirm: 'Confirm booking',
    confirmed: (id: string) => `Booking ${id} confirmed`,
    edit: {
      service: 'You would go back to choose the package.',
      schedule: 'You would go back to choose the day and time.',
      location: 'You would go back to choose the address.',
      vehicle: 'You would go back to choose the vehicle.',
      auction: 'You would go back to the auction details.',
      payment: 'You would go back to choose the payment method.',
    } as Record<SummaryField, string>,
    payOnline: (amount: string, method: string) => `When you confirm, ${amount} is charged to ${method}.`,
    payZelle: 'Your booking is confirmed and payment stays pending until we receive your Zelle.',
    payCash: 'You pay the professional when the service is done. Payment stays pending until then.',
  },
};

export interface ReviewSummaryScreenProps {
  /** `BS-24117` (Detailing Premium) or `BS-24120` (Towing, with auction data). In the app the route params decide instead. */
  bookingId?: string;
  /** Start with the BIENVENIDA coupon already applied. */
  couponApplied?: boolean;
}

/** Step each "Cambiar" link of the summary goes back to. Towing has no package, vehicle or schedule step: its day lives in the auction form. */
const editStep = (field: SummaryField, unit: BusinessUnit) => {
  if (unit === 'towing') return field === 'payment' ? 'payment-method' : 'auction-pickup';
  return { service: 'choose-package', vehicle: 'select-vehicle', schedule: 'schedule', location: 'pickup-address', auction: 'auction-pickup', payment: 'payment-method' }[field];
};

function Content({ bookingId = FLOW_BOOKING_ID, couponApplied = true }: ReviewSummaryScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const toast = useToast();
  const nav = useNav();
  const params = nav.route.params ?? {};
  const booking = flowBooking({ unit: bookingId === 'BS-24120' ? 'towing' : 'detailing', ...params });
  const [applied, setApplied] = useState(couponApplied);
  const [code, setCode] = useState(couponApplied ? PROMO_CODE : '');
  const [error, setError] = useState(false);

  const base = booking.lines.filter((l) => l.kind !== 'discount');
  const lines = [
    ...base.map((l) => ({ label: l.label[locale], amount: l.amount, kind: l.kind })),
    ...(applied ? [{ label: t.couponLine, amount: PROMO_AMOUNT, kind: 'discount' as const }] : []),
  ];
  const total = base.reduce((sum, l) => sum + l.amount, 0) - (applied ? PROMO_AMOUNT : 0);

  const apply = () => {
    if (code.trim().toUpperCase() === PROMO_CODE) {
      setApplied(true);
      setError(false);
      setCode(PROMO_CODE);
    } else setError(true);
  };
  const remove = () => {
    setApplied(false);
    setCode('');
    setError(false);
  };

  return (
    <ScreenRoot>
      <BookingTopBar title={t.title} step={3} />
      <ScreenBody gap={6} sx={{ flex: 1 }}>
        <BookingSummary booking={booking} hideAmounts onEdit={(field) => (nav.route.name ? nav.go(editStep(field, booking.unit), params) : toast.show({ message: t.edit[field] }))} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t.promo}
            optional
            value={code}
            readOnly={applied}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(false);
            }}
            error={error ? t.invalid : undefined}
            autoComplete="off"
            slotProps={{ htmlInput: { autoCapitalize: 'characters', spellCheck: false } }}
            endAdornment={
              applied ? (
                <Button variant="quiet" size="sm" onClick={remove}>
                  {t.remove}
                </Button>
              ) : (
                <Button variant="quiet" size="sm" onClick={apply} disabled={!code.trim()}>
                  {t.apply}
                </Button>
              )
            }
          />
          {applied && <FieldMessage tone="hint" live>{t.applied(formatMoney(PROMO_AMOUNT, locale))}</FieldMessage>}
        </Box>

        <AmountBreakdown
          lines={lines}
          total={total}
          totalLabel={t.total}
          note={booking.package.priceFrom ? t.priceFrom(formatMoney(booking.package.price, locale)) : undefined}
        />
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
        <Button onClick={() => {
              toast.show({ message: t.confirmed(booking.id), severity: 'success' });
              nav.reset('booking-confirmed', params);
            }}>
            {t.confirm}
          </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}

/**
 * Resumen (s36): BookingSummary with "Cambiar" per row, promo code, AmountBreakdown and "Confirmar reserva",
 * the only solid orange of the screen. A note says honestly whether the card is charged now or payment stays pending. Step 4 of 5.
 */
export function ReviewSummaryScreen(props: ReviewSummaryScreenProps) {
  return (
    <ToastProvider offsetBottom={150}>
      <Content {...props} />
    </ToastProvider>
  );
}
