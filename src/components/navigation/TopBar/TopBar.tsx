import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { InverseSurface, SchemeScope } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { layout, radius, zLayer } from '../../../theme/tokens';
import { BackButton } from '../BackButton/BackButton';

export interface TopBarProps {
  title?: ReactNode;
  /** Small line under the title (e.g. booking reference). */
  subtitle?: ReactNode;
  /** Replaces the title block on the left (e.g. a location selector on Home). */
  leading?: ReactNode;
  /** Shows a BackButton. Use `onBack` or `backHref`. */
  onBack?: () => void;
  backHref?: string;
  backLabel?: string;
  /** Right side: one to three IconButtons. */
  actions?: ReactNode;
  /** `inverse` is the black header ("encabezado negro") for Home. */
  tone?: 'default' | 'inverse';
  /** `center` (default with back button) or `start` (large title, Home-like). */
  align?: 'center' | 'start';
  /**
   * Content under the title row (search, segmented filters). On the inverse tone it renders
   * in the page color scheme, so a search field stays light on the black header in light mode.
   */
  children?: ReactNode;
  /** Pad the top by the device safe area (status bar). On by default. */
  safeArea?: boolean;
  sticky?: boolean;
  /** Heading element for the title. One `h1` per screen. */
  headingLevel?: 'h1' | 'h2';
}

/** Mobile top app bar: back, title, actions; default or inverse (black) surface. */
export function TopBar({
  title,
  subtitle,
  leading,
  onBack,
  backHref,
  backLabel,
  actions,
  tone = 'default',
  align,
  children,
  safeArea = true,
  sticky = false,
  headingLevel = 'h1',
}: TopBarProps) {
  const hasBack = Boolean(onBack || backHref);
  const resolvedAlign = align ?? (hasBack ? 'center' : 'start');
  const inverse = tone === 'inverse';

  const titleBlock = leading ?? (
    <Box sx={{ minWidth: 0, textAlign: resolvedAlign === 'center' ? 'center' : 'left' }}>
      {title && (
        <Typography
          component={headingLevel}
          variant={resolvedAlign === 'center' ? 'h3' : 'h2'}
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body2" sx={{ color: bs.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  const row = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: resolvedAlign === 'center' ? 'minmax(44px, 1fr) minmax(0, auto) minmax(44px, 1fr)' : 'auto minmax(0, 1fr) auto',
        alignItems: 'center',
        columnGap: 3,
        minHeight: layout.topBarHeight,
      }}
    >
      <Box sx={{ justifySelf: 'start', display: 'flex' }}>
        {hasBack && <BackButton onClick={onBack} href={backHref} label={backLabel} variant={inverse ? 'plain' : 'outlined'} />}
      </Box>
      {titleBlock}
      <Box sx={{ justifySelf: 'end', display: 'flex', gap: 2 }}>{actions}</Box>
    </Box>
  );

  const shell = {
    component: 'header' as const,
    sx: {
      pt: safeArea ? `calc(${layout.safeAreaTop} + 8px)` : 2,
      pb: children ? 5 : 2,
      px: `${layout.gutter.mobile}px`,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 4,
      flexShrink: 0,
      ...(sticky && { position: 'sticky' as const, top: 0, zIndex: zLayer.topBar }),
      '@media (min-width:600px)': { px: `${layout.gutter.tablet}px` },
    },
  };

  if (inverse) {
    return (
      <InverseSurface
        {...shell}
        sx={{ ...shell.sx, borderBottomLeftRadius: children ? radius.xl : 0, borderBottomRightRadius: children ? radius.xl : 0 }}
      >
        {row}
        {children && <SchemeScope scheme="page">{children}</SchemeScope>}
      </InverseSurface>
    );
  }
  return (
    <Box {...shell} sx={{ ...shell.sx, backgroundColor: bs.surface.canvas, color: bs.text.primary }}>
      {row}
      {children}
    </Box>
  );
}
