import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import BoltOutlined from '@mui/icons-material/BoltOutlined';
import CheckRounded from '@mui/icons-material/CheckRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EventRepeatOutlined from '@mui/icons-material/EventRepeatOutlined';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box, { type BoxProps } from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useState, type ReactNode } from 'react';
import { formatDuration, formatHoursRange } from '../blackseat/shared/format';
import { wordmarkPath, wordmarkViewBox } from '../brand/logoPaths';
import { Wordmark } from '../brand/Wordmark';
import { Button } from '../components/actions/Button/Button';
import { Price } from '../components/data-display/Price/Price';
import { LanguageSelect } from '../components/preferences/LanguageSelect/LanguageSelect';
import { unitMeta, type BusinessUnit } from '../domain/units';
import type { Locale } from '../i18n/locale';
import { useLocale, useT } from '../i18n/locale';
import { unitIcon } from '../icons/unitIcon';
import { fromPrice, packagesFor, unitCopy, unitHours, vipBenefits, vipPlans } from '../prototype/data';
import { AppProviders } from '../theme/AppProviders';
import { SchemeScope } from '../theme/SchemeScope';
import { bs } from '../theme/theme';
import { layout, transition } from '../theme/tokens';

/* ─────────────── Tipografía de póster (flyers de Black Seat) ─────────────── */

/** Archivo at its narrowest width, heavy, uppercase: the flyer's poster lettering in the DS family. */
const poster = (size: string, md: string) => ({
  fontStretch: '62%',
  fontWeight: 800,
  textTransform: 'uppercase' as const,
  letterSpacing: 0,
  lineHeight: 0.88,
  fontSize: size,
  '@media (min-width:900px)': { fontSize: md },
});

const APP = './prototype.html';
const units: BusinessUnit[] = ['detailing', 'towing', 'personal-washing'];
const anchor: Record<BusinessUnit, string> = { detailing: 'detailing', towing: 'towing', 'personal-washing': 'personal-washing' };

