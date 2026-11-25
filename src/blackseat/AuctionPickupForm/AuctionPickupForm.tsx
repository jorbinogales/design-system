import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Dayjs } from 'dayjs';
import type { AuctionHouse, AuctionYard } from '../../domain/booking';
import { useT, type Locale } from '../../i18n/locale';
import { Button } from '../../components/actions/Button/Button';
import { LocationCard } from '../../components/address/LocationCard/LocationCard';
import { DayStrip } from '../../components/date-time/DayStrip/DayStrip';
import type { DayState } from '../../components/date-time/Calendar/Calendar';
import { CodeField } from '../../components/fields/CodeField/CodeField';
import { FieldMessage } from '../../components/feedback/FieldMessage/FieldMessage';
import { RadioGroup } from '../../components/selection/Radio/Radio';
import { Select } from '../../components/selection/Select/Select';
import { bs } from '../../theme/theme';

export interface AuctionPickupValue {
  auction: AuctionHouse | null;
  yardId: string;
  /** Lot number. A string: leading zeros are data ("04217753"). */
  lot: string;
  /** Pickup code. A string: "0093". */
  code: string;
  date: Dayjs | null;
}

export type AuctionPickupErrors = Partial<Record<keyof AuctionPickupValue, string>>;

export const emptyAuctionPickup: AuctionPickupValue = { auction: null, yardId: '', lot: '', code: '', date: null };

const errorCopy = {
  es: {
    auction: 'Elige Copart o IAA.',
    yardId: 'Elige el patio donde está el vehículo.',
    lotRequired: 'Escribe el número de lote.',
    lotFormat: 'El lote debe tener entre 6 y 8 dígitos.',
    codeRequired: 'Escribe el código de recogida.',
    codeFormat: 'El código de recogida tiene 4 dígitos.',
    date: 'Elige el día de la recogida.',
  },
  en: {
    auction: 'Choose Copart or IAA.',
    yardId: 'Choose the yard where the vehicle is.',
    lotRequired: 'Enter the lot number.',
    lotFormat: 'The lot must have 6 to 8 digits.',
    codeRequired: 'Enter the pickup code.',
    codeFormat: 'The pickup code has 4 digits.',
    date: 'Choose the pickup day.',
  },
};

/** Validates the pickup data. Returns one message per invalid field; an empty object means valid. */
export function validateAuctionPickup(v: AuctionPickupValue, locale: Locale): AuctionPickupErrors {
  const m = errorCopy[locale];
  const errors: AuctionPickupErrors = {};
  if (!v.auction) errors.auction = m.auction;
  if (!v.yardId) errors.yardId = m.yardId;
  if (!v.lot.trim()) errors.lot = m.lotRequired;
  else if (!/^\d{6,8}$/.test(v.lot)) errors.lot = m.lotFormat;
  if (!v.code.trim()) errors.code = m.codeRequired;
  else if (!/^\d{4}$/.test(v.code)) errors.code = m.codeFormat;
  if (!v.date) errors.date = m.date;
  return errors;
}

export interface AuctionPickupFormProps {
  value: AuctionPickupValue;
  onChange: (next: AuctionPickupValue) => void;
  /** Yards of Copart and IAA (see `src/mocks/catalog.ts`). */
  yards: AuctionYard[];
  /** Validation messages, usually from `validateAuctionPickup` after the first submit. */
  errors?: AuctionPickupErrors;
  /** First selectable day of the date strip. */
  start: Dayjs;
  today?: Dayjs;
  getDayState?: (day: Dayjs) => DayState;
  onSubmit?: () => void;
  submitLabel?: string;
  loading?: boolean;
}

const messages = {
  es: {
    auction: 'Subasta',
    yard: 'Patio de recogida',
    yardPlaceholder: 'Elige un patio',
    yardFirst: 'Elige primero la subasta',
    lot: 'Número de lote',
    lotHelp: 'Como aparece en tu factura de la subasta. Conservamos los ceros del inicio.',
    code: 'Código de recogida',
    codeHelp: 'Los 4 dígitos que te dio la subasta para liberar el vehículo.',
    date: 'Fecha de recogida',
    yardTitle: (name: string) => `Patio ${name}`,
    hours: (h: string) => `Horario del patio: ${h}`,
    next: 'Continuar',
  },
  en: {
    auction: 'Auction',
    yard: 'Pickup yard',
    yardPlaceholder: 'Choose a yard',
    yardFirst: 'Choose the auction first',
    lot: 'Lot number',
    lotHelp: 'As shown on your auction invoice. We keep the leading zeros.',
    code: 'Pickup code',
    codeHelp: 'The 4 digits the auction gave you to release the vehicle.',
    date: 'Pickup date',
    yardTitle: (name: string) => `${name} yard`,
    hours: (h: string) => `Yard hours: ${h}`,
    next: 'Continue',
  },
};

const auctionLabel: Record<AuctionHouse, string> = { copart: 'Copart', iaa: 'IAA' };

/**
 * Pickup data of a Towing booking. Auction, yard, lot, pickup code and date each have their own label;
 * lot and code are identifiers (strings), so leading zeros are never lost. Validation messages come from the parent.
 */
export function AuctionPickupForm({ value, onChange, yards, errors = {}, start, today, getDayState, onSubmit, submitLabel, loading = false }: AuctionPickupFormProps) {
  const t = useT(messages);
  const set = (patch: Partial<AuctionPickupValue>) => onChange({ ...value, ...patch });
  const yardOptions = yards.filter((y) => y.auction === value.auction).map((y) => ({ value: y.id, label: y.name }));
  const yard = yards.find((y) => y.id === value.yardId);

  return (
    <Box
      component="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}
    >
      <RadioGroup<AuctionHouse>
        label={t.auction}
        orientation="horizontal"
        required
        value={value.auction}
        onChange={(a) => set({ auction: a, yardId: yards.find((y) => y.id === value.yardId)?.auction === a ? value.yardId : '' })}
        options={[
          { value: 'copart', label: auctionLabel.copart },
          { value: 'iaa', label: auctionLabel.iaa },
        ]}
        error={errors.auction}
      />

      <Select<string>
        label={t.yard}
        required
        value={value.yardId}
        onChange={(id) => set({ yardId: id })}
        options={yardOptions}
        placeholder={value.auction ? t.yardPlaceholder : t.yardFirst}
        disabled={!value.auction}
        error={errors.yardId}
      />

      <CodeField label={t.lot} value={value.lot} onChange={(lot) => set({ lot })} charset="numeric" maxLength={8} required helperText={t.lotHelp} error={errors.lot} clearable />
      <CodeField label={t.code} value={value.code} onChange={(code) => set({ code })} charset="numeric" maxLength={4} required helperText={t.codeHelp} error={errors.code} clearable />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="label" component="p">
          {t.date}
        </Typography>
        <DayStrip start={start} today={today} value={value.date} onChange={(date) => set({ date })} getDayState={getDayState} label={t.date} />
        {errors.date && <FieldMessage tone="error">{errors.date}</FieldMessage>}
      </Box>

      {yard && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <LocationCard address={yard.address} title={t.yardTitle(yard.name)} pinKind="auction" layout="stacked" />
          <Typography variant="caption" sx={{ color: bs.text.secondary }}>
            {t.hours(yard.hours)}
          </Typography>
        </Box>
      )}

      {onSubmit && (
        <Button type="submit" size="lg" fullWidth loading={loading}>
          {submitLabel ?? t.next}
        </Button>
      )}
    </Box>
  );
}
