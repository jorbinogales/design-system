import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { formatDuration, formatHoursRange } from '../blackseat/shared/format';
import { Button } from '../components/actions/Button/Button';
import { formatAddress } from '../components/address/LocationCard/LocationCard';
import { Price } from '../components/data-display/Price/Price';
import { Tag } from '../components/data-display/Tag/Tag';
import { unitMeta, type BusinessUnit } from '../domain/units';
import { useLocale, useT } from '../i18n/locale';
import { unitIcon } from '../icons/unitIcon';
import { center, fromPrice, packagesFor, unitCopy, unitHours, yards } from '../prototype/data';
import { SchemeScope } from '../theme/SchemeScope';
import { bs } from '../theme/theme';
import { layout, radius, transition } from '../theme/tokens';
import { unitContent } from './content';
import { Faq } from './Home';
import { APP, Band, Eyebrow, gutters, HOME, poster, PosterTitle, SiteFooter, SiteShell, Stripes, unitPage, units } from './shared';

const messages = {
  es: {
    home: 'Black Seat',
    back: 'Todos los servicios',
    from: 'Desde',
    seePackages: 'Ver paquetes',
    packagesTitle: 'Paquetes',
    packagesLead: 'Precio de referencia. El total exacto lo ves antes de confirmar.',
    popular: 'Más elegido',
    includes: 'Incluye',
    notIncluded: 'No incluye',
    choose: 'Elegir este',
    stepsTitle: 'Cómo funciona',
    detailsTitle: 'Horario y lugar',
    hours: 'Horario',
    closed: 'Cerrado',
    where: 'Dónde',
    yards: 'Patios donde recogemos',
    whereWash: 'Charlotte, Raleigh y alrededores, en tu casa.',
    faqTitle: 'Preguntas',
    otherTitle: 'También en Black Seat',
    explore: (n: string) => `Conocer ${n}`,
    closeTitle: (n: string) => `Reserva ${n} en menos de un minuto`,
  },
  en: {
    home: 'Black Seat',
    back: 'All services',
    from: 'From',
    seePackages: 'See packages',
    packagesTitle: 'Packages',
    packagesLead: 'Reference price. You see the exact total before you confirm.',
    popular: 'Most chosen',
    includes: 'Includes',
    notIncluded: 'Not included',
    choose: 'Choose this',
    stepsTitle: 'How it works',
    detailsTitle: 'Hours and place',
    hours: 'Hours',
    closed: 'Closed',
    where: 'Where',
    yards: 'Yards we pick up from',
    whereWash: 'Charlotte, Raleigh and around, at your home.',
    faqTitle: 'Questions',
    otherTitle: 'Also at Black Seat',
    explore: (n: string) => `Explore ${n}`,
    closeTitle: (n: string) => `Book ${n} in under a minute`,
  },
};

