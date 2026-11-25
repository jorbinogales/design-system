import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';

export interface EmptyStateProps {
  /** Illustration slot (see `Illustrations.tsx`). Decorative: the text carries the meaning. */
  illustration?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** The one main way forward (a Button). */
  primaryAction?: ReactNode;
  /** An alternative (quiet Button or Link). */
  secondaryAction?: ReactNode;
  /** `page`: fills the screen and centers (default). `inline`: compact, inside a card, list or table. */
  layout?: 'page' | 'inline';
  /** `h1` when it is the whole screen's content, `h2`/`h3` when inside a section. */
  headingLevel?: 'h1' | 'h2' | 'h3';
  /** `alert` for failures that appear after an action; `status` for politely announced changes; none for static states. */
  role?: 'alert' | 'status';
}

/**
 * Base for every "there is nothing to show" screen: illustration, title, body, primary and secondary
 * action. Presets in `StatePresets` set the copy, illustration and actions for each case.
 */
export function EmptyState({ illustration, title, description, primaryAction, secondaryAction, layout: mode = 'page', headingLevel = 'h2', role }: EmptyStateProps) {
  const page = mode === 'page';
  return (
    <Box
      role={role}
      sx={{
        flex: page ? 1 : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 4,
        px: `${layout.gutter.mobile}px`,
        py: page ? 10 : 8,
        minHeight: page ? 0 : undefined,
      }}
    >
      {illustration && <Box sx={{ mb: 2 }}>{illustration}</Box>}
      <Box sx={{ maxWidth: 360 }}>
        <Typography variant="h3" component={headingLevel} sx={{ overflowWrap: 'anywhere' }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" sx={{ color: bs.text.secondary, mt: 2, overflowWrap: 'anywhere' }}>
            {description}
          </Typography>
        )}
      </Box>
      {(primaryAction || secondaryAction) && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 2, width: '100%', maxWidth: 320, mt: 2 }}>
          {primaryAction}
          {secondaryAction}
        </Box>
      )}
    </Box>
  );
}
