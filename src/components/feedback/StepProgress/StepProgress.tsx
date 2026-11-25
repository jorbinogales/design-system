import CheckRounded from '@mui/icons-material/CheckRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';

export interface Step {
  id: string;
  label: string;
}

export interface StepProgressProps {
  steps: Step[];
  /** Zero-based index of the current step. */
  current: number;
  /**
   * `responsive` (default): compact "Paso 2 de 5" below 600 px, the full list from there up.
   * `compact` or `full` force one form.
   */
  variant?: 'responsive' | 'compact' | 'full';
  /** Accessible name of the navigation landmark. */
  label?: string;
}

const messages = {
  es: {
    nav: 'Progreso de la reserva',
    step: (n: number, total: number) => `Paso ${n} de ${total}`,
    done: 'completado',
    now: 'paso actual',
    vehicle: 'Vehículo',
    service: 'Servicio',
    schedule: 'Horario',
    payment: 'Pago',
    confirmation: 'Confirmación',
  },
  en: {
    nav: 'Booking progress',
    step: (n: number, total: number) => `Step ${n} of ${total}`,
    done: 'completed',
    now: 'current step',
    vehicle: 'Vehicle',
    service: 'Service',
    schedule: 'Schedule',
    payment: 'Payment',
    confirmation: 'Confirmation',
  },
};

/** The five booking steps (Vehículo · Servicio · Horario · Pago · Confirmación) in the active language. */
export function useBookingSteps(): Step[] {
  const t = useT(messages);
  return [
    { id: 'vehicle', label: t.vehicle },
    { id: 'service', label: t.service },
    { id: 'schedule', label: t.schedule },
    { id: 'payment', label: t.payment },
    { id: 'confirmation', label: t.confirmation },
  ];
}

/** Booking progress: compact form on mobile, full step list on desktop. Never navigates by itself. */
export function StepProgress({ steps, current, variant = 'responsive', label }: StepProgressProps) {
  const t = useT(messages);
  const total = steps.length;
  const safe = Math.min(Math.max(current, 0), total - 1);
  const showCompact = variant !== 'full';
  const showFull = variant !== 'compact';
  const compactDisplay = variant === 'responsive' ? { xs: 'block', sm: 'none' } : 'block';
  const fullDisplay = variant === 'responsive' ? { xs: 'none', sm: 'flex' } : 'flex';

  return (
    <Box component="nav" aria-label={label ?? t.nav}>
      {showCompact && (
        <Box sx={{ display: compactDisplay }}>
          <Typography variant="label" component="p" aria-current="step" sx={{ mb: 2 }}>
            {t.step(safe + 1, total)}
            <Box component="span" sx={{ color: bs.text.secondary, fontWeight: 500 }}>
              {' · '}
              {steps[safe]?.label}
            </Box>
          </Typography>
          <Box aria-hidden sx={{ display: 'flex', gap: 1 }}>
            {steps.map((s, i) => (
              <Box key={s.id} sx={{ flex: 1, height: 4, borderRadius: `${radius.pill}px`, backgroundColor: i <= safe ? bs.brand.primary : bs.surface.muted }} />
            ))}
          </Box>
        </Box>
      )}
      {showFull && (
        <Box component="ol" sx={{ display: fullDisplay, listStyle: 'none', m: 0, p: 0, alignItems: 'center' }}>
          {steps.map((s, i) => {
            const done = i < safe;
            const now = i === safe;
            return (
              <Box
                key={s.id}
                component="li"
                aria-current={now ? 'step' : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flex: i < total - 1 ? '1 1 0' : '0 0 auto',
                  minWidth: 0,
                  ...(i < total - 1 && { '&::after': { content: '""', flex: 1, minWidth: 16, height: 2, mx: 3, borderRadius: `${radius.pill}px`, backgroundColor: done ? bs.brand.primary : bs.border.subtle } }),
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    typography: 'caption',
                    fontWeight: 700,
                    ...(done || now ? { backgroundColor: bs.brand.primary, color: bs.action.primary.fg } : { border: `2px solid ${bs.border.strong}`, color: bs.text.secondary }),
                  }}
                >
                  {done ? <CheckRounded sx={{ fontSize: 18 }} /> : i + 1}
                </Box>
                <Typography variant="label" component="span" sx={{ color: done || now ? bs.text.primary : bs.text.secondary, fontWeight: now ? 700 : 500, whiteSpace: 'nowrap' }}>
                  {s.label}
                  <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                    {done ? ` (${t.done})` : now ? ` (${t.now})` : ''}
                  </Box>
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
