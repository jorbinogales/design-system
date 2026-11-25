# Black Seat — DESIGN.md

Contract for every agent working on the Black Seat design system (PWA: Detailing, Towing, Personal
Washing; cliente mobile-first + operador desktop/mobile; ES default / EN; light #FFFFFF / dark #111111).
Read this whole file before writing code. Source of truth for the product: `docs/brief.md`.

## 1. Direction contract

| Decision | Value |
|---|---|
| Skill | `impeccable` (Operate mode: product UI) |
| Aesthetic | Charcoal-and-white precision, one orange signal |
| Structure | Taken from the reference kit (`ref/`): rounded cards, full-width pill CTAs, soft gray filled fields with the label above, underline tabs, chips, photo cards with rating/bookmark badges, circular back buttons, 5-item bottom nav, bottom sheets. Purple → orange; the purple Home header → **black header** (`surface.inverse`). |
| Type | **Archivo** variable (weight 100–900, width 62–125%), self-hosted via `@fontsource-variable/archivo/wdth.css`. Display steps use width 104–112%; the wordmark uses 125%. One family only. |
| Color | Neutral surfaces carry hierarchy; **orange #FF5000 only for the one primary action, selection and active indicators**. Orange buttons ALWAYS carry `#111111` text (5.75:1). Prices, times and lot numbers stay charcoal. |
| Motion | Fast and few: 90/150/220/320 ms, ease-out-expo for arrivals. No ripple. Global `prefers-reduced-motion` kill switch in `CssBaseline` + MUI `motion.reducedMotion: 'system'`. |
| Density | `comfortable` (cliente, touch, 44px+ targets) · `compact` (operador desktop). |

## 2. Tokens

All values live in `src/theme/tokens.ts` (brief table verbatim + extensions). `node scripts/contrast.mjs`
checks 114 pairs (all WCAG AA). **Use tokens through `bs`, never hex:**

```ts
import { bs } from '../../../theme/theme';          // CSS-variable references
sx={{ backgroundColor: bs.surface.subtle, color: bs.text.secondary, borderColor: bs.border.subtle }}
import { radius, space, layout, typeScale, duration, easing, transition, density } from '../../../theme/tokens';
```

`bs.*` resolves to `var(--mui-palette-bs-…)`, so it follows light/dark **and scoped subtrees**.
`theme.spacing(1)` = **4px** (`p: 4` = 16px).

| Group | Tokens (`bs.…`) | Notes |
|---|---|---|
| brand | `brand.primary` | #FF5000 both modes |
| action | `action.primary.{bg,fg,hover,pressed}` · `action.secondary.*` · `action.destructive.*` · `action.hover` · `action.pressed` | fg on primary is #111111 |
| surface | `surface.{canvas,subtle,raised,inverse,muted}` | `inverse` = black header (#111 light / #000 dark) |
| text | `text.{primary,secondary,link,disabled,onDestructive}` | link #B33700 / #FF8A55 |
| selection | `selection.{bg,border}` | selected slot/package/chip/day |
| border | `border.{subtle,strong,field}` | `strong` = control outlines (3:1) |
| status | `status.{success,warning,danger,info,neutral,brand}.{bg,fg,border,solid}` | fg on bg ≥ 4.5:1 |
| other | `focus.ring` · `scrim` · `disabled.{bg,fg,border}` · `elevation.{e0..e3}` | shadows are per-scheme |

Non-color tokens: `typeScale` (display, h1–h4, body1/2, label, caption, button, code, price),
`space` (4…64), `radius` (xs 6, sm 8, md 12 fields, lg 16 cards, xl 24 sheets, pill), `layout`
(gutters 20/32/40, maxWidth 480/840/1280, controlHeight 36/44/52, fieldHeight 52, safeAreaTop/Bottom),
`duration`, `easing`, `transition()`, `breakpoints` (sm 600, md 900, lg 1200, xl 1440), `zLayer`.
Typography variants: `<Typography variant="display|h1|h2|h3|h4|body1|body2|label|caption|code|price">`.

Scheme tools (`src/theme/SchemeScope.tsx`): `<SchemeScope scheme="light|dark|page">` forces tokens on a
subtree; `<InverseSurface>` is the black block with dark-scheme content. Overlay text on photos goes in
`<SchemeScope scheme="dark">` over `Media scrim`.

**`src/theme/**` is frozen after Phase 1.** Every MUI component in the inventory is already themed
(Button, IconButton, Link, TextField/Input*, Select, Autocomplete, Checkbox, Radio, Switch, Slider, Chip,
ToggleButton, Tabs, BottomNavigation, AppBar/Toolbar, Breadcrumbs, Drawer (bottom sheet radius +
safe area), Dialog*, Menu, Popover, Tooltip, Snackbar, Alert, Skeleton, Linear/CircularProgress, Stepper,
Accordion, Card*, List*, Divider, Avatar, Badge, Table*, Pagination, DateCalendar, PickerDay, pickers
fields, digital clocks, TimeClock). Raw MUI components look right; prefer them over custom styling.
If a token is genuinely missing, report it to the orchestrator; do not edit the theme.

## 3. Folder structure and naming

```
src/theme/        tokens, theme, AppProviders, augmentation, SchemeScope, a11y   (frozen after Phase 1)
src/i18n/         locale.tsx (API fixed) · format.ts (intlLocale, formatMoney, formatNumber)
src/domain/       status.ts · units.ts (+ later shared domain types)
src/brand/        Wordmark (logo oficial vectorizado), BlackSeatMark (B del logo), logoPaths
src/icons/        custom SvgIcons (one file each) + unitIcon map
src/storybook/    DeviceFrame, decorators, DocsContainer, docSpec, Showcase, labels, sbThemes
src/foundations/  Fundamentos stories
src/components/<family>/<Component>/   generic components (Phase 1 + Phase 2)
src/blackseat/<Component>/              brief §5 components (Phase 2)
src/mocks/                             shared realistic data (Phase 2)
src/screens/<flow>/<Screen>/           screen stories (Phase 3)
```

Families (folder → sidebar): `actions` → Acciones · `navigation` → Navegación móvil ·
`desktop-navigation` → Navegación de escritorio · `layout` → **Estructura** · `fields` → Campos ·
`selection` → Selección · `date-time` → Fecha y hora · `address` → Direcciones · `overlays` → Capas y menús ·
`feedback` → Feedback · `screen-states` → Estados de pantalla · `tables` → Tablas y bandejas ·
`preferences` → Preferencias · `data-display` → Presentación de datos.

Each component folder: `<Component>.tsx`, `<Component>.stories.tsx`, `index.ts` (re-exports that folder
only). Code identifiers in English (PascalCase components, camelCase props). Sidebar titles in Spanish.

**No shared barrel files.** Never create `src/components/index.ts` or family-level indexes. Import from
the component's own file: `import { Button } from '../../components/actions/Button/Button';`.

## 4. Rules

- No raw hex/rgb outside `src/theme/**`. Use `bs.*`.
- No lorem ipsum. Real ES and EN copy, realistic data (Miami-area US market, USD, Copart/IAA auctions,
  lot numbers with leading zeros like `04217753`, pickup code `0093`).
- Icons, never emojis. Generic UI: `@mui/icons-material` **Rounded/Outlined** (outlined at rest, filled
  Rounded for active). Domain icons: `src/icons/*` (24px grid, 1.75 stroke) via `createStrokeIcon`.
- Status meaning never by color alone: text + icon (`StatusBadge`).
- Codes and identifiers are strings; never `type="number"`.
- One orange primary per view. Orange buttons have #111111 text.
- No new dependencies. Never hotlink unverified images; local assets go in `public/` (add
  `staticDirs: ['../public']` to `.storybook/main.ts` when the first asset lands).
- Touch targets ≥ 44px on cliente screens. Visible focus everywhere (theme handles MUI).
- Must hold at 390px (and 320px) with 20px gutters, no horizontal scroll.

## 5. i18n pattern

```tsx
import { useT, useLocale } from '../../../i18n/locale';
import { formatMoney } from '../../../i18n/format';

const messages = {
  es: { book: 'Reservar', items: (n: number) => `${n} servicios` },
  en: { book: 'Book', items: (n: number) => `${n} services` },
};
export function Example() {
  const t = useT(messages);          // typed from the es/en object
  const locale = useLocale();        // 'es' | 'en'
  return <Button>{t.book} · {formatMoney(89, locale)}</Button>;
}
```
Colocate `messages` in the component file. Components default their own labels (e.g. BackButton
"Volver/Back") and accept overrides. Long cases must fit: "Pendiente de asignación / Awaiting assignment".
Domain labels come from `src/domain/*` (`getStatusLabel(dim, status, locale, long?)`, `unitMeta`).

## 6. Story conventions

- `title`: `'Componentes/<Familia>/<Nombre>'` (e.g. `Componentes/Acciones/Botón`), `Black Seat/<Nombre>`,
  `Pantallas/<Flujo>/<Pantalla>`. Story `name` in Spanish ('Interactivo', 'Estados', 'Ejemplo de negocio').
- Autodocs is on globally. First story = "Interactivo" with args when practical.
- Copy inside stories: a `messages` object + small demo components using `useT` (hooks need components:
  `render: () => <Demo />`). Specimen captions: `useStoryLabels()` from `src/storybook/labels.ts`.
- Layout helpers: `<Showcase maxWidth={390}>` + `<Specimen label=… direction="row|column">`.
- Every component includes a **business example** story (Detailing, Towing or Personal Washing data).
- Toolbars: Apariencia (Claro, Oscuro, Sistema, **Claro + Oscuro** side by side) and Idioma (ES/EN).
  Tokens must come from `bs` for the side-by-side view to work.

### Docs page (8 fields of brief §6) — copy-paste template

```tsx
import { componentDocs } from '../../../storybook/docSpec';

parameters: {
  docs: {
    description: {
      component: componentDocs({
        purpose: 'Qué tarea resuelve, en una o dos frases.',
        anatomy: ['**Parte** obligatoria', '**Parte** (opcional)'],
        props: ['Notas que la tabla de controles no explica (combinaciones, valores por defecto).'],
        states: ['Reposo', 'Hover (solo puntero)', 'Foco visible', 'Presionado', 'Seleccionado', 'Deshabilitado', 'Carga', 'Error'],
        tokens: [['Fondo', 'surface.raised'], ['Texto', 'text.primary'], ['Radio', 'radius.lg']],
        responsive: ['Móvil vs escritorio', 'Texto largo', 'Teclado abierto'],
        a11y: ['Nombre accesible', 'Orden de foco y teclado', 'Anuncio de errores', 'Significado sin color'],
        content: [['Pendiente de asignación', 'Awaiting assignment']],
        example: 'Qué historia muestra el ejemplo de negocio y con qué datos.',
      }),
    },
  },
},
```

## 7. Screen stories (device frame)

```tsx
const meta = {
  title: 'Pantallas/Reserva/Resumen',
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },  // 'light' over black header/photos
} satisfies Meta;
export const Default: StoryObj = { render: () => <ReviewSummaryScreen /> };
```
- `parameters.device` wraps the story in `DeviceFrame` (390×844, 9:41 status bar, Dynamic Island, home
  indicator). Props: `statusBar: 'auto' | 'light' | 'dark'`, `background: 'canvas' | 'subtle'`.
- The screen root is a **flex column** filling the frame's scroll area. Put `TopBar` first (it pads
  `layout.safeAreaTop`), content next, then `BottomActionBar` or `BottomNav` last (both `position:
  sticky` + `mt: 'auto'`, padding `layout.safeAreaBottom`).
- Screens without TopBar pad their top with `pt: \`calc(${layout.safeAreaTop} + 24px)\``.
- Safe areas are CSS vars `--bs-safe-area-top/bottom` set by the frame, falling back to
  `env(safe-area-inset-*)` in the PWA. `position: fixed` children are contained by the screen.
- Below 440px viewport width the frame drops its bezel and fills the viewport (Móvil viewport).
- Viewports: `mobile` 390×844, `tablet` 834×1194, `desktop` 1440×900 (`globals: { viewport: { value: 'desktop' } }`).
- Operator desktop screens: no device frame; `layout: 'fullscreen'`.

## 8. Verification for every agent

`npx tsc -b` · `npx storybook build -o storybook-static --quiet` · `node scripts/contrast.mjs` ·
`node scripts/theme-smoke.mjs` · `node scripts/logic-check.mjs`. Check 390px and 1440px, light, dark and ES/EN.
