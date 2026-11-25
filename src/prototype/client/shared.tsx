import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { StepProgress } from '../../components/feedback/StepProgress/StepProgress';
import { Price } from '../../components/data-display/Price/Price';
import { TopBar } from '../../components/navigation/TopBar/TopBar';
import { useLocale } from '../../i18n/locale';
import { bs } from '../../theme/theme';
import { flowSteps, useProto } from '../store';

export { ScreenBody, ScreenRoot, IconBubble } from '../../screens/profile/ui';

/** Top bar of the booking flow: back, title and "Paso N de M" with the unit's own steps. */
export function FlowTopBar({ title, step }: { title: ReactNode; step: number }) {
  const { back, draft } = useProto();
  const locale = useLocale();
  const steps = flowSteps(draft.unit, locale).map((label, i) => ({ id: String(i), label }));
  return (
    <TopBar title={title} onBack={back}>
      <StepProgress steps={steps} current={step} variant="compact" />
    </TopBar>
  );
}

/** "Total" block for the bottom action bar. */
export function TotalSummary({ label, amount, from = false, note }: { label: string; amount: number; from?: boolean; note?: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" component="p" sx={{ color: bs.text.secondary }}>
        {label}
      </Typography>
      <Price amount={amount} size="lg" from={from} />
      {note && (
        <Typography variant="caption" component="p" sx={{ color: bs.text.secondary }}>
          {note}
        </Typography>
      )}
    </Box>
  );
}

/** Section title used inside screens (h2, h4 look). */
export function BlockTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <Typography variant="h4" component="h2" id={id}>
      {children}
    </Typography>
  );
}

/**
 * Poster headline taken from Black Seat's flyers: Archivo at its narrowest width, heavy, uppercase,
 * tight leading. Same family as the DS (no new font), so it stays one type system.
 */
export const posterType = {
  fontStretch: '62%',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0',
  lineHeight: 0.92,
  fontSize: '3.25rem',
  '@media (min-width:900px)': { fontSize: '3.25rem' },
} as const;
