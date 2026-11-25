import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';

export interface LoadingIndicatorProps {
  /**
   * `spinner`: the circle alone (inside buttons, small slots).
   * `inline`: circle + text next to it ("Enviando…"), for an action in progress.
   * `block`: circle + text centered (loading a screen or list).
   */
  variant?: 'spinner' | 'inline' | 'block';
  /** Text shown (inline, block) and announced. Defaults per variant. */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const px = { sm: 16, md: 24, lg: 40 } as const;
const messages = {
  es: { spinner: 'Cargando', inline: 'Enviando…', block: 'Cargando…' },
  en: { spinner: 'Loading', inline: 'Sending…', block: 'Loading…' },
};

/** Progress for waits under a few seconds; for longer content use Skeleton. Announced politely. */
export function LoadingIndicator({ variant = 'inline', label, size }: LoadingIndicatorProps) {
  const t = useT(messages);
  const text = label ?? t[variant];
  const resolved = size ?? (variant === 'block' ? 'lg' : variant === 'inline' ? 'sm' : 'md');
  const circle = <CircularProgress size={px[resolved]} thickness={resolved === 'lg' ? 3.6 : 5} aria-hidden={variant !== 'spinner'} aria-label={variant === 'spinner' ? text : undefined} sx={{ color: bs.brand.primary, flexShrink: 0 }} />;

  if (variant === 'spinner') return circle;
  return (
    <Box
      role="status"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: variant === 'block' ? 3 : 2,
        flexDirection: variant === 'block' ? 'column' : 'row',
        justifyContent: 'center',
        color: bs.text.secondary,
        py: variant === 'block' ? 8 : 0,
      }}
    >
      {circle}
      <Typography variant={variant === 'block' ? 'body1' : 'body2'} component="span" sx={{ color: 'inherit' }}>
        {text}
      </Typography>
    </Box>
  );
}
