import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { formatNumber } from '../../../i18n/format';
import { useLocale } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius, typeScale } from '../../../theme/tokens';

export type CounterTone = 'brand' | 'neutral' | 'inverse';

export interface CounterProps {
  value: number;
  /** Values above show as "99+". */
  max?: number;
  tone?: CounterTone;
  size?: 'sm' | 'md';
  /**
   * When given, the counter anchors to this element's top-right corner (badge mode),
   * e.g. a cart or a notification icon that is not an IconButton.
   */
  children?: ReactNode;
  /** Accessible text, e.g. "3 trabajos sin asignar". Without it, the number is read as-is. */
  label?: string;
  /** Hide when the value is 0 (badge mode). */
  hideZero?: boolean;
}

const toneSx: Record<CounterTone, object> = {
  brand: { backgroundColor: bs.brand.primary, color: bs.action.primary.fg },
  neutral: { backgroundColor: bs.surface.muted, color: bs.text.primary },
  inverse: { backgroundColor: bs.text.primary, color: bs.surface.canvas },
};

/** Numeric count pill (tabs, filters, inbox) or anchored badge. */
export function Counter({ value, max = 99, tone = 'neutral', size = 'md', children, label, hideZero = true }: CounterProps) {
  const locale = useLocale();
  const text = value > max ? `${formatNumber(max, locale)}+` : formatNumber(value, locale);
  if (children) {
    return (
      <Badge badgeContent={text} invisible={hideZero && value === 0} color={tone === 'brand' ? 'primary' : 'default'} aria-label={label} sx={tone !== 'brand' ? { '& .MuiBadge-badge': toneSx[tone] } : undefined}>
        {children}
      </Badge>
    );
  }
  return (
    <Box
      component="span"
      aria-label={label}
      sx={{
        ...typeScale.caption,
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        display: 'inline-grid',
        placeItems: 'center',
        minWidth: size === 'sm' ? 20 : 24,
        height: size === 'sm' ? 20 : 24,
        px: size === 'sm' ? 1.5 : 2,
        borderRadius: `${radius.pill}px`,
        fontSize: size === 'sm' ? '0.6875rem' : '0.75rem',
        lineHeight: 1,
        ...toneSx[tone],
      }}
    >
      {text}
    </Box>
  );
}
