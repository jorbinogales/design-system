import AddRounded from '@mui/icons-material/AddRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BottomActionBar } from '../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../components/actions/Button/Button';
import { formatAddress, LocationCard } from '../../components/address/LocationCard/LocationCard';
import { useToast } from '../../components/feedback/Toast/Toast';
import { RadioGroup } from '../../components/selection/Radio/Radio';
import { useLocale, useT } from '../../i18n/locale';
import { bs } from '../../theme/theme';
import { getPackage, getYard, myAddresses, totalOf } from '../data';
import { draftLines, useProto } from '../store';
import { FlowTopBar, ScreenBody, ScreenRoot, TotalSummary } from './shared';

const messages = {
  es: {
    title: 'Dirección',
    titleTowing: 'Entrega',
    question: '¿Dónde hacemos el servicio?',
    questionTowing: '¿A dónde llevamos el vehículo?',
    from: 'Recogemos en',
    label: { home: 'Casa', office: 'Oficina', other: 'Otra' },
    add: 'Agregar otra dirección',
    soon: 'En el prototipo usamos tus direcciones guardadas.',
    total: 'Total',
    next: 'Ir al pago',
  },
  en: {
    title: 'Address',
    titleTowing: 'Delivery',
    question: 'Where should we do the service?',
    questionTowing: 'Where should we deliver the vehicle?',
    from: 'Pickup at',
    label: { home: 'Home', office: 'Office', other: 'Other' },
    add: 'Add another address',
    soon: 'This prototype uses your saved addresses.',
    total: 'Total',
    next: 'Go to payment',
  },
};

/** Dirección (Personal Washing) or Entrega (Towing): saved addresses as single choice + the chosen one on the map. */
export function AddressScreen() {
  const t = useT(messages);
  const locale = useLocale();
  const toast = useToast();
  const { draft, setDraft, go, isVip } = useProto();
  const towing = draft.unit === 'towing';
  const chosen = myAddresses.find((a) => a.id === draft.addressId) ?? myAddresses[0];
  const yard = towing ? getYard(draft.auction.yardId) : undefined;
  const pkg = getPackage(draft.packageId);

  return (
    <ScreenRoot>
      <FlowTopBar title={towing ? t.titleTowing : t.title} step={2} />
      <ScreenBody gap={6}>
        {yard && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" sx={{ color: bs.text.secondary }}>
              {t.from}
            </Typography>
            <Typography variant="label" component="p">
              {yard.name} · {formatAddress(yard.address)}
            </Typography>
          </Box>
        )}
        <RadioGroup
          label={towing ? t.questionTowing : t.question}
          value={chosen.id}
          onChange={(id) => setDraft({ addressId: id })}
          options={myAddresses.map((a) => ({ value: a.id, label: t.label[a.label], description: formatAddress(a) }))}
        />
        <Button variant="quiet" size="md" startIcon={<AddRounded />} onClick={() => toast.show({ message: t.soon, severity: 'info' })} sx={{ alignSelf: 'flex-start' }}>
          {t.add}
        </Button>
        <LocationCard address={chosen} title={t.label[chosen.label]} pinKind={towing ? 'destination' : 'address'} layout="stacked" />
      </ScreenBody>
      <BottomActionBar summary={<TotalSummary label={t.total} amount={totalOf(draftLines(draft, isVip, locale))} from={pkg.priceFrom} />}>
        <Button onClick={() => go({ name: 'checkout' })}>{t.next}</Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
