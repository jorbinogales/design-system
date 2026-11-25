import { DocsContainer as BaseDocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { AppProviders } from '../theme/AppProviders';
import { defaultGlobals, readUrlGlobals, SIDE_BY_SIDE, type BsGlobals } from './globals';
import { sbDark, sbLight } from './sbThemes';

function prefersDark() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Docs pages follow the Apariencia and Idioma toolbars: the Storybook docs theme flips to
 * dark, and MDX pages get Black Seat providers so they can render real components.
 */
export function DocsContainer({ children, ...props }: PropsWithChildren<DocsContainerProps>) {
  const [globals, setGlobals] = useState<BsGlobals>(() => ({
    ...defaultGlobals,
    ...(typeof window !== 'undefined' ? readUrlGlobals(window.location.search) : {}),
  }));

  useEffect(() => {
    const channel = props.context.channel;
    const onGlobals = ({ globals: next }: { globals: Partial<BsGlobals> }) => setGlobals((prev) => ({ ...prev, ...next }));
    channel.on(GLOBALS_UPDATED, onGlobals);
    channel.on(SET_GLOBALS, onGlobals);
    return () => {
      channel.off(GLOBALS_UPDATED, onGlobals);
      channel.off(SET_GLOBALS, onGlobals);
    };
  }, [props.context]);

  const mode = globals.theme === SIDE_BY_SIDE ? 'light' : globals.theme;
  const dark = mode === 'dark' || (mode === 'system' && prefersDark());

  return (
    <AppProviders mode={mode} locale={globals.locale}>
      <BaseDocsContainer {...props} theme={dark ? sbDark : sbLight}>
        {children}
      </BaseDocsContainer>
    </AppProviders>
  );
}
