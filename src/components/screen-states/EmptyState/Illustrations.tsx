import type { ReactNode } from 'react';
import { carFront } from '../../../icons/carFront';
import { bs } from '../../../theme/theme';

/**
 * Screen-state illustrations: one car-front motif (the icon family's `carFront`, 24px grid scaled up)
 * on a soft disc with a small badge that says what happened. Inline SVG, `bs` tokens only, decorative
 * (the title and body carry the meaning).
 */
const line = { fill: 'none', stroke: bs.text.primary, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function Frame({ children, size = 160 }: { children: ReactNode; size?: number }) {
  return (
    <svg viewBox="0 0 160 120" width={size} height={(size * 120) / 160} aria-hidden focusable="false" style={{ display: 'block', maxWidth: '100%' }}>
      <ellipse cx="80" cy="108" rx="50" ry="5" fill={bs.surface.muted} />
      <circle cx="80" cy="56" r="46" fill={bs.surface.subtle} />
      <g transform="translate(32 1) scale(4)" stroke={bs.text.primary} strokeWidth="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {carFront}
      </g>
      {children}
    </svg>
  );
}

/** Badge disc in the lower right; glyph drawn inside a 32px box centered at (116, 88). */
function Badge({ children, fill }: { children: ReactNode; fill: string }) {
  return (
    <g>
      <circle cx="116" cy="88" r="17" fill={fill} stroke={bs.surface.canvas} strokeWidth="4" />
      <g transform="translate(116 88)">{children}</g>
    </g>
  );
}

/** Nothing here yet (empty list, no jobs today): a calendar behind the car. */
export function EmptyIllustration({ size }: { size?: number }) {
  return (
    <Frame size={size}>
      <Badge fill={bs.surface.canvas}>
        <rect x="-9" y="-8" width="18" height="17" rx="3" {...line} strokeWidth="1.75" />
        <path d="M-9 -2h18M-4 -11v5M4 -11v5" {...line} strokeWidth="1.75" />
      </Badge>
    </Frame>
  );
}

/** No search results: a magnifier. */
export function NoResultsIllustration({ size }: { size?: number }) {
  return (
    <Frame size={size}>
      <Badge fill={bs.surface.canvas}>
        <circle cx="-2" cy="-2" r="7" {...line} strokeWidth="1.75" />
        <path d="m3 3 6 6" {...line} strokeWidth="1.75" />
      </Badge>
    </Frame>
  );
}

/** Something failed on our side: warning mark on the danger tone. */
export function ErrorIllustration({ size }: { size?: number }) {
  return (
    <Frame size={size}>
      <Badge fill={bs.status.danger.solid}>
        <path d="M0 -8v9M0 7v.5" fill="none" stroke={bs.text.onDestructive} strokeWidth="2.25" strokeLinecap="round" />
      </Badge>
    </Frame>
  );
}

/** No connection: Wi-Fi arcs with a slash. */
export function OfflineIllustration({ size }: { size?: number }) {
  return (
    <Frame size={size}>
      <Badge fill={bs.surface.canvas}>
        <path d="M-9 -3a13 13 0 0 1 18 0M-5 1.5a7 7 0 0 1 10 0" {...line} strokeWidth="1.75" />
        <path d="M0 7v.5" {...line} strokeWidth="2.25" />
        <path d="m-10 -10 20 20" stroke={bs.text.primary} strokeWidth="1.75" strokeLinecap="round" />
      </Badge>
    </Frame>
  );
}

/** Role-based restriction: a padlock. */
export function RestrictedIllustration({ size }: { size?: number }) {
  return (
    <Frame size={size}>
      <Badge fill={bs.surface.canvas}>
        <rect x="-8" y="-3" width="16" height="12" rx="3" {...line} strokeWidth="1.75" />
        <path d="M-5 -3v-3a5 5 0 0 1 10 0v3" {...line} strokeWidth="1.75" />
        <path d="M0 2.5v2" {...line} strokeWidth="1.75" />
      </Badge>
    </Frame>
  );
}
