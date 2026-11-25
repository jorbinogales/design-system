import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, type ReactNode } from 'react';
import { Wordmark } from '../brand/Wordmark';
import { MapStreetNamesContext } from '../components/address/MapCanvas/MapCanvas';
import { ToastProvider } from '../components/feedback/Toast/Toast';
import { ListGroup, ListRow } from '../components/layout/ListRow/ListRow';
import { SegmentedControl } from '../components/navigation/SegmentedControl/SegmentedControl';
import { AppearanceSelect } from '../components/preferences/AppearanceSelect/AppearanceSelect';
import { LanguageSelect } from '../components/preferences/LanguageSelect/LanguageSelect';
import { unitMeta } from '../domain/units';
import { useT } from '../i18n/locale';
import { DeviceFrame } from '../storybook/DeviceFrame';
import { AppProviders } from '../theme/AppProviders';
import { bs } from '../theme/theme';
import { layout } from '../theme/tokens';
import { AddressScreen } from './client/Address';
import { BookingDetailScreen, BookingsScreen, ConfirmedScreen } from './client/Bookings';
import { CheckoutScreen } from './client/Checkout';
import { HomeScreen } from './client/Home';
import { ScheduleScreen } from './client/Schedule';
import { TowingScreen } from './client/Towing';
import { UnitScreen } from './client/Unit';
import { AccountScreen, VipScreen } from './client/Vip';
import { OperatorToday } from './operator/Today';
import { PrototypeProvider, toHash, useProto, type ClientRoute } from './store';

const BAR = 56;
const ncStreets = ['Selwyn Ave', 'N Tryon St', 'Providence Rd', 'Central Ave', 'Graham St', 'Park Rd', 'Queens Rd', 'South Blvd'];

const messages = {
  es: {
    preview: 'Preview del MVP',
    view: 'Vista',
    client: 'Cliente',
    operator: 'Operador',
    tour: 'Recorrido sugerido',
    tourHint: 'Datos de ejemplo en Charlotte y Raleigh, NC. Nada se cobra ni se envía.',
    home: 'Inicio',
    vip: 'Black Six VIP',
    bookings: 'Mis reservas',
    opHint: 'Vista de Elio y Jesús en la computadora: los trabajos de hoy y su asignación.',
    flowDet: 'Paquete → fecha y hora → pago',
    flowTow: 'Subasta → entrega → pago',
    flowWash: 'Servicio → fecha → dirección → pago',
  },
  en: {
    preview: 'MVP preview',
    view: 'View',
    client: 'Customer',
    operator: 'Operator',
    tour: 'Suggested tour',
    tourHint: 'Sample data in Charlotte and Raleigh, NC. Nothing is charged or sent.',
    home: 'Home',
    vip: 'Black Six VIP',
    bookings: 'My bookings',
    opHint: "Elio and Jesús's desktop view: today's jobs and who's on them.",
    flowDet: 'Package → date and time → payment',
    flowTow: 'Auction → delivery → payment',
    flowWash: 'Service → date → address → payment',
  },
};

function ClientRouter() {
  const { route } = useProto();
  switch (route.name) {
    case 'unit':
      return <UnitScreen unit={route.unit} />;
    case 'schedule':
      return <ScheduleScreen />;
    case 'towing':
      return <TowingScreen />;
    case 'address':
      return <AddressScreen />;
    case 'checkout':
      return <CheckoutScreen />;
    case 'confirmed':
      return <ConfirmedScreen id={route.id} />;
    case 'bookings':
      return <BookingsScreen />;
    case 'booking':
      return <BookingDetailScreen id={route.id} />;
    case 'vip':
      return <VipScreen />;
    case 'account':
      return <AccountScreen />;
    default:
      return <HomeScreen />;
  }
}

/** Preview chrome: brand, Cliente/Operador, language and appearance. Not part of the product. */
function PreviewBar() {
  const t = useT(messages);
  const { surface, setSurface, locale, setLocale, appearance, setAppearance } = useProto();
  const narrow = useMediaQuery('(max-width:599.95px)');
  const roomy = useMediaQuery('(min-width:960px)');
  return (
    <Box
      component="header"
      sx={{
        height: BAR,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        px: { xs: 3, sm: 5 },
        borderBottom: `1px solid ${bs.border.subtle}`,
        backgroundColor: bs.surface.raised,
        position: 'relative',
        zIndex: 2,
      }}
    >
      {!narrow && <Wordmark size="sm" />}
      {!narrow && (
        <Typography variant="caption" sx={{ color: bs.text.secondary, whiteSpace: 'nowrap' }}>
          {t.preview}
        </Typography>
      )}
      <Box sx={{ flex: narrow ? 1 : '0 0 auto', ml: narrow ? 0 : 'auto', minWidth: 0 }}>
        <SegmentedControl
          size="sm"
          fullWidth={narrow}
          label={t.view}
          value={surface}
          onChange={setSurface}
          options={[
            { value: 'c', label: t.client },
            { value: 'o', label: t.operator },
          ]}
        />
      </Box>
      <LanguageSelect size="sm" value={locale} onChange={setLocale} />
      {roomy && <AppearanceSelect size="sm" value={appearance} onChange={setAppearance} />}
    </Box>
  );
}

