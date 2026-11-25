import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import Box from '@mui/material/Box';
import MuiLink, { type LinkProps as MuiLinkProps } from '@mui/material/Link';
import { useT } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { typeScale } from '../../../theme/tokens';

export interface LinkProps extends Omit<MuiLinkProps, 'variant' | 'underline' | 'color'> {
  /**
   * `inline`: inside running text, always underlined.
   * `standalone`: on its own (Ver todo, Cambiar horario), underline on hover only.
   */
  variant?: 'inline' | 'standalone';
  size?: 'sm' | 'md';
  /** Opens in a new tab, adds an icon and announces it. */
  external?: boolean;
}

const messages = {
  es: { newTab: '(se abre en otra pestaña)' },
  en: { newTab: '(opens in a new tab)' },
};

/**
 * Text link in `text.link` (#B33700 light, 6.06:1 · #FF8A55 dark). Renders `<a>` with `href`,
 * or a `<button>` when only `onClick` is given, so semantics match behavior.
 */
export function Link({ variant = 'inline', size = 'md', external = false, href, children, sx, ...rest }: LinkProps) {
  const t = useT(messages);
  return (
    <MuiLink
      href={href}
      component={href ? 'a' : 'button'}
      underline={variant === 'inline' ? 'always' : 'hover'}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      sx={[
        {
          ...(size === 'sm' ? typeScale.body2 : typeScale.body1),
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          verticalAlign: 'baseline',
          ...(!href && { border: 0, background: 'none', p: 0, cursor: 'pointer', font: 'inherit', fontWeight: 600 }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
      {external && (
        <>
          <OpenInNewRounded aria-hidden sx={{ fontSize: '1em' }} />
          <Box component="span" sx={visuallyHidden}>
            {t.newTab}
          </Box>
        </>
      )}
    </MuiLink>
  );
}
