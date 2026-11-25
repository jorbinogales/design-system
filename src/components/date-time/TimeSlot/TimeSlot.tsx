import BlockRounded from '@mui/icons-material/BlockRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import EventBusyRounded from '@mui/icons-material/EventBusyRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { intlLocale } from '../../../i18n/format';
import { useLocale, useT, type Locale } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius, transition, typeScale } from '../../../theme/tokens';

/**
 * `available` can be picked · `full` every place is taken · `closed` outside business hours ·
 * `taken` was available and got booked by someone else while the customer was deciding.
 */
export type SlotStatus = 'available' | 'full' | 'closed' | 'taken';

export interface TimeSlotProps {
  /** Start time as "HH:mm" (24 h). Rendered in the active locale: "9:00 a. m." / "9:00 AM". */
  time: string;
  status?: SlotStatus;
  selected?: boolean;
  onSelect?: () => void;
  /** Roving tab index, set by `TimeSlotGroup`. */
  tabIndex?: number;
}

/** "13:30" → "1:30 p. m." (es) / "1:30 PM" (en). */
export function formatSlotTime(time: string, locale: Locale): string {
  const [h, m] = time.split(':').map(Number);
  return new Intl.DateTimeFormat(intlLocale[locale], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(new Date(Date.UTC(2000, 0, 1, h, m)));
}

const messages = {
  es: { full: 'Completo', closed: 'Cerrado', taken: 'Ocupado', fullName: 'completo', closedName: 'fuera del horario de atención', takenName: 'ya no está disponible' },
  en: { full: 'Full', closed: 'Closed', taken: 'Taken', fullName: 'full', closedName: 'outside business hours', takenName: 'no longer available' },
};

/**
 * One time slot, a radio button. Selected = soft orange fill + orange border + check.
 * Full, closed and taken slots say so in text and shape, not only in color.
 */
export function TimeSlot({ time, status = 'available', selected = false, onSelect, tabIndex }: TimeSlotProps) {
  const t = useT(messages);
  const locale = useLocale();
  const enabled = status === 'available';
  const text = formatSlotTime(time, locale);
  const sub = status === 'full' ? t.full : status === 'closed' ? t.closed : status === 'taken' ? t.taken : null;
  const stateName = status === 'full' ? t.fullName : status === 'closed' ? t.closedName : status === 'taken' ? t.takenName : null;
  const Glyph = status === 'taken' ? EventBusyRounded : status === 'closed' ? BlockRounded : null;
  const tone = bs.status.danger;
  return (
    <ButtonBase
      role="radio"
      aria-checked={selected}
      aria-disabled={!enabled || undefined}
      aria-label={stateName ? `${text}, ${stateName}` : text}
      tabIndex={tabIndex}
      onClick={() => enabled && onSelect?.()}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.25,
        minWidth: 0,
        width: '100%',
        minHeight: 52,
        px: 2,
        borderRadius: `${radius.md}px`,
        border: `1px solid ${bs.border.subtle}`,
        backgroundColor: bs.surface.subtle,
        color: bs.text.primary,
        cursor: enabled ? 'pointer' : 'not-allowed',
        transition: transition('background-color', 'box-shadow'),
        '@media (hover: hover)': enabled && !selected ? { '&:hover': { backgroundColor: bs.surface.muted } } : undefined,
        '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 },
        ...(selected && { backgroundColor: bs.selection.bg, borderColor: 'transparent', boxShadow: `inset 0 0 0 2px ${bs.selection.border}` }),
        ...(status === 'full' && { backgroundColor: 'transparent', borderStyle: 'dashed', color: bs.text.secondary }),
        ...(status === 'closed' && { backgroundColor: bs.disabled.bg, borderColor: bs.disabled.border, color: bs.disabled.fg }),
        ...(status === 'taken' && { backgroundColor: tone.bg, borderColor: tone.border, color: tone.fg }),
      }}
    >
      <Box component="span" sx={{ ...typeScale.label, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', textDecoration: status === 'full' || status === 'taken' ? 'line-through' : 'none' }}>
        {text}
      </Box>
      {sub && (
        <Box component="span" aria-hidden sx={{ ...typeScale.caption, fontSize: '0.6875rem', display: 'inline-flex', alignItems: 'center', gap: 0.5, textDecoration: 'none' }}>
          {Glyph && <Glyph sx={{ fontSize: 12 }} />}
          {sub}
        </Box>
      )}
      {selected && <CheckRounded aria-hidden sx={{ position: 'absolute', top: 4, right: 4, fontSize: 16, color: bs.text.primary }} />}
    </ButtonBase>
  );
}
