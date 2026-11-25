import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { Checkbox } from '../../../components/selection/Checkbox/Checkbox';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { useT } from '../../../i18n/locale';
import { InverseSurface } from '../../../theme/SchemeScope';
import { bs } from '../../../theme/theme';
import { radius, typeScale } from '../../../theme/tokens';
import { BookingTopBar, Lead, ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Agregar tarjeta',
    lead: 'Guarda una tarjeta de crédito o débito para pagar tus reservas en línea.',
    preview: 'Vista previa de la tarjeta',
    previewNote: 'Ilustración. Aquí nunca se muestran tus datos reales.',
    newCard: 'Tarjeta nueva',
    holder: 'Titular',
    holderValue: 'NOMBRE APELLIDO',
    expires: 'Vence',
    expiresValue: 'MM/AA',
    secureLabel: 'Campos de tarjeta seguros del proveedor de pagos',
    secureTitle: 'Datos de la tarjeta',
    secureBody: 'El proveedor de pagos muestra y procesa estos campos en su propio contenedor seguro. Black Six nunca ve ni guarda el número de tarjeta.',
    secureMount: 'Contenedor seguro del proveedor de pagos',
    number: 'Número de tarjeta',
    expiry: 'Vencimiento',
    cvc: 'CVC',
    makeDefault: 'Usar como mi método de pago predeterminado',
    save: 'Guardar tarjeta',
    saved: 'Tarjeta guardada',
  },
  en: {
    title: 'Add card',
    lead: 'Save a credit or debit card to pay for your bookings online.',
    preview: 'Card preview',
    previewNote: 'Illustration. Your real details are never shown here.',
    newCard: 'New card',
    holder: 'Cardholder',
    holderValue: 'FIRST LAST',
    expires: 'Expires',
    expiresValue: 'MM/YY',
    secureLabel: 'Secure card fields from the payment provider',
    secureTitle: 'Card details',
    secureBody: 'The payment provider shows and processes these fields in its own secure container. Black Six never sees or stores the card number.',
    secureMount: 'Payment provider secure container',
    number: 'Card number',
    expiry: 'Expiry',
    cvc: 'CVC',
    makeDefault: 'Use as my default payment method',
    save: 'Save card',
    saved: 'Card saved',
  },
};

/** Static card illustration. Placeholders only: it never reflects what the customer types in the provider's fields. */
function CardPreview() {
  const t = useT(messages);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <InverseSurface
        aria-label={t.preview}
        role="img"
        sx={{
          borderRadius: `${radius.lg}px`,
          p: 5,
          aspectRatio: '1.586',
          maxWidth: 360,
          width: '100%',
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="label" component="span" sx={{ color: bs.text.secondary }}>
            {t.newCard}
          </Typography>
          <CreditCardOutlined aria-hidden />
        </Box>
        <Typography component="p" sx={{ ...typeScale.code, fontSize: '1.25rem', letterSpacing: '0.08em', fontVariantNumeric: 'tabular-nums' }}>
          •••• •••• •••• ••••
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" component="p" sx={{ color: bs.text.secondary }}>
              {t.holder}
            </Typography>
            <Typography variant="label" component="p" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t.holderValue}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" component="p" sx={{ color: bs.text.secondary }}>
              {t.expires}
            </Typography>
            <Typography variant="label" component="p">
              {t.expiresValue}
            </Typography>
          </Box>
        </Box>
      </InverseSurface>
      <Typography variant="caption" sx={{ color: bs.text.secondary, textAlign: 'center' }}>
        {t.previewNote}
      </Typography>
    </Box>
  );
}

const Slot = ({ label, short = false }: { label: string; short?: boolean }) => (
  <Box aria-hidden sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: short ? 1 : undefined }}>
    <Typography variant="caption" sx={{ color: bs.text.secondary }}>
      {label}
    </Typography>
    <Box sx={{ height: 44, borderRadius: `${radius.md}px`, backgroundColor: bs.surface.subtle, border: `1px solid ${bs.border.field}` }} />
  </Box>
);

/** Where the payment provider mounts its own card fields. These are not inputs of ours: there is nothing to type here. */
function SecureFieldsContainer() {
  const t = useT(messages);
  return (
    <Box
      role="group"
      aria-label={t.secureLabel}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4, borderRadius: `${radius.lg}px`, border: `1px dashed ${bs.border.strong}`, backgroundColor: bs.surface.raised }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <LockOutlined aria-hidden sx={{ fontSize: 20 }} />
        <Typography variant="label" component="p">
          {t.secureTitle}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: bs.text.secondary }}>
        {t.secureBody}
      </Typography>
      <Box data-provider-mount aria-label={t.secureMount} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Slot label={t.number} />
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Slot label={t.expiry} short />
          <Slot label={t.cvc} short />
        </Box>
      </Box>
    </Box>
  );
}

export interface AddCardScreenProps {
  /** Shows the save button in its loading state. */
  saving?: boolean;
}

function Content({ saving = false }: AddCardScreenProps) {
  const t = useT(messages);
  const toast = useToast();
  const [makeDefault, setMakeDefault] = useState(true);
  return (
    <ScreenRoot>
      <BookingTopBar title={t.title} step={3} />
      <ScreenBody gap={6} sx={{ flex: 1 }}>
        <Lead>{t.lead}</Lead>
        <CardPreview />
        <SecureFieldsContainer />
        <Checkbox label={t.makeDefault} checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)} />
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth loading={saving} startIcon={<LockOutlined />} onClick={() => toast.show({ message: t.saved, severity: 'success' })}>
          {t.save}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}

/** Agregar tarjeta (s34): illustrated card preview, the payment provider's labeled secure-fields container and "Guardar tarjeta". Step 4 of 5. */
export function AddCardScreen(props: AddCardScreenProps) {
  return (
    <ToastProvider offsetBottom={96}>
      <Content {...props} />
    </ToastProvider>
  );
}
