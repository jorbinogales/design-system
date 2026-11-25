import CheckRounded from '@mui/icons-material/CheckRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { BottomActionBar } from '../../actions/BottomActionBar/BottomActionBar';

export interface SuccessStateProps {
  title: ReactNode;
  description?: ReactNode;
  /** What was confirmed: reference, identifier block, summary lines. Centered under the text. */
  children?: ReactNode;
  /** One main action (Ver recibo). */
  primaryAction?: ReactNode;
  /** Link-like alternative (Ver mis reservas). */
  secondaryAction?: ReactNode;
  /**
   * `page`: fills the screen with actions in a bottom bar that respects the safe area (reference s35).
   * `inline`: compact, actions under the text (dialogs, desktop panels).
   */
  layout?: 'page' | 'inline';
  headingLevel?: 'h1' | 'h2' | 'h3';
}

/**
 * Confirmation / success screen (references s22 You Have Arrived, s35 Congratulations, s76 Top Up Successful):
 * large check, title, body, optional details and the next steps. Announced politely when it appears.
 */
export function SuccessState({ title, description, children, primaryAction, secondaryAction, layout: mode = 'page', headingLevel = 'h1' }: SuccessStateProps) {
  const page = mode === 'page';
  const actions = (primaryAction || secondaryAction) && (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 2, width: '100%', maxWidth: page ? undefined : 320 }}>
      {primaryAction}
      {secondaryAction}
    </Box>
  );
  return (
    <Box sx={{ flex: page ? 1 : undefined, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Box role="status" sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 5, px: `${layout.gutter.mobile}px`, py: page ? 10 : 8 }}>
        <Box
          aria-hidden
          sx={{
            width: page ? 104 : 72,
            height: page ? 104 : 72,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: bs.brand.primary,
            color: bs.action.primary.fg,
            '@keyframes bsCheckIn': { from: { transform: 'scale(0.8)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
            animation: 'bsCheckIn 320ms cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          <CheckRounded sx={{ fontSize: page ? 64 : 44 }} />
        </Box>
        <Box sx={{ maxWidth: 360 }}>
          <Typography variant="h2" component={headingLevel} sx={{ overflowWrap: 'anywhere' }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body1" sx={{ color: bs.text.secondary, mt: 2, overflowWrap: 'anywhere' }}>
              {description}
            </Typography>
          )}
        </Box>
        {children && <Box sx={{ width: '100%', maxWidth: 360 }}>{children}</Box>}
        {!page && actions}
      </Box>
      {page && actions && <BottomActionBar>{actions}</BottomActionBar>}
    </Box>
  );
}
