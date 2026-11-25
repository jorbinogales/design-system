import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { bs } from '../../../theme/theme';
import { Breadcrumbs, type BreadcrumbItem } from '../Breadcrumbs/Breadcrumbs';

export interface PageHeaderProps {
  title: ReactNode;
  /** One line under the title (date, summary). */
  description?: ReactNode;
  /** Trail above the title. Omit on first-level pages. */
  breadcrumbs?: BreadcrumbItem[];
  /** Badges beside the title (StatusBadge, Tag). */
  meta?: ReactNode;
  /** Right side: one primary Button plus secondary actions or an ActionMenu. */
  actions?: ReactNode;
  /** `h1` (default): one per page. */
  headingLevel?: 'h1' | 'h2';
}

/** Header of a desktop page: breadcrumbs, title with badges, description and actions. */
export function PageHeader({ title, description, breadcrumbs, meta, actions, headingLevel = 'h1' }: PageHeaderProps) {
  return (
    <Box component="header" sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 5 }}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 0, flex: '1 1 280px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Typography variant="h1" component={headingLevel} sx={{ overflowWrap: 'anywhere' }}>
              {title}
            </Typography>
            {meta}
          </Box>
          {description && (
            <Typography variant="body1" sx={{ color: bs.text.secondary, mt: 1 }}>
              {description}
            </Typography>
          )}
        </Box>
        {actions && <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', flexShrink: 0 }}>{actions}</Box>}
      </Box>
    </Box>
  );
}