function Hero({ unit }: { unit: BusinessUnit }) {
  const t = useT(messages);
  const locale = useLocale();
  const c = unitContent[unit];
  const Icon = unitIcon[unit];
  return (
    <SchemeScope scheme="dark">
      <Box component="section" aria-labelledby="h-hero" sx={{ backgroundColor: bs.surface.canvas, color: bs.text.primary }}>
        <Box sx={{ maxWidth: layout.maxWidth.wide, mx: 'auto', px: gutters, pt: { xs: 8, md: 12 }, pb: { xs: 10, md: 14 } }}>
          <Box component="a" href={`${HOME}#servicios`} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, minHeight: 44, color: bs.text.secondary, textDecoration: 'none', fontWeight: 600, '&:hover': { color: bs.text.primary }, '&:focus-visible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 4, borderRadius: '4px' } }}>
            <ArrowBackRounded aria-hidden sx={{ fontSize: 18 }} />
            {t.back}
          </Box>
          <Box sx={{ mt: { xs: 6, md: 10 }, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,7fr) minmax(0,5fr)' }, gap: { xs: 8, md: 12 }, alignItems: 'end' }}>
            <Box>
              <Icon aria-hidden sx={{ fontSize: { xs: 40, md: 56 }, mb: 3 }} />
              <Typography id="h-hero" component="h1" sx={poster('clamp(4rem, 18vw, 6rem)', 'clamp(7rem, 11vw, 10rem)')}>
                {unitMeta[unit].name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, pb: { md: 3 } }}>
              <Typography component="p" sx={poster('2rem', '2.5rem')}>
                {c.promise[locale]}
              </Typography>
              <Typography sx={{ fontSize: { xs: '1.0625rem', md: '1.125rem' }, lineHeight: 1.55, color: bs.text.secondary, maxWidth: 460 }}>{unitCopy[unit].description[locale]}</Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button href={`${APP}#/c/unit/${unit}`} endIcon={<ArrowForwardRounded />}>
                  {c.bookLabel[locale]}
                </Button>
                <Button variant="secondary" href="#paquetes">
                  {t.seePackages}
                </Button>
              </Box>
            </Box>
          </Box>
          <Box component="dl" sx={{ m: 0, mt: { xs: 10, md: 14 }, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr) minmax(0,1fr)', md: 'repeat(4, minmax(0,1fr))' }, borderTop: `1px solid ${bs.border.subtle}` }}>
            <Box sx={{ pt: 4, pr: 4, pb: { xs: 4, md: 0 } }}>
              <Box component="dt" sx={{ color: bs.text.secondary, fontSize: '0.875rem' }}>
                {t.from}
              </Box>
              <Box component="dd" sx={{ m: 0, mt: 1 }}>
                <Price amount={fromPrice(unit)} size="lg" />
              </Box>
            </Box>
            {c.facts.map((f) => (
              <Box key={f.label.es} sx={{ pt: 4, pr: 4, pb: { xs: 4, md: 0 } }}>
                <Box component="dt" sx={{ color: bs.text.secondary, fontSize: '0.875rem' }}>
                  {f.label[locale]}
                </Box>
                <Box component="dd" sx={{ m: 0, mt: 1, fontWeight: 650, fontSize: '1.0625rem' }}>
                  {f.value[locale]}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Stripes />
      </Box>
    </SchemeScope>
  );
}

/** OpenTable-style plan columns: name, line, price, includes / not included, one action each. */
function Packages({ unit }: { unit: BusinessUnit }) {
  const t = useT(messages);
  const locale = useLocale();
  const pkgs = packagesFor(unit);
  return (
    <Band id="paquetes" aria-labelledby="h-pkg">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,7fr) minmax(0,5fr)' }, gap: { xs: 3, md: 12 }, alignItems: 'end', mb: { xs: 8, md: 12 } }}>
        <PosterTitle id="h-pkg">{t.packagesTitle}</PosterTitle>
        <Typography sx={{ color: bs.text.secondary, maxWidth: 420 }}>{t.packagesLead}</Typography>
      </Box>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: `repeat(${pkgs.length}, minmax(0,1fr))` }, gap: { xs: 4, md: 5 } }}>
        {pkgs.map((p) => (
          <Box
            component="li"
            key={p.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              p: { xs: 5, md: 6 },
              borderRadius: `${radius.lg}px`,
              border: `${p.popular ? 2 : 1}px solid ${p.popular ? bs.text.primary : bs.border.subtle}`,
              backgroundColor: bs.surface.raised,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3, minHeight: 28 }}>
                <Typography variant="h3" component="h3">
                  {p.name[locale]}
                </Typography>
                {p.popular && <Tag tone="inverse" size="sm" label={t.popular} />}
              </Box>
              <Typography variant="body2" sx={{ color: bs.text.secondary, minHeight: { md: 44 } }}>
                {p.tagline[locale]}
              </Typography>
            </Box>
            <Box>
              <Price amount={p.price} size="xl" from={p.priceFrom} />
              <Typography variant="caption" component="p" sx={{ color: bs.text.secondary, mt: 0.5 }}>
                {formatDuration(p.durationMin)}
              </Typography>
            </Box>
            <Box sx={{ borderTop: `1px solid ${bs.border.subtle}`, pt: 4, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <Box component="ul" aria-label={t.includes} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {p.includes[locale].map((x) => (
                  <Box component="li" key={x} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <CheckRounded aria-hidden sx={{ fontSize: 18, mt: 0.25 }} />
                    <Typography variant="body2">{x}</Typography>
                  </Box>
                ))}
              </Box>
              {p.notIncluded && (
                <Box component="ul" aria-label={t.notIncluded} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {p.notIncluded[locale].map((x) => (
                    <Box component="li" key={x} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', color: bs.text.secondary }}>
                      <CloseRounded aria-hidden sx={{ fontSize: 18, mt: 0.25 }} />
                      <Typography variant="body2">{x}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Button variant="secondary" fullWidth href={`${APP}#/c/unit/${unit}`} aria-label={`${t.choose}: ${p.name[locale]}`}>
              {t.choose}
            </Button>
          </Box>
        ))}
      </Box>
    </Band>
  );
}

function Steps({ unit }: { unit: BusinessUnit }) {
  const t = useT(messages);
  const locale = useLocale();
  const steps = unitContent[unit].steps;
  return (
    <Band dark aria-labelledby="h-steps">
      <PosterTitle id="h-steps" sx={{ mb: { xs: 8, md: 12 } }}>
        {t.stepsTitle}
      </PosterTitle>
      <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))', lg: `repeat(${steps.length}, minmax(0,1fr))` }, gap: { xs: 8, md: 8 } }}>
        {steps.map((s, i) => (
          <Box component="li" key={s.title.es} sx={{ borderTop: `2px solid ${bs.text.primary}`, pt: 4 }}>
            <Typography component="h3" sx={{ ...poster('2.25rem', '2.75rem'), display: 'flex', gap: 3, alignItems: 'baseline' }}>
              <Box component="span" sx={{ color: bs.text.secondary }}>
                {i + 1}
              </Box>
              {s.title[locale]}
            </Typography>
            <Typography sx={{ mt: 3, color: bs.text.secondary }}>{s.body[locale]}</Typography>
          </Box>
        ))}
      </Box>
    </Band>
  );
}

function Details({ unit }: { unit: BusinessUnit }) {
  const t = useT(messages);
  const locale = useLocale();
  const note = unitCopy[unit].note;
  return (
    <Band aria-labelledby="h-details">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(3, minmax(0,1fr))' }, gap: { xs: 8, md: 10 }, alignItems: 'start' }}>
        <PosterTitle id="h-details">{t.detailsTitle}</PosterTitle>
        <Box>
          <Eyebrow>{t.hours}</Eyebrow>
          <Box component="dl" sx={{ m: 0, mt: 3, borderTop: `2px solid ${bs.text.primary}` }}>
            {unitHours[unit].map((h) => (
              <Box key={h.days.es} sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, py: 3, borderBottom: `1px solid ${bs.border.subtle}` }}>
                <Box component="dt" sx={{ color: bs.text.secondary }}>
                  {h.days[locale]}
                </Box>
                <Box component="dd" sx={{ m: 0, fontWeight: 650, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                  {formatHoursRange(h.hours, locale, t.closed)}
                </Box>
              </Box>
            ))}
          </Box>
          {note && (
            <Typography variant="label" component="p" sx={{ mt: 4, borderLeft: `3px solid ${bs.brand.primary}`, pl: 3 }}>
              {note[locale]}
            </Typography>
          )}
        </Box>
        <Box>
          <Eyebrow>{unit === 'towing' ? t.yards : t.where}</Eyebrow>
          <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 3, p: 0, borderTop: `2px solid ${bs.text.primary}` }}>
            {unit === 'towing' ? (
              yards.map((y) => (
                <Box component="li" key={y.id} sx={{ py: 3, borderBottom: `1px solid ${bs.border.subtle}` }}>
                  <Typography variant="label" component="p">
                    {y.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                    {formatAddress(y.address)}
                  </Typography>
                </Box>
              ))
            ) : unit === 'detailing' ? (
              <Box component="li" sx={{ py: 3, borderBottom: `1px solid ${bs.border.subtle}` }}>
                <Typography variant="label" component="p">
                  {center.name}
                </Typography>
                <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                  {formatAddress(center.address)}
                </Typography>
              </Box>
            ) : (
              <Box component="li" sx={{ py: 3, borderBottom: `1px solid ${bs.border.subtle}` }}>
                <Typography variant="body2">{t.whereWash}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Band>
  );
}

/** Webflow add-ons style cross-sell: the other two units. */
function OtherUnits({ unit }: { unit: BusinessUnit }) {
  const t = useT(messages);
  const locale = useLocale();
  const others = units.filter((u) => u !== unit);
  return (
    <Band aria-labelledby="h-other">
      <PosterTitle id="h-other" sx={{ mb: { xs: 8, md: 10 } }}>
        {t.otherTitle}
      </PosterTitle>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(2, minmax(0,1fr))' }, gap: { xs: 4, md: 5 } }}>
        {others.map((u) => {
          const Icon = unitIcon[u];
          return (
            <Box component="li" key={u}>
              <Box
                component="a"
                href={unitPage[u]}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  height: '100%',
                  p: { xs: 5, md: 7 },
                  borderRadius: `${radius.lg}px`,
                  border: `1px solid ${bs.border.subtle}`,
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: transition('border-color', 'background-color'),
                  '@media (hover: hover)': { '&:hover': { borderColor: bs.text.primary }, '&:hover .arrow': { transform: 'translateX(4px)' } },
                  '&:focus-visible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 },
                }}
              >
                <Icon aria-hidden sx={{ fontSize: 32 }} />
                <Typography component="h3" sx={poster('2.5rem', '3.25rem')}>
                  {unitMeta[u].name}
                </Typography>
                <Typography sx={{ color: bs.text.secondary }}>{unitContent[u].promise[locale]} {unitMeta[u].summary[locale]}</Typography>
                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                    <Typography component="span" variant="caption" sx={{ color: bs.text.secondary }}>
                      {t.from}
                    </Typography>
                    <Price amount={fromPrice(u)} size="lg" />
                  </Box>
                  <Typography component="span" variant="label" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    {t.explore(unitMeta[u].name)}
                    <ArrowForwardRounded className="arrow" aria-hidden sx={{ fontSize: 18, transition: transition('transform') }} />
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Band>
  );
}

function UnitContent({ unit }: { unit: BusinessUnit }) {
  const t = useT(messages);
  const locale = useLocale();
  const c = unitContent[unit];
  return (
    <>
      <Box component="main" id="main">
        <Hero unit={unit} />
        <Packages unit={unit} />
        <Steps unit={unit} />
        <Details unit={unit} />
        <Faq title={t.faqTitle} items={c.faqs.map((f) => [f.q[locale], f.a[locale]] as [string, string])} />
        <OtherUnits unit={unit} />
      </Box>
      <SiteFooter title={t.closeTitle(unitMeta[unit].name)} cta={c.bookLabel[locale]} ctaHref={`${APP}#/c/unit/${unit}`} />
    </>
  );
}

export function UnitPage({ unit }: { unit: BusinessUnit }) {
  return (
    <SiteShell page={unit}>
      <UnitContent unit={unit} />
    </SiteShell>
  );
}
