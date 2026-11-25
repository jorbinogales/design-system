import Box, { type BoxProps } from '@mui/material/Box';
import { useId, type ReactNode } from 'react';
import { SectionHeader, type SectionHeaderProps } from '../SectionHeader/SectionHeader';

export interface SectionProps extends Omit<BoxProps, 'title'> {
  /** When given, renders a SectionHeader and labels the `<section>` with it. */
  title?: ReactNode;
  description?: ReactNode;
  actionHref?: string;
  onAction?: () => void;
  actionLabel?: string;
  headingLevel?: SectionHeaderProps['headingLevel'];
  /** Vertical rhythm: gap between header and content, and padding block. */
  spacing?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const rhythm = { sm: { gap: 3, py: 3 }, md: { gap: 4, py: 5 }, lg: { gap: 5, py: 8 } } as const;

/** A titled block of a screen (`<section>`), with consistent vertical rhythm. */
export function Section({ title, description, actionHref, onAction, actionLabel, headingLevel, spacing = 'md', children, sx, ...rest }: SectionProps) {
  const id = useId();
  return (
    <Box
      component="section"
      aria-labelledby={title ? id : undefined}
      {...rest}
      sx={[{ display: 'flex', flexDirection: 'column', ...rhythm[spacing] }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {title && <SectionHeader id={id} title={title} description={description} actionHref={actionHref} onAction={onAction} actionLabel={actionLabel} headingLevel={headingLevel} />}
      {children}
    </Box>
  );
}
