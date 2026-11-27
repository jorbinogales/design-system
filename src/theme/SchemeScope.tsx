import Box, { type BoxProps } from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import { createContext, useContext, type ReactNode } from 'react';
import { bs } from './theme';

export type SchemeName = 'light' | 'dark';

/**
 * The color scheme of the page around a subtree. `SchemeScope asPage` sets it (Storybook
 * side-by-side panels); otherwise it is MUI's resolved scheme.
 */
const PageSchemeContext = createContext<SchemeName | null>(null);

export function usePageScheme(): SchemeName {
  const fromScope = useContext(PageSchemeContext);
  const { colorScheme } = useColorScheme();
  return fromScope ?? colorScheme ?? 'light';
}

interface SchemeScopeProps extends Omit<BoxProps, 'children'> {
  /** `page` re-applies the surrounding page scheme (e.g. a field inside the inverse header). */
  scheme: SchemeName | 'page';
  /** Treat this subtree as a page: descendants using `scheme="page"` resolve to it. */
  asPage?: boolean;
  children: ReactNode;
}

/**
 * Forces every Black Seat token inside to one color scheme. Works because MUI emits the
 * scheme variables on `.light` / `.dark` class selectors, and `bs.*` are CSS variables.
 */
export function SchemeScope({ scheme, asPage = false, children, className, sx, ...rest }: SchemeScopeProps) {
  const page = usePageScheme();
  const resolved = scheme === 'page' ? page : scheme;
  const node = (
    <Box
      {...rest}
      className={[resolved, className].filter(Boolean).join(' ')}
      sx={[{ color: bs.text.primary }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {children}
    </Box>
  );
  return asPage ? <PageSchemeContext value={resolved}>{node}</PageSchemeContext> : node;
}

/**
 * Inverse block ("encabezado negro"): `surface.inverse` background resolved in the page
 * scheme (#111111 in light, #000000 in dark) with dark-scheme tokens for its content.
 * Layout props (`sx`, `component`) apply to the block itself.
 */
export function InverseSurface({ children, sx, ...rest }: BoxProps) {
  return (
    <Box {...rest} sx={[{ backgroundColor: bs.surface.inverse, color: bs.text.primary }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box className="dark" sx={{ display: 'contents', color: bs.text.primary }}>
        {children}
      </Box>
    </Box>
  );
}
