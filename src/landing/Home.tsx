import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import BoltOutlined from '@mui/icons-material/BoltOutlined';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import EventRepeatOutlined from '@mui/icons-material/EventRepeatOutlined';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import TranslateRounded from '@mui/icons-material/TranslateRounded';
import NotificationsActiveOutlined from '@mui/icons-material/NotificationsActiveOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Button } from '../components/actions/Button/Button';
import { Price } from '../components/data-display/Price/Price';
import { unitMeta } from '../domain/units';
import { useLocale, useT } from '../i18n/locale';
import { unitIcon } from '../icons/unitIcon';
import { fromPrice, vipBenefits, vipPlans } from '../prototype/data';
import { SchemeScope } from '../theme/SchemeScope';
import { bs } from '../theme/theme';
import { layout, transition } from '../theme/tokens';
import { unitContent } from './content';
import { APP, Band, Eyebrow, gutters, poster, PosterTitle, SiteFooter, SiteShell, Stripes, unitPage, units } from './shared';

const messages = {
  es: {
    heroLines: ['Detailing.', 'Towing.', 'Pressure', 'washing.'],
    heroLead: 'Black Seat cuida tu auto y tu casa en Carolina del Norte. Eliges el servicio, la fecha y pagas desde el teléfono: sin llamadas ni mensajes.',
    heroCta: 'Reservar ahora',
    heroSecondary: 'Ver servicios',
    area: 'Charlotte · Raleigh · NC',
    unitsTitle: 'Tres servicios, una marca',
    unitsLead: 'Cada unidad tiene su equipo y su forma de trabajar. Todas se reservan en el mismo lugar.',
    from: 'Desde',
    learn: (n: string) => `Conocer ${n}`,
    whyTitle: 'Por qué Black Seat',
    why: [
      ['Sin llamadas', 'Reservas, cambias o cancelas desde el teléfono. Nadie tiene que escribirte por WhatsApp.'],
      ['Precio antes de confirmar', 'Ves el total y el desglose antes de pagar. Lo que ves es lo que pagas.'],
      ['Sabes en qué va', 'Tu reserva muestra si está confirmada, quién va y si está pagada.'],
      ['Inglés y español', 'La app, los mensajes y el equipo hablan los dos idiomas.'],
    ],
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
      ['¿Puedo cambiar la hora?', 'Sí. Puedes reprogramar sin costo hasta 24 horas antes. Los miembros VIP, hasta 2 horas antes.'],
      ['¿Qué pasa si el día está lleno?', 'Puedes elegir otro día. Los miembros VIP pueden reservar también los días llenos.'],
      ['¿Atienden en inglés?', 'Sí. Todo está en inglés y en español.'],
    ],
    closeTitle: 'Tu próxima cita está a tres toques',
    closeCta: 'Reservar ahora',
  },
  en: {
    heroLines: ['Detailing.', 'Towing.', 'Pressure', 'washing.'],
    heroLead: 'Black Seat takes care of your car and your home in North Carolina. Pick the service, the date and pay from your phone: no calls, no texts.',
    heroCta: 'Book now',
    heroSecondary: 'See services',
    area: 'Charlotte · Raleigh · NC',
    unitsTitle: 'Three services, one brand',
    unitsLead: 'Each unit has its own crew and way of working. All of them are booked in the same place.',
    from: 'From',
    learn: (n: string) => `Explore ${n}`,
    whyTitle: 'Why Black Seat',
    why: [
      ['No calls', 'Book, change or cancel from your phone. Nobody needs to text you on WhatsApp.'],
      ['Price before you confirm', 'See the total and the breakdown before paying. What you see is what you pay.'],
      ['Know where it stands', 'Your booking shows whether it is confirmed, who is coming and whether it is paid.'],
      ['English and Spanish', 'The app, the messages and the crew speak both languages.'],
    ],
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
      ['Can I change the time?', 'Yes. You can reschedule for free up to 24 hours before. VIP members, up to 2 hours before.'],
      ['What if the day is full?', 'You can pick another day. VIP members can also book full days.'],
      ['Do you speak English?', 'Yes. Everything is available in English and Spanish.'],
    ],
    closeTitle: 'Your next appointment is three taps away',
    closeCta: 'Book now',
  },
};

const whyIcons = [EventAvailableOutlined, ReceiptLongOutlined, NotificationsActiveOutlined, TranslateRounded];
const vipIcons = { priority: BoltOutlined, discount: LocalOfferOutlined, bins: DeleteOutlineRounded, reschedule: EventRepeatOutlined };

