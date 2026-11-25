import CheckRounded from '@mui/icons-material/CheckRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import type { Dayjs } from 'dayjs';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius, transition, typeScale } from '../../../theme/tokens';
import type { DayState } from '../Calendar/Calendar';
import { rovingRadioKeyDown } from '../rovingRadio';

export interface DayStripProps {
  /** First day of the strip. */
  start: Dayjs;
  /** How many consecutive days to show. */
  count?: number;
  value: Dayjs | null;
  onChange: (day: Dayjs) => void;
  /** Availability per day. Omit to treat every day as available. */
  getDayState?: (day: Dayjs) => DayState;
  /** Reference "today" for the Hoy / Mañana labels. Defaults to the current day. */
  today?: Dayjs;
  /** Accessible name of the group ("Día de la cita"). */
  label: string;
}

const messages = {
  es: {
    today: 'Hoy',
    tomorrow: 'Mañana',
    full: 'Completo',
    closed: 'Cerrado',
    none: 'Sin horario',
    availableName: 'disponible',
    fullName: 'completo',
    closedName: 'fuera de horario',
    noneName: 'sin disponibilidad',
    fullDate: (d: Dayjs) => d.locale('es').format('dddd D [de] MMMM'),
    weekday: (d: Dayjs) => d.locale('es').format('ddd').replace('.', ''),
  },
  en: {
    today: 'Today',
    tomorrow: 'Tomorrow',
    full: 'Full',
    closed: 'Closed',
    none: 'No slots',
    availableName: 'available',
    fullName: 'full',
    closedName: 'outside business hours',
    noneName: 'no availability',
    fullDate: (d: Dayjs) => d.locale('en').format('dddd, MMMM D'),
    weekday: (d: Dayjs) => d.locale('en').format('ddd'),
  },
};

/**
 * Horizontal, scrollable strip of days ("Hoy", "Mañana", "jue 27"). One day selected at a time;
 * radio-group semantics with arrow keys. Days that are full, closed or without slots stay visible but cannot be picked.
 */
export function DayStrip({ start, count = 14, value, onChange, getDayState, today, label }: DayStripProps) {
  const t = useT(messages);
  const locale = useLocale();
  const now = (today ?? start).locale(locale);
  const days = Array.from({ length: count }, (_, i) => start.add(i, 'day'));
  const stateOf = (d: Dayjs): DayState => getDayState?.(d) ?? 'available';
  const firstEnabled = days.find((d) => stateOf(d) === 'available');
  const tabStop = value && days.some((d) => d.isSame(value, 'day') && stateOf(d) === 'available') ? value : firstEnabled;

  return (
    <Box
      role="radiogroup"
      aria-label={label}
      onKeyDown={rovingRadioKeyDown}
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        scrollSnapType: 'x proximity',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        py: 1,
        px: 1,
        mx: -1,
      }}
    >
      {days.map((d) => {
        const state = stateOf(d);
        const selected = Boolean(value && d.isSame(value, 'day'));
        const enabled = state === 'available';
        const isToday = d.isSame(now, 'day');
        const isTomorrow = d.isSame(now.add(1, 'day'), 'day');
        const top = isToday ? t.today : isTomorrow ? t.tomorrow : t.weekday(d);
        const stateName = { available: t.availableName, full: t.fullName, closed: t.closedName, none: t.noneName }[state];
        const bottomText = { available: '', full: t.full, closed: t.closed, none: t.none }[state];
        return (
          <ButtonBase
            key={d.format('YYYY-MM-DD')}
            role="radio"
            aria-checked={selected}
            aria-disabled={!enabled || undefined}
            aria-label={`${isToday ? `${t.today}, ` : isTomorrow ? `${t.tomorrow}, ` : ''}${t.fullDate(d)}, ${stateName}`}
            tabIndex={tabStop && d.isSame(tabStop, 'day') ? 0 : -1}
            onClick={() => enabled && onChange(d)}
            sx={{
              flexShrink: 0,
              scrollSnapAlign: 'start',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              width: 76,
              minHeight: 80,
              borderRadius: `${radius.md}px`,
              border: `1px solid ${bs.border.subtle}`,
              backgroundColor: bs.surface.subtle,
              color: bs.text.primary,
              cursor: enabled ? 'pointer' : 'not-allowed',
              transition: transition('background-color', 'box-shadow'),
              '@media (hover: hover)': enabled && !selected ? { '&:hover': { backgroundColor: bs.surface.muted } } : undefined,
              '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 },
              ...(selected && { backgroundColor: bs.selection.bg, borderColor: 'transparent', boxShadow: `inset 0 0 0 2px ${bs.selection.border}` }),
              ...(!enabled && { backgroundColor: 'transparent', borderStyle: 'dashed', color: bs.text.secondary }),
              ...(state === 'closed' && { color: bs.text.disabled }),
            }}
          >
            <Box component="span" sx={{ ...typeScale.caption, textTransform: 'capitalize', color: selected ? bs.text.primary : bs.text.secondary }}>
              {top}
            </Box>
            <Box component="span" sx={{ ...typeScale.h3, fontVariantNumeric: 'tabular-nums', textDecoration: state === 'full' ? 'line-through' : 'none' }}>
              {d.date()}
            </Box>
            <Box component="span" aria-hidden sx={{ ...typeScale.caption, fontSize: '0.6875rem', minHeight: 14, display: 'inline-flex', alignItems: 'center' }}>
              {selected ? <CheckRounded sx={{ fontSize: 14 }} /> : bottomText}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
