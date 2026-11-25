import CallEndRounded from '@mui/icons-material/CallEndRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState, type ReactNode } from 'react';
import { IconButton } from '../../../components/actions/IconButton/IconButton';
import { bs } from '../../../theme/theme';
import { layout, radius, transition } from '../../../theme/tokens';

/** mm:ss counter that ticks every second. */
export function useCallTimer(start = 0) {
  const [seconds, setSeconds] = useState(start);
  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  return seconds;
}

export const formatCallTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function CallTimer({ seconds }: { seconds: number }) {
  return (
    <Typography role="timer" aria-live="off" variant="body1" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: bs.text.primary }}>
      {formatCallTime(seconds)}
    </Typography>
  );
}

export interface CallControlDef {
  id: string;
  label: string;
  icon: ReactNode;
  /** Shown while `pressed`. */
  activeIcon?: ReactNode;
  pressed?: boolean;
  onToggle?: () => void;
}

function Control({ control }: { control: CallControlDef }) {
  const on = control.pressed;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 64 }}>
      <IconButton
        label={control.label}
        icon={on && control.activeIcon ? control.activeIcon : control.icon}
        variant="plain"
        pressed={control.pressed}
        onClick={control.onToggle}
        sx={{
          width: 56,
          height: 56,
          backgroundColor: on ? bs.text.primary : bs.surface.raised,
          color: on ? bs.surface.canvas : bs.text.primary,
          transition: transition('background-color'),
          '@media (hover: hover)': { '&:hover': { backgroundColor: on ? bs.text.primary : bs.surface.muted } },
        }}
      />
      <Typography variant="caption" aria-hidden sx={{ color: bs.text.secondary, textAlign: 'center' }}>
        {control.label}
      </Typography>
    </Box>
  );
}

/**
 * Bottom call controls: two toggles, the end-call button in the middle (danger red, larger), two toggles.
 * Must sit inside a dark `SchemeScope`.
 */
export function CallControls({ left, right, endLabel, onEnd }: { left: CallControlDef[]; right: CallControlDef[]; endLabel: string; onEnd?: () => void }) {
  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 2,
        backgroundColor: bs.surface.inverse,
        borderTopLeftRadius: `${radius.xl}px`,
        borderTopRightRadius: `${radius.xl}px`,
        px: `${layout.gutter.mobile}px`,
        pt: 6,
        pb: `calc(24px + ${layout.safeAreaBottom})`,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        {left.map((c) => (
          <Control key={c.id} control={c} />
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 72, mt: -1 }}>
        <IconButton
          label={endLabel}
          icon={<CallEndRounded sx={{ fontSize: 30 }} />}
          variant="plain"
          onClick={onEnd}
          sx={{
            width: 72,
            height: 72,
            backgroundColor: bs.action.destructive.bg,
            color: bs.action.destructive.fg,
            '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.destructive.hover } },
            '&:active': { backgroundColor: bs.action.destructive.pressed },
          }}
        />
        <Typography variant="caption" aria-hidden sx={{ color: bs.text.secondary }}>
          {endLabel}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {right.map((c) => (
          <Control key={c.id} control={c} />
        ))}
      </Box>
    </Box>
  );
}
