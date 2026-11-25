import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { formatMoney } from '../../../i18n/format';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { typeScale } from '../../../theme/tokens';
import { Divider } from '../../layout/Divider/Divider';

export interface BreakdownLine {
  label: ReactNode;
  /** Positive amount in major units. Discounts are given positive and `kind: 'discount'`. */
  amount: number;
  /** `discount` renders "−$X" in success tone; `free` renders "Gratis / Free". */
  kind?: 'charge' | 'discount' | 'free';
  /** Small secondary line under the label (e.g. "2 vehículos × $95.00"). */
  detail?: ReactNode;
}

export interface AmountBreakdownProps {
  lines: BreakdownLine[];
  total: number;
  /** Defaults to "Total". */
  totalLabel?: ReactNode;
  currency?: string;
  /** Note under the total (taxes, payment method). */
  note?: ReactNode;
  density?: 'comfortable' | 'compact';
}

const messages = {
  es: { total: 'Total', free: 'Gratis', discount: 'Descuento' },
  en: { total: 'Total', free: 'Free', discount: 'Discount' },
};

/** Itemized amounts with a dashed rule before the total (reference: Review Summary, E-Receipt). */
export function AmountBreakdown({ lines, total, totalLabel, currency = 'USD', note, density = 'comfortable' }: AmountBreakdownProps) {
  const locale = useLocale();
  const t = useT(messages);
  const text = density === 'compact' ? typeScale.body2 : typeScale.body1;
  return (
    <Box>
      <Box component="dl" sx={{ m: 0, display: 'flex', flexDirection: 'column', gap: density === 'compact' ? 2 : 3 }}>
        {lines.map((line, i) => {
          const value =
            line.kind === 'free' ? t.free : line.kind === 'discount' ? `−${formatMoney(line.amount, locale, currency)}` : formatMoney(line.amount, locale, currency);
          return (
            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4 }}>
              <Box component="dt" sx={{ ...text, color: bs.text.secondary, minWidth: 0 }}>
                {line.label}
                {line.detail && (
                  <Box component="span" sx={{ ...typeScale.caption, display: 'block', mt: 0.5 }}>
                    {line.detail}
                  </Box>
                )}
              </Box>
              <Box
                component="dd"
                aria-label={line.kind === 'discount' ? `${t.discount} ${formatMoney(line.amount, locale, currency)}` : undefined}
                sx={{ ...text, m: 0, fontWeight: 600, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: line.kind === 'discount' || line.kind === 'free' ? bs.status.success.fg : bs.text.primary }}
              >
                {value}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Divider variant="dashed" spacing={density === 'compact' ? 'sm' : 'md'} />
      <Box component="dl" sx={{ m: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4 }}>
        <Box component="dt" sx={{ ...typeScale.h4, color: bs.text.primary }}>
          {totalLabel ?? t.total}
        </Box>
        <Box component="dd" sx={{ ...typeScale.price, fontSize: density === 'compact' ? '1.125rem' : '1.375rem', m: 0, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {formatMoney(total, locale, currency)}
        </Box>
      </Box>
      {note && <Box sx={{ ...typeScale.caption, color: bs.text.secondary, mt: 2 }}>{note}</Box>}
    </Box>
  );
}