const messages = {
  es: {
    skip: 'Saltar al contenido',
    nav: 'Secciones',
    vip: 'VIP',
    faq: 'Preguntas',
    book: 'Reservar',
    heroLines: ['Detailing.', 'Towing.', 'Pressure', 'washing.'],
    heroLead: 'Una sola marca para tu auto y tu casa en Carolina del Norte. Eliges el servicio, la fecha y pagas desde el teléfono: sin llamadas ni mensajes.',
    heroCta: 'Reservar ahora',
    heroSecondary: 'Ver servicios',
    area: 'Charlotte · Raleigh · NC',
    indexTitle: 'Tres servicios, una marca',
    from: 'Desde',
    see: 'Ver',
    packages: 'Paquetes',
    duration: 'Duración',
    price: 'Precio',
    hours: 'Horario',
    closed: 'Cerrado',
    includes: 'Incluye',
    bookUnit: (n: string) => `Reservar ${n}`,
    towSteps: ['Elige Copart o IAA y el patio.', 'Escribe el número de lote y el código de recogida.', 'Escoge el día. Nosotros vamos por él y te lo entregamos.'],
    towStepsTitle: 'Sin WhatsApp, en tres pasos',
    howTitle: 'Cómo funciona',
    how: [
      ['Elige', 'Detailing, Towing o Personal Washing, y el paquete que necesitas.'],
      ['Agenda', 'Ves las horas libres en tiempo real y eliges la que te sirve.'],
      ['Listo', 'Pagas en la app o al terminar, y sigues el estado de tu reserva.'],
    ],
    vipTitle: 'Black Seat VIP',
    vipLead: 'Para los que no quieren esperar.',
    perMonth: 'al mes',
    vipCta: 'Hacerme VIP',
    areaTitle: 'Dónde trabajamos',
    areaNow: 'Hoy',
    areaNowList: ['Charlotte y alrededores', 'Raleigh y alrededores', 'Patios de Copart e IAA en Carolina del Norte'],
    areaNext: 'Próximamente',
    areaNextList: ['Carolina del Sur', 'Virginia', 'Nashville, TN', 'Atlanta, GA'],
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      ['¿Tengo que descargar una app?', 'No. Black Seat funciona desde el navegador del teléfono y se puede instalar en la pantalla de inicio del iPhone o Android.'],
      ['¿Cómo pago?', 'Con tarjeta o Apple Pay al confirmar. También aceptamos Zelle y efectivo al terminar; en ese caso la reserva queda con el pago pendiente.'],
      ['¿Qué necesito para que recojan mi auto en la subasta?', 'La subasta (Copart o IAA), el patio, el número de lote y el código de recogida. Los cargos de la subasta y de almacenamiento no están incluidos.'],
      ['¿Puedo cambiar la hora?', 'Sí. Puedes reprogramar sin costo hasta 24 horas antes. Los miembros VIP, hasta 2 horas antes.'],
      ['¿Atienden en inglés?', 'Sí. Todo está en inglés y en español.'],
    ],
    closeTitle: 'Tu próxima cita está a tres toques',
    closeCta: 'Reservar ahora',
    footerTag: 'Detailing, Towing y Personal Washing en Carolina del Norte.',
    footerServices: 'Servicios',
    footerCompany: 'Black Seat',
    footerApp: 'Abrir la app',
    sample: 'Precios y datos de ejemplo para la vista previa.',
  },
  en: {
    skip: 'Skip to content',
    nav: 'Sections',
    vip: 'VIP',
    faq: 'FAQ',
    book: 'Book',
    heroLines: ['Detailing.', 'Towing.', 'Pressure', 'washing.'],
    heroLead: 'One brand for your car and your home in North Carolina. Pick the service, the date and pay from your phone: no calls, no texts.',
    heroCta: 'Book now',
    heroSecondary: 'See services',
    area: 'Charlotte · Raleigh · NC',
    indexTitle: 'Three services, one brand',
    from: 'From',
    see: 'See',
    packages: 'Packages',
    duration: 'Duration',
    price: 'Price',
    hours: 'Hours',
    closed: 'Closed',
    includes: 'Includes',
    bookUnit: (n: string) => `Book ${n}`,
    towSteps: ['Pick Copart or IAA and the yard.', 'Enter the lot number and the pickup code.', 'Choose the day. We pick it up and deliver it to you.'],
    towStepsTitle: 'No WhatsApp, three steps',
    howTitle: 'How it works',
    how: [
      ['Pick', 'Detailing, Towing or Personal Washing, and the package you need.'],
      ['Schedule', 'See open times live and choose the one that works for you.'],
      ['Done', 'Pay in the app or when we finish, and follow your booking status.'],
    ],
    vipTitle: 'Black Seat VIP',
    vipLead: "For those who don't want to wait.",
    perMonth: 'per month',
    vipCta: 'Go VIP',
    areaTitle: 'Where we work',
    areaNow: 'Today',
    areaNowList: ['Charlotte area', 'Raleigh area', 'Copart and IAA yards in North Carolina'],
    areaNext: 'Coming soon',
    areaNextList: ['South Carolina', 'Virginia', 'Nashville, TN', 'Atlanta, GA'],
    faqTitle: 'Frequently asked questions',
    faqs: [
      ['Do I need to download an app?', 'No. Black Seat runs in your phone browser and can be added to your iPhone or Android home screen.'],
      ['How do I pay?', 'By card or Apple Pay when you confirm. We also take Zelle and cash when we finish; in that case the booking stays payment pending.'],
      ['What do you need to pick up my car at the auction?', 'The auction (Copart or IAA), the yard, the lot number and the pickup code. Auction and storage fees are not included.'],
      ['Can I change the time?', 'Yes. You can reschedule for free up to 24 hours before. VIP members, up to 2 hours before.'],
      ['Do you speak English?', 'Yes. Everything is available in English and Spanish.'],
    ],
    closeTitle: 'Your next appointment is three taps away',
    closeCta: 'Book now',
    footerTag: 'Detailing, Towing and Personal Washing in North Carolina.',
    footerServices: 'Services',
    footerCompany: 'Black Seat',
    footerApp: 'Open the app',
    sample: 'Sample prices and data for this preview.',
  },
};

/* ─────────────── Piezas ─────────────── */

function Band({ dark = false, children, sx, ...rest }: BoxProps & { dark?: boolean }) {
  const inner = (
    <Box component="section" {...rest} sx={[{ backgroundColor: bs.surface.canvas, color: bs.text.primary, px: { xs: `${layout.gutter.mobile}px`, sm: `${layout.gutter.tablet}px`, lg: `${layout.gutter.desktop}px` }, py: { xs: 14, md: 24 } }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ maxWidth: layout.maxWidth.wide, mx: 'auto' }}>{children}</Box>
    </Box>
  );
  return dark ? <SchemeScope scheme="dark">{inner}</SchemeScope> : inner;
}