function Hero() {
  const t = useT(messages);
  return (
    <SchemeScope scheme="dark">
      <Box component="section" aria-labelledby="h-hero" sx={{ backgroundColor: bs.surface.canvas, color: bs.text.primary }}>
        <Box sx={{ maxWidth: layout.maxWidth.wide, mx: 'auto', px: gutters, pt: { xs: 12, md: 20 }, pb: { xs: 10, md: 16 }, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,7fr) minmax(0,5fr)' }, gap: { xs: 8, md: 12 }, alignItems: 'end' }}>
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

/** The three units as doors to their own landing (metic-style rows, bigger, with promise and price). */
function Units() {
  const t = useT(messages);
  const locale = useLocale();
  return (
    <Band id="servicios" aria-labelledby="h-units">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,7fr) minmax(0,5fr)' }, gap: { xs: 4, md: 12 }, alignItems: 'end', mb: { xs: 8, md: 12 } }}>
        <PosterTitle id="h-units">{t.unitsTitle}</PosterTitle>
        <Typography sx={{ color: bs.text.secondary, fontSize: '1.125rem', maxWidth: 440 }}>{t.unitsLead}</Typography>
      </Box>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, borderTop: `2px solid ${bs.text.primary}` }}>
        {units.map((u) => {
          const Icon = unitIcon[u];
          return (
            <Box component="li" key={u} sx={{ borderBottom: `1px solid ${bs.border.subtle}` }}>
              <ButtonBase
                component="a"
                href={unitPage[u]}
                aria-label={t.learn(unitMeta[u].name)}
                sx={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: { xs: 'auto minmax(0,1fr) auto', md: 'auto minmax(0,5fr) minmax(0,4fr) auto auto' },
                  gridTemplateAreas: { xs: '"icon name arrow" ". promise promise" ". price price"', md: '"icon name promise price arrow"' },
                  alignItems: 'center',
                  columnGap: { xs: 4, md: 8 },
                  rowGap: 2,
                  py: { xs: 6, md: 9 },
                  textAlign: 'left',
                  color: 'inherit',
                  transition: transition('background-color'),
                  '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover }, '&:hover .arrow': { transform: 'translateX(4px)' } },
                  '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: -2 },
                }}
              >
                <Icon aria-hidden sx={{ gridArea: 'icon', fontSize: { xs: 28, md: 40 } }} />
                <Typography component="span" sx={{ gridArea: 'name', ...poster('2.5rem', '4rem') }}>
                  {unitMeta[u].name}
                </Typography>
                <Box component="span" sx={{ gridArea: 'promise', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography component="span" variant="h4">
                    {unitContent[u].promise[locale]}
                  </Typography>
                  <Typography component="span" variant="body2" sx={{ color: bs.text.secondary }}>
                    {unitMeta[u].summary[locale]}
                  </Typography>
                </Box>
                <Box component="span" sx={{ gridArea: 'price', display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                  <Typography component="span" variant="caption" sx={{ color: bs.text.secondary }}>
                    {t.from}
                  </Typography>
                  <Price amount={fromPrice(u)} size="lg" />
                </Box>
                <ArrowForwardRounded className="arrow" aria-hidden sx={{ gridArea: 'arrow', transition: transition('transform') }} />
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
    </Band>
  );
}

/** Framer-style reasons on black: icon, bold title, one paragraph. */
function Why() {
  const t = useT(messages);
  return (
    <Band dark aria-labelledby="h-why">
      <PosterTitle id="h-why" sx={{ mb: { xs: 8, md: 12 } }}>
        {t.whyTitle}
      </PosterTitle>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' }, gap: { xs: 8, md: 10 } }}>
        {t.why.map(([title, body], i) => {
          const Icon = whyIcons[i];
          return (
            <Box component="li" key={title} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Icon aria-hidden />
              <Typography variant="h4" component="h3">
                {title}
              </Typography>
              <Typography sx={{ color: bs.text.secondary }}>{body}</Typography>
            </Box>
          );
        })}
      </Box>
    </Band>
  );
}

function HowItWorks() {
  const t = useT(messages);
  return (
    <Band id="como" aria-labelledby="h-how">
      <PosterTitle id="h-how" sx={{ mb: { xs: 8, md: 12 } }}>
        {t.howTitle}
      </PosterTitle>
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

function Vip() {
  const t = useT(messages);
  const locale = useLocale();
  return (
    <Band dark id="vip" aria-labelledby="h-vip">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) minmax(0,1fr)' }, gap: { xs: 10, md: 16 }, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Eyebrow>{t.vipTitle}</Eyebrow>
          <PosterTitle id="h-vip" size={['3.25rem', '5rem']}>
            {t.vipLead}
          </PosterTitle>
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
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(3, minmax(0,1fr))' }, gap: { xs: 8, md: 10 }, alignItems: 'start' }}>
        <PosterTitle id="h-area">{t.areaTitle}</PosterTitle>
        {col(t.areaNow, t.areaNowList)}
        {col(t.areaNext, t.areaNextList, true)}
      </Box>
    </Band>
  );
}

export function Faq({ title, items }: { title: string; items: [string, string][] }) {
  const [open, setOpen] = useState<number | false>(0);
  return (
    <Band dark id="faq" aria-labelledby="h-faq">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,4fr) minmax(0,8fr)' }, gap: { xs: 8, md: 12 } }}>
        <PosterTitle id="h-faq">{title}</PosterTitle>
        <Box>
          {items.map(([q, a], i) => (
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

function HomeContent() {
  const t = useT(messages);
  return (
    <>
      <Box component="main" id="main">
        <Hero />
        <Units />
        <Why />
        <HowItWorks />
        <Vip />
        <Area />
        <Faq title={t.faqTitle} items={t.faqs as [string, string][]} />
      </Box>
      <SiteFooter title={t.closeTitle} cta={t.closeCta} ctaHref={APP} />
    </>
  );
}

export function HomePage() {
  return (
    <SiteShell page="home">
      <HomeContent />
    </SiteShell>
  );
}
