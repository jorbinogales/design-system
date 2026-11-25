import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { Link } from '../../actions/Link/Link';

export interface SectionHeaderProps {
  title: ReactNode;
  /** Short line under the title. */
  description?: ReactNode;
  /** Show the "Ver todo / See all" link: pass `actionHref` or `onAction`. */
  actionHref?: string;
  onAction?: () => void;
  /** Override the link text (default "Ver todo" / "See all"). */
  actionLabel?: string;
  /** Heading element; visual size stays h3. */
  headingLevel?: 'h2' | 'h3' | 'h4';
  /** id for the heading, so a Section can reference it with aria-labelledby. */
  id?: string;
}

const messages = {
  es: { seeAll: 'Ver todo', seeAllOf: (t: string) => `Ver todo: ${t}` },
  en: { seeAll: 'See all', seeAllOf: (t: string) => `See all: ${t}` },
};

/** Section title with an optional "Ver todo" link (Home: Servicios, Talleres populares). */
export function SectionHeader({ title, description, actionHref, onAction, actionLabel, headingLevel = 'h2', id }: SectionHeaderProps) {
  const t = useT(messages);
  const hasAction = Boolean(actionHref || onAction);
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography id={id} component={headingLevel} variant="h3">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ color: bs.text.secondary, mt: 1 }}>
            {description}
          </Typography>
        )}
      </Box>
      {hasAction && (
        <Link
          variant="standalone"
          size="sm"
          href={actionHref}
          onClick={onAction}
          aria-label={typeof title === 'string' && !actionLabel ? t.seeAllOf(title) : undefined}
          sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          {actionLabel ?? t.seeAll}
        </Link>
      )}
    </Box>
  );
}