/** Road-marking stripes from the flyer: a quiet signature at the foot of dark bands. */
function Stripes() {
  return (
    <Box
      aria-hidden
      sx={{
        height: { xs: 56, md: 88 },
        backgroundImage: `repeating-linear-gradient(180deg, ${bs.text.primary} 0 8px, transparent 8px 20px)`,
        opacity: 0.14,
      }}
    />
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Typography variant="label" component="p" sx={{ color: bs.text.secondary }}>
      {children}
    </Typography>
  );
}

function Header({ locale, setLocale }: { locale: Locale; setLocale: (l: Locale) => void }) {
  const t = useT(messages);
  const links: [string, string][] = [...units.map((u) => [anchor[u], unitMeta[u].name] as [string, string]), ['vip', t.vip], ['faq', t.faq]];
  return (
    <SchemeScope scheme="dark">
      <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: bs.surface.canvas, color: bs.text.primary, borderBottom: `1px solid ${bs.border.subtle}` }}>
        <Box sx={{ maxWidth: layout.maxWidth.wide, mx: 'auto', px: { xs: `${layout.gutter.mobile}px`, sm: `${layout.gutter.tablet}px`, lg: `${layout.gutter.desktop}px` }, height: 64, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box component="a" href="#top" aria-label="Black Seat" sx={{ color: 'inherit', display: 'flex', alignItems: 'center', minHeight: 44, '&:focus-visible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 4 } }}>
            <Wordmark size="md" />
          </Box>
          <Box component="nav" aria-label={t.nav} sx={{ display: { xs: 'none', md: 'flex' }, gap: 6, ml: 6 }}>
            {links.map(([id, label]) => (
              <Box key={id} component="a" href={`#${id}`} sx={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, color: bs.text.secondary, textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem', transition: transition('color'), '&:hover': { color: bs.text.primary }, '&:focus-visible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 4, borderRadius: '4px' } }}>
                {label}
              </Box>
            ))}
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
            <LanguageSelect size="sm" value={locale} onChange={setLocale} />
            <Button size="sm" variant="secondary" href={APP} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              {t.book}
            </Button>
          </Box>
        </Box>
      </Box>
    </SchemeScope>
  );
}

function Hero() {
  const t = useT(messages);
  return (
    <SchemeScope scheme="dark">
      <Box component="section" aria-labelledby="h-hero" sx={{ backgroundColor: bs.surface.canvas, color: bs.text.primary }}>
        <Box sx={{ maxWidth: layout.maxWidth.wide, mx: 'auto', px: { xs: `${layout.gutter.mobile}px`, sm: `${layout.gutter.tablet}px`, lg: `${layout.gutter.desktop}px` }, pt: { xs: 12, md: 20 }, pb: { xs: 10, md: 16 }, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,7fr) minmax(0,5fr)' }, gap: { xs: 8, md: 12 }, alignItems: 'end' }}>
          <Typography id="h-hero" component="h1" sx={poster('clamp(4rem, 19vw, 6.5rem)', 'clamp(7rem, 11vw, 10.5rem)')}>
            {t.heroLines.map((l) => (
              <Box key={l} component="span" sx={{ display: 'block' }}>
                {l}
              </Box>
            ))}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: { md: 3 } }}>
            <Typography variant="label" component="p" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: bs.text.secondary }}>
              <PlaceOutlined aria-hidden sx={{ fontSize: 18 }} />
              {t.area}
            </Typography>
            <Typography sx={{ fontSize: { xs: '1.125rem', md: '1.25rem' }, lineHeight: 1.5, color: bs.text.secondary, maxWidth: 440 }}>{t.heroLead}</Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Button href={APP} endIcon={<ArrowForwardRounded />}>
                {t.heroCta}
              </Button>
              <Button variant="secondary" href="#servicios">
                {t.heroSecondary}
              </Button>
            </Box>
          </Box>
        </Box>
        <Stripes />
      </Box>
    </SchemeScope>
  );
}

