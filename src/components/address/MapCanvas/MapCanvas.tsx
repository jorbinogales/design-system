import FlagRounded from '@mui/icons-material/FlagRounded';
import GavelRounded from '@mui/icons-material/GavelRounded';
import HomeRounded from '@mui/icons-material/HomeRounded';
import LocalCarWashRounded from '@mui/icons-material/LocalCarWashRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import Box from '@mui/material/Box';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { keyframes } from '@mui/material/styles';
import type { ComponentType, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { TowTruckIcon } from '../../../icons/TowTruckIcon';
import { bs } from '../../../theme/theme';
import { radius as radii, transition, typeScale } from '../../../theme/tokens';

/** What a pin stands for: a customer address, an auction yard, a destination, a service location or a live tow unit. */
export type MapPinKind = 'address' | 'auction' | 'destination' | 'service' | 'unit';

export interface MapPin {
  id: string;
  kind: MapPinKind;
  /** Horizontal position, 0–100 (% of the map width). */
  x: number;
  /** Vertical position, 0–100 (% of the map height). */
  y: number;
  /** Place name, also the pin's accessible name. */
  label: string;
}

/** Point as `[x, y]` in map percentages (0–100). */
export type MapPoint = [number, number];

export interface MapCanvasProps {
  /** Accessible description of the map ("Mapa de la recogida: IAA Miami North a Doral"). Required: the SVG itself carries no text for assistive tech. */
  label: string;
  pins?: MapPin[];
  /** Route polyline through these points, in order. */
  route?: MapPoint[];
  /** "You are here" dot. */
  userLocation?: { x: number; y: number };
  /** Service-area blob: center and radius, all in map percentages (radius is relative to the map width). */
  serviceArea?: { x: number; y: number; radius: number };
  /** Arrival chip. Sits at the route midpoint unless `x` / `y` are given. */
  eta?: { label: string; x?: number; y?: number };
  /** Selected pin id (controlled). The selected pin turns orange and shows its label. */
  selectedPinId?: string | null;
  /** Makes pins interactive (buttons). Called with the pin id, or `null` when the selected pin is pressed again. */
  onPinSelect?: (id: string | null) => void;
  /** `selected` (default): label only on the selected pin. `all`: every pin shows its label. `none`: labels only for assistive tech. */
  pinLabels?: 'selected' | 'all' | 'none';
  /** Width ÷ height. Default 4:3 (cards) · 16:9 (banners) · 1 (squares). */
  ratio?: number;
  /** Seeds the street grid: the same seed always draws the same streets. */
  seed?: number;
  /** Round the corners (default). Turn off for full-bleed maps behind sheets. */
  rounded?: boolean;
  /** Controls drawn over the map (back button, zoom, recenter). Placed above the pins, receives pointer events. */
  children?: ReactNode;
}

const W = 400;

/** Small deterministic PRNG (mulberry32): same seed, same map. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const defaultStreetNames = ['NW 87th Ave', 'Biscayne Blvd', 'SW 8th St', 'Collins Ave', 'NE 2nd Ave', 'Flagler St', 'Brickell Ave', 'Ponce de Leon Blvd'];

/**
 * Street names the drawn map labels. Defaults to the Miami mock; wrap a tree in this provider to draw
 * another market (the prototype uses Charlotte streets).
 */
export const MapStreetNamesContext = createContext<string[]>(defaultStreetNames);

interface Road {
  at: number;
  major: boolean;
}

function roadsAlong(random: () => number, from: number, to: number, minGap: number, spread: number): Road[] {
  const out: Road[] = [];
  let at = from;
  let i = 0;
  while (at < to) {
    out.push({ at, major: i % 3 === 1 });
    at += minGap + random() * spread;
    i += 1;
  }
  return out;
}

/** Smooth closed blob (Catmull-Rom to cubic Bézier) around a center. */
function blobPath(cx: number, cy: number, r: number, random: () => number): string {
  const n = 9;
  const pts = Array.from({ length: n }, (_, k) => {
    const angle = (Math.PI * 2 * k) / n;
    const rr = r * (0.82 + random() * 0.32);
    return [cx + Math.cos(angle) * rr, cy + Math.sin(angle) * rr] as const;
  });
  const p = (i: number) => pts[(i + n) % n];
  let d = `M ${p(0)[0].toFixed(1)} ${p(0)[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const c1 = [p(i)[0] + (p(i + 1)[0] - p(i - 1)[0]) / 6, p(i)[1] + (p(i + 1)[1] - p(i - 1)[1]) / 6];
    const c2 = [p(i + 1)[0] - (p(i + 2)[0] - p(i)[0]) / 6, p(i + 1)[1] - (p(i + 2)[1] - p(i)[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p(i + 1)[0].toFixed(1)} ${p(i + 1)[1].toFixed(1)}`;
  }
  return `${d} Z`;
}