/** Desktop side column with the quick tour (hidden under 960 px). */
function Tour() {
  const t = useT(messages);
  const { go, startBooking } = useProto();
  const open = (r: ClientRoute) => {
    if (r.name === 'unit') startBooking(r.unit);
    go(r);
  };
  return (
    <Box component="aside" aria-labelledby="h-tour" sx={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4, pt: 8 }}>
      <Typography variant="h3" component="h2" id="h-tour">
        {t.tour}
      </Typography>
      <Typography variant="body2" sx={{ color: bs.text.secondary }}>
        {t.tourHint}
      </Typography>
      <ListGroup>
        <ListRow title={t.home} onClick={() => open({ name: 'home' })} inset="none" />
        <ListRow title={unitMeta.detailing.name} description={t.flowDet} onClick={() => open({ name: 'unit', unit: 'detailing' })} inset="none" />
        <ListRow title={unitMeta.towing.name} description={t.flowTow} onClick={() => open({ name: 'unit', unit: 'towing' })} inset="none" />
        <ListRow title={unitMeta['personal-washing'].name} description={t.flowWash} onClick={() => open({ name: 'unit', unit: 'personal-washing' })} inset="none" />
        <ListRow title={t.vip} onClick={() => open({ name: 'vip' })} inset="none" />
        <ListRow title={t.bookings} onClick={() => open({ name: 'bookings' })} inset="none" divider={false} />
      </ListGroup>
    </Box>
  );
}

/** Scroll container for phones: full-bleed, real safe areas, same structure as DeviceFrame. */
function PhoneBleed({ children }: { children: ReactNode }) {
  return (
    <Box
      data-device-screen
      sx={{
        '--bs-safe-area-top': '0px',
        '--bs-safe-area-bottom': 'env(safe-area-inset-bottom, 0px)',
        position: 'relative',
        flex: 1,
        minHeight: 0,
        transform: 'translateZ(0)',
        backgroundColor: bs.surface.canvas,
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>{children}</Box>
    </Box>
  );
}

function Stage() {
  const { surface, route } = useProto();
  const phone = useMediaQuery('(max-width:440px)');
  const wide = useMediaQuery('(min-width:960px)');

  useEffect(() => {
    document.querySelectorAll<HTMLElement>('[data-device-screen] > div').forEach((el) => (el.scrollTop = 0));
  }, [route]);

  if (surface === 'o') {
    return (
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ToastProvider offsetBottom={phone ? 88 : 0}>
          <OperatorToday />
        </ToastProvider>
      </Box>
    );
  }

  const app = (
    <ToastProvider offsetBottom={96}>
      <ClientRouter />
    </ToastProvider>
  );

  if (phone) return <PhoneBleed>{app}</PhoneBleed>;

  return (
    <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: bs.surface.subtle }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 10, px: `${layout.gutter.desktop}px`, maxWidth: layout.maxWidth.wide, mx: 'auto' }}>
        {wide && <Tour />}
        <Box component="main" aria-label="App">
          <DeviceFrame statusBar={route.name === 'home' ? 'light' : 'auto'}>{app}</DeviceFrame>
        </Box>
      </Box>
    </Box>
  );
}

function Themed() {
  const { locale, appearance } = useProto();
  return (
    <AppProviders mode={appearance} locale={locale}>
      <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: bs.surface.canvas, color: bs.text.primary }}>
        <PreviewBar />
        <Stage />
      </Box>
    </AppProviders>
  );
}

export function App() {
  useEffect(() => {
    if (!window.location.hash) window.history.replaceState(null, '', toHash('c'));
  }, []);
  return (
    <PrototypeProvider>
      <MapStreetNamesContext.Provider value={ncStreets}>
        <Themed />
      </MapStreetNamesContext.Provider>
    </PrototypeProvider>
  );
}
