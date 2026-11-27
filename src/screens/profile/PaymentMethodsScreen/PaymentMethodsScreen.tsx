import Box from '@mui/material/Box';
import { useState } from 'react';
import { useNav } from '../../../app/nav';
import { InlineAlert } from '../../../components/feedback/InlineAlert/InlineAlert';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { RadioGroup } from '../../../components/selection/Radio/Radio';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import { paymentMethods, type PaymentMethodId } from '../data';
import { useMethodOptions } from '../methodOptions';
import { AddRow, ScreenBody, ScreenRoot, pick } from '../ui';

const messages = {
  es: {
    title: 'Métodos de pago',
    legend: 'Método predeterminado',
    add: 'Agregar tarjeta',
    note: 'Los datos de tu tarjeta los procesa nuestro proveedor de pagos. Black Seat solo guarda los últimos cuatro dígitos.',
    setDefault: (name: string) => `${name} es ahora tu método predeterminado`,
    addInfo: 'Te llevaremos al formulario seguro de nuestro proveedor de pagos.',
  },
  en: {
    title: 'Payment methods',
    legend: 'Default method',
    add: 'Add card',
    note: 'Your card details are processed by our payment provider. Black Seat only keeps the last four digits.',
    setDefault: (name: string) => `${name} is now your default method`,
    addInfo: 'We will take you to our payment provider’s secure form.',
  },
};

function Content() {
  const t = useT(messages);
  const nav = useNav();
  const locale = useLocale();
  const toast = useToast();
  const options = useMethodOptions(true);
  const [selected, setSelected] = useState<PaymentMethodId>('visa-4242');

  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={nav.back} />
      <ScreenBody gap={5}>
        <Box sx={{ border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, backgroundColor: bs.surface.raised, px: 4, py: 3 }}>
          <RadioGroup
            label={t.legend}
            options={options}
            value={selected}
            onChange={(id) => {
              setSelected(id);
              const m = paymentMethods.find((x) => x.id === id);
              if (m) toast.show({ message: t.setDefault(pick(m.title, locale)), severity: 'success' });
            }}
          />
        </Box>
        <AddRow label={t.add} onClick={() => nav.go('add-card')} />
        <InlineAlert severity="info">{t.note}</InlineAlert>
      </ScreenBody>
    </ScreenRoot>
  );
}

/** Métodos de pago (s70): lists and selects saved methods. Card entry belongs to the payment provider. */
export function PaymentMethodsScreen() {
  return (
    <ToastProvider>
      <Content />
    </ToastProvider>
  );
}