const pulse = keyframes({ '0%': { transform: 'scale(0.6)', opacity: 0.45 }, '100%': { transform: 'scale(1.5)', opacity: 0 } });

const pinIcon: Record<MapPinKind, ComponentType<SvgIconProps>> = {
  address: HomeRounded,
  auction: GavelRounded,
  destination: FlagRounded,
  service: LocalCarWashRounded,
  unit: TowTruckIcon,
};

const teardrop = 'M16 1.5C8.9 1.5 3.5 6.9 3.5 13.6c0 8.9 12.5 22.4 12.5 22.4s12.5-13.5 12.5-22.4C28.5 6.9 23.1 1.5 16 1.5z';

function PinMark({ pin, selected, showLabel, interactive, onPress }: { pin: MapPin; selected: boolean; showLabel: boolean; interactive: boolean; onPress: () => void }) {
  const Icon = pinIcon[pin.kind];
  const body = (
    <>
      {showLabel && (
        <Box
          component="span"
          sx={{
            ...typeScale.caption,
            fontWeight: 650,
            mb: 1,
            maxWidth: 148,
            px: 2.5,
            py: 1,
            borderRadius: `${radii.sm}px`,
            textAlign: 'center',
            backgroundColor: bs.surface.raised,
            color: bs.text.primary,
            boxShadow: bs.elevation.e2,
            border: `1px solid ${bs.border.subtle}`,
          }}
        >
          {pin.label}
        </Box>
      )}
      <Box className="dark" component="span" sx={{ position: 'relative', display: 'block', width: selected ? 38 : 32, height: selected ? 46 : 40, transition: transition('width', 'height') }}>
        <svg viewBox="0 0 32 38" width="100%" height="100%" aria-hidden focusable="false" style={{ display: 'block' }}>
          <path d={teardrop} style={{ fill: selected ? bs.brand.primary : bs.surface.inverse, stroke: bs.text.primary, strokeWidth: 1.5 }} />
        </svg>
        <Icon aria-hidden sx={{ position: 'absolute', top: '17%', left: '50%', transform: 'translateX(-50%)', fontSize: selected ? 20 : 17, color: selected ? bs.action.primary.fg : bs.text.primary }} />
      </Box>
    </>
  );
  const anchor = {
    position: 'absolute',
    left: `${pin.x}%`,
    top: `${pin.y}%`,
    transform: 'translate(-50%, -100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: selected ? 3 : 2,
    p: 0,
    m: 0,
    border: 0,
    background: 'none',
    font: 'inherit',
  } as const;
  if (!interactive) {
    return (
      <Box aria-hidden sx={anchor}>
        {body}
      </Box>
    );
  }
  return (
    <Box
      component="button"
      type="button"
      aria-label={pin.label}
      aria-pressed={selected}
      onClick={onPress}
      sx={{ ...anchor, cursor: 'pointer', borderRadius: `${radii.md}px`, '&:focus-visible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 3 } }}
    >
      {body}
    </Box>
  );
}

/**
 * Stylized map placeholder, drawn in SVG with no map library: a deterministic street grid,
 * pins, a user-location dot, a route, a service-area blob and an ETA chip. Reads the Black Six tokens,
 * so light and dark come for free. Used by Explorar, Ubicación del centro, Cómo llegar, Seguimiento en vivo
 * and Agregar dirección; swap it for a real map later and keep the same props.
 */
export function MapCanvas({ label, pins = [], route, userLocation, serviceArea, eta, selectedPinId = null, onPinSelect, pinLabels = 'selected', ratio = 4 / 3, seed = 7, rounded = true, children }: MapCanvasProps) {
  const streets = useContext(MapStreetNamesContext);
  const H = Math.round(W / ratio);
  const interactive = Boolean(onPinSelect);

  const scene = useMemo(() => {
    const random = rng(seed);
    const streetNames = streets;
    const angle = -(9 + random() * 10);
    const horizontals = roadsAlong(random, -H * 0.7, H * 1.7, 38, 34);
    const verticals = roadsAlong(random, -W * 0.7, W * 1.7, 46, 44);
    const parkCells: { x: number; y: number; w: number; h: number }[] = [];
    for (let tries = 0; tries < 40 && parkCells.length < 2; tries++) {
      const i = Math.floor(random() * (verticals.length - 1));
      const j = Math.floor(random() * (horizontals.length - 1));
      const x = verticals[i].at;
      const y = horizontals[j].at;
      const w = verticals[i + 1].at - x;
      const h = horizontals[j + 1].at - y;
      if (x > W * 0.05 && x + w < W * 0.95 && y > H * 0.05 && y + h < H * 0.95 && w > 30 && h > 24) parkCells.push({ x: x + 5, y: y + 5, w: w - 10, h: h - 10 });
    }
    const labelled = horizontals.filter((r) => r.major && r.at > H * 0.1 && r.at < H * 0.9).slice(0, 2).map((r, k) => ({ y: r.at - 4, x: W * (0.12 + 0.34 * k) + random() * 20, name: streetNames[Math.floor(random() * streetNames.length)] }));
    const blob = serviceArea ? blobPath((serviceArea.x * W) / 100, (serviceArea.y * H) / 100, (serviceArea.radius * W) / 100, random) : null;
    return { angle, horizontals, verticals, parkCells, labelled, blob };
  }, [seed, H, serviceArea, streets]);

  const px = (p: MapPoint) => `${((p[0] * W) / 100).toFixed(1)},${((p[1] * H) / 100).toFixed(1)}`;
  const lo = route?.[Math.floor((route.length - 1) / 2)];
  const hi = route?.[Math.ceil((route.length - 1) / 2)];
  const etaAt = eta ? { x: eta.x ?? (lo && hi ? (lo[0] + hi[0]) / 2 : 50), y: eta.y ?? (lo && hi ? (lo[1] + hi[1]) / 2 : 50) } : null;

  const description = [label, ...(interactive ? [] : pins.map((p) => p.label)), eta?.label].filter(Boolean).join('. ');
  const grouped = interactive || Boolean(children);

  return (
    <Box
      role={grouped ? 'group' : 'img'}
      aria-label={grouped ? label : description}
      sx={{ position: 'relative', width: '100%', aspectRatio: String(ratio), overflow: 'hidden', backgroundColor: bs.surface.subtle, borderRadius: rounded ? `${radii.lg}px` : 0, isolation: 'isolate' }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
        <rect width={W} height={H} style={{ fill: bs.surface.subtle }} />
        <g transform={`rotate(${scene.angle.toFixed(1)} ${W / 2} ${H / 2})`}>
          {scene.parkCells.map((p, i) => (
            <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={6} style={{ fill: bs.status.success.bg, stroke: bs.status.success.border, strokeWidth: 1 }} />
          ))}
          {scene.horizontals.filter((r) => !r.major).map((r) => (
            <line key={`h${r.at}`} x1={-W} x2={W * 2} y1={r.at} y2={r.at} style={{ stroke: bs.border.subtle, strokeWidth: 1.5 }} />
          ))}
          {scene.verticals.filter((r) => !r.major).map((r) => (
            <line key={`v${r.at}`} y1={-H} y2={H * 2} x1={r.at} x2={r.at} style={{ stroke: bs.border.subtle, strokeWidth: 1.5 }} />
          ))}
          {scene.horizontals.filter((r) => r.major).map((r) => (
            <g key={`H${r.at}`}>
              <line x1={-W} x2={W * 2} y1={r.at} y2={r.at} style={{ stroke: bs.border.subtle, strokeWidth: 10 }} />
              <line x1={-W} x2={W * 2} y1={r.at} y2={r.at} style={{ stroke: bs.surface.raised, strokeWidth: 7.5 }} />
            </g>
          ))}
          {scene.verticals.filter((r) => r.major).map((r) => (
            <g key={`V${r.at}`}>
              <line y1={-H} y2={H * 2} x1={r.at} x2={r.at} style={{ stroke: bs.border.subtle, strokeWidth: 10 }} />
              <line y1={-H} y2={H * 2} x1={r.at} x2={r.at} style={{ stroke: bs.surface.raised, strokeWidth: 7.5 }} />
            </g>
          ))}
          {scene.labelled.map((l) => (
            <text key={l.name} x={l.x} y={l.y} style={{ fill: bs.text.secondary, fontSize: 7.5, fontWeight: 600, letterSpacing: '0.04em' }}>
              {l.name}
            </text>
          ))}
        </g>
        {scene.blob && <path d={scene.blob} style={{ fill: bs.selection.bg, fillOpacity: 0.75, stroke: bs.selection.border, strokeWidth: 1.6, strokeDasharray: '5 4' }} />}
        {route && route.length > 1 && (
          <>
            <polyline points={route.map(px).join(' ')} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: bs.surface.canvas, strokeWidth: 8 }} />
            <polyline points={route.map(px).join(' ')} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: bs.brand.primary, strokeWidth: 4.5 }} />
          </>
        )}
      </svg>

      {userLocation && (
        <Box aria-hidden sx={{ position: 'absolute', left: `${userLocation.x}%`, top: `${userLocation.y}%`, width: 0, height: 0, zIndex: 1 }}>
          <Box sx={{ position: 'absolute', width: 36, height: 36, left: -18, top: -18, borderRadius: '50%', backgroundColor: bs.status.info.solid, animation: `${pulse} 2s ease-out infinite` }} />
          <Box sx={{ position: 'absolute', width: 16, height: 16, left: -8, top: -8, borderRadius: '50%', backgroundColor: bs.status.info.solid, border: `3px solid ${bs.surface.canvas}`, boxShadow: bs.elevation.e2, boxSizing: 'border-box' }} />
        </Box>
      )}

      {pins.map((pin) => {
        const selected = pin.id === selectedPinId;
        return (
          <PinMark
            key={pin.id}
            pin={pin}
            selected={selected}
            showLabel={pinLabels === 'all' || (pinLabels === 'selected' && selected)}
            interactive={interactive}
            onPress={() => onPinSelect?.(selected ? null : pin.id)}
          />
        );
      })}

      {eta && etaAt && (
        <Box
          sx={{
            ...typeScale.label,
            position: 'absolute',
            left: `${etaAt.x}%`,
            top: `${etaAt.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            height: 30,
            px: 3,
            borderRadius: `${radii.pill}px`,
            backgroundColor: bs.surface.raised,
            color: bs.text.primary,
            border: `1px solid ${bs.border.subtle}`,
            boxShadow: bs.elevation.e2,
            whiteSpace: 'nowrap',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <ScheduleRounded aria-hidden sx={{ fontSize: 16 }} />
          {eta.label}
        </Box>
      )}

      {children && <Box sx={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', '& > *': { pointerEvents: 'auto' } }}>{children}</Box>}
    </Box>
  );
}