/** Service index (metic-style rows): name, one line, "from" price, arrow to the unit section. */
function UnitIndex() {
  const t = useT(messages);
  const locale = useLocale();
  return (
    <Band id="servicios" aria-labelledby="h-index" sx={{ py: { xs: 12, md: 18 } }}>
      <Typography id="h-index" component="h2" sx={{ ...poster('3rem', '4.5rem'), mb: { xs: 6, md: 10 } }}>
        {t.indexTitle}
      </Typography>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, borderTop: `2px solid ${bs.text.primary}` }}>
        {units.map((u) => {
          const Icon = unitIcon[u];
          return (
            <Box component="li" key={u} sx={{ borderBottom: `1px solid ${bs.border.subtle}` }}>
              <ButtonBase
                component="a"
                href={`#${anchor[u]}`}
                sx={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: { xs: 'auto minmax(0,1fr) auto', md: 'auto minmax(0,4fr) minmax(0,5fr) auto auto' },
                  alignItems: 'center',
                  columnGap: { xs: 4, md: 8 },
                  rowGap: 1,
                  py: { xs: 5, md: 7 },
                  textAlign: 'left',
                  color: 'inherit',
                  transition: transition('background-color'),
                  '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover } },
                  '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: -2 },
                }}
              >
                <Icon aria-hidden sx={{ fontSize: { xs: 28, md: 36 } }} />
                <Typography component="span" sx={poster('2.25rem', '3.25rem')}>
                  {unitMeta[u].name}
                </Typography>
                <Typography component="span" sx={{ display: { xs: 'none', md: 'block' }, color: bs.text.secondary }}>
                  {unitMeta[u].summary[locale]}
                </Typography>
                <Box component="span" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'baseline', gap: 1.5 }}>
                  <Typography component="span" variant="caption" sx={{ color: bs.text.secondary }}>
                    {t.from}
                  </Typography>
                  <Price amount={fromPrice(u)} size="lg" />
                </Box>
                <ArrowForwardRounded aria-hidden />
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
    </Band>
  );
}

