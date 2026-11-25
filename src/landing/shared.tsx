import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState, type ReactNode } from 'react';
import { wordmarkPath, wordmarkViewBox } from '../brand/logoPaths';
import { Wordmark } from '../brand/Wordmark';
import { Button } from '../components/actions/Button/Button';
import { LanguageSelect } from '../components/preferences/LanguageSelect/LanguageSelect';
import { unitMeta, type BusinessUnit } from '../domain/units';
import { useT, type Locale } from '../i18n/locale';
import { AppProviders } from '../theme/AppProviders';
import { SchemeScope } from '../theme/SchemeScope';
import { bs } from '../theme/theme';
import { layout, transition } from '../theme/tokens';

/* ─────────────── Rutas del sitio ─────────────── */

export const APP = './prototype.html';
export const units: BusinessUnit[] = ['detailing', 'towing', 'personal-washing'];
export const unitPage: Record<BusinessUnit, string> = { detailing: './detailing.html', towing: './towing.html', 'personal-washing': './personal-washing.html' };
export const HOME = './index.html';
export type Page = 'home' | BusinessUnit;

/* ─────────────── Tipografía de póster (flyers de Black Seat) ─────────────── */

/** Archivo at its narrowest width, heavy, uppercase: the flyer's poster lettering in the DS family. */
export const poster = (size: string, md: string) => ({
  fontStretch: '62%',
  fontWeight: 800,
  textTransform: 'uppercase' as const,
  letterSpacing: 0,
  lineHeight: 0.88,
  fontSize: size,
  '@media (min-width:900px)': { fontSize: md },
});

export const gutters = { xs: `${layout.gutter.mobile}px`, sm: `${layout.gutter.tablet}px`, lg: `${layout.gutter.desktop}px` };

/* ─────────────── Piezas ─────────────── */

/** Full-bleed section with the wide content column; `dark` flips the scheme for the band. */
export function Band({ dark = false, children, sx, ...rest }: BoxProps & { dark?: boolean }) {
  const inner = (
    <Box component="section" {...rest} sx={[{ backgroundColor: bs.surface.canvas, color: bs.text.primary, px: gutters, py: { xs: 14, md: 24 } }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ maxWidth: layout.maxWidth.wide, mx: 'auto' }}>{children}</Box>
    </Box>
  );
  return dark ? <SchemeScope scheme="dark">{inner}</SchemeScope> : inner;
}

/** Road-marking stripes from the flyer: a quiet signature at the foot of dark bands. */
export function Stripes() {
  return <Box aria-hidden sx={{ height: { xs: 56, md: 88 }, backgroundImage: `repeating-linear-gradient(180deg, ${bs.text.primary} 0 8px, transparent 8px 20px)`, opacity: 0.14 }} />;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Typography variant="label" component="p" sx={{ color: bs.text.secondary }}>
      {children}
    </Typography>
  );
}

/** Section title in poster lettering. */
export function PosterTitle({ id, children, size = ['3rem', '4.5rem'], sx }: { id?: string; children: ReactNode; size?: [string, string]; sx?: object }) {
  return (
    <Typography id={id} component="h2" sx={{ ...poster(size[0], size[1]), ...sx }}>
      {children}
    </Typography>
  );
}

const linkSx = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 44,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.9375rem',
  transition: transition('color'),
  '&:focus-visible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 4, borderRadius: '4px' },
};

const headerMessages = {
  es: { nav: 'Secciones', vip: 'VIP', book: 'Reservar', skip: 'Saltar al contenido', home: 'Inicio' },
  en: { nav: 'Sections', vip: 'VIP', book: 'Book', skip: 'Skip to content', home: 'Home' },
};

