import CheckRounded from '@mui/icons-material/CheckRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import type { Dayjs } from 'dayjs';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';

/**
 * Availability of one day.
 * `available` can be picked · `full` every slot is taken · `closed` outside business hours · `none` the service has no availability.
 */
export type DayState = 'available' | 'full' | 'closed' | 'none';

export interface CalendarProps {
  /** Selected day. */
  value: Dayjs | null;
  onChange: (day: Dayjs) => void;
  /** Availability of each day. Anything other than `available` is not selectable. */
  getDayState: (day: Dayjs) => DayState;
  /** Fires when the visible month changes: load that month's availability here and set `loading`. */
  onMonthChange?: (month: Dayjs) => void;
  /** Replaces the grid with a skeleton while the month's availability loads. */
  loading?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  /** Explains the four day states. On by default. */
  showLegend?: boolean;
  /** Accessible name of the calendar ("Fecha de la cita"). */
  label: string;
}

const messages = {
  es: {
    available: 'Disponible',
    full: 'Completo',
    closed: 'Fuera de horario',
    none: 'Sin disponibilidad',
    selected: 'Seleccionado',
    legend: 'Leyenda del calendario',
    dayName: (d: Dayjs) => d.locale('es').format('dddd D [de] MMMM'),
  },
  en: {
    available: 'Available',
    full: 'Full',
    closed: 'Outside business hours',
    none: 'No availability',
    selected: 'Selected',
    legend: 'Calendar legend',
    dayName: (d: Dayjs) => d.locale('en').format('dddd, MMMM D'),
  },
};

const hatch = `repeating-linear-gradient(135deg, ${bs.border.subtle} 0 2px, transparent 2px 6px)`;

/** Visual treatment per state: never color alone (dot, strike-through + hatch, dash, dashed outline). */
const stateSx = (state: DayState) => {
  if (state === 'full') return { color: bs.text.secondary, textDecoration: 'line-through', backgroundImage: hatch };
  if (state === 'closed') return { color: bs.text.disabled };
  if (state === 'none') return { color: bs.text.disabled, border: `1px dashed ${bs.border.strong}` };
  return {};
};

function Marker({ state, selected }: { state: DayState; selected: boolean }) {
  const base = { position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', display: 'block', lineHeight: 0 } as const;
  if (selected) return <CheckRounded aria-hidden sx={{ ...base, fontSize: 12, color: bs.text.primary }} />;
  if (state === 'available') return <Box component="span" aria-hidden sx={{ ...base, width: 4, height: 4, borderRadius: '50%', backgroundColor: bs.status.success.solid }} />;
  if (state === 'closed') return <Box component="span" aria-hidden sx={{ ...base, width: 8, height: 2, borderRadius: 1, backgroundColor: bs.text.disabled }} />;
  return null;
}

/** Static sample of a day cell, used by the legend. */
function Swatch({ state, selected = false }: { state: DayState; selected?: boolean }) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        fontSize: '0.8125rem',
        fontWeight: selected ? 700 : 500,
        fontVariantNumeric: 'tabular-nums',
        color: bs.text.primary,
        ...(selected && { backgroundColor: bs.selection.bg, boxShadow: `inset 0 0 0 2px ${bs.selection.border}` }),
        ...stateSx(state),
      }}
    >
      26
      <Marker state={state} selected={selected} />
    </Box>
  );
}

/**
 * Month calendar for choosing a service day. Built on the themed MUI X `DateCalendar`;
 * each day is available, full, outside business hours or without availability, and only available days can be picked.
 */
export function Calendar({ value, onChange, getDayState, onMonthChange, loading = false, minDate, maxDate, showLegend = true, label }: CalendarProps) {
  const t = useT(messages);
  const locale = useLocale();
  const legend: { state: DayState; selected?: boolean; label: string }[] = [
    { state: 'available', label: t.available },
    { state: 'full', label: t.full },
    { state: 'closed', label: t.closed },
    { state: 'none', label: t.none },
    { state: 'available', selected: true, label: t.selected },
  ];
  return (
    <Box role="group" aria-label={label} sx={{ width: '100%', maxWidth: 360 }}>
      <DateCalendar
        value={value}
        onChange={(d) => d && onChange(d)}
        onMonthChange={onMonthChange}
        loading={loading}
        renderLoading={() => <DayCalendarSkeleton />}
        minDate={minDate}
        maxDate={maxDate}
        fixedWeekNumber={6}
        shouldDisableDate={(d) => getDayState(d) !== 'available'}
        slotProps={{
          day: (owner) => {
            const state = getDayState(owner.day);
            const selected = owner.isDaySelected;
            const status = selected ? t.selected : t[state];
            return {
              'aria-label': `${t.dayName(owner.day)}, ${status}`,
              sx: { '&.Mui-disabled:not(.Mui-selected)': stateSx(state) },
              children: (
                <>
                  {owner.day.locale(locale).date()}
                  <Marker state={state} selected={selected} />
                </>
              ),
            };
          },
        }}
      />
      {showLegend && (
        <Box component="ul" aria-label={t.legend} sx={{ listStyle: 'none', m: 0, mt: 2, p: 0, px: 2, display: 'flex', flexWrap: 'wrap', columnGap: 4, rowGap: 2 }}>
          {legend.map((l) => (
            <Box component="li" key={l.label} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
              <Swatch state={l.state} selected={l.selected} />
              <Typography variant="caption" sx={{ color: bs.text.secondary }}>
                {l.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