function UnitSection({ unit, dark }: { unit: BusinessUnit; dark: boolean }) {
  const t = useT(messages);
  const locale = useLocale();
  const name = unitMeta[unit].name;
  const Icon = unitIcon[unit];
  const pkgs = packagesFor(unit);
  const copy = unitCopy[unit];
  return (
    <Band dark={dark} id={anchor[unit]} aria-labelledby={`h-${unit}`}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,5fr) minmax(0,7fr)' }, gap: { xs: 10, md: 16 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Icon aria-hidden sx={{ fontSize: 40 }} />
          <Typography id={`h-${unit}`} component="h2" sx={poster('clamp(3.5rem, 17vw, 5rem)', '7rem')}>
            {name}
          </Typography>
          <Typography sx={{ fontSize: '1.125rem', lineHeight: 1.55, color: bs.text.secondary, maxWidth: 480 }}>{copy.description[locale]}</Typography>
          {copy.note && (
            <Typography variant="label" component="p" sx={{ borderLeft: `3px solid ${bs.brand.primary}`, pl: 3 }}>
              {copy.note[locale]}
            </Typography>
          )}
          <Box>
            <Eyebrow>{t.hours}</Eyebrow>
            <Box component="dl" sx={{ m: 0, mt: 2, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 6, rowGap: 1 }}>
              {unitHours[unit].map((h) => (
                <Box key={h.days.es} sx={{ display: 'contents' }}>
                  <Box component="dt" sx={{ color: bs.text.secondary }}>
                    {h.days[locale]}
                  </Box>
                  <Box component="dd" sx={{ m: 0, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                    {formatHoursRange(h.hours, locale, t.closed)}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Box>
            <Button href={`${APP}#/c/unit/${unit}`} endIcon={<ArrowForwardRounded />}>
              {t.bookUnit(name)}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {unit === 'towing' && (
            <Box>
              <Eyebrow>{t.towStepsTitle}</Eyebrow>
              <Box component="ol" sx={{ listStyle: 'none', m: 0, mt: 3, p: 0, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(3, minmax(0,1fr))' }, gap: 4 }}>
                {t.towSteps.map((s, i) => (
                  <Box component="li" key={s} sx={{ borderTop: `2px solid ${bs.text.primary}`, pt: 3 }}>
                    <Typography component="span" sx={{ ...poster('2rem', '2rem'), display: 'block', mb: 1 }}>
                      {i + 1}
                    </Typography>
                    <Typography variant="body2">{s}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          <Box>
            <Eyebrow>{t.packages}</Eyebrow>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 3, p: 0, borderTop: `2px solid ${bs.text.primary}` }}>
              {pkgs.map((p) => (
                <Box component="li" key={p.id} sx={{ py: 5, borderBottom: `1px solid ${bs.border.subtle}`, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', columnGap: 4, rowGap: 2 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h3" component="h3">
                      {p.name[locale]}
                    </Typography>
                    <Typography variant="body2" sx={{ color: bs.text.secondary, mt: 1 }}>
                      {p.tagline[locale]}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Price amount={p.price} size="lg" from={p.priceFrom} />
                    <Typography variant="caption" component="p" sx={{ color: bs.text.secondary, whiteSpace: 'nowrap' }}>
                      {formatDuration(p.durationMin)}
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ gridColumn: '1 / -1', listStyle: 'none', m: 0, p: 0, display: 'flex', flexWrap: 'wrap', columnGap: 5, rowGap: 1.5 }}>
                    {p.includes[locale].slice(0, 4).map((x) => (
                      <Box component="li" key={x} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: bs.text.secondary, fontSize: '0.875rem' }}>
                        <CheckRounded aria-hidden sx={{ fontSize: 16, color: bs.text.primary }} />
                        {x}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Band>
  );
}

function HowItWorks() {
  const t = useT(messages);
  return (
    <Band id="como" aria-labelledby="h-how">
      <Typography id="h-how" component="h2" sx={{ ...poster('3rem', '4.5rem'), mb: { xs: 8, md: 12 } }}>
        {t.howTitle}
      </Typography>
      <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(3, minmax(0,1fr))' }, gap: { xs: 8, md: 10 } }}>
        {t.how.map(([title, body], i) => (
          <Box component="li" key={title} sx={{ borderTop: `2px solid ${bs.text.primary}`, pt: 4 }}>
            <Typography component="h3" sx={{ ...poster('2.5rem', '3rem'), display: 'flex', gap: 3, alignItems: 'baseline' }}>
              <Box component="span" sx={{ color: bs.text.secondary }}>
                {i + 1}
              </Box>
              {title}
            </Typography>
            <Typography sx={{ mt: 3, color: bs.text.secondary, maxWidth: 360 }}>{body}</Typography>
          </Box>
        ))}
      </Box>
    </Band>
  );
}

const vipIcons = { priority: BoltOutlined, discount: LocalOfferOutlined, bins: DeleteOutlineRounded, reschedule: EventRepeatOutlined };

function Vip() {
  const t = useT(messages);
  const locale = useLocale();
  return (
    <Band dark id="vip" aria-labelledby="h-vip">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) minmax(0,1fr)' }, gap: { xs: 10, md: 16 }, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Eyebrow>{t.vipTitle}</Eyebrow>
          <Typography id="h-vip" component="h2" sx={poster('3.25rem', '5rem')}>
            {t.vipLead}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <Price amount={vipPlans.monthly} size="xl" />
            <Typography sx={{ color: bs.text.secondary }}>{t.perMonth}</Typography>
          </Box>
          <Box>
            <Button href={`${APP}#/c/vip`}>{t.vipCta}</Button>
          </Box>
        </Box>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, borderTop: `1px solid ${bs.border.subtle}` }}>
          {vipBenefits.map((b) => {
            const Icon = vipIcons[b.icon];
            return (
              <Box component="li" key={b.icon} sx={{ display: 'flex', gap: 4, py: 4, borderBottom: `1px solid ${bs.border.subtle}` }}>
                <Icon aria-hidden sx={{ mt: 0.25 }} />
                <Box>
                  <Typography variant="label" component="p">
                    {b.title[locale]}
                  </Typography>
                  <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                    {b.detail[locale]}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Band>
  );
}

function Area() {
  const t = useT(messages);
  const col = (title: string, items: string[], muted = false) => (
    <Box>
      <Eyebrow>{title}</Eyebrow>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 3, p: 0, borderTop: `2px solid ${muted ? bs.border.strong : bs.text.primary}` }}>
        {items.map((x) => (
          <Box component="li" key={x} sx={{ py: 3, borderBottom: `1px solid ${bs.border.subtle}`, color: muted ? bs.text.secondary : bs.text.primary, fontSize: '1.125rem', fontWeight: muted ? 400 : 600 }}>
            {x}
          </Box>
        ))}
      </Box>
    </Box>
  );
  return (
    <Band id="zona" aria-labelledby="h-area">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,4fr) minmax(0,4fr) minmax(0,4fr)' }, gap: { xs: 8, md: 10 }, alignItems: 'start' }}>
        <Typography id="h-area" component="h2" sx={poster('3rem', '4.5rem')}>
          {t.areaTitle}
        </Typography>
        {col(t.areaNow, t.areaNowList)}
        {col(t.areaNext, t.areaNextList, true)}
      </Box>
    </Band>
  );
}

function Faq() {
  const t = useT(messages);
  const [open, setOpen] = useState<number | false>(0);
  return (
    <Band dark id="faq" aria-labelledby="h-faq">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,4fr) minmax(0,8fr)' }, gap: { xs: 8, md: 12 } }}>
        <Typography id="h-faq" component="h2" sx={poster('3rem', '4.5rem')}>
          {t.faqTitle}
        </Typography>
        <Box>
          {t.faqs.map(([q, a], i) => (
            <Accordion key={q} expanded={open === i} onChange={(_, ex) => setOpen(ex ? i : false)} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls={`faq-${i}`} id={`faq-${i}-h`}>
                <Typography variant="h4" component="h3">
                  {q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails id={`faq-${i}`}>
                <Typography sx={{ color: bs.text.secondary }}>{a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Band>
  );
}

function Closing() {
  const t = useT(messages);
  return (
    <SchemeScope scheme="dark">
      <Box component="footer" sx={{ backgroundColor: bs.surface.inverse, color: bs.text.primary, overflow: 'hidden' }}>
        <Stripes />
        <Box sx={{ maxWidth: layout.maxWidth.wide, mx: 'auto', px: { xs: `${layout.gutter.mobile}px`, sm: `${layout.gutter.tablet}px`, lg: `${layout.gutter.desktop}px` }, pt: { xs: 12, md: 18 }, pb: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: { md: 'flex-end' }, justifyContent: 'space-between', pb: { xs: 12, md: 16 } }}>
            <Typography component="h2" sx={{ ...poster('3rem', '4.5rem'), maxWidth: 720 }}>
              {t.closeTitle}
            </Typography>
            <Button href={APP} endIcon={<ArrowForwardRounded />} sx={{ flexShrink: 0 }}>
              {t.closeCta}
            </Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr) minmax(0,1fr)', md: 'minmax(0,6fr) minmax(0,3fr) minmax(0,3fr)' }, gap: 8, borderTop: `1px solid ${bs.border.subtle}`, pt: 8 }}>
            <Typography sx={{ gridColumn: { xs: '1 / -1', md: 'auto' }, color: bs.text.secondary, maxWidth: 360 }}>{t.footerTag}</Typography>
            <Box component="nav" aria-label={t.footerServices}>
              <Eyebrow>{t.footerServices}</Eyebrow>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 2, p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {units.map((u) => (
                  <li key={u}>
                    <Box component="a" href={`#${anchor[u]}`} sx={{ color: bs.text.primary, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      {unitMeta[u].name}
                    </Box>
                  </li>
                ))}
              </Box>
            </Box>
            <Box component="nav" aria-label={t.footerCompany}>
              <Eyebrow>{t.footerCompany}</Eyebrow>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 2, p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[['#vip', 'VIP'], ['#faq', t.faq], ['#zona', t.areaTitle], [APP, t.footerApp]].map(([h, l]) => (
                  <li key={h}>
                    <Box component="a" href={h} sx={{ color: bs.text.primary, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
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

function Page({ locale, setLocale }: { locale: Locale; setLocale: (l: Locale) => void }) {
  const t = useT(messages);
  return (
    <Box id="top" sx={{ backgroundColor: bs.surface.canvas, color: bs.text.primary, minHeight: '100dvh' }}>
      <Box
        component="a"
        href="#main"
        sx={{ position: 'absolute', left: 8, top: -64, zIndex: 20, px: 4, py: 3, borderRadius: '8px', backgroundColor: bs.surface.raised, color: bs.text.primary, fontWeight: 600, '&:focus-visible': { top: 8 } }}
      >
        {t.skip}
      </Box>
      <Header locale={locale} setLocale={setLocale} />
      <Box component="main" id="main">
        <Hero />
        <UnitIndex />
        <UnitSection unit="detailing" dark />
        <UnitSection unit="towing" dark={false} />
        <UnitSection unit="personal-washing" dark />
        <HowItWorks />
        <Vip />
        <Area />
        <Faq />
      </Box>
      <Closing />
    </Box>
  );
}

export function Landing() {
  const [locale, setLocale] = useState<Locale>(() => (navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'));
  return (
    <AppProviders mode="light" locale={locale}>
      <Page locale={locale} setLocale={setLocale} />
    </AppProviders>
  );
}
