// Runtime smoke test: the theme builds, MUI generates a CSS variable for every Black Six
// token, and the hand-built `bs` references match MUI's names. Run: `node scripts/theme-smoke.mjs`
import { createServer } from 'vite';

const server = await createServer({ logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' });
try {
  const { themes, bs } = await server.ssrLoadModule('/src/theme/theme.ts');
  const flat = (o, p = []) => Object.entries(o).flatMap(([k, v]) => (typeof v === 'string' ? [[[...p, k].join('.'), v]] : flat(v, [...p, k])));
  let bad = 0;
  for (const locale of ['es', 'en']) {
    const generated = Object.fromEntries(flat(themes[locale].vars.palette.bs));
    for (const [path, ref] of flat(bs)) {
      const name = (v) => String(v).match(/var\((--[^,)]+)/)?.[1];
      if (name(generated[path]) !== name(ref)) { bad++; console.log(`MISMATCH ${locale} ${path}: ${generated[path]} vs ${ref}`); }
    }
    const sheets = JSON.stringify(themes[locale].generateStyleSheets());
    for (const needle of ['--mui-palette-bs-surface-canvas":"#111111', '--mui-palette-bs-surface-canvas":"#FFFFFF', '.dark', ':root, .light']) {
      if (!sheets.includes(needle)) { bad++; console.log(`MISSING in stylesheet (${locale}): ${needle}`); }
    }
  }
  console.log(`${flat(bs).length} token variables checked per locale; ${bad} problems.`);
  if (bad) process.exitCode = 1;
} finally {
  await server.close();
}
