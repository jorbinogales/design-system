import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Decorator } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useT } from '../i18n/locale';
import { AppProviders } from '../theme/AppProviders';
import { SchemeScope, type SchemeName } from '../theme/SchemeScope';
import { bs } from '../theme/theme';
import { radius } from '../theme/tokens';
import { DeviceFrame, type DeviceFrameProps } from './DeviceFrame';
import { defaultGlobals, SIDE_BY_SIDE, type BsGlobals } from './globals';

/** `parameters.device` on a story or meta wraps it in the phone frame. */
export type DeviceParameters = Omit<DeviceFrameProps, 'children'>;

const panelMessages = {
  es: { light: 'Claro', dark: 'Oscuro' },
  en: { light: 'Light', dark: 'Dark' },
};

function Panel({ scheme, children }: { scheme: SchemeName; children: ReactNode }) {
  const t = useT(panelMessages);
  return (
    <SchemeScope
      scheme={scheme}
      asPage
      sx={{ backgroundColor: bs.surface.canvas, borderRadius: `${radius.lg}px`, p: 6, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}
    >
      <Typography variant="caption" sx={{ color: bs.text.secondary }}>
        {t[scheme]}
      </Typography>
      <Box sx={{ minWidth: 0 }}>{children}</Box>
    </SchemeScope>
  );
}

/** Light and dark copies of the same story. Tokens are CSS variables, so each panel re-themes. */
export function SideBySide({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 4, p: 4, width: '100%' }}>
      <Panel scheme="light">{children}</Panel>
      <Panel scheme="dark">{children}</Panel>
    </Box>
  );
}

/** In docs pages each inline story sits on the active canvas color, so dark mode reads correctly. */
function DocsCanvas({ children, flush }: { children: ReactNode; flush: boolean }) {
  return (
    <Box sx={{ backgroundColor: bs.surface.canvas, color: bs.text.primary, borderRadius: `${radius.md}px`, p: flush ? 0 : 6, width: '100%' }}>
      {children}
    </Box>
  );
}

/** Global decorator: providers, theme/locale toolbars, side-by-side mode and the device frame. */
export const withBlackSeat: Decorator = (Story, context) => {
  const globals: BsGlobals = { ...defaultGlobals, ...(context.globals as Partial<BsGlobals>) };
  const device = context.parameters.device as DeviceParameters | undefined;
  const story = device ? (
    <DeviceFrame {...device}>
      <Story />
    </DeviceFrame>
  ) : (
    <Story />
  );

  if (globals.theme === SIDE_BY_SIDE) {
    return (
      <AppProviders mode="light" locale={globals.locale}>
        <SideBySide>{story}</SideBySide>
      </AppProviders>
    );
  }
  return (
    <AppProviders mode={globals.theme} locale={globals.locale}>
      {context.viewMode === 'docs' ? <DocsCanvas flush={Boolean(device)}>{story}</DocsCanvas> : story}
    </AppProviders>
  );
};
