import Box from '@mui/material/Box';
import { formatMoney } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { bs } from '../../../theme/theme';
import { typeScale } from '../../../theme/tokens';

export type PriceSize = 'sm' | 'md' | 'lg' | 'xl';

export interface PriceProps {
  /** Amount in major units (89.5 = $89.50). */
  amount: number;
  /** ISO 4217 code. */
  currency?: string;
  size?: PriceSize;
  /** Previous price, shown struck through (discounts like the 40% off promo). */
  originalAmount?: number;
  /** Prefix "Desde / From" for starting prices. */
  from?: boolean;
  /** Suffix such as "por vehículo / per vehicle". */
  unit?: string;
}

const messages = {
  es: { from: 'Desde', was: 'Antes', now: 'Ahora' },
  en: { from: 'From', was: 'Was', now: 'Now' },
};

const amountStyle: Record<PriceSize, object> = {
  sm: { ...typeScale.price, fontSize: '0.875rem' },
  md: typeScale.price,
  lg: { ...typeScale.price, fontSize: '1.5rem' },
  xl: { ...typeScale.price, fontSize: '2rem', fontStretch: '108%', letterSpacing: '-0.02em' },
};

/** Price in charcoal (brief: prices go in black), tabular figures, locale formatting. */
export function Price({ amount, currency = 'USD', size = 'md', originalAmount, from = false, unit }: PriceProps) {
  const locale = useLocale();
  const t = useT(messages);
  const discounted = originalAmount !== undefined && originalAmount > amount;
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: 1.5, rowGap: 0.5 }}>
      {from && (
        <Box component="span" sx={{ ...typeScale.body2, color: bs.text.secondary }}>
          {t.from}
        </Box>
      )}
      <Box component="span" sx={{ ...amountStyle[size], color: bs.text.primary, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        {discounted && (
          <Box component="span" sx={visuallyHidden}>
            {t.now}{' '}
          </Box>
        )}
        {formatMoney(amount, locale, currency)}
      </Box>
      {discounted && (
        <Box component="span" sx={{ ...typeScale.body2, color: bs.text.secondary, textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>
          <Box component="span" sx={visuallyHidden}>
            {t.was}{' '}
          </Box>
          {formatMoney(originalAmount, locale, currency)}
        </Box>
      )}
      {unit && (
        <Box component="span" sx={{ ...typeScale.body2, color: bs.text.secondary }}>
          {unit}
        </Box>
      )}
    </Box>
  );
}
