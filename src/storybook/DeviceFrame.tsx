import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { SchemeScope } from '../theme/SchemeScope';
import { bs } from '../theme/theme';
import { deviceChrome, radius, zLayer } from '../theme/tokens';

export type StatusBarTone = 'auto' | 'light' | 'dark';

export interface DeviceFrameProps {
  children: ReactNode;
  /**
   * Color of the status bar glyphs. `auto` follows the page scheme; use `light` over the
   * black header or a photo hero, `dark` over a light photo in dark mode.
   */
  statusBar?: StatusBarTone;
  /** Screen background. Defaults to `surface.canvas`. */
  background?: 'canvas' | 'subtle';
}

const { screen, safeArea } = deviceChrome;

function StatusGlyphs() {
  return (
    <Box component="svg" viewBox="0 0 78 14" aria-hidden sx={{ width: 78, height: 14, fill: 'currentColor' }}>
      {/* Signal */}
      <rect x="0" y="9" width="3.2" height="4.5" rx="1" />
      <rect x="4.8" y="6.5" width="3.2" height="7" rx="1" />
      <rect x="9.6" y="3.8" width="3.2" height="9.7" rx="1" />
      <rect x="14.4" y="1" width="3.2" height="12.5" rx="1" />
      {/* Wi-Fi */}
      <path d="M31.2 3.4a10.6 10.6 0 0 1 7.6 3.1l1.3-1.3a12.5 12.5 0 0 0-17.8 0l1.3 1.3a10.6 10.6 0 0 1 7.6-3.1Z" />
      <path d="M31.2 7.1a6.9 6.9 0 0 1 4.9 2l1.3-1.3a8.7 8.7 0 0 0-12.4 0l1.3 1.3a6.9 6.9 0 0 1 4.9-2Z" />
      <path d="M31.2 10.8c.9 0 1.7.4 2.3 1l-2.3 2.3-2.3-2.3c.6-.6 1.4-1 2.3-1Z" />
      {/* Battery */}
      <rect x="49" y="1" width="24.5" height="12.5" rx="3.6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="51" y="3" width="20.5" height="8.5" rx="2.2" />
      <path d="M75.3 5v4.5a2.3 2.3 0 0 0 0-4.5Z" fillOpacity="0.45" />
    </Box>
  );
}

function StatusBar({ tone }: { tone: StatusBarTone }) {
  const bar = (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: '0 0 auto 0',
        height: safeArea.top,
        zIndex: zLayer.statusBar,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: '34px',
        pt: '4px',
        color: bs.text.primary,
      }}
    >
      <Box component="span" sx={{ fontSize: 17, fontWeight: 650, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums', width: 54, textAlign: 'center' }}>
        9:41
      </Box>
      <StatusGlyphs />
    </Box>
  );
  if (tone === 'auto') return bar;
  return (
    <SchemeScope scheme={tone === 'light' ? 'dark' : 'light'} sx={{ display: 'contents' }}>
      {bar}
    </SchemeScope>
  );
}

/**
 * iPhone-class frame (390×844) for screen stories: bezel, Dynamic Island, status bar at 9:41,
 * home indicator and safe-area insets exposed as `--bs-safe-area-top/bottom`.
 * Below 440px of viewport width it drops the bezel and fills the viewport.
 * `position: fixed` children are contained by the screen (it is a containing block).
 */
export function DeviceFrame({ children, statusBar = 'auto', background = 'canvas' }: DeviceFrameProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, px: 4, '@media (max-width: 440px)': { p: 0 } }}>
      <Box
        sx={{
          p: '12px',
          borderRadius: `${screen.radius + 12}px`,
          backgroundColor: deviceChrome.bezel,
          boxShadow: `inset 0 0 0 1.5px ${deviceChrome.bezelEdge}, ${bs.elevation.e3}`,
          '@media (max-width: 440px)': { p: 0, borderRadius: 0, boxShadow: 'none', width: '100%' },
        }}
      >
        <Box
          data-device-screen
          sx={{
            '--bs-safe-area-top': `${safeArea.top}px`,
            '--bs-safe-area-bottom': `${safeArea.bottom}px`,
            position: 'relative',
            width: screen.width,
            height: screen.height,
            borderRadius: `${screen.radius}px`,
            overflow: 'hidden',
            transform: 'translateZ(0)',
            backgroundColor: background === 'canvas' ? bs.surface.canvas : bs.surface.subtle,
            color: bs.text.primary,
            '@media (max-width: 440px)': { width: '100vw', height: '100dvh', borderRadius: 0 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              overscrollBehavior: 'contain',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </Box>
          <StatusBar tone={statusBar} />
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: 11,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 124,
              height: 36,
              borderRadius: `${radius.pill}px`,
              backgroundColor: deviceChrome.island,
              zIndex: zLayer.statusBar + 1,
              '@media (max-width: 440px)': { display: 'none' },
            }}
          />
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 134,
              height: 5,
              borderRadius: `${radius.pill}px`,
              backgroundColor: bs.text.primary,
              zIndex: zLayer.statusBar,
              pointerEvents: 'none',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
