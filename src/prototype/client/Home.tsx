import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import PlaceRounded from '@mui/icons-material/PlaceRounded';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import WorkspacePremiumRounded from '@mui/icons-material/WorkspacePremiumRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BusinessUnitCard } from '../../blacksix/BusinessUnitCard/BusinessUnitCard';
import { NextAppointmentCard } from '../../blacksix/NextAppointmentCard/NextAppointmentCard';
import { Button } from '../../components/actions/Button/Button';
import { IconButton } from '../../components/actions/IconButton/IconButton';
import { Price } from '../../components/data-display/Price/Price';
import { SectionHeader } from '../../components/layout/SectionHeader/SectionHeader';
import { TopBar } from '../../components/navigation/TopBar/TopBar';
import { businessUnits } from '../../domain/units';
import { useT } from '../../i18n/locale';
import { InverseSurface, SchemeScope } from '../../theme/SchemeScope';
import { bs } from '../../theme/theme';
import { layout, radius } from '../../theme/tokens';
import { fromPrice, me, TODAY_ISO, vipPlans } from '../data';
import { useProto } from '../store';
import { ClientNav } from './ClientNav';
import { ScreenRoot } from './shared';

const messages = {
  es: {
    hello: (n: string) => `Hola, ${n}`,
    where: 'Charlotte, NC',
    notifications: 'Notificaciones, 1 sin leer',
    headline: '¿Qué hacemos hoy por ti?',
    next: 'Tu próxima cita',
    seeAll: 'Ver todas',
    services: 'Nuestros servicios',
    servicesHint: 'Elige uno para ver precios, horarios y reservar.',
    vipTitle: 'Black Six VIP',
    vipBody: 'Prioridad cuando la agenda está llena y 10 % en todos los servicios.',
    vipCta: 'Ver beneficios',
    vipActive: 'Eres VIP',
    vipActiveBody: 'Tienes prioridad en días llenos y 10 % en cada reserva.',
    perMonth: 'al mes',
  },
  en: {
    hello: (n: string) => `Hi, ${n}`,
    where: 'Charlotte, NC',
    notifications: 'Notifications, 1 unread',
    headline: 'What can we take care of today?',
    next: 'Your next appointment',
    seeAll: 'See all',
    services: 'Our services',
    servicesHint: 'Pick one to see prices, hours and book.',
    vipTitle: 'Black Six VIP',
    vipBody: 'Priority when the schedule is full and 10% off every service.',
    vipCta: 'See benefits',
    vipActive: "You're VIP",
    vipActiveBody: 'You get priority on full days and 10% off every booking.',
    perMonth: 'per month',
  },
};

/** Inicio: black header with greeting, next appointment, the three units as full-width doors and the VIP card. */
export function HomeScreen() {
  const t = useT(messages);
  const { go, startBooking, bookings, isVip } = useProto();
  const gutter = `${layout.gutter.mobile}px`;
  const next = bookings
    .filter((b) => b.customerId === me.id && b.date >= TODAY_ISO && (b.status === 'confirmed' || b.status === 'pending_confirmation'))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0];

  return (
    <ScreenRoot>
      <TopBar
        tone="inverse"
        leading={
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" component="p" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: bs.text.secondary }}>
              <PlaceRounded aria-hidden sx={{ fontSize: 16, color: bs.brand.primary }} />
              {t.where}
            </Typography>
            <Typography variant="h3" component="p">
              {t.hello(me.name.split(' ')[0])}
            </Typography>
          </Box>
        }
        actions={<IconButton label={t.notifications} icon={<NotificationsNoneRounded />} variant="filled" badge />}
      >
        <SchemeScope scheme="dark">
          <Typography variant="display" component="h1" sx={{ pt: 1, pb: 1, color: bs.text.primary, fontSize: '2.25rem', '@media (min-width:900px)': { fontSize: '2.25rem' } }}>
            {t.headline}
          </Typography>
        </SchemeScope>
      </TopBar>

      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, pt: 6, pb: 8, px: gutter }}>
        {next && (
          <Box component="section" aria-labelledby="h-next" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SectionHeader id="h-next" title={t.next} actionLabel={t.seeAll} onAction={() => go({ name: 'bookings' })} />
            <NextAppointmentCard booking={next} onView={(id) => go({ name: 'booking', id })} />
          </Box>
        )}

        <Box component="section" aria-labelledby="h-units" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SectionHeader id="h-units" title={t.services} description={t.servicesHint} />
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {businessUnits.map((u) => (
              <Box component="li" key={u}>
                <BusinessUnitCard
                  unit={u}
                  fromPrice={fromPrice(u)}
                  onSelect={() => {
                    startBooking(u);
                    go({ name: 'unit', unit: u });
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        <InverseSurface component="section" aria-labelledby="h-vip" sx={{ borderRadius: `${radius.lg}px`, p: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isVip ? <WorkspacePremiumRounded aria-hidden sx={{ color: bs.brand.primary }} /> : <WorkspacePremiumOutlined aria-hidden sx={{ color: bs.brand.primary }} />}
            <Typography variant="h3" component="h2" id="h-vip">
              {isVip ? t.vipActive : t.vipTitle}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {isVip ? t.vipActiveBody : t.vipBody}
          </Typography>
          {!isVip && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Price amount={vipPlans.monthly} size="lg" />
                <Typography variant="caption" sx={{ color: bs.text.secondary }}>
                  {t.perMonth}
                </Typography>
              </Box>
              <Button variant="secondary" size="md" onClick={() => go({ name: 'vip' })}>
                {t.vipCta}
              </Button>
            </Box>
          )}
        </InverseSurface>
      </Box>
      <ClientNav value="home" />
    </ScreenRoot>
  );
}
