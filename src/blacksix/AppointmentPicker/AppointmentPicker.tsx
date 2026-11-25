import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import EventBusyRounded from '@mui/icons-material/EventBusyRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import { useLocale, useT } from '../../i18n/locale';
import { Button } from '../../components/actions/Button/Button';
import { Calendar, type DayState } from '../../components/date-time/Calendar/Calendar';
import { DayStrip } from '../../components/date-time/DayStrip/DayStrip';
import { formatSlotTime } from '../../components/date-time/TimeSlot/TimeSlot';
import { TimeSlotGroup, type SlotOption } from '../../components/date-time/TimeSlotGroup/TimeSlotGroup';
import { bs } from '../../theme/theme';
import { radius } from '../../theme/tokens';
import { addMinutes, formatDateLong, formatDuration } from '../shared/format';

export interface AppointmentValue {
  day: Dayjs | null;
  /** "HH:mm". Kept even if the slot gets taken, so the customer never loses the data. */
  time: string | null;
}

export interface AppointmentPickerProps {
  value: AppointmentValue;
  onChange: (next: AppointmentValue) => void;
  /** First day of the strip. */
  start: Dayjs;
  today?: Dayjs;
  /** Days in the strip (default 14). */
  days?: number;
  getDayState: (day: Dayjs) => DayState;
  /** Slots of the selected day. Pass fresh slots when availability changes (polling, socket, refocus). */
  slots: SlotOption[];
  loading?: boolean;
  /** Estimated duration of the chosen package: shows the expected end time. */
  durationMin?: number;
  /** Offers a month calendar below the strip. */
  showCalendar?: boolean;
}

const messages = {
  es: {
    day: 'Día de la cita',
    time: 'Horario de la cita',
    selection: 'Tu cita',
    nothing: 'Elige un día y un horario para continuar.',
    pickTime: 'Ahora elige un horario.',
    lost: 'Ese horario ya no está disponible. Tus datos siguen guardados: elige otro horario.',
    calendar: 'Ver calendario del mes',
    hideCalendar: 'Ocultar calendario',
    calendarLabel: 'Calendario de la cita',
    ends: (end: string, d: string) => `Termina aprox. a las ${end} (${d})`,
  },
  en: {
    day: 'Appointment day',
    time: 'Appointment time',
    selection: 'Your appointment',
    nothing: 'Pick a day and a time to continue.',
    pickTime: 'Now pick a time.',
    lost: 'That time is no longer available. Your details are still saved: choose another time.',
    calendar: 'Show month calendar',
    hideCalendar: 'Hide calendar',
    calendarLabel: 'Appointment calendar',
    ends: (end: string, d: string) => `Ends about ${end} (${d})`,
  },
};

/**
 * Date + time picker of the booking flow: day strip (calendar optional), time slots and the current selection.
 * Changing day keeps the chosen time when it exists there; if the slot is taken meanwhile the data is kept and
 * the customer picks another (the slot group explains it).
 */
export function AppointmentPicker({ value, onChange, start, today, days = 14, getDayState, slots, loading = false, durationMin, showCalendar = false }: AppointmentPickerProps) {
  const t = useT(messages);
  const locale = useLocale();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const iso = value.day?.format('YYYY-MM-DD');
  const slotLost = Boolean(value.time) && slots.length > 0 && slots.find((s) => s.value === value.time)?.status === 'taken';

  const pickDay = (day: Dayjs) => onChange({ day, time: value.time });
  const pick = (time: string) => onChange({ ...value, time });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <DayStrip start={start} count={days} value={value.day} onChange={pickDay} getDayState={getDayState} today={today} label={t.day} />
        {showCalendar && (
          <>
            <Box>
              <Button variant="quiet" size="sm" startIcon={<CalendarMonthOutlined />} onClick={() => setCalendarOpen((o) => !o)} aria-expanded={calendarOpen}>
                {calendarOpen ? t.hideCalendar : t.calendar}
              </Button>
            </Box>
            {calendarOpen && <Calendar value={value.day} onChange={pickDay} getDayState={getDayState} label={t.calendarLabel} />}
          </>
        )}
      </Box>

      {value.day ? <TimeSlotGroup label={t.time} slots={slots} value={value.time} onChange={pick} loading={loading} /> : null}

      <Box
        role="status"
        aria-live="polite"
        sx={{
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
          p: 4,
          borderRadius: `${radius.lg}px`,
          border: `1px solid ${value.day && value.time && !slotLost ? bs.selection.border : bs.border.subtle}`,
          backgroundColor: value.day && value.time && !slotLost ? bs.selection.bg : bs.surface.subtle,
        }}
      >
        {slotLost ? <EventBusyRounded aria-hidden sx={{ color: bs.status.warning.fg }} /> : <CheckCircleRounded aria-hidden sx={{ color: value.day && value.time ? bs.selection.border : bs.text.secondary }} />}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: bs.text.secondary, display: 'block' }}>
            {t.selection}
          </Typography>
          {value.day && value.time && iso ? (
            <>
              <Typography variant="label" component="p" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatDateLong(iso, locale)} · {formatSlotTime(value.time, locale)}
              </Typography>
              {slotLost ? (
                <Typography variant="body2" sx={{ color: bs.status.warning.fg }}>
                  {t.lost}
                </Typography>
              ) : (
                durationMin !== undefined && (
                  <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                    {t.ends(formatSlotTime(addMinutes(value.time, durationMin), locale), formatDuration(durationMin))}
                  </Typography>
                )
              )}
            </>
          ) : (
            <Typography variant="body2" sx={{ color: bs.text.secondary }}>
              {value.day && iso ? `${formatDateLong(iso, locale)}. ${t.pickTime}` : t.nothing}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
