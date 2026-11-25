import dayjs from 'dayjs';
import { useState } from 'react';
import { AuctionPickupForm, validateAuctionPickup, type AuctionPickupValue } from '../../../blackseat/AuctionPickupForm/AuctionPickupForm';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { InlineAlert } from '../../../components/feedback/InlineAlert/InlineAlert';
import { useLocale, useT } from '../../../i18n/locale';
import { getDayState } from '../../../mocks/availability';
import { auctionYards } from '../../../mocks/catalog';
import { TODAY } from '../data';
import { BookingTopBar, Lead, ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Recogida en subasta',
    lead: 'Con el código y el lote de tu compra, nuestro conductor retira el vehículo en el patio y lo lleva a la dirección que elijas.',
    errors: 'Revisa los campos marcados. Sin el código y el lote no podemos retirar el vehículo.',
    next: 'Continuar',
  },
  en: {
    title: 'Auction pickup',
    lead: 'With the pickup code and lot of your purchase, our driver collects the vehicle at the yard and delivers it to the address you choose.',
    errors: 'Check the highlighted fields. Without the code and the lot we cannot release the vehicle.',
    next: 'Continue',
  },
};

/** The values of the Towing booking BS-24120 (Copart Miami South, lot with leading zeros, code 0071). */
export const filledPickup: AuctionPickupValue = { auction: 'copart', yardId: 'copart-miami-south', lot: '05503318', code: '0071', date: dayjs('2026-11-30') };
/** A first attempt with mistakes: the lot is too short, the code is missing and no day is chosen. */
export const invalidPickup: AuctionPickupValue = { auction: 'copart', yardId: 'copart-miami-south', lot: '55033', code: '', date: null };

export interface AuctionPickupScreenProps {
  initial?: AuctionPickupValue;
  /** Shows validation messages from the start (story "Con errores"). */
  showErrors?: boolean;
}

/** Recogida en subasta (Towing): AuctionPickupForm with its own label for every identifier. Step 3 of 5 (Horario). */
export function AuctionPickupScreen({ initial = filledPickup, showErrors = false }: AuctionPickupScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const [value, setValue] = useState<AuctionPickupValue>(initial);
  const [submitted, setSubmitted] = useState(showErrors);
  const errors = submitted ? validateAuctionPickup(value, locale) : {};
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <ScreenRoot>
      <BookingTopBar title={t.title} step={2} />
      <ScreenBody sx={{ flex: 1 }}>
        <Lead>{t.lead}</Lead>
        {hasErrors && <InlineAlert severity="error">{t.errors}</InlineAlert>}
        <AuctionPickupForm value={value} onChange={setValue} yards={auctionYards} errors={errors} start={TODAY} today={TODAY} getDayState={(d) => getDayState(d, 'towing')} />
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth onClick={() => setSubmitted(true)}>
          {t.next}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}
