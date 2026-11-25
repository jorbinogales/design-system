// WCAG contrast check for Black Six tokens. Run: `node scripts/contrast.mjs`
// (Node ≥ 23.6 strips TypeScript types, so tokens.ts is imported as-is.)
// Exits with code 1 if any pair fails its threshold.
import { color } from '../src/theme/tokens.ts';

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
};
const lum = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// Self-check against the brief's published numbers.
console.assert(Math.abs(ratio('#111111', '#FF5000') - 5.75) < 0.02, 'charcoal on orange should be 5.75');
console.assert(Math.abs(ratio('#B33700', '#FFFFFF') - 6.06) < 0.02, 'link on white should be 6.06');

const TEXT = 4.5;
const UI = 3;
const rows = [];
const check = (scheme, name, fg, bg, min) => rows.push({ scheme, name, fg, bg, ratio: ratio(fg, bg), min });

for (const mode of ['light', 'dark']) {
  const c = color[mode];
  const s = c.surface;
  const surfaces = { canvas: s.canvas, subtle: s.subtle, raised: s.raised, muted: s.muted };
  for (const [sn, bg] of Object.entries(surfaces)) {
    check(mode, `text.primary / surface.${sn}`, c.text.primary, bg, TEXT);
    check(mode, `text.secondary / surface.${sn}`, c.text.secondary, bg, TEXT);
    check(mode, `text.link / surface.${sn}`, c.text.link, bg, TEXT);
    check(mode, `focus.ring / surface.${sn}`, c.focus.ring, bg, UI);
    check(mode, `border.strong / surface.${sn}`, c.border.strong, bg, UI);
  }
  check(mode, 'text.primary / selection.bg', c.text.primary, c.selection.bg, TEXT);
  check(mode, 'text.secondary / selection.bg', c.text.secondary, c.selection.bg, TEXT);
  check(mode, 'text.link / selection.bg', c.text.link, c.selection.bg, TEXT);
  check(mode, 'selection.border / surface.canvas', c.selection.border, s.canvas, UI);
  check(mode, 'brand.primary / surface.canvas (icons, indicators)', c.brand.primary, s.canvas, UI);
  check(mode, 'brand.primary / surface.raised (icons, indicators)', c.brand.primary, s.raised, UI);
  for (const k of ['bg', 'hover', 'pressed']) {
    check(mode, `action.primary.fg / action.primary.${k}`, c.action.primary.fg, c.action.primary[k], TEXT);
    check(mode, `action.secondary.fg / action.secondary.${k}`, c.action.secondary.fg, c.action.secondary[k], TEXT);
    check(mode, `text.onDestructive / action.destructive.${k}`, c.text.onDestructive, c.action.destructive[k], TEXT);
  }
  for (const [tone, t] of Object.entries(c.status)) {
    check(mode, `status.${tone}.fg / status.${tone}.bg`, t.fg, t.bg, TEXT);
    check(mode, `status.${tone}.fg / surface.canvas`, t.fg, s.canvas, TEXT);
    check(mode, `status.${tone}.solid / surface.canvas`, t.solid, s.canvas, UI);
  }
  // Inverse surface: content inside renders with the dark scheme's tokens.
  const d = color.dark;
  check(mode, 'inverse: dark text.primary / surface.inverse', d.text.primary, s.inverse, TEXT);
  check(mode, 'inverse: dark text.secondary / surface.inverse', d.text.secondary, s.inverse, TEXT);
  check(mode, 'inverse: dark text.link / surface.inverse', d.text.link, s.inverse, TEXT);
  check(mode, 'inverse: brand.primary / surface.inverse', d.brand.primary, s.inverse, UI);
}

let failed = 0;
const pad = (v, n) => String(v).padEnd(n);
for (const r of rows) {
  const ok = r.ratio >= r.min;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${pad(r.scheme, 6)}${pad(r.name, 58)}${pad(r.fg, 9)}on ${pad(r.bg, 9)}${r.ratio.toFixed(2)}:1 (min ${r.min})`);
}
console.log(`\n${rows.length - failed}/${rows.length} pairs pass.`);
if (failed) process.exitCode = 1;