function Header({ page, locale, setLocale }: { page: Page; locale: Locale; setLocale: (l: Locale) => void }) {
  const t = useT(headerMessages);
  return (
    <SchemeScope scheme="dark">
      <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: bs.surface.canvas, color: bs.text.primary, borderBottom: `1px solid ${bs.border.subtle}` }}>
        <Box sx={{ maxWidth: layout.maxWidth.wide, mx: 'auto', px: gutters, height: 64, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box component="a" href={HOME} aria-label={`Black Seat · ${t.home}`} sx={{ color: 'inherit', display: 'flex', alignItems: 'center', minHeight: 44, '&:focus-visible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 4 } }}>
            <Wordmark size="md" />
          </Box>
          <Box component="nav" aria-label={t.nav} sx={{ display: { xs: 'none', md: 'flex' }, gap: 6, ml: 6 }}>
            {units.map((u) => {
              const active = page === u;
              return (
                <Box key={u} component="a" href={unitPage[u]} aria-current={active ? 'page' : undefined} sx={{ ...linkSx, color: active ? bs.text.primary : bs.text.secondary, boxShadow: active ? `inset 0 -2px 0 ${bs.text.primary}` : 'none', '&:hover': { color: bs.text.primary } }}>
                  {unitMeta[u].name}
                </Box>
              );
            })}
            <Box component="a" href={`${HOME}#vip`} sx={{ ...linkSx, color: bs.text.secondary, '&:hover': { color: bs.text.primary } }}>
              {t.vip}
            </Box>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
            <LanguageSelect size="sm" value={locale} onChange={setLocale} />
            <Button size="sm" variant="secondary" href={page === 'home' ? APP : `${APP}#/c/unit/${page}`} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              {t.book}
            </Button>
          </Box>
        </Box>
        {/* Phone: the unit pages stay one tap away */}
        <Box component="nav" aria-label={t.nav} sx={{ display: { xs: 'flex', md: 'none' }, gap: 5, px: gutters, overflowX: 'auto', scrollbarWidth: 'none', borderTop: `1px solid ${bs.border.subtle}` }}>
          {units.map((u) => (
            <Box key={u} component="a" href={unitPage[u]} aria-current={page === u ? 'page' : undefined} sx={{ ...linkSx, flexShrink: 0, color: page === u ? bs.text.primary : bs.text.secondary, boxShadow: page === u ? `inset 0 -2px 0 ${bs.text.primary}` : 'none' }}>
              {unitMeta[u].name}
            </Box>
          ))}
        </Box>
      </Box>
    </SchemeScope>
  );
}

const footerMessages = {
  es: { services: 'Servicios', company: 'Black Seat', app: 'Abrir la app', tag: 'Detailing, Towing y Personal Washing en Carolina del Norte.', sample: 'Precios y datos de ejemplo para la vista previa.', home: 'Inicio', faq: 'Preguntas', area: 'Dónde trabajamos' },
  en: { services: 'Services', company: 'Black Seat', app: 'Open the app', tag: 'Detailing, Towing and Personal Washing in North Carolina.', sample: 'Sample prices and data for this preview.', home: 'Home', faq: 'FAQ', area: 'Where we work' },
};

/** Closing call to action + footer with the edge-to-edge wordmark. */
export function SiteFooter({ title, cta, ctaHref }: { title: string; cta: string; ctaHref: string }) {
  const t = useT(footerMessages);
  const link = { color: bs.text.primary, textDecoration: 'none', display: 'inline-flex', minHeight: 32, alignItems: 'center', '&:hover': { textDecoration: 'underline' } };
  return (
    <SchemeScope scheme="dark">
      <Box component="footer" sx={{ backgroundColor: bs.surface.inverse, color: bs.text.primary, overflow: 'hidden' }}>
        <Stripes />
        <Box sx={{ maxWidth: layout.maxWidth.wide, mx: 'auto', px: gutters, pt: { xs: 12, md: 18 }, pb: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: { md: 'flex-end' }, justifyContent: 'space-between', pb: { xs: 12, md: 16 } }}>
            <PosterTitle sx={{ maxWidth: 760 }}>{title}</PosterTitle>
            <Button href={ctaHref} endIcon={<ArrowForwardRounded />} sx={{ flexShrink: 0, alignSelf: { xs: 'flex-start', md: 'auto' } }}>
              {cta}
            </Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr) minmax(0,1fr)', md: 'minmax(0,6fr) minmax(0,3fr) minmax(0,3fr)' }, gap: 8, borderTop: `1px solid ${bs.border.subtle}`, pt: 8 }}>
            <Typography sx={{ gridColumn: { xs: '1 / -1', md: 'auto' }, color: bs.text.secondary, maxWidth: 360 }}>{t.tag}</Typography>
            <Box component="nav" aria-label={t.services}>
              <Eyebrow>{t.services}</Eyebrow>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 2, p: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {units.map((u) => (
                  <li key={u}>
                    <Box component="a" href={unitPage[u]} sx={link}>
                      {unitMeta[u].name}
                    </Box>
                  </li>
                ))}
              </Box>
            </Box>
            <Box component="nav" aria-label={t.company}>
              <Eyebrow>{t.company}</Eyebrow>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 2, p: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  [HOME, t.home],
                  [`${HOME}#vip`, 'VIP'],
                  [`${HOME}#zona`, t.area],
                  [`${HOME}#faq`, t.faq],
                  [APP, t.app],
                ].map(([h, l]) => (
                  <li key={h}>
                    <Box component="a" href={h} sx={link}>
                      {l}
                    </Box>
                  </li>
                ))}
              </Box>
            </Box>
          </Box>
          <Typography variant="caption" component="p" sx={{ color: bs.text.secondary, mt: 8 }}>
            © 2026 Black Seat · {t.sample}
          </Typography>
        </Box>
        <Box aria-hidden sx={{ px: { xs: `${layout.gutter.mobile}px`, lg: `${layout.gutter.desktop}px` }, pb: { xs: 4, md: 6 }, maxWidth: layout.maxWidth.wide + 80, mx: 'auto' }}>
          <Box component="svg" viewBox={wordmarkViewBox} sx={{ width: '100%', height: 'auto', display: 'block', color: bs.text.primary }}>
            <path d={wordmarkPath} fillRule="evenodd" fill="currentColor" />
          </Box>
        </Box>
      </Box>
    </SchemeScope>
  );
}

function SkipLink() {
  const t = useT(headerMessages);
  return (
    <Box component="a" href="#main" sx={{ position: 'absolute', left: 8, top: -64, zIndex: 20, px: 4, py: 3, borderRadius: '8px', backgroundColor: bs.surface.raised, color: bs.text.primary, fontWeight: 600, '&:focus-visible': { top: 8 } }}>
      {t.skip}
    </Box>
  );
}

/** Providers, locale (browser language by default), header and skip link shared by every page. */
export function SiteShell({ page, children }: { page: Page; children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => (navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'));
  return (
    <AppProviders mode="light" locale={locale}>
      <Box sx={{ backgroundColor: bs.surface.canvas, color: bs.text.primary, minHeight: '100dvh' }}>
        <SkipLink />
        <Header page={page} locale={locale} setLocale={setLocale} />
        {children}
      </Box>
    </AppProviders>
  );
}
