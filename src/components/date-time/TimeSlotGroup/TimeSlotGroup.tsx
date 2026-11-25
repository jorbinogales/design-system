import NightlightOutlined from '@mui/icons-material/NightlightOutlined';
import WbSunnyOutlined from '@mui/icons-material/WbSunnyOutlined';
import WbTwilightOutlined from '@mui/icons-material/WbTwilightOutlined';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import type { ComponentType } from 'react';
import { useId } from 'react';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { Button } from '../../actions/Button/Button';
import { formatSlotTime, TimeSlot, type SlotStatus } from '../TimeSlot/TimeSlot';
import { rovingRadioKeyDown } from '../rovingRadio';

export interface SlotOption {
  /** Start time "HH:mm" (24 h). It is also the value of the group. */
  value: string;
  status?: SlotStatus;
}

export interface TimeSlotGroupProps {
  slots: SlotOption[];
  /** Selected start time, kept by the parent even when its slot stops being available. */
  value: string | null;
  onChange: (value: string) => void;
  /** Accessible name of the group ("Horario de la cita"). */
  label: string;
  /** Skeleton while availability loads. */
  loading?: boolean;
}

type Period = 'morning' | 'afternoon' | 'evening';

const periodOf = (time: string): Period => {
  const hour = Number(time.split(':')[0]);
  return hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
};

const periodIcon: Record<Period, ComponentType<{ sx?: object }>> = { morning: WbSunnyOutlined, afternoon: WbTwilightOutlined, evening: NightlightOutlined };

const messages = {
  es: {
    morning: 'Mañana',
    afternoon: 'Tarde',
    evening: 'Noche',
    available: (n: number) => (n === 1 ? '1 disponible' : `${n} disponibles`),
    none: 'Sin horarios disponibles',
    noneBody: 'Este día ya no tiene horarios libres. Prueba con otra fecha.',
    lostTitle: (time: string) => `El horario de ${time} ya no está disponible`,
    lostTaken: 'Se ocupó mientras terminabas tu reserva. Conservamos tus datos: elige otro horario para continuar.',
    lostOther: 'Este horario dejó de estar disponible. Conservamos tus datos: elige otro horario para continuar.',
    pickNext: (time: string) => `Elegir ${time}`,
  },
  en: {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    available: (n: number) => `${n} available`,
    none: 'No time slots available',
    noneBody: 'This day has no free slots left. Try another date.',
    lostTitle: (time: string) => `The ${time} slot is no longer available`,
    lostTaken: 'It was booked while you were finishing your reservation. Your details are saved: pick another time to continue.',
    lostOther: 'This slot stopped being available. Your details are saved: pick another time to continue.',
    pickNext: (time: string) => `Choose ${time}`,
  },
};

/**
 * Time slots grouped by Mañana / Tarde / Noche, with radio-group semantics (single tab stop, arrow keys).
 * Availability can change while the customer decides: if the selected slot is lost, the group keeps the value,
 * marks the slot, announces it, and offers the next free slot ("conserva los datos y permite elegir otra").
 */
export function TimeSlotGroup({ slots, value, onChange, label, loading = false }: TimeSlotGroupProps) {
  const t = useT(messages);
  const locale = useLocale();
  const headingId = useId();
  const status = (s: SlotOption): SlotStatus => s.status ?? 'available';
  const free = slots.filter((s) => status(s) === 'available');
  const selected = slots.find((s) => s.value === value);
  const lost = selected && status(selected) !== 'available' ? selected : undefined;
  const nextFree = lost ? (free.find((s) => s.value > lost.value) ?? free[0]) : undefined;
  const tabStop = selected && status(selected) === 'available' ? selected.value : free[0]?.value;
  const periods = (['morning', 'afternoon', 'evening'] as const).map((p) => ({ period: p, items: slots.filter((s) => periodOf(s.value) === p) })).filter((g) => g.items.length);

  if (loading) {
    return (
      <Box aria-busy="true" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[0, 1].map((i) => (
          <Box key={i} sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 2 }}>
            {Array.from({ length: 6 }, (_, j) => (
              <Skeleton key={j} variant="rounded" height={52} sx={{ borderRadius: `${radius.md}px` }} />
            ))}
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lost && (
        <Alert
          severity="warning"
          role="alert"
          action={nextFree ? <Button variant="secondary" size="sm" onClick={() => onChange(nextFree.value)}>{t.pickNext(formatSlotTime(nextFree.value, locale))}</Button> : undefined}
          sx={{ alignItems: 'center', flexWrap: 'wrap' }}
        >
          <AlertTitle>{t.lostTitle(formatSlotTime(lost.value, locale))}</AlertTitle>
          {status(lost) === 'taken' ? t.lostTaken : t.lostOther}
        </Alert>
      )}
      {free.length === 0 && (
        <Alert severity="info">
          <AlertTitle>{t.none}</AlertTitle>
          {t.noneBody}
        </Alert>
      )}
      {slots.length > 0 && (
      <Box role="radiogroup" aria-label={label} onKeyDown={rovingRadioKeyDown} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {periods.map(({ period, items }) => {
          const Icon = periodIcon[period];
          const id = `${headingId}-${period}`;
          const n = items.filter((s) => status(s) === 'available').length;
          return (
            <Box key={period} role="group" aria-labelledby={id} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Icon sx={{ fontSize: 20, color: bs.text.secondary }} />
                <Typography id={id} variant="h4" component="h3">
                  {t[period]}
                </Typography>
                <Typography variant="caption" sx={{ color: bs.text.secondary, ml: 'auto' }}>
                  {t.available(n)}
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 2 }}>
                {items.map((s) => (
                  <TimeSlot
                    key={s.value}
                    time={s.value}
                    status={status(s)}
                    selected={s.value === value}
                    tabIndex={s.value === tabStop ? 0 : -1}
                    onSelect={() => onChange(s.value)}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
      )}
    </Box>
  );
}
