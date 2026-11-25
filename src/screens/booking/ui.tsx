import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { StepProgress, useBookingSteps } from '../../components/feedback/StepProgress/StepProgress';
import { TopBar } from '../../components/navigation/TopBar/TopBar';
import { bs } from '../../theme/theme';

export { AddRow, IconBubble, ScreenBody, ScreenRoot, pick } from '../profile/ui';
export type { L } from '../profile/ui';

/** Top bar of the booking flow: back, title and the compact "Paso N de 5" progress (Vehículo → Confirmación). */
export function BookingTopBar({ title, step, onBack = () => undefined, actions }: { title: ReactNode; step: 0 | 1 | 2 | 3 | 4; onBack?: () => void; actions?: ReactNode }) {
  const steps = useBookingSteps();
  return (
    <TopBar title={title} onBack={onBack} actions={actions}>
      <StepProgress steps={steps} current={step} variant="compact" />
    </TopBar>
  );
}

/** Short lead text under the top bar. */
export function Lead({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body1" sx={{ color: bs.text.secondary }}>
      {children}
    </Typography>
  );
}
