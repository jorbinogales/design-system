import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { AuctionPickupForm, validateAuctionPickup, type AuctionPickupErrors } from '../../blackseat/AuctionPickupForm/AuctionPickupForm';
import { BottomActionBar } from '../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../components/actions/Button/Button';
import { useLocale, useT } from '../../i18n/locale';
import { getDayState } from '../../mocks/availability';
import { bs } from '../../theme/theme';
import { getPackage, TODAY, totalOf, yards } from '../data';
import { draftLines, useProto } from '../store';
import { FlowTopBar, ScreenBody, ScreenRoot, TotalSummary } from './shared';

const messages = {
  es: {
    title: 'Datos de la subasta',
    lead: 'Copia el código de recogida y el número de lote de tu cuenta de Copart o IAA. Con eso vamos directo al patio.',
    next: 'Continuar',
  },
  en: {
    title: 'Auction details',
    lead: 'Copy the pickup code and lot number from your Copart or IAA account. That is all we need to go straight to the yard.',
    next: 'Continue',
  },
};

/** Recogida en subasta: auction, yard, lot, pickup code and date — replaces the WhatsApp message. */
export function TowingScreen() {
  const t = useT(messages);
  const locale = useLocale();
  const { draft, setDraft, go, isVip } = useProto();
  const [errors, setErrors] = useState<AuctionPickupErrors>({});
  const pkg = getPackage(draft.packageId);
  const total = totalOf(draftLines(draft, isVip, locale));

  const submit = () => {
    const e = validateAuctionPickup(draft.auction, locale);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setDraft({ day: draft.auction.date, time: '08:00' });
      go({ name: 'address' });
    }
  };

  return (
    <ScreenRoot>
      <FlowTopBar title={t.title} step={1} />
      <ScreenBody gap={6}>
        <Typography variant="body1" sx={{ color: bs.text.secondary }}>
          {t.lead}
        </Typography>
        <Box component="form" noValidate onSubmit={(e) => (e.preventDefault(), submit())}>
          <AuctionPickupForm
            value={draft.auction}
            onChange={(v) => {
              setDraft({ auction: v });
              if (Object.keys(errors).length) setErrors(validateAuctionPickup(v, locale));
            }}
            yards={yards}
            errors={errors}
            start={TODAY}
            today={TODAY}
            getDayState={(d) => getDayState(d, 'towing')}
          />
        </Box>
      </ScreenBody>
      <BottomActionBar summary={<TotalSummary label={pkg.name[locale]} amount={total} from />}>
        <Button onClick={submit}>{t.next}</Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
