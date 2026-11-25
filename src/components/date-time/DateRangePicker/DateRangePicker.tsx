import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { useId } from 'react';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { Button } from '../../actions/Button/Button';
import { FilterChipGroup } from '../../selection/FilterChip/FilterChip';

export interface DateRange {
  from: Dayjs | null;
  to: Dayjs | null;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Visible title of the group ("Fechas del servicio"). */
  label: string;
  /** Show the quick ranges Hoy / 7 días / Este mes. On by default. */
  presets?: boolean;
  /** Reference "today" for presets. Defaults to the current day. */
  today?: Dayjs;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

type PresetId = 'today' | 'last7' | 'month';

const messages = {
  es: {
    from: 'Desde',
    to: 'Hasta',
    today: 'Hoy',
    last7: 'Últimos 7 días',
    month: 'Este mes',
    presets: 'Rangos rápidos',
    clear: 'Limpiar fechas',
    invalid: 'La fecha final no puede ser anterior a la inicial.',
  },
  en: {
    from: 'From',
    to: 'To',
    today: 'Today',
    last7: 'Last 7 days',
    month: 'This month',
    presets: 'Quick ranges',
    clear: 'Clear dates',
    invalid: 'The end date cannot be earlier than the start date.',
  },
};

const rangeOf = (id: PresetId, today: Dayjs): DateRange =>
  id === 'today' ? { from: today, to: today } : id === 'last7' ? { from: today.subtract(6, 'day'), to: today } : { from: today.startOf('month'), to: today.endOf('month') };

/**
 * From–to date range for operator filters (historial, reportes). Two pickers plus quick ranges;
 * an end date before the start date is flagged in text, not only by color.
 */
export function DateRangePicker({ value, onChange, label, presets = true, today = dayjs(), minDate, maxDate }: DateRangePickerProps) {
  const t = useT(messages);
  const titleId = useId();
  const invalid = Boolean(value.from && value.to && value.to.isBefore(value.from, 'day'));
  const active = (['today', 'last7', 'month'] as const).find((id) => {
    const r = rangeOf(id, today);
    return value.from?.isSame(r.from, 'day') && value.to?.isSame(r.to, 'day');
  });
  const hasValue = Boolean(value.from || value.to);
  return (
    <Box role="group" aria-labelledby={titleId} sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography id={titleId} variant="label">
          {label}
        </Typography>
        {hasValue && (
          <Button variant="quiet" size="sm" onClick={() => onChange({ from: null, to: null })}>
            {t.clear}
          </Button>
        )}
      </Box>
      {presets && (
        <FilterChipGroup
          selectionMode="single"
          size="sm"
          overflow="wrap"
          label={t.presets}
          value={active ?? null}
          onChange={(id) => onChange(rangeOf(id as PresetId, today))}
          options={[
            { value: 'today', label: t.today },
            { value: 'last7', label: t.last7 },
            { value: 'month', label: t.month },
          ]}
        />
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: 3 }}>
        <DatePicker
          label={t.from}
          value={value.from}
          onChange={(from) => onChange({ ...value, from })}
          minDate={minDate}
          maxDate={value.to && !invalid ? value.to : maxDate}
          slotProps={{ textField: { error: invalid } }}
        />
        <DatePicker
          label={t.to}
          value={value.to}
          onChange={(to) => onChange({ ...value, to })}
          minDate={value.from ?? minDate}
          maxDate={maxDate}
          slotProps={{ textField: { error: invalid } }}
        />
      </Box>
      {invalid && (
        <Typography role="alert" variant="caption" sx={{ color: bs.status.danger.fg }}>
          {t.invalid}
        </Typography>
      )}
    </Box>
  );
}
