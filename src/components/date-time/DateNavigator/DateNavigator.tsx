import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dayjs, { type Dayjs } from 'dayjs';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { Button } from '../../actions/Button/Button';
import { IconButton } from '../../actions/IconButton/IconButton';

export interface DateNavigatorProps {
  value: Dayjs;
  onChange: (day: Dayjs) => void;
  /** Reference "today". Defaults to the current day. */
  today?: Dayjs;
  /** `md` 44 px (touch) · `sm` 36 px (dense desktop toolbars). */
  size?: 'sm' | 'md';
}

const messages = {
  es: { prev: 'Día anterior', next: 'Día siguiente', today: 'Hoy', yesterday: 'Ayer', tomorrow: 'Mañana', goToday: 'Ir a hoy', group: 'Navegación por día', date: (d: Dayjs) => d.locale('es').format('ddd D MMM YYYY').replaceAll('.', '') },
  en: { prev: 'Previous day', next: 'Next day', today: 'Today', yesterday: 'Yesterday', tomorrow: 'Tomorrow', goToday: 'Go to today', group: 'Day navigation', date: (d: Dayjs) => d.locale('en').format('ddd, MMM D, YYYY') },
};

/**
 * Previous / next day, the date label and a "Hoy" shortcut. Drives the operator's daily tray.
 * The label is a polite live region, so screen readers hear the new day after each change.
 */
export function DateNavigator({ value, onChange, today = dayjs(), size = 'md' }: DateNavigatorProps) {
  const t = useT(messages);
  const locale = useLocale();
  const isToday = value.isSame(today, 'day');
  const relative = isToday ? t.today : value.isSame(today.subtract(1, 'day'), 'day') ? t.yesterday : value.isSame(today.add(1, 'day'), 'day') ? t.tomorrow : value.locale(locale).format('dddd');
  return (
    <Box role="group" aria-label={t.group} sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, maxWidth: '100%' }}>
      <IconButton label={t.prev} icon={<ChevronLeftRounded />} variant="outlined" size={size} tooltip onClick={() => onChange(value.subtract(1, 'day'))} />
      <Box aria-live="polite" sx={{ minWidth: 132, textAlign: 'center', px: 1 }}>
        <Typography variant="label" sx={{ display: 'block', textTransform: 'capitalize', color: bs.text.primary }}>
          {relative}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: bs.text.secondary, fontVariantNumeric: 'tabular-nums', textTransform: 'capitalize' }}>
          {t.date(value)}
        </Typography>
      </Box>
      <IconButton label={t.next} icon={<ChevronRightRounded />} variant="outlined" size={size} tooltip onClick={() => onChange(value.add(1, 'day'))} />
      <Button variant="secondary" size={size === 'sm' ? 'sm' : 'md'} disabled={isToday} aria-label={t.goToday} onClick={() => onChange(today)}>
        {t.today}
      </Button>
    </Box>
  );
}
